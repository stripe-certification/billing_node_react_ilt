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
    let price = null;
    return price;
  }

  static async createRecurringPrice(
    productId: string,
    interval: Stripe.Price.Recurring.Interval,
    unitAmount: number,
    currency: string
  ): Promise<Stripe.Price> {
    const stripe = this.getSdk();
  }

  static async recordMeterEvent(
    eventName: string,
    customerId: string,
    tokens: string
  ): Promise<Stripe.Billing.MeterEvent> {
    const stripe = this.getSdk();
    // #region Start Stripe Implementation
    return await stripe.billing.meterEvents.create({
      event_name: eventName,
      payload: {
        stripe_customer_id: customerId,
        value: tokens,
      },
    });
    // #region Start Stripe Implementation
  }
}

export default stripe;
