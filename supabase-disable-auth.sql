-- Run this in Supabase SQL Editor to remove auth requirements

-- Disable Row Level Security (no auth needed)
alter table public.summaries disable row level security;
alter table public.qa_messages disable row level security;

-- Make user_id optional (nullable with no default)
alter table public.summaries alter column user_id drop not null;
alter table public.summaries alter column user_id set default null;
