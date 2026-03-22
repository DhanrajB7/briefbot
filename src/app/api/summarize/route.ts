import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { generateSummary } from '@/lib/anthropic';
import { extractTextFromPDF } from '@/lib/pdf-parser';
import { extractTextFromURL } from '@/lib/url-scraper';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
        user_id: user.id,
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
    console.error('Summarize error:', err);
    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again.' },
      { status: 500 }
    );
  }
}
