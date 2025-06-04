import cheerio from 'cheerio';

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
    const html = await fetch(url).then(res => res.text());
    const $ = cheerio.load(html);
    const sectionText = $('.act-section, .content-area, .act-body').text().trim();
    texts.push(sectionText || 'Section not found.');
  }
  return texts.join('\n\n');
}

export default async function handler(req, res) {
  const { docType, name, address, amount } = req.body;
  const legalContent = await fetchIndiaCodeSections(ACT_MAP[docType] || []);
  const prompt = `Create a ${docType} between ${name} residing at ${address}, for INR ${amount}.\nReference the following legal provisions:\n${legalContent}`;

  const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const gptData = await gptRes.json();
  const text = gptData.choices?.[0]?.message?.content || 'No draft generated.';
  res.status(200).json({ text });
}
