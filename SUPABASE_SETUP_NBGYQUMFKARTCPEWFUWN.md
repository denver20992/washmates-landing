# WashMates Supabase Setup - Project nbgyqumfkartcpewfuwn

## Your Existing Supabase Project
- **Project ID**: nbgyqumfkartcpewfuwn
- **Project URL**: https://nbgyqumfkartcpewfuwn.supabase.co
- **Dashboard**: https://app.supabase.com/project/nbgyqumfkartcpewfuwn

## Setup Instructions

### Step 1: Get Your API Keys
1. Go to: https://app.supabase.com/project/nbgyqumfkartcpewfuwn/settings/api
2. Copy the **anon public** key (starts with `eyJ...`)
3. Update `.env.local` with this key

### Step 2: Run the Unified User Schema
1. Go to: https://app.supabase.com/project/nbgyqumfkartcpewfuwn/sql/new
2. Copy ALL contents from `/supabase/unified-user-schema.sql`
3. Paste into the SQL editor
4. Click "Run" button
5. You should see "Success. No rows returned"

### Step 3: Verify Tables Were Created
1. Go to: https://app.supabase.com/project/nbgyqumfkartcpewfuwn/editor
2. You should see these new tables:
   - `users` - Main user table
   - `invitations` - Invitation tracking
3. And these views:
   - `waitlist_analytics` - Analytics dashboard
   - `conversion_funnel` - Conversion tracking

### Step 4: Configure Production (Vercel)
1. Go to your Vercel dashboard
2. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://nbgyqumfkartcpewfuwn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
   ```
3. Redeploy the site

### Step 5: Test the System
1. Restart your dev server:
   ```bash
   cd /home/denver/dev/projects/washmates-landing
   npm run dev
   ```
2. Go to http://localhost:3000
3. Try signing up with a test email
4. Check the database: https://app.supabase.com/project/nbgyqumfkartcpewfuwn/editor/users

## Integration with Your Mobile App

Your mobile app can now:
1. **Check for users by email** when they sign up
2. **Use invitation codes** to pre-fill signup forms
3. **Track user journey** from waitlist to active user

### Mobile App Configuration
Add to your React Native app's `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://nbgyqumfkartcpewfuwn.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[same-anon-key]
```

### Check if User Exists (in mobile app)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://nbgyqumfkartcpewfuwn.supabase.co',
  'your-anon-key'
)

// When user enters email in signup
const checkExistingUser = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()
  
  if (data) {
    // User was on waitlist!
    // Pre-fill their user type
    setUserType(data.user_type)
    // Show welcome back message
    alert(`Welcome back! You were #${data.waitlist_position} on our waitlist!`)
  }
}
```

## Why Use the Unified System?

### Benefits:
1. **Single Database**: Both waitlist and app use same Supabase project
2. **No Data Migration**: Users flow seamlessly from waitlist to app
3. **Better Analytics**: Track conversion rates and user journey
4. **Cost Effective**: One Supabase project for everything

### What Happens:
1. User signs up on landing page → Creates `users` record
2. You send invitations → Creates `invitations` record
3. User opens app → App checks `users` table
4. User completes signup → Updates same `users` record

## Admin Functions

### View All Waitlist Users
Go to: https://app.supabase.com/project/nbgyqumfkartcpewfuwn/sql/new
```sql
SELECT email, user_type, waitlist_position, created_at, postal_code
FROM users
WHERE joined_waitlist_at IS NOT NULL
ORDER BY waitlist_position;
```

### Send Invitations (when app is ready)
```sql
-- Invite next 10 customers
SELECT invite_waitlist_users(10, 'customer');
```

### View Analytics
```sql
-- See signups by day
SELECT * FROM waitlist_analytics ORDER BY signup_date DESC;

-- See conversion funnel
SELECT * FROM conversion_funnel;
```

## Troubleshooting

### If Tables Don't Create:
- Make sure you copied the ENTIRE schema file
- Check for error messages in the SQL editor
- Try running the schema in smaller chunks

### If Signups Don't Work:
1. Check browser console for errors
2. Verify `.env.local` has correct keys
3. Make sure dev server was restarted after adding `.env.local`
4. Check Supabase logs: https://app.supabase.com/project/nbgyqumfkartcpewfuwn/logs/explorer

### If You See "undefined" Errors:
- Your API keys are not configured correctly
- Double-check the anon key in `.env.local`
- Make sure there are no extra spaces or quotes

## Security Notes
- The anon key is safe for public use (it's meant for browsers)
- RLS (Row Level Security) protects user data
- Users can only see/edit their own records
- Never share your service_role key (keep it server-side only)

## Next Steps
1. Get your anon key and update `.env.local`
2. Run the schema in SQL editor
3. Test a signup
4. Deploy to production with environment variables
5. Start collecting real signups!

Your existing Supabase project (nbgyqumfkartcpewfuwn) will now handle both waitlist signups AND future app users in one unified system!