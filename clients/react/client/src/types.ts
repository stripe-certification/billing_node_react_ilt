import Stripe from "stripe";

export interface Error {
  message: string;
  link?: {
    text: string;
    href: string;
  };
}

export enum Status {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  PAYMENT_FAILED = "payment_failed",
  TRIALING = "trialing",
  NOT_STARTED = "not_started",
}

export const ACTIVE_USER_STATUSES = [
  Status.ACTIVE,
  Status.TRIALING,
  Status.PAYMENT_FAILED,
];

export type Nullable<T> = T | null;

export interface User {
  id: string;
  status: Status;
  email: string;
  error?: {
    message: string;
  };
}

function isStripePrice(obj: any): obj is Stripe.Price {
  const { id, object } = obj;
  const isStripePrice = typeof id === "string" && object === "price";
  if (!isStripePrice)
    throw new Error(
      "Expected a Stripe.Price, instead got: " + JSON.stringify(obj, null, 2)
    );
  return true;
}

interface LlmModel {
  modelName: string;
  meterEventName: string;
  displayName: string;
  monthlyLookupKey: string;
  yearlyLookupKey: string;
  costPer1000Tokens: number;
}

export interface PricedLlmModel extends LlmModel {
  monthlyPrice: Stripe.Price;
  yearlyPrice: Stripe.Price;
}

function isPricedLlmModel(obj: any): obj is PricedLlmModel {
  const {
    modelName,
    meterEventName,
    displayName,
    monthlyLookupKey,
    yearlyLookupKey,
    costPer1000Tokens,
    monthlyPrice,
    yearlyPrice,
  } = obj;
  const isLlmModel =
    typeof modelName === "string" &&
    typeof meterEventName === "string" &&
    typeof displayName === "string" &&
    typeof monthlyLookupKey === "string" &&
    typeof yearlyLookupKey === "string" &&
    typeof costPer1000Tokens === "number" &&
    isStripePrice(monthlyPrice) &&
    isStripePrice(yearlyPrice);
  if (!isLlmModel)
    throw new Error(
      "Expected an LlmModel, instead got: " + JSON.stringify(obj, null, 2)
    );
  return true;
}

interface PrepaidCredit {
  cadence: "month" | "year";
  amount: number;
  credit: number;
  lookupKey: string;
}

export interface PricedPrepaidCredit extends PrepaidCredit {
  price: Stripe.Price;
}

function isPricedPrepaidCredit(obj: any): obj is PrepaidCredit {
  const { cadence, amount, credit, lookupKey, price } = obj;
  const isPrepaidCredit =
    (cadence === "month" || cadence === "year") &&
    typeof amount === "number" &&
    typeof credit === "number" &&
    typeof lookupKey === "string" &&
    isStripePrice(price);
  if (!isPrepaidCredit)
    throw new Error(
      "Expected a PrepaidCredit, instead got: " + JSON.stringify(obj, null, 2)
    );
  return true;
}

export interface PricedOfferings {
  models: Record<string, PricedLlmModel>;
  prepaid: {
    monthly: PricedPrepaidCredit;
    yearly: PricedPrepaidCredit;
  };
}

export function isPricedOfferings(obj: any): obj is PricedOfferings {
  const { models, prepaid } = obj;
  const isPricedOfferings =
    typeof models === "object" &&
    Object.values(models).every(isPricedLlmModel) &&
    typeof prepaid === "object" &&
    isPricedPrepaidCredit(prepaid.monthly) &&
    isPricedPrepaidCredit(prepaid.yearly);
  if (!isPricedOfferings)
    throw new Error(
      "Expected a PricedOfferings, instead got: " + JSON.stringify(obj, null, 2)
    );
  return true;
}
