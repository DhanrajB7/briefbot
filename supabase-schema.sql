-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- This creates the tables needed for BriefBot

-- Summaries table
create table public.summaries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  source_type text not null check (source_type in ('pdf', 'url', 'text')),
  source_url text,
  original_text text not null,
  summary text not null,
  key_takeaways jsonb not null default '[]'::jsonb,
  share_id text unique not null,
  created_at timestamptz default now() not null
);

-- QA Messages table
create table public.qa_messages (
  id uuid default gen_random_uuid() primary key,
  summary_id uuid references public.summaries(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_summaries_user_id on public.summaries(user_id);
create index idx_summaries_share_id on public.summaries(share_id);
create index idx_qa_messages_summary_id on public.qa_messages(summary_id);

-- Row Level Security
alter table public.summaries enable row level security;
alter table public.qa_messages enable row level security;

-- Policies: Users can only access their own summaries
create policy "Users can view own summaries"
  on public.summaries for select
  using (auth.uid() = user_id);

create policy "Users can insert own summaries"
  on public.summaries for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own summaries"
  on public.summaries for delete
  using (auth.uid() = user_id);

-- Public read access for shared summaries
create policy "Anyone can view shared summaries"
  on public.summaries for select
  using (share_id is not null);

-- QA messages: access through summary ownership
create policy "Users can view QA messages for own summaries"
  on public.qa_messages for select
  using (
    exists (
      select 1 from public.summaries
      where summaries.id = qa_messages.summary_id
      and summaries.user_id = auth.uid()
    )
  );

create policy "Users can insert QA messages for own summaries"
  on public.qa_messages for insert
  with check (
    exists (
      select 1 from public.summaries
      where summaries.id = qa_messages.summary_id
      and summaries.user_id = auth.uid()
    )
  );

create policy "Users can delete QA messages for own summaries"
  on public.qa_messages for delete
  using (
    exists (
      select 1 from public.summaries
      where summaries.id = qa_messages.summary_id
      and summaries.user_id = auth.uid()
    )
  );
