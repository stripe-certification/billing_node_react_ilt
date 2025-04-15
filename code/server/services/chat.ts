import Stripe from "stripe";
import stripe from "../clients/stripe";
import { User } from "../types/users";
import OpenAI from "../clients/openai";
import { UserService } from "./users";

async function generateLlmResponse(
  prompt: string,
  user: User,
  modelName: string
): Promise<{
  message: string;
  meterEvent: Stripe.Billing.MeterEvent;
}> {
  let meterEvent: Stripe.Billing.MeterEvent;
  let message: string = "plug in response from a model";
  const model = chooseModel(modelName);

  // Training TODO: Calculate the response from the LLM and 
  // create a meter event to record the usage. Also ensure
  // the user's account is active before spending any tokens.

  return {
    meterEvent,
    message,
  };
}

function chooseModel(modelName: string) {
  // TODO: Implement other models
  return OpenAI.generateResponse
}

export const ChatService = {
  generateLlmResponse,
};
