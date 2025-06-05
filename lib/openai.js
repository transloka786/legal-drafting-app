// lib/openai.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * generateDraft(variables):
 *   - Builds a prompt string from the provided variables.
 *   - Calls the OpenAI completions endpoint using text-davinci-003.
 *   - Returns the generated draft text.
 */
export async function generateDraft(variables) {
  // Build a plain-text prompt from the variables object
  const prompt = `You are a highly qualified Indian lawyer. Using the following input variables, generate a formal legal draft in plain text. Ensure formatting suitable for A4 print. Variables:
${Object.entries(variables)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}`;

  // Call the completions endpoint on text-davinci-003
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: 2000,
    temperature: 0.3,
    top_p: 1.0,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  // v5+ returns an array under `choices`; we take the first choice's text
  return response.choices[0].text.trim();
}
