import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import fs from 'fs';

const systemPrompt = "You are a legal assistant.";

async function main() {
  fs.readFileSync('.env.local', 'utf-8').split('\n').forEach(l => {
    if (l.trim() && !l.startsWith('#')) {
      const [k, ...v] = l.split('=');
      process.env[k.trim()] = v.join('=').trim();
    }
  });

  const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
  
  try {
    const { text } = await generateText({
      model: openrouter('google/gemini-2.0-flash-lite-preview-02-05:free'),
      system: systemPrompt,
      messages: [{ role: 'user', content: 'What is 1+1?' }],
      temperature: 0.1
    });
    console.log('Success:', text);
  } catch (e) {
    console.error('Failed:', e.message);
  }
}
main();
