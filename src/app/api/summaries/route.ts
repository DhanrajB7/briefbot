import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: summaries, error } = await supabase
      .from('summaries')
      .select('id, title, source_type, source_url, share_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch summaries' }, { status: 500 });
    }

    return NextResponse.json({ summaries });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
