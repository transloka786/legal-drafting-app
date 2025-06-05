// pages/api/generate.js

import OpenAI from "openai";

// Instantiate your v5-style OpenAI client on the server:
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const variables = req.body;

    // Build the same prompt as before:
    const prompt = `You are a highly qualified Indian lawyer. Using the following input variables, generate a formal legal draft in plain text. Ensure formatting suitable for A4 print. Variables:
${Object.entries(variables)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}`;

    // Call text-davinci-003:
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
      max_tokens: 2000,
      temperature: 0.3,
      top_p: 1.0,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Extract the generated text:
    const draftText = response.choices[0].text.trim();
    return res.status(200).json({ text: draftText });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
