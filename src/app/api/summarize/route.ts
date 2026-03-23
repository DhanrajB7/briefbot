import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';
import { generateSummary } from '@/lib/anthropic';
import { extractTextFromURL } from '@/lib/url-scraper';
import { nanoid } from 'nanoid';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const { allowed, remaining } = checkRateLimit(ip, 'summarize');
    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. You can summarize up to 10 documents per hour.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': String(remaining) } }
      );
    }

    const formData = await request.formData();
    const sourceType = formData.get('sourceType') as string;
    const url = formData.get('url') as string | null;
    const file = formData.get('file') as File | null;
    const text = formData.get('text') as string | null;

    let documentText = '';
    let sourceUrl: string | null = null;

    if (sourceType === 'pdf' && file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { extractTextFromPDF } = await import('@/lib/pdf-parser');
      documentText = await extractTextFromPDF(buffer);
    } else if (sourceType === 'url' && url) {
      documentText = await extractTextFromURL(url);
      sourceUrl = url;
    } else if (sourceType === 'text' && text) {
      documentText = text;
    } else {
      return NextResponse.json(
        { error: 'Invalid input. Provide a file, URL, or text.' },
        { status: 400 }
      );
    }

    if (!documentText.trim()) {
      return NextResponse.json(
        { error: 'Could not extract text from the provided source.' },
        { status: 400 }
      );
    }

    const result = await generateSummary(documentText);
    const shareId = nanoid(10);

    const { data: summary, error } = await supabase
      .from('summaries')
      .insert({
        title: result.title,
        source_type: sourceType,
        source_url: sourceUrl,
        original_text: documentText.slice(0, 100000),
        summary: result.summary,
        key_takeaways: result.keyTakeaways,
        share_id: shareId,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to save summary' }, { status: 500 });
    }

    return NextResponse.json({ summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : '';
    console.error('Summarize error:', message);
    console.error('Stack:', stack);
    return NextResponse.json(
      { error: `Error: ${message}` },
      { status: 500 }
    );
  }
}
