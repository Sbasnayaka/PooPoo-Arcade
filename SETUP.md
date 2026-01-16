# Environment Setup Guide

## Quick Start (Mock Mode - No Database Required)

The partner matching system is currently running in **mock mode** which allows you to test the functionality without setting up Supabase.

### Testing Mock Mode

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Test pairing flow**:
   - Open the landing page
   - Note your generated code (e.g., "ABC-D3F-GH5")
   - Enter any partner code (e.g., "XYZ-123-ABC")
   - Click FLUSH
   - You'll be redirected to `/lobby/mock-lobby-[id]`
   - The lobby page will need to be created (Phase 3)

### Current Limitations in Mock Mode

- ✅ Code generation works
- ✅ Partner code validation works
- ✅ Pairing initiates successfully
- ❌ Realtime notifications don't work (both users must click FLUSH)
- ❌ No database persistence
- ❌ Lobby page shows "not found" error (Phase 3 not implemented yet)

---

## Production Setup (Full Features)

To enable full realtime pairing with database persistence:

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for project to finish provisioning

### Step 2: Set Environment Variables

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from Supabase Dashboard → Settings → API

### Step 3: Run Database Migrations

In Supabase Dashboard → SQL Editor, run:

```sql
-- Create user_sessions table
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 hour'),
  is_paired BOOLEAN DEFAULT FALSE,
  pair_id UUID
);

CREATE INDEX idx_user_code ON user_sessions(user_code);
CREATE INDEX idx_is_paired ON user_sessions(is_paired);

-- Create user_pairs table
CREATE TABLE user_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_code VARCHAR(20) NOT NULL,
  user_b_code VARCHAR(20) NOT NULL,
  lobby_id VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 hours'),
  CONSTRAINT different_users CHECK (user_a_code != user_b_code)
);

CREATE INDEX idx_lobby_id ON user_pairs(lobby_id);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pairs ENABLE ROW LEVEL SECURITY;

-- Allow reading sessions (needed for partner validation)
CREATE POLICY "Anyone can read sessions"
  ON user_sessions FOR SELECT
  USING (true);

-- Allow creating sessions
CREATE POLICY "Anyone can create session"
  ON user_sessions FOR INSERT
  WITH CHECK (true);

-- Allow reading own pairs
CREATE POLICY "Users can read pairs"
  ON user_pairs FOR SELECT
  USING (true);

-- Allow creating valid pairs
CREATE POLICY "Anyone can create pairs"
  ON user_pairs FOR INSERT
  WITH CHECK (user_a_code != user_b_code);
```

### Step 4: Enable Realtime

In Supabase Dashboard → Database → Replication:
- Enable realtime for `user_sessions` table
- Enable realtime for `user_pairs` table

### Step 5: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

The system will automatically detect Supabase configuration and switch from mock mode to full realtime mode.

---

## Testing Realtime Pairing (with Supabase)

### Two-Window Test

1. **Window A** (User A):
   - Open incognito window
   - Go to `http://localhost:3001`
   - Copy the generated code
   - Share with User B

2. **Window B** (User B):
   - Open normal window
   - Go to `http://localhost:3001`
   - Paste User A's code
   - Click FLUSH

3. **Expected Result**:
   - User B redirects to lobby immediately
   - User A receives realtime notification and also redirects to same lobby
   - Both see same lobby ID in URL

---

## Troubleshooting

### "Partner code not found" error
- Codes expire after 1 hour
- Ensure both users have active codes
- Check that partner code is typed correctly

### Pairing doesn't trigger realtime redirect
- Check Supabase is configured (see browser console)
- Verify realtime is enabled in Supabase dashboard
- Check network tab for websocket connection

### "You are already paired"
- Clear localStorage: `localStorage.clear()` in browser console
- Refresh the page to generate new code

### Database errors
- Verify RLS policies are created
- Check Supabase logs in dashboard
- Ensure environment variables are correct

---

## Next Steps

To complete the lobby feature (Phase 3):
1. Create `/src/app/lobby/[id]/page.tsx`
2. Build lobby UI with game list
3. Create GameCard component
4. Test full flow: landing → pairing → lobby → game

See `partner_matching_plan.md` for detailed Phase 3 instructions.
