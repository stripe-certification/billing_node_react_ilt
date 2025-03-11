import { Router, Request, Response } from "express";
import stripe from "../clients/stripe";
import { UserService } from "../services/users";

const router = Router();

router.post(
  "/checkout-session",
  async (request: Request, response: Response) => {
    try {
      const checkoutSession = await UserService.createCheckoutSession(
        request.body
      );
      response.json(checkoutSession);
    } catch (error: any) {
      response.status(500).json({ error });
    }
  }
);

router.get(
  "/checkout-session/:sessionId",
  async (request: Request, response: Response) => {
    try {
      const sessionId = request.params.sessionId;
      const checkoutSession = await stripe
        .getSdk()
        .checkout.sessions.retrieve(sessionId);

      response.json(checkoutSession);
    } catch (error: any) {
      response.status(500).json({ error });
    }
  }
);

export default router;
