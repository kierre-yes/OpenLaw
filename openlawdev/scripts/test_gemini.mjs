import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import fs from 'fs';

const context = '[Source Title: 1987 Constitution of the Republic of the Philippines]\n[Article: ARTICLE XIV]\n[Section: SECTION 6]\nThe national language of the Philippines is Filipino. As it evolves, it shall be further developed and enriched on the basis of existing Philippine and other languages.';

const systemPrompt = `You are a Philippine Legal Assistant named OpenLaw.
You MUST answer the user's question based ONLY on the following context.
If the context does not contain the answer, say "I don't have enough information in my verifiable sources to answer that."

When you provide facts from the context, please cite the [Source Title] and [Article/Section] appropriately so the user can verify it. Include a direct answer, a brief explanation, and the source citation. Refuse ONLY if the retrieved text does not contain relevant information.

Context:
${context}
`;

async function main() {
  fs.readFileSync('.env.local', 'utf-8').split('\n').forEach(l => {
    if (l.trim() && !l.startsWith('#')) {
      const [k, ...v] = l.split('=');
      process.env[k.trim()] = v.join('=').trim();
    }
  });

  try {
    const { text } = await generateText({
      model: google('gemini-1.5-pro'),
      system: systemPrompt,
      messages: [{ role: 'user', content: 'What is the national language of the Philippines according to the Constitution?' }],
      temperature: 0.1
    });
    console.log('Response:', text);
  } catch (e) {
    console.error('Error:', e);
  }
}
main();
