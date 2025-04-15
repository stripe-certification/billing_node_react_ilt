import OpenAI from 'openai';
import { loremIpsum } from "lorem-ipsum";
import { LlmResponse } from '../types/llm';

function getApiKey(): string | null {
  const maybeKey = process.env.OPENAI_API_KEY;
  if (
    typeof maybeKey === "string" &&
    maybeKey.length > 0
  ) return maybeKey;
  return null;
}

async function generateResponse(prompt: string): Promise<LlmResponse> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return dummyResponse(prompt);
  }
  const client = new OpenAI();
  const response = await client.responses.create({
    model: 'gpt-4o',
    instructions: "Your name is Lora and you offer AI solutions which prioritize safety and ethics. Please be helpful to our user, who has requested:",
    input: prompt
  });
  const message = response.output_text;
  const numTokens = response.usage?.total_tokens as number;
  return { message, numTokens };
}

function dummyResponse(prompt: string): LlmResponse {
  const responseLength = Math.floor(Math.random() * 450) + 50;

  let loremText = loremIpsum({
    count: Math.ceil(responseLength / 10),
    units: "words",
  });

  loremText = loremText.slice(0, responseLength);
  const message = loremText.charAt(0).toUpperCase() + loremText.slice(1);
  const numTokens = dummyTokenEstimate(message) + dummyTokenEstimate(prompt);

  return { message, numTokens };
}

function dummyTokenEstimate(text: string) {
  const words = text.trim().split(/\s+/).length; // count words
  return Math.ceil(words * 1.3); // approximate word-to-token conversion
}

export default { generateResponse };