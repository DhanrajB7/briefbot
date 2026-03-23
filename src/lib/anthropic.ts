import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateSummary(text: string): Promise<{
  title: string;
  summary: string;
  keyTakeaways: string[];
}> {
  const trimmed = text.slice(0, 80000);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Analyze the following document and provide:
1. A concise title (max 10 words)
2. A comprehensive summary (2-4 paragraphs)
3. 5-8 key takeaways as bullet points

Respond in this exact JSON format and nothing else:
{
  "title": "...",
  "summary": "...",
  "keyTakeaways": ["...", "..."]
}

Document:
${trimmed}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not parse AI response');

  return JSON.parse(jsonMatch[0]);
}

export async function askQuestion(
  documentText: string,
  question: string,
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const trimmedDoc = documentText.slice(0, 60000);

  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content: `You are answering questions about this document. Be helpful, accurate, and concise. If the answer isn't in the document, say so.\n\nDocument:\n${trimmedDoc}`,
    },
    {
      role: 'assistant',
      content: "I've read the document. I'm ready to answer your questions about it.",
    },
    ...history.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: question,
    },
  ];

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages,
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');
  return content.text;
}
