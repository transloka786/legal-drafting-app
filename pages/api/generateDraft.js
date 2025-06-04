const cheerio = require('cheerio');
const fetch = require('node-fetch');

const ACT_MAP = {
  rent: [
    "https://www.indiacode.nic.in/show-data?actid=AC_CEN_3_20_00007_188204_1517807324080&sectionId=4278&sectionno=105",
    "https://www.indiacode.nic.in/show-data?actid=AC_CEN_3_11_00013_187209_1517807324079&sectionId=3758&sectionno=10",
  ],
  nda: [
    "https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_23_00022_187209_1517807324092&sectionId=987&sectionno=27",
  ],
  affidavit: [
    "https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_23_00022_187209_1517807324092&sectionId=991&sectionno=29",
  ]
};

async function fetchIndiaCodeSections(urls) {
  const texts = [];
  for (const url of urls) {
    try {
      const html = await fetch(url).then(res => res.text());
      const $ = cheerio.load(html);
      const sectionText = $('.act-section, .content-area, .act-body').text().trim();
      texts.push(sectionText || 'Section not found.');
    } catch (e) {
      texts.push('Section not found (fetch error).');
    }
  }
  return texts.join('\n\n');
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { docType, name, address, amount } = req.body || {};
    if (!docType || !name || !address || !amount) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    const legalContent = await fetchIndiaCodeSections(ACT_MAP[docType] || []);
    const prompt = `You are an Indian legal document drafting assistant. Create a ${docType.replace('_', ' ')} between ${name} residing at ${address}, for INR ${amount}.\n\nReference and cite the following legal provisions wherever appropriate:\n${legalContent}\n\nFormat the draft professionally and include relevant clauses based on Indian legal practice.`;

    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const gptData = await gptRes.json();
    const text = gptData.choices?.[0]?.message?.content || 'No draft generated.';
    res.status(200).json({ text });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
