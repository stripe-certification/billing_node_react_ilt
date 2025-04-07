import { dbService } from "./db";
import { User, Status, PortalAction } from "../types/users";
import stripe from "../clients/stripe";
import Stripe from "stripe";
import { offeringsService } from "./offerings";
import {
  findPrepaidByLookupKey,
  findPrepaidCreditItem,
} from "../helpers/subscriptionHelpers";
import { CheckoutSessionPayload } from "../types/checkout";
import { PricedPrepaidPackages } from "../types/llm";
import {
  inactiveSubStatuses,
  isLoraInvoice,
  isLoraSubscription,
  LoraInvoice,
  LoraSubscription,
  SubscriptionStatuses,
} from "../types/subscriptions";
type Invoice = Stripe.Invoice;
type Subscription = Stripe.Subscription;
type Charge = Stripe.Charge;
type PaymentIntent = Stripe.PaymentIntent;

function loadUserOrThrow(id: string): User {
  const user = dbService.loadData("users", id);
  if (!user) throw new Error(`User ${id} not found`);
  return user;
}

function userExists(id: string): boolean {
  const user = dbService.loadData("users", id);
  return !!user;
}

async function isUserActive(id: string): Promise<boolean> {
  const user = await dbService.loadData("users", id);
  if (!user) return false;
  return !!user && [Status.ACTIVE, Status.TRIALING].includes(user.status);
}

async function recordPaymentFailure(event: Stripe.Event): Promise<void> {
  if (event.type !== "invoice.payment_failed")
    throw new Error("Event is not an invoice payment failed event");

  const obj = event.data.object;
  if (!isLoraInvoice(obj))
    throw new Error("Event is not an invoice payment failed event");
  const invoice: LoraInvoice = obj;

  const userId = invoice.subscription_details.metadata.userId;

  try {
    const expandedInvoice: Invoice = await stripe
      .getSdk()
      .invoices.retrieve(invoice.id, {
        expand: ["charge", "subscription", "payment_intent"],
      });

    const charge = expandedInvoice.charge as Charge | null;
    const paymentIntent =
      expandedInvoice.payment_intent as PaymentIntent | null;
    const lastPaymentFailure = new Date(
      (charge?.created || event.created) * 1000
    );

    const failedPaymentId = charge?.id || paymentIntent?.id;

    const subscription = expandedInvoice.subscription as Subscription;
    const subscriptionStatus = subscription.status as SubscriptionStatuses;

    if (inactiveSubStatuses.includes(subscriptionStatus)) {
      await updateUser(userId, {
        status: Status.PAYMENT_FAILED,
        lastPaymentFailure,
        failedPaymentId,
      });
    }
  } catch (error) {
    console.error(
      `Failed to record payment failure for user ${userId}:`,
      error
    );
  }
}

async function markUserActive(subscription: LoraSubscription): Promise<void> {
  const userId = subscription.metadata.userId;

  await updateUser(userId, {
    status: Status.ACTIVE,
    lastPaymentFailure: null,
    failedPaymentId: null,
    subscriptionId: subscription.id,
  });

  return;
}

async function markUserCancelled(
  subscription: LoraSubscription
): Promise<void> {
  const userId = subscription.metadata.userId;

  const user = await updateUser(userId, {
    status: Status.CANCELLED,
  });
  if (!user) console.log("Failed to update user");
  return;
}

async function createCheckoutSession(data: {
  plan: "monthly" | "yearly";
  userId: string;
}): Promise<{ clientSecret: string }> {
  const { plan, userId } = data;

  try {
    const checkoutSession = await UserService.startSubscription({
      plan: plan as "monthly" | "yearly",
      userId: userId,
    });

    if (!checkoutSession.client_secret) {
      throw new Error("Client secret is missing");
    }

    return {
      clientSecret: checkoutSession.client_secret,
    };
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

async function updateUser(
  id: string,
  userUpdates: Partial<User>
): Promise<User> {
  const user = await loadUserOrThrow(id);

  const updateData: User = {
    ...user,
    ...userUpdates,
  };

  await dbService.saveData("users", id, updateData);
  return updateData;
}

async function createUser(userData: { email: string }): Promise<User> {
  const email = userData.email;
  if (!email) throw new Error("Email is required");

  const existing = findUserByEmail(email);
  if (existing) {
    throw new Error(`User with email ${email} already exists`);
  }
  const id = crypto.randomUUID();

  const payload: Stripe.CustomerCreateParams = {
    email: email,
    metadata: { userId: id },
  };

  const now = new Date();

  const stripeCustomer = await stripe.getSdk().customers.create(payload);
  const newUser: User = {
    email: email,
    customerId: stripeCustomer.id,
    subscriptionId: null,
    status: Status.NOT_STARTED,
    lastPaymentFailure: null,
    failedPaymentId: null,
    updatedAt: now,
    id,
    createdAt: now,
  };

  await dbService.saveData("users", id, newUser);
  return newUser;
}

function findUserByEmail(email: string): User | null {
  const results = dbService.searchData("users", (user) => user.email === email);

  if (results.length > 1)
    throw Error(
      "Multiple users found with this email, please adjust your database"
    );
  if (results.length === 1) return results[0];
  return null;
}

function findUserByStripeCustomerId(customerId: string): User | null {
  const results = dbService.searchData(
    "users",
    (user) => user.customerId === customerId
  );
  if (results.length > 1) throw Error("customerIds should be unique");
  if (results.length === 1) return results[0];
  return null;
}

async function handleSubscriptionUpdate(event: Stripe.Event): Promise<void> {
  if (event.type !== "customer.subscription.updated")
    throw new Error("Event is not a subscription update event");

  const obj = event.data.object;

  if (!isLoraSubscription(obj))
    throw new Error("Object is not a Lora subscription");
  const subscription: LoraSubscription = obj;

  if (event.data.previous_attributes?.status !== subscription.status) {
    switch (subscription.status) {
      case "active":
      case "trialing":
        await markUserActive(subscription);
        await setBillingThreshold(subscription);
        break;

      default:
        console.log(`Unhandled subscription status: ${subscription.status}`);
        break;
    }
  } else {
    console.log("No status change");
  }
}

async function setBillingThreshold(
  subscription: LoraSubscription
): Promise<void> {
  const offerings = await offeringsService.getLlmOfferings();

  const matchedPrepaid = findPrepaidByLookupKey(
    subscription.items.data,
    offerings.prepaid
  );

  if (!matchedPrepaid) {
    throw new Error("No matching prepaid subscription item found");
  }

  const creditAmount = matchedPrepaid.credit;

  const billingThreshold = creditAmount;

  if (!subscription.billing_thresholds) {
    const payload: Stripe.SubscriptionUpdateParams = {
      billing_thresholds: {
        amount_gte: billingThreshold,
        reset_billing_cycle_anchor: true,
      },
      proration_behavior: "none",
    };
    await stripe.getSdk().subscriptions.update(subscription.id, payload);
  }
}

async function createCreditGrant(invoice: LoraInvoice): Promise<void> {
  if (!invoice.subscription)
    throw new Error("Invoice does not have a subscription");

  const userId = invoice.subscription_details.metadata.userId;

  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : undefined;
  if (!customerId) throw new Error("Invalid or missing customer ID");

  const offerings = await offeringsService.getLlmOfferings();

  if (!invoice.lines.data.length) throw new Error("No line items in invoice");

  const lineItem = findPrepaidCreditItem(invoice, offerings.prepaid);
  if (!lineItem?.price?.lookup_key)
    throw new Error(
      "No valid prepaid credit line item found in invoice. Credit grant unnecessary"
    );

  const prepaidCredit =
    offerings.prepaid[lineItem.price.lookup_key as keyof PricedPrepaidPackages];

  await stripe.getSdk().billing.creditGrants.create({
    name: `$${prepaidCredit.credit / 100} credit`,
    amount: {
      type: "monetary",
      monetary: { value: prepaidCredit.credit, currency: "usd" },
    },
    applicability_config: { scope: { price_type: "metered" } },
    category: "paid",
    customer: customerId,
  });

  console.log(`Successfully granted credit to user: ${userId}`);
}

async function startSubscription(data: {
  plan: "monthly" | "yearly";
  userId: string;
}): Promise<Stripe.Checkout.Session> {
  const { plan, userId } = data;

  const userData = await loadUserOrThrow(userId);
  const offerings = await offeringsService.getLlmOfferings();

  const lineItems = [];

  const prepaidOffering = offerings.prepaid[plan];
  if (!prepaidOffering) {
    throw new Error(`No prepaid offering found for the selected ${plan} plan.`);
  }

  lineItems.push({
    price: prepaidOffering.price.id,
    quantity: 1,
  });

  Object.keys(offerings.models).forEach((modelKey) => {
    const modelOffering = offerings.models[modelKey];
    const modelPrice = modelOffering[`${plan}Price`];

    if (modelPrice && modelPrice.id) {
      lineItems.push({
        price: modelPrice.id,
      });
    }
  });

  if (lineItems.length === 0) {
    throw new Error("No valid prices found for the selected plan.");
  }

  const customerId = userData.customerId;

  let payload: CheckoutSessionPayload | null = null;

  return await stripe.getSdk().checkout.sessions.create(payload);
}

/**
 * Creates the customer portal session object
 * @param payload: should contain the userId and the action to be performed.  The action
 *   specifies which deep link create for the portal, PortalAction.ACCOUNT will return the
 *   default URL.
 * @returns a customer portal session object
 */
async function getCustomerPortalSession(payload: {
  userId: string;
  action: PortalAction;
}): Promise<Stripe.BillingPortal.Session> {
  const BASE_URL = `${process.env.CLIENT_HOSTNAME || "localhost"}`;
  const PORT = `${process.env.CLIENT_PORT || "3000"}`;
  const returnUrl = `${BASE_URL}:${PORT}/account`;

  const user = loadUserOrThrow(payload.userId);
  if (!user.subscriptionId) {
    throw new Error("User does not have a subscription");
  }

  // Training TODO: Build up the parameters that will be passed to the API call 
  // to create a Customer Session.  You'll need to handle the deep link PortalActions, 
  // we want to use the deep links to support letting the customer update their payment method
  // and cancel their subscription.
  // https://docs.stripe.com/api/customer_portal/sessions/create?lang=node
  // https://docs.stripe.com/customer-management/portal-deep-links 

  let sessionParams: Stripe.BillingPortal.SessionCreateParams | null = null;


  let session: Stripe.BillingPortal.Session | null = null;


  return session;
}

export const finalizeInvoice = async (invoice: LoraInvoice): Promise<void> => {
  try {
    if (invoice.status !== "draft") {
      console.log(`Invoice ${invoice.id} is already finalized, skipping.`);
      return;
    }
    if (!invoice.id)
      throw new Error("Invoice ID is missing or invalid");
    await stripe.getSdk().invoices.finalizeInvoice(invoice.id);

    console.log(`Invoice ${invoice.id} finalized successfully.`);
  } catch (error) {
    console.log(` Error finalizing invoice ${invoice.id}:`, error);
  }
};

export const UserService = {
  handleSubscriptionUpdate,
  findUserByStripeCustomerId,
  loadUserOrThrow,
  startSubscription,
  createUser,
  updateUser,
  recordPaymentFailure,
  markUserActive,
  isUserActive,
  findUserByEmail,
  getCustomerPortalSession,
  createCreditGrant,
  userExists,
  markUserCancelled,
  createCheckoutSession,
  finalizeInvoice,
};
