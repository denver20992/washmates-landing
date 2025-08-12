# 🚀 WashMates Landing Page Deployment Guide

## Prerequisites
- GitHub account (you have: denver20992)
- Vercel account (free at vercel.com)
- Domain: www.washmates.ca (already owned)

## Step 1: Push to GitHub

First, initialize git and push your code:

```bash
cd /home/denver/dev/projects/washmates-landing
git init
git add .
git commit -m "Initial commit: WashMates landing page"
git branch -M main
git remote add origin https://github.com/denver20992/washmates-landing.git
git push -u origin main
```

**Note:** You may need to create the repository on GitHub first:
1. Go to https://github.com/new
2. Name it "washmates-landing"
3. Don't initialize with README (we already have code)
4. Create repository

## Step 2: Deploy to Vercel

### Option A: Via Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts:
   - Login/signup to Vercel
   - Link to existing project? No
   - What's your project name? washmates-landing
   - In which directory is your code? ./
   - Want to override settings? No

4. Deploy to production:
```bash
vercel --prod
```

### Option B: Via Vercel Dashboard

1. Go to https://vercel.com
2. Sign up/login (use GitHub for easy integration)
3. Click "Add New Project"
4. Import your GitHub repository "washmates-landing"
5. Click "Deploy"
6. Wait for build to complete (takes ~1-2 minutes)

## Step 3: Configure Custom Domain (www.washmates.ca)

### In Vercel Dashboard:

1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add domain: `www.washmates.ca`
4. Add domain: `washmates.ca` (redirect to www)

### At Your Domain Registrar:

You'll need to update DNS records. Vercel will show you exactly what to add:

**For www.washmates.ca:**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

**For washmates.ca (apex/root):**
- Type: A
- Name: @
- Value: 76.76.21.21

**Alternative if your registrar supports ALIAS/ANAME:**
- Type: ALIAS or ANAME
- Name: @
- Value: alias.vercel-dns.com

DNS propagation takes 5-48 hours, but often works within minutes.

## Step 4: Environment Variables (Optional - for Supabase)

If you want the waitlist to work:

1. In Vercel Dashboard → Settings → Environment Variables
2. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your_supabase_url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your_anon_key

3. Redeploy for changes to take effect

## Step 5: Verify Deployment

1. Check deployment URL: `https://washmates-landing.vercel.app`
2. Check custom domain: `https://www.washmates.ca` (after DNS propagates)
3. Test the waitlist form
4. Test mobile responsiveness

## Quick Deploy Commands Summary

```bash
# First time setup
npm i -g vercel
cd /home/denver/dev/projects/washmates-landing
vercel --prod

# Future updates
git add .
git commit -m "Update: description of changes"
git push
vercel --prod
```

## Troubleshooting

### Build Fails
- Check `npm run build` locally first
- Verify all dependencies are in package.json
- Check Vercel build logs for specific errors

### Domain Not Working
- DNS can take up to 48 hours to propagate
- Use https://dnschecker.org to verify DNS records
- Ensure SSL certificate is provisioned in Vercel (automatic)

### Images Not Loading
- Verify images are in `/public/images/`
- Check file names are case-sensitive
- Ensure Next.js Image component has proper width/height

## Production Checklist

✅ Remove console.log statements
✅ Test all links and buttons
✅ Verify logos display correctly
✅ Test form submission (even if just logging)
✅ Check mobile responsiveness
✅ Verify no emojis appear anywhere
✅ Test page load speed
✅ Verify SEO meta tags

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Domain issues: Check with your registrar's support

---

🎉 Congratulations! Your WashMates landing page is live!