import { loremIpsum } from "lorem-ipsum";

export function dummyLlm(prompt: string): string {
  const responseLength = Math.floor(Math.random() * 450) + 50;

  let loremText = loremIpsum({
    count: Math.ceil(responseLength / 10),
    units: "words",
  });

  loremText = loremText.slice(0, responseLength);

  return loremText.charAt(0).toUpperCase() + loremText.slice(1);
}
