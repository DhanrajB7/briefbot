import { extractText } from 'unpdf';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const result = await extractText(new Uint8Array(buffer));
  const text = Array.isArray(result.text) ? result.text.join('\n') : String(result.text);
  return text;
}
