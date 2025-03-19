import Stripe from "stripe";
import {
  PricedOfferings,
  PricedPrepaidCredit,
  PricedPrepaidPackages,
} from "../types/llm";

export function findPrepaidByLookupKey(
  subscriptionItems: Stripe.SubscriptionItem[],
  prepaidOfferings: PricedOfferings["prepaid"]
): PricedPrepaidCredit | null {
  for (const item of subscriptionItems) {
    if (!item.price.lookup_key) continue;

    return (
      Object.values(prepaidOfferings).find(
        (prepaid) => prepaid.lookupKey === item.price.lookup_key
      ) || null
    );
  }

  return null;
}

export function findPrepaidCreditItem(
  invoice: Stripe.Invoice,
  prepaidOfferings: PricedPrepaidPackages
): Stripe.InvoiceLineItem | undefined {
  return invoice.lines.data.find(
    (line) =>
      line.amount > 0 &&
      line.price?.lookup_key &&
      Object.values(prepaidOfferings)
        .map((offering) => offering.lookupKey)
        .includes(line.price.lookup_key)
  );
}
