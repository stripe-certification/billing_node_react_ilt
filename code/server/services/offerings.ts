import { offeringsConfig, PricedOfferings } from "../types/llm";
import stripe from "../clients/stripe";
import { dbService } from "./db";

class OfferingsService {
  private static instance: OfferingsService | null = null;
  private cache: { data: PricedOfferings | null; timestamp: number | null } = {
    data: null,
    timestamp: null,
  };

  private constructor() {}

  public static getInstance(): OfferingsService {
    if (!OfferingsService.instance) {
      OfferingsService.instance = new OfferingsService();
    }
    return OfferingsService.instance;
  }

  private isCacheValid(): boolean {
    return (
      this.cache.timestamp !== null &&
      Date.now() - this.cache.timestamp < 3600000
    );
  }

  public async getLlmOfferings(): Promise<PricedOfferings> {
    if (this.isCacheValid() && this.cache.data) {
      return this.cache.data;
    }

    const pricedModels: Record<string, any> = {};

    for (const [modelName, model] of Object.entries(offeringsConfig.models)) {
      const monthlyPrice = await stripe.findPrice(model.monthlyLookupKey);
      const yearlyPrice = await stripe.findPrice(model.yearlyLookupKey);

      pricedModels[modelName] = {
        ...model,
        monthlyPrice,
        yearlyPrice,
      };
      await dbService.saveData("llm", modelName, pricedModels[modelName]);
    }

    const monthlyPrepaidPrice = await stripe.findPrice(
      offeringsConfig.prepaid.monthly.lookupKey
    );
    const yearlyPrepaidPrice = await stripe.findPrice(
      offeringsConfig.prepaid.yearly.lookupKey
    );

    const pricedPrepaid = {
      monthly: {
        ...offeringsConfig.prepaid.monthly,
        price: monthlyPrepaidPrice,
      },
      yearly: { ...offeringsConfig.prepaid.yearly, price: yearlyPrepaidPrice },
    };

    const result = { models: pricedModels, prepaid: pricedPrepaid };

    this.cache.data = result;
    this.cache.timestamp = Date.now();

    return result;
  }
}

export const offeringsService = OfferingsService.getInstance();
