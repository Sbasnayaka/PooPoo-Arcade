-- Create a table for game leaderboards
create table if not exists leaderboards (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  player_name text not null,
  game_type text not null, -- 'tictacturd', 'battleflush'
  score int not null default 0,
  metadata jsonb
);

-- Enable RLS
alter table leaderboards enable row level security;

-- Allow anyone to read leaderboards
create policy "Public Leaderboards" on leaderboards
  for select using (true);

-- Allow authenticated users to insert scores (or anon if we want open season)
create policy "Insert Scores" on leaderboards
  for insert with check (true);
