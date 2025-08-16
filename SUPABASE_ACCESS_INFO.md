# Supabase Access Information

## Your Project Details
- **Project ID**: nbgyqumfkartcpewfuwn
- **Project URL**: https://nbgyqumfkartcpewfuwn.supabase.co
- **Dashboard**: https://app.supabase.com/project/nbgyqumfkartcpewfuwn

## Recent Access
You mentioned Supabase shows recent access. This could be from:
1. Previous Claude sessions checking the project
2. The Supabase MCP server if it was configured before
3. Direct API calls from testing

## To Get Your API Keys

Since the project exists and has been accessed, you already have the keys somewhere. Check:

### 1. Supabase Dashboard
Go to: https://app.supabase.com/project/nbgyqumfkartcpewfuwn/settings/api
- Copy the **anon public** key (starts with `eyJ...`)
- This is safe to use in client-side code

### 2. Check Your Password Manager
You might have saved the keys when you first created the project

### 3. Check Your Email
Supabase might have sent the initial setup email with project details

### 4. Check Previous Code
The keys might be in:
- Old commits in git history
- Backup files
- Other project folders

## Quick Test Without Keys

To check if the schema exists, go to:
https://app.supabase.com/project/nbgyqumfkartcpewfuwn/editor

Look for these tables:
- `users` (if unified schema was run)
- `waitlist` (if old schema was run)
- `invitations` (if unified schema was run)

## If Schema Doesn't Exist Yet

1. Go to SQL Editor: https://app.supabase.com/project/nbgyqumfkartcpewfuwn/sql/new
2. Copy contents from `/supabase/unified-user-schema.sql`
3. Click "Run"

## Manual Configuration

If you have the anon key, update `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://nbgyqumfkartcpewfuwn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[paste-your-anon-key-here]
```

## Testing Without Local Setup

You can test directly in Supabase:
1. Go to SQL Editor
2. Run this to add a test signup:
```sql
SELECT add_to_waitlist(
  'test@example.com',
  'customer',
  NULL, NULL, NULL, NULL, NULL, NULL
);
```
3. Check if it worked:
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```

## Production Deployment

For Vercel, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` = https://nbgyqumfkartcpewfuwn.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = [your-anon-key]

The system is ready - we just need to connect the API key!