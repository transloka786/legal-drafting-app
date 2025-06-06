// pages/api/generate.js

import OpenAI from "openai";
import axios from "axios";
import cheerio from "cheerio";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * scrapeIndianKanoon(query):
 *   - Given a query string (e.g. "Sale Deed Transfer of Property Act 1882"),
 *     it performs a search on Indian Kanoon (https://indiankanoon.org/).
 *   - It then parses the first few result snippets (titles + first paragraph)
 *     and returns them concatenated.
 */
async function scrapeIndianKanoon(query) {
  try {
    const encoded = encodeURIComponent(query);
    const searchUrl = `https://indiankanoon.org/search/?formInput=${encoded}`;

    const { data: html } = await axios.get(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html);
    const results = [];

    $(".search_results")
      .slice(0, 3)
      .each((i, el) => {
        const title = $(el).find(".result_heading").text().trim();
        const summary = $(el)
          .find(".search_summ")
          .text()
          .trim()
          .replace(/\s+/g, " ");
        if (title && summary) {
          results.push(`• ${title}: ${summary}`);
        }
      });

    if (results.length === 0) {
      return `No clear search results found for "${query}" on Indian Kanoon.`;
    }

    return `Indian Kanoon snippets for "${query}":\n` + results.join("\n");
  } catch (e) {
    console.error(`❌ [Scrape] Error scraping Indian Kanoon for "${query}":`, e.message);
    return `Error retrieving data from Indian Kanoon for "${query}".`;
  }
}

export default async function handler(req, res) {
  console.log("🔔 [API] /api/generate called – method:", req.method);

  if (req.method !== "POST") {
    console.log("⚠️ [API] Not a POST request. Returning 405");
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("📥 [API] Request body:", JSON.stringify(req.body));

  try {
    const {
      partyA,
      partyB,
      contractDate,
      agreementType,
      selectedCodes,
      jurisdiction,
      additionalNotes,
    } = req.body;

    // 1) Scrape Indian Kanoon for each selected statute or code
    const scrapedSnippets = [];
    for (const code of selectedCodes) {
      const queryString = `${agreementType} ${code}`;
      console.log(`🔍 [Scrape] Searching Indian Kanoon for "${queryString}"...`);
      const snippet = await scrapeIndianKanoon(queryString);
      scrapedSnippets.push(snippet);
      await new Promise((r) => setTimeout(r, 1000));
    }

    // 2) Combine all scraped text
    const combinedScrapes = scrapedSnippets.join("\n\n");

    // 3) Build the system prompt
    const systemPrompt =
      "You are a highly qualified Indian lawyer with in-depth knowledge of Indian statutes, case law, and drafting standards. You are given real excerpts from Indian Kanoon for guidance.";

    // 4) Build the user prompt
    const userPrompt = `
Draft a comprehensive ${agreementType} between the following parties on ${contractDate} under the jurisdiction of ${jurisdiction}.

Parties:
- Party A: ${partyA}
- Party B: ${partyB}

Included Statutes / Sections (selected by the user):
${selectedCodes.map((c) => `- ${c}`).join("\n")}

Below are real excerpts (“snippets”) retrieved from Indian Kanoon for each statute/section. Use these excerpts to ensure your final draft matches authentic Indian drafting style and correctly references those laws:

${combinedScrapes}

Additional Notes or Clauses (if any):
${additionalNotes || "None"}

Instructions:
1. Reference the above real-world excerpts as factual guidance. When drafting, explicitly mention the statutes/sections (e.g., “In consideration of Section 54 of the Transfer of Property Act, 1882…”).
2. Structure the agreement with proper Indian legal headings: Recitals, Definitions, Operative Clauses, Governing Law, Dispute Resolution, Signatures, etc.
3. Make the final draft suitable for printing on A4 paper.
4. Present the entire agreement in plain text.

Begin drafting now:
`;

    console.log(
      "✍️ [API] Built system+user prompt (first 200 chars):",
      (systemPrompt + userPrompt).substring(0, 200)
    );

    // 5) Call the Chat Completions endpoint with gpt-3.5-turbo
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 4000,
      temperature: 0.25,
      top_p: 1.0,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log(
      "✅ [API] OpenAI chat call succeeded. Choices length:",
      chatResponse.choices.length
    );

    const draftText = chatResponse.choices[0].message.content.trim();
    console.log("📝 [API] Draft length (chars):", draftText.length);

    return res.status(200).json({ text: draftText });
  } catch (err) {
    console.error("❌ [API] Error during OpenAI call or scraping:", err);
    return res
      .status(500)
      .json({ error: err.message || "Unknown server error" });
  }
}
