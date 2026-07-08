import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import fs from 'fs';

const systemPrompt = "You are a legal assistant.";

async function main() {
  fs.readFileSync('.env.local', 'utf-8').split('\n').forEach(l => {
    if (l.trim() && !l.startsWith('#')) {
      const [k, ...v] = l.split('=');
      process.env[k.trim()] = v.join('=').trim();
    }
  });

  const models = ['gemini-1.5-flash-latest', 'gemini-1.5-pro-latest', 'gemini-1.5-flash'];
  for (const model of models) {
    try {
      console.log('Testing', model);
      const { text } = await generateText({
        model: google(model),
        system: systemPrompt,
        messages: [{ role: 'user', content: 'What is 1+1?' }],
        temperature: 0.1
      });
      console.log('Success:', text);
    } catch (e) {
      console.error('Failed:', model, e.message);
    }
  }
}
main();
