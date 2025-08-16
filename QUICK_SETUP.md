# 🚀 WashMates Waitlist Quick Setup

## Current Status
✅ Supabase API keys configured in `.env.local`
✅ Next.js server running at http://localhost:3001
✅ API endpoint ready at `/api/waitlist`
⚠️ Waitlist table needs to be created in Supabase

## Step 1: Create Waitlist Table

1. **Go to Supabase SQL Editor:**
   https://app.supabase.com/project/nbgyqumfkartcpewfuwn/sql/new

2. **Copy and paste this SQL:**
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

3. **Click "Run"** to create the table

## Step 2: Test the Signup Form

1. **Visit the website:** http://localhost:3001
2. **Try signing up** with a test email
3. **Check Supabase Table Browser:** 
   https://app.supabase.com/project/nbgyqumfkartcpewfuwn/editor/waitlist

## Step 3: Verify Data Collection

Run this in terminal to check signups:
```bash
node setup-waitlist.mjs
```

## Optional: Full Unified User Schema

If you want the complete unified user system (for seamless app integration):

1. Go to: https://app.supabase.com/project/nbgyqumfkartcpewfuwn/sql/new
2. Copy contents from: `./supabase/unified-user-schema.sql`
3. Run the SQL

This creates:
- `users` table (for both waitlist and app users)
- `invitations` table (for tracking invites)
- Analytics views
- Stored procedures for user management

## Production Deployment

For Vercel, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` = https://nbgyqumfkartcpewfuwn.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = [your anon key from .env.local]

## Current Configuration

```env
NEXT_PUBLIC_SUPABASE_URL=https://nbgyqumfkartcpewfuwn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...XmD-wmzx...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...E0Eo_qee...
```

## Test Endpoints

- **Add to waitlist:** POST http://localhost:3001/api/waitlist
  ```json
  {
    "email": "test@example.com",
    "userType": "customer"
  }
  ```

- **Check if email exists:** GET http://localhost:3001/api/waitlist?email=test@example.com

## What's Working

✅ Supabase connection configured with your API keys
✅ Simple waitlist table schema ready
✅ API endpoints functional
✅ Forms will save to Supabase once table is created
✅ Error handling and duplicate detection

## Next Steps

1. Create the waitlist table in Supabase (see Step 1)
2. Test signup flow
3. Monitor signups in Supabase dashboard
4. Deploy to production when ready