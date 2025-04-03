import { Router, raw, Request, Response } from "express";
import stripe from "../clients/stripe";
import { UserService } from "../services/users";
import { isLoraInvoice, isLoraSubscription } from "../types/subscriptions";

const router = Router();

/**
 * Handle Stripe webhook events.
 *
 * @param {request} request
 * @param {response} 200 JSON response including {received: true}
 */
router.post(
  "/webhook",
  raw({ type: "application/json" }),
  async (request: Request, response: Response) => {
    try {
      let event = null;

      switch (event.type) {
        case "invoice.created":
          if (!isLoraInvoice(obj)) break;
          await UserService.finalizeInvoice(obj);

          break;
        case "customer.subscription.updated":
          if (!isLoraSubscription(obj)) break;
          await UserService.handleSubscriptionUpdate(event);

          break;
        case "invoice.payment_succeeded":
          if (!isLoraInvoice(obj)) break;
          await UserService.createCreditGrant(obj);

          break;
        case "invoice.payment_failed":
          if (!isLoraInvoice(obj)) break;
          await UserService.recordPaymentFailure(event);

          break;
        case "customer.subscription.deleted":
          if (!isLoraSubscription(obj)) break;
          await UserService.markUserCancelled(obj);

          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      response.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error.message);

      response.status(200).json({ received: true });
    }
  }
);

export default router;
