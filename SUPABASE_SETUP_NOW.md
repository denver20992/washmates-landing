# 🔥 IMMEDIATE ACTION REQUIRED - Supabase Setup

## Current Status
✅ **Website is running:** http://localhost:3001
✅ **API keys are configured**
❌ **Waitlist table needs to be created**

## Create the Waitlist Table (1 minute)

### Step 1: Open Supabase SQL Editor
👉 **Click here:** https://app.supabase.com/project/nbgyqumfkartcpewfuwn/sql/new

### Step 2: Copy & Paste This SQL
```sql
-- Simple waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_type VARCHAR(20) CHECK (user_type IN ('customer', 'washmate')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  referrer VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_waitlist_user_type ON waitlist(user_type);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
```

### Step 3: Click "Run"
The green "Run" button is at the bottom of the SQL editor.

## Test the System (30 seconds)

### Option A: Test via Website
1. Go to http://localhost:3001
2. Enter a test email
3. Select "As a Customer" or "As a WashMate"
4. Click "Join Waitlist"
5. You should see a success message

### Option B: Test via Terminal
```bash
node setup-waitlist.mjs
```

## Verify Data in Supabase
👉 **View signups here:** https://app.supabase.com/project/nbgyqumfkartcpewfuwn/editor/waitlist

## That's It! 🎉
Once you create the table, everything will work automatically:
- Website forms will save to Supabase
- API endpoints are ready
- Environment variables are configured
- Duplicate detection is active

## Optional: Full User System (Later)
If you want the complete unified user system for app integration:
1. Run the SQL from `./supabase/unified-user-schema.sql`
2. This creates advanced features for invitation tracking and user conversion