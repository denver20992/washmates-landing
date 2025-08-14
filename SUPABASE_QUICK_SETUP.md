# Quick Supabase Setup for WashMates Waitlist

## ⚠️ Current Status: NOT CONNECTED
Your waitlist form is currently not working because Supabase is not configured.

## To Enable Waitlist:

### Option 1: Use Your Existing Supabase Project (If you have one)

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

3. Run the SQL schema from `/supabase/waitlist-schema.sql` in your Supabase SQL editor

4. Restart the dev server:
```bash
npm run dev
```

### Option 2: Create New Supabase Project (Free)

1. Go to https://app.supabase.com and sign up/login
2. Click "New project"
3. Fill in:
   - Name: WashMates Waitlist
   - Database Password: (save this!)
   - Region: US East (closest to Toronto)
   
4. Once created, go to Settings > API
5. Copy the "Project URL" and "anon" key
6. Create `.env.local` with these values
7. Run the SQL schema in SQL Editor
8. Restart your Next.js server

## Testing the Waitlist

Once configured, test at http://localhost:3000:
1. Enter an email address
2. Select "As a Customer" or "As a WashMate"
3. Click "Join Waitlist"
4. Check Supabase dashboard > Table Editor > waitlist table

## Current Errors (Without Supabase)

When users try to sign up now, they'll see:
- "Failed to join waitlist. Please try again."
- Console error: Cannot read properties of undefined

## Production Deployment

For Vercel deployment:
1. Go to Vercel Dashboard > Settings > Environment Variables
2. Add the same NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Redeploy

## Check Current Signups

Once connected, view signups at:
- Supabase Dashboard > Table Editor > waitlist
- Or use SQL: `SELECT * FROM waitlist ORDER BY created_at DESC;`