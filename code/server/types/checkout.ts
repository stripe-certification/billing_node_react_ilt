  export interface CheckoutSessionPayload {
    mode: "subscription";
    customer: string;
    line_items: Array<{ price: string; quantity?: number }>;
    ui_mode: "embedded";
    return_url: string;
    subscription_data: {
      metadata: {
        userId: string;
      };
    };
  }
