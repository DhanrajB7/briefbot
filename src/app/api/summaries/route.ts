import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';

export async function GET() {
  try {

    const { data: summaries, error } = await supabase
      .from('summaries')
      .select('id, title, source_type, source_url, share_id, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch summaries' }, { status: 500 });
    }

    return NextResponse.json({ summaries });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
