import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';
import { askQuestion } from '@/lib/anthropic';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const { allowed } = checkRateLimit(ip, 'qa');
    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. You can ask up to 30 questions per hour.' },
        { status: 429 }
      );
    }

    const { summaryId, question } = await request.json();

    const { data: summary, error: summaryError } = await supabase
      .from('summaries')
      .select('original_text')
      .eq('id', summaryId)
      .single();

    if (summaryError || !summary) {
      return NextResponse.json({ error: 'Summary not found' }, { status: 404 });
    }

    const { data: history } = await supabase
      .from('qa_messages')
      .select('role, content')
      .eq('summary_id', summaryId)
      .order('created_at', { ascending: true })
      .limit(20);

    const answer = await askQuestion(
      summary.original_text,
      question,
      (history || []) as { role: 'user' | 'assistant'; content: string }[]
    );

    await supabase.from('qa_messages').insert([
      { summary_id: summaryId, role: 'user', content: question },
      { summary_id: summaryId, role: 'assistant', content: answer },
    ]);

    return NextResponse.json({ answer });
  } catch (err) {
    console.error('QA error:', err);
    return NextResponse.json({ error: 'Failed to answer question' }, { status: 500 });
  }
}
