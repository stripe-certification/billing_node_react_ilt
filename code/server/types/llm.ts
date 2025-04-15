import Stripe from "stripe";

export interface LlmResponse {
  message: string;
  numTokens: number;
}

interface LlmModel {
  modelName: string;
  meterEventName: string;
  displayName: string;
  monthlyLookupKey: string;
  yearlyLookupKey: string;
  costPer1000Tokens: number;
}

interface PricedLlmModel extends LlmModel {
  monthlyPrice: Stripe.Price;
  yearlyPrice: Stripe.Price;
}

interface PrepaidCredit {
  cadence: "month" | "year";
  amount: number;
  credit: number;
  lookupKey: string;
}

interface PricedPrepaidCredit extends PrepaidCredit {
  price: Stripe.Price;
}

interface OfferingsConfig {
  models: Record<string, LlmModel>;
  prepaid: {
    monthly: PrepaidCredit;
    yearly: PrepaidCredit;
  };
}

function getMonthlyLookupKey(modelName: string): string {
  return `${modelName}_monthly`;
}

function getYearlyLookupKey(modelName: string): string {
  return `${modelName}_yearly`;
}

export const offeringsConfig: OfferingsConfig = {
  models: {
    titan: {
      modelName: "titan",
      meterEventName: "titan",
      displayName: "AWS Titan",
      costPer1000Tokens: 0.05,
      monthlyLookupKey: getMonthlyLookupKey("titan"),
      yearlyLookupKey: getYearlyLookupKey("titan"),
    },
    claude: {
      modelName: "claude",
      meterEventName: "claude",
      displayName: "Claude AI",
      costPer1000Tokens: 0.1,
      monthlyLookupKey: getMonthlyLookupKey("claude"),
      yearlyLookupKey: getYearlyLookupKey("claude"),
    },
    chatgpt: {
      modelName: "chatgpt",
      meterEventName: "chatgpt",
      displayName: "ChatGPT",
      costPer1000Tokens: 0.15,
      monthlyLookupKey: getMonthlyLookupKey("chatgpt"),
      yearlyLookupKey: getYearlyLookupKey("chatgpt"),
    },
  },
  prepaid: {
    monthly: {
      cadence: "month",
      amount: 2000,
      credit: 2000,
      lookupKey: "monthly",
    },
    yearly: {
      cadence: "year",
      amount: 20000,
      credit: 30000,
      lookupKey: "yearly",
    },
  },
};

interface PricedPrepaidPackages {
  monthly: PricedPrepaidCredit;
  yearly: PricedPrepaidCredit;
}

interface PricedOfferings {
  models: Record<string, PricedLlmModel>;
  prepaid: PricedPrepaidPackages;
}

export type {
  OfferingsConfig,
  PricedOfferings,
  LlmModel,
  PricedLlmModel,
  PrepaidCredit,
  PricedPrepaidCredit,
  PricedPrepaidPackages,
};
