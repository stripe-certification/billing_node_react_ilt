import Stripe from "stripe";

export enum SubscriptionStatuses {
  ACTIVE = "active",
  PAUSED = "paused",
  TRIALING = "trialing",
  INCOMPLETE = "incomplete",
  INCOMPLETE_EXPIRED = "incomplete_expired",
  PAST_DUE = "past_due",
  UNPAID = "unpaid",
  CANCELLED = "cancelled",
}

export const inactiveSubStatuses = [
  SubscriptionStatuses.PAST_DUE,
  SubscriptionStatuses.UNPAID,
];

export interface LoraSubscription extends Stripe.Subscription {
  metadata: {
    userId: string;
  };
}

export interface LoraInvoice extends Stripe.Invoice {
  subscription_details: {
    metadata: {
      userId: string;
    };
  };
}

export function isLoraSubscription(obj: any): obj is LoraSubscription {
  return (
    obj.object === "subscription" && typeof obj.metadata?.userId === "string"
  );
}

export function isLoraInvoice(obj: any): obj is LoraInvoice {
  return (
    obj.object === "invoice" &&
    typeof obj.subscription_details?.metadata?.userId === "string"
  );
}
