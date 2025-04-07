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
  let meterEvent: Stripe.Billing.MeterEvent;
  // Training TODO: Calculate the response from the LLM and 
  // create a meter event to record the usage.
  const message = dummyLlm(prompt);

  return {
    meterEvent,
    message,
  };
}

export const ChatService = {
  generateLlmResponse,
};
