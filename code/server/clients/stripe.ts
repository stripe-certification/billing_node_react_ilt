import Stripe from "stripe";

const apiVersion = (process.env.STRIPE_API_VERSION ||
  "2025-02-24.acacia") as Stripe.LatestApiVersion;

class stripe {
  private static instance: Stripe | null = null;

  private constructor() {}

  static getSdk(): Stripe {
    if (!this.instance) {
      this.instance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion,
      });
    }
    return this.instance;
  }

  static async findPrice(lookupKey: string): Promise<Stripe.Price> {
    const stripe = this.getSdk();
    const prices = await stripe.prices.list({
      active: true,
      lookup_keys: [lookupKey],
      limit: 1,
      expand: ["data.product"],
    });

    if (!prices.data.length) {
      throw new Error(`Price not found for lookup key: ${lookupKey}`);
    }

    return prices.data[0];
  }

  static async createRecurringPrice(
    productId: string,
    interval: Stripe.Price.Recurring.Interval,
    unitAmount: number,
    currency: string
  ): Promise<Stripe.Price> {
    const stripe = this.getSdk();
    return await stripe.prices.create({
      product: productId,
      recurring: { interval },
      unit_amount: unitAmount,
      currency,
    });
  }

  static async recordMeterEvent(
    eventName: string,
    customerId: string,
    tokens: string
  ): Promise<Stripe.Billing.MeterEvent> {
    const stripe = this.getSdk();
    return await stripe.billing.meterEvents.create({
      event_name: eventName,
      payload: {
        stripe_customer_id: customerId,
        value: tokens,
      },
    });
  }
}

export default stripe;
