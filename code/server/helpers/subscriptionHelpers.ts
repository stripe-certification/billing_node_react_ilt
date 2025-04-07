import Stripe from "stripe";
import {
  PricedOfferings,
  PricedPrepaidCredit,
  PricedPrepaidPackages,
} from "../types/llm";
import stripe from "../clients/stripe";

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

async function isCreditItem(line: Stripe.InvoiceLineItem, prepaidOfferings: PricedPrepaidPackages): Stripe.InvoiceLineItem | false {
  if (line.amount > 0)
  {
    const priceId = line.pricing?.price_details?.price;
    if (!priceId) return false;
    const lookupKey = (await stripe.getSdk().prices.retrieve(priceId)).lookup_key;
    if (!lookupKey) return false;

    if (Object.values(prepaidOfferings)
        .map((offering) => offering.lookupKey)
        .includes(lookupKey))
      return line;
  }
  return false;
}

export function findPrepaidCreditItem(
  invoice: Stripe.Invoice,
  prepaidOfferings: PricedPrepaidPackages
): Stripe.InvoiceLineItem | undefined {
  return invoice.lines.data.find((line) => isCreditItem(line, prepaidOfferings));
}
