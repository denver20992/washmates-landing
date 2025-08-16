# 🚨 URGENT SECURITY FIX REQUIRED

## Critical Issue
Your Supabase service role key was exposed in GitHub repository. GitGuardian detected this leak.

## Immediate Actions Required

### 1. ⚠️ ROTATE YOUR SUPABASE KEYS NOW
1. Go to: https://app.supabase.com/project/nbgyqumfkartcpewfuwn/settings/api
2. Click "Generate new JWT secret" 
3. Copy the new keys
4. Update .env.local with new keys

### 2. Remove Sensitive Files from Git History
Run these commands to remove the exposed files:
```bash
# Remove files with hardcoded keys
git rm run-schema.mjs setup-waitlist.mjs test-supabase.mjs
git commit -m "Remove files with exposed credentials"

# Force remove from history (WARNING: This rewrites history)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch run-schema.mjs setup-waitlist.mjs test-supabase.mjs" \
  --prune-empty --tag-name-filter cat -- --all

# Force push to GitHub
git push origin --force --all
git push origin --force --tags
```

### 3. Use the New Secure Scripts
I've created secure versions that use environment variables:
- `run-schema-secure.mjs`
- `setup-waitlist-secure.mjs`
- `test-supabase-secure.mjs`

### 4. Environment Variables Setup
Never commit .env.local! Always use environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://nbgyqumfkartcpewfuwn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key
```

## Files Affected
- ❌ run-schema.mjs (EXPOSED SERVICE ROLE KEY)
- ⚠️ setup-waitlist.mjs (contains anon key)
- ⚠️ test-supabase.mjs (contains anon key)

## Security Audit Results
1. **Service Role Key Exposed**: run-schema.mjs line 6
2. **Anon Key Hardcoded**: Multiple files (less critical but should use env vars)
3. **.env.local**: Properly in .gitignore ✅

## Prevention
1. NEVER hardcode API keys in code
2. ALWAYS use environment variables
3. Add pre-commit hooks to detect secrets
4. Use `.env.example` for documentation

## Next Steps
1. ⚠️ **ROTATE KEYS IMMEDIATELY**
2. Remove exposed files from git history
3. Use secure scripts going forward
4. Consider using GitHub Secret Scanning
5. Enable Supabase RLS policies as additional protection

## Important Note
The service role key has FULL DATABASE ACCESS. Anyone with this key can:
- Read/write/delete all data
- Bypass Row Level Security
- Access all user data
- Modify database schema

**ACT NOW - Your database is currently vulnerable!**