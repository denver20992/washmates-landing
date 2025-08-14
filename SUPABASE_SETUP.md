# Supabase Setup Guide for WashMates Waitlist

## Prerequisites
- Supabase account (create one at https://supabase.com)
- Access to the WashMates landing page project

## Step 1: Create a New Supabase Project

1. Go to https://app.supabase.com
2. Click "New project"
3. Enter the following details:
   - **Name**: WashMates Waitlist
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the closest to Toronto (e.g., US East)
   - **Plan**: Free tier is fine to start

4. Click "Create new project" and wait for setup (takes ~2 minutes)

## Step 2: Run the Database Schema

Once your project is ready:

1. In the Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy the entire contents of `/supabase/waitlist-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned" message

## Step 3: Get Your API Keys

1. In the Supabase dashboard, click on "Settings" (gear icon) in the left sidebar
2. Click on "API" under Project Settings
3. You'll need two values:
   - **Project URL**: Copy the URL (looks like `https://xxxxx.supabase.co`)
   - **Anon/Public Key**: Copy the `anon` `public` key (long string starting with `eyJ...`)

## Step 4: Configure Environment Variables

1. In your landing page project, create or update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the placeholder values with your actual Supabase credentials

## Step 5: Test the Waitlist

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000
3. Try submitting an email to the waitlist
4. Check if it works by:
   - Looking for the success message on the page
   - Checking the Supabase dashboard:
     - Go to "Table Editor" in the left sidebar
     - Click on the "waitlist" table
     - You should see your test email entry

## Step 6: Verify in Supabase Dashboard

1. In Supabase dashboard, go to "Table Editor"
2. Select the "waitlist" table
3. You should see columns for:
   - id (auto-generated UUID)
   - email
   - user_type (customer or washmate)
   - created_at
   - And various tracking fields

## Step 7: Production Deployment

When deploying to Vercel:

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add the same environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy your application

## Troubleshooting

### If emails aren't being saved:
1. Check browser console for errors
2. Verify your environment variables are set correctly
3. Make sure the SQL schema was run successfully
4. Check Supabase logs: Dashboard → Logs → API

### If you get CORS errors:
1. In Supabase dashboard, go to Authentication → URL Configuration
2. Add your domain to "Site URL" and "Redirect URLs":
   - http://localhost:3000
   - https://washmates.ca
   - https://www.washmates.ca

### To view waitlist statistics:
Run this query in the SQL Editor:
```sql
SELECT * FROM waitlist_stats;
```

## Security Notes

- The `anon` key is safe to use in client-side code
- Row Level Security (RLS) is enabled to protect data
- Email addresses are automatically lowercased for consistency
- Duplicate emails update the existing record instead of creating new ones

## Next Steps

1. Set up email notifications (optional):
   - Use Supabase Edge Functions to send welcome emails
   - Integrate with SendGrid, Resend, or similar service

2. Create an admin dashboard (optional):
   - Build a protected route to view all waitlist entries
   - Add export functionality for CSV downloads

3. Set up regular backups:
   - Supabase automatically backs up on paid plans
   - For free tier, periodically export your data

## Support

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check application logs in Vercel dashboard for production issues