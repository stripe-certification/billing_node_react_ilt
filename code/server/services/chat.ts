import Stripe from "stripe";
import stripe from "../clients/stripe";
import { User } from "../types/users";
import { dummyLlm } from "../clients/openai";
import { UserService } from "./users";

function estimateTokenCount(text: string): string {
  const words = text.trim().split(/\s+/).length; // count words
  return Math.ceil(words * 1.3).toString(); // approximate word-to-token conversion
}

async function generateLlmResponse(
  prompt: string,
  user: User,
  eventName: string
): Promise<{
  message: string;
  meterEvent: Stripe.Billing.MeterEvent;
}> {
  const tokenCount = estimateTokenCount(prompt);

  const isActive = await UserService.isUserActive(user.id);
  if (!isActive) {
    throw new Error("User must have an active subscription");
  }

  const meterEvent = await stripe.recordMeterEvent(
    eventName,
    user.customerId,
    tokenCount
  );
  const message = dummyLlm(prompt);

  return {
    meterEvent,
    message,
  };
}

export const ChatService = {
  generateLlmResponse,
};
