// pages/api/generate.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  console.log("🔔 [API] /api/generate called – HTTP method:", req.method);

  if (req.method !== "POST") {
    console.log("⚠️ [API] Not POST, returning 405");
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("📥 [API] Request body:", JSON.stringify(req.body));

  try {
    const prompt = `You are a highly qualified Indian lawyer. Using the following input variables, generate a formal legal draft in plain text. Ensure formatting suitable for A4 print. Variables:
${Object.entries(req.body)
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}`;

    console.log(
      "✍️ [API] Prompt built (first 100 chars):",
      prompt.substring(0, 100)
    );

    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
      max_tokens: 2000,
      temperature: 0.3,
      top_p: 1.0,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log(
      "✅ [API] OpenAI call succeeded. Choices length:",
      response.choices.length
    );

    const draftText = response.choices[0].text.trim();
    console.log("📝 [API] Draft length:", draftText.length);

    return res.status(200).json({ text: draftText });
  } catch (err) {
    // Print the full error to Vercel’s logs:
    console.error("❌ [API] Error during OpenAI call:", err);

    // **Temporarily** also send the actual message back to the client:
    return res
      .status(500)
      .json({ error: err.message || "Unknown server error" });
  }
}
