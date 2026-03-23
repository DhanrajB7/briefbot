import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await supabase.from('qa_messages').delete().eq('summary_id', id);

    const { error } = await supabase
      .from('summaries')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
