import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function generateDraft(variables) {
  const prompt = `You are a highly qualified Indian lawyer. Using the following input variables, generate a formal legal draft in plain text. Ensure formatting suitable for A4 print. Variables:
${Object.entries(variables).map(([k, v]) => `${k}: ${v}`).join('\n')}`;

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    max_tokens: 2000,
    temperature: 0.3,
    top_p: 1.0,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response.data.choices[0].text.trim();
}
