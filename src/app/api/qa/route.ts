import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { askQuestion } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { summaryId, question } = await request.json();

    // Fetch the summary and its original text
    const { data: summary, error: summaryError } = await supabase
      .from('summaries')
      .select('original_text')
      .eq('id', summaryId)
      .single();

    if (summaryError || !summary) {
      return NextResponse.json({ error: 'Summary not found' }, { status: 404 });
    }

    // Fetch conversation history
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

    // Save both messages to the database
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
