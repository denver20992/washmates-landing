# 🌐 GoDaddy DNS Setup for WashMates

## Your Deployment URLs
✅ **Production URL**: https://washmates-landing.vercel.app
✅ **Vercel Dashboard**: https://vercel.com/washmates/washmates-landing

## Step-by-Step GoDaddy Configuration

### 1. Login to GoDaddy
Go to https://www.godaddy.com and sign in to your account.

### 2. Access DNS Management
1. Click "My Products"
2. Find "washmates.ca" domain
3. Click "DNS" or "Manage DNS"

### 3. Delete Existing Records (Important!)
Delete any existing A, AAAA, or CNAME records for:
- `@` (root domain)
- `www`

### 4. Add New DNS Records

#### For www.washmates.ca (RECOMMENDED SETUP):
- **Type**: CNAME
- **Name**: www
- **Value**: cname.vercel-dns.com
- **TTL**: 1 Hour (or 3600)

#### For washmates.ca (root domain):
- **Type**: A
- **Name**: @ (or leave blank)
- **Value**: 76.76.21.21
- **TTL**: 1 Hour (or 3600)

### 5. Add Vercel Domain in Dashboard
1. Go to: https://vercel.com/washmates/washmates-landing/settings/domains
2. Click "Add Domain"
3. Enter: `washmates.ca`
4. Click "Add"
5. Add another domain: `www.washmates.ca`

### 6. Wait for Propagation
- DNS changes typically take 5-30 minutes on GoDaddy
- Maximum wait time is 48 hours (rare)
- You can check status at: https://dnschecker.org

## Alternative Setup (If Above Doesn't Work)

Some GoDaddy accounts support forwarding. If so:

### Option A: Domain Forwarding
1. In GoDaddy DNS settings
2. Find "Forwarding" section
3. Set up:
   - Forward to: https://washmates-landing.vercel.app
   - Type: Permanent (301)
   - Forward with masking: NO

### Option B: Use Vercel's IP addresses
Instead of the single A record, add all four:
- **Type**: A, **Name**: @, **Value**: 76.76.21.21
- **Type**: A, **Name**: @, **Value**: 76.76.21.93
- **Type**: A, **Name**: @, **Value**: 76.76.21.123
- **Type**: A, **Name**: @, **Value**: 76.76.21.142

## Verify It's Working

### Check these URLs:
1. https://washmates-landing.vercel.app (works immediately)
2. https://www.washmates.ca (after DNS propagation)
3. https://washmates.ca (after DNS propagation)

### In Vercel Dashboard:
- Green checkmark = SSL certificate issued
- "Valid Configuration" = DNS is correct

## Troubleshooting

### "Invalid Configuration" in Vercel
- Double-check the CNAME and A records
- Make sure no conflicting records exist
- Wait 10 more minutes and refresh

### Site Not Loading
- Clear browser cache
- Try incognito/private browsing
- Check https://dnschecker.org for your domain

### SSL Certificate Error
- Vercel automatically provisions SSL
- Can take up to 24 hours after DNS is configured
- If still not working, click "Refresh" in Vercel domains settings

## Quick Reference

### Your Records Should Look Like:
```
Type    Name    Value                   TTL
A       @       76.76.21.21            1 Hour
CNAME   www     cname.vercel-dns.com   1 Hour
```

### Your Live URLs Will Be:
- https://www.washmates.ca (primary)
- https://washmates.ca (redirects to www)
- https://washmates-landing.vercel.app (Vercel subdomain, always works)

---

📧 Need help? Contact Vercel support: https://vercel.com/support