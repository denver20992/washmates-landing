# WashMates Unified User System Setup

## Overview
This system unifies waitlist signups with your main app's user database, allowing seamless transition from waitlist → invitation → app user.

## Key Features
✅ **Single User Record**: One user entry from waitlist to active customer/washmate
✅ **Pre-filled Signups**: When invited, users see their email pre-populated
✅ **Invitation Tracking**: Track who opened, clicked, and completed signup
✅ **Waitlist Position**: Users know their place in line
✅ **Analytics**: Conversion funnel from waitlist to active user
✅ **Location Data**: Capture postal codes for service area planning

## Database Architecture

### Users Table
- Stores both waitlist and active users
- Tracks journey: `joined_waitlist_at` → `invited` → `activated_at`
- Single source of truth for all user data

### Invitations Table
- Unique invitation codes for each user
- Tracks engagement (opened, clicked, completed)
- 30-day expiration for urgency

## User Flow

### 1. Waitlist Signup (Landing Page)
```
User enters email → Creates/updates user record → Gets waitlist position
```

### 2. Invitation Process
```
Admin sends invites → User receives email with code → Code links to app signup
```

### 3. App Signup (Mobile App)
```
User enters code → App fetches user data → Email pre-filled → Complete profile
```

## Supabase Setup Instructions

### Step 1: Create Supabase Project
1. Go to https://app.supabase.com
2. Create new project: "WashMates Production"
3. Save your database password!

### Step 2: Run Database Schema
1. Go to SQL Editor in Supabase
2. Copy contents of `/supabase/unified-user-schema.sql`
3. Paste and run (click "RUN")
4. You should see "Success" message

### Step 3: Get API Keys
1. Go to Settings → API
2. Copy these values:
   - Project URL: `https://[your-project].supabase.co`
   - Anon Key: `eyJ...` (long string)
   - Service Role Key: `eyJ...` (keep this secret!)

### Step 4: Configure Landing Page
Create `.env.local` in `/washmates-landing`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Step 5: Configure Mobile App
In your React Native app, add to `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 6: Deploy to Production
In Vercel Dashboard:
1. Settings → Environment Variables
2. Add all three variables
3. Redeploy

## Integration with Mobile App

### Check for Invitation Code
```typescript
// In your app's signup screen
const checkInvitation = async (code: string) => {
  const result = await getUserByInvitation(code);
  if (result.success) {
    // Pre-fill signup form
    setEmail(result.user.email);
    setUserType(result.user.user_type);
    setUserId(result.user.id);
  }
};
```

### Complete User Activation
```typescript
// After user completes signup
const completeSignup = async () => {
  await activateUser(userId, {
    first_name: firstName,
    last_name: lastName,
    phone: phone,
    postal_code: postalCode,
    password_hash: hashedPassword
  });
};
```

## Admin Functions

### Send Invitations (Run in SQL Editor)
```sql
-- Invite next 10 customers
SELECT invite_waitlist_users(10, 'customer');

-- Invite next 5 washmates
SELECT invite_waitlist_users(5, 'washmate');
```

### View Analytics
```sql
-- Waitlist signups by day
SELECT * FROM waitlist_analytics ORDER BY signup_date DESC;

-- Conversion funnel
SELECT * FROM conversion_funnel;

-- Users by postal code
SELECT postal_code, COUNT(*) as users 
FROM users 
GROUP BY postal_code 
ORDER BY users DESC;
```

### Export Waitlist
```sql
-- Export all waitlist users
SELECT email, user_type, waitlist_position, created_at, postal_code
FROM users
WHERE joined_waitlist_at IS NOT NULL
ORDER BY waitlist_position;
```

## Testing the System

### 1. Test Waitlist Signup
```bash
curl -X POST https://www.washmates.ca/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","userType":"customer"}'
```

### 2. Check User in Database
Go to Supabase → Table Editor → users table

### 3. Test Invitation Flow
```sql
-- Get invitation code for test user
SELECT i.invitation_code 
FROM invitations i
JOIN users u ON u.id = i.user_id
WHERE u.email = 'test@example.com';
```

### 4. Test App Integration
Use invitation code in your mobile app's signup flow

## Benefits of This System

### For Marketing
- Track conversion rates from waitlist to active user
- Identify best performing channels (UTM tracking)
- Geographic data for expansion planning

### For Product
- Seamless user onboarding
- No duplicate accounts
- Pre-validated email addresses

### For Users
- Know their position in line
- Quick signup with pre-filled data
- Feel valued as early adopters

## Security Considerations
- Row Level Security (RLS) enabled
- Users can only see/edit their own data
- Service role key never exposed to client
- Invitation codes expire after 30 days
- Email normalization prevents duplicates

## Next Steps
1. Set up Supabase project
2. Run the schema
3. Configure environment variables
4. Test with a few email addresses
5. Set up email notifications (optional)
6. Create admin dashboard (optional)

## Support
- Supabase Docs: https://supabase.com/docs
- Check table data: Supabase Dashboard → Table Editor
- View logs: Supabase Dashboard → Logs