import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  console.error('Please ensure .env.local contains:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔨 Running unified user schema...\n')

// Read the SQL schema
const schema = fs.readFileSync('./supabase/unified-user-schema.sql', 'utf8')

// Split by statements and filter out empty ones
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

// Execute each statement
let successCount = 0
let errorCount = 0

for (const statement of statements) {
  // Skip if just whitespace
  if (!statement.trim()) continue
  
  // Get first few words for logging
  const preview = statement.substring(0, 50).replace(/\n/g, ' ')
  
  try {
    // Use raw SQL execution
    const { error } = await supabase.rpc('execute_sql', {
      query: statement + ';'
    }).catch(err => ({ error: err }))
    
    if (error) {
      console.log(`❌ Failed: ${preview}...`)
      console.log(`   Error: ${error.message}`)
      errorCount++
    } else {
      console.log(`✅ Success: ${preview}...`)
      successCount++
    }
  } catch (err) {
    console.log(`❌ Failed: ${preview}...`)
    console.log(`   Error: ${err.message}`)
    errorCount++
  }
}

console.log('\n📊 Summary:')
console.log(`   ✅ Successful: ${successCount}`)
console.log(`   ❌ Failed: ${errorCount}`)

if (errorCount > 0) {
  console.log('\n⚠️  Some statements failed.')
  console.log('This might be because:')
  console.log('1. Tables already exist (that\'s OK!)')
  console.log('2. You need to run the SQL directly in Supabase dashboard')
  console.log('3. RPC function execute_sql is not available')
  console.log('\nTry running the SQL directly at:')
  console.log('https://app.supabase.com/project/nbgyqumfkartcpewfuwn/sql')
}

console.log('\n✨ Done!')