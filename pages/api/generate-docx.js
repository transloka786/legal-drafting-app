// pages/api/generate.js

import OpenAI from "openai";

// Instantiate v5 client on the server ONLY:
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  console.log("🔔 /api/generate called—method:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const variables = req.body;
    console.log("📋 Received variables:", variables);

    const prompt = `You are a highly qualified Indian lawyer. Using the following input variables, generate a formal legal draft in plain text. Ensure formatting suitable for A4 print. Variables:
${Object.entries(variables).map(([key, value]) => `${key}: ${value}`).join("\n")}`;

    // Call the completions endpoint
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
      max_tokens: 2000,
      temperature: 0.3,
      top_p: 1.0,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    
    const draftText = response.choices[0].text.trim();
    console.log("✅ Generated draft text length:", draftText.length);

    return res.status(200).json({ text: draftText });
  } catch (err) {
    console.error("❌ OpenAI call failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
