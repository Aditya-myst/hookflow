-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY, -- Matches Clerk ID
  email TEXT,
  plan TEXT DEFAULT 'free',
  credits INTEGER DEFAULT 3,
  last_reset_date TEXT DEFAULT timezone('utc'::text, now())::date::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) if you want to restrict access
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow the backend (service role) to do everything, 
-- or generic public access if you are lazy for now (NOT RECOMMENDED FOR PROD)
-- For now, since we interact via backend with Key, it should work fine without policies 
-- if using Service Role, but with Anon key constraints might apply.
-- Let's just create a basic policy to allow read/write for now to avoid permission errors if RLS is on.
create policy "Public users are viewable by everyone."
  on users for select
  using ( true );

create policy "Users can insert their own profile."
  on users for insert
  with check ( true );

create policy "Users can update own profile."
  on users for update
  using ( true );
