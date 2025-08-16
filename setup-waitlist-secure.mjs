import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  console.error('Please ensure .env.local contains:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🚀 Setting up WashMates waitlist...\n')

// Step 1: Check if waitlist table exists
console.log('1️⃣ Checking for waitlist table...')
const { error: checkError } = await supabase
  .from('waitlist')
  .select('count')
  .limit(0)

if (checkError) {
  console.log('   Waitlist table does not exist yet')
  console.log('   Please create it using the Supabase dashboard:\n')
  
  console.log('   Go to: https://app.supabase.com/project/nbgyqumfkartcpewfuwn/sql')
  console.log('   Run this SQL:\n')
  
  console.log(`
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_type VARCHAR(20) CHECK (user_type IN ('customer', 'washmate')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  position INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  referrer VARCHAR(255)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_user_type ON waitlist(user_type);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (join waitlist)
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Only authenticated users can view
CREATE POLICY "Only authenticated can view waitlist" ON waitlist
  FOR SELECT TO authenticated
  USING (true);
  `)
  
  process.exit(1)
}

console.log('   ✅ Waitlist table exists!\n')

// Step 2: Test adding an entry
console.log('2️⃣ Testing waitlist functionality...')
const testEmail = `test-${Date.now()}@example.com`

const { data: newEntry, error: insertError } = await supabase
  .from('waitlist')
  .insert({
    email: testEmail,
    user_type: 'customer',
    metadata: { test: true }
  })
  .select()
  .single()

if (insertError) {
  console.log('   ❌ Failed to add test entry:', insertError.message)
  process.exit(1)
}

console.log('   ✅ Successfully added test entry\n')

// Step 3: Get stats
console.log('3️⃣ Checking waitlist stats...')
const { data: stats, error: statsError } = await supabase
  .from('waitlist')
  .select('user_type')

if (statsError) {
  console.log('   ❌ Failed to get stats:', statsError.message)
} else {
  const customers = stats.filter(s => s.user_type === 'customer').length
  const washmates = stats.filter(s => s.user_type === 'washmate').length
  
  console.log(`   📊 Total entries: ${stats.length}`)
  console.log(`   👤 Customers: ${customers}`)
  console.log(`   🧺 WashMates: ${washmates}`)
}

// Step 4: Clean up test entry
console.log('\n4️⃣ Cleaning up test entry...')
const { error: deleteError } = await supabase
  .from('waitlist')
  .delete()
  .eq('email', testEmail)

if (deleteError) {
  console.log('   ⚠️  Could not delete test entry:', deleteError.message)
} else {
  console.log('   ✅ Test entry removed')
}

console.log('\n✨ Waitlist setup complete!')
console.log('Your app can now accept waitlist signups.')
console.log('\nNext steps:')
console.log('1. Deploy your app with `vercel --prod`')
console.log('2. Test the waitlist form on your site')
console.log('3. Monitor signups in Supabase dashboard')