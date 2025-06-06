// pages/api/generate.js

import OpenAI from "openai";

// Instantiate the v5+ client (still server‐only)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  console.log("🔔 [API] /api/generate called – method:", req.method);

  if (req.method !== "POST") {
    console.log("⚠️ [API] Not a POST request. Returning 405");
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("📥 [API] Request body:", JSON.stringify(req.body));

  try {
    // Build a single “user” message containing all variables
    const userMessage = `You are a highly qualified Indian lawyer. Using the following input variables, generate a formal legal draft in plain text. Ensure formatting suitable for A4 print. Variables:
${Object.entries(req.body)
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}`;

    console.log(
      "✍️ [API] Built user message (first 100 chars):",
      userMessage.substring(0, 100)
    );

    // Call the chat completions endpoint with gpt-3.5-turbo
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a highly qualified Indian lawyer." },
        { role: "user", content: userMessage },
      ],
      max_tokens: 2000,
      temperature: 0.3,
      top_p: 1.0,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log(
      "✅ [API] OpenAI chat call succeeded. Choices length:",
      chatResponse.choices.length
    );

    // Extract the assistant’s reply:
    const draftText = chatResponse.choices[0].message.content.trim();
    console.log("📝 [API] Draft text length:", draftText.length);

    return res.status(200).json({ text: draftText });
  } catch (err) {
    console.error("❌ [API] Error during OpenAI call:", err);
    // Send the actual error message back temporarily for debugging:
    return res
      .status(500)
      .json({ error: err.message || "Unknown server error" });
  }
}
