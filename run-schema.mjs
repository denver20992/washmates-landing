import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://nbgyqumfkartcpewfuwn.supabase.co'
// Use service role key for admin operations
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZ3lxdW1ma2FydGNwZXdmdXduIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODcyMDg5NywiZXhwIjoyMDY0Mjk2ODk3fQ.E0Eo_qeepzRB9cGj67xAbQ-6v-516GXkakS7pm4hxYM'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔨 Running unified user schema...\n')

// Read the SQL schema
const schema = fs.readFileSync('./supabase/unified-user-schema.sql', 'utf8')

// Split by statements and filter out empty ones
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

console.log(`Found ${statements.length} SQL statements to execute\n`)

let successCount = 0
let errorCount = 0

for (let i = 0; i < statements.length; i++) {
  const statement = statements[i] + ';'
  
  // Skip pure comments
  if (statement.trim().startsWith('--')) continue
  
  // Get statement type for logging
  const type = statement.match(/^(CREATE|ALTER|INSERT|DROP)/i)?.[1] || 'SQL'
  
  try {
    const { error } = await supabase.rpc('execute_sql', {
      query: statement
    }).catch(async (rpcError) => {
      // If RPC doesn't exist, try raw query (requires admin key)
      console.log('Note: execute_sql RPC not found, statement may need manual execution')
      
      // For testing, we'll check what exists
      if (statement.includes('CREATE TABLE IF NOT EXISTS users')) {
        const { error } = await supabase.from('users').select('count').limit(0)
        if (!error) {
          console.log('✅ Users table already exists')
          return { error: null }
        }
      }
      
      return { error: rpcError }
    })
    
    if (error) {
      console.log(`❌ ${type} statement ${i+1}: ${error.message}`)
      errorCount++
    } else {
      console.log(`✅ ${type} statement ${i+1} executed successfully`)
      successCount++
    }
  } catch (err) {
    console.log(`⚠️ ${type} statement ${i+1}: May require manual execution`)
    errorCount++
  }
}

console.log('\n📊 Summary:')
console.log(`✅ Successful: ${successCount}`)
console.log(`❌ Failed: ${errorCount}`)

if (errorCount > 0) {
  console.log('\n⚠️ Some statements failed. This might be because:')
  console.log('1. Tables/functions already exist (which is fine)')
  console.log('2. You need to run the SQL directly in Supabase dashboard')
  console.log('\nTo run manually:')
  console.log('1. Go to: https://app.supabase.com/project/nbgyqumfkartcpewfuwn/sql/new')
  console.log('2. Copy the contents of ./supabase/unified-user-schema.sql')
  console.log('3. Paste and click "Run"')
}

console.log('\n✨ Testing the schema...')

// Test if we can use the add_to_waitlist function
const testEmail = `test-${Date.now()}@washmates.ca`
const { data, error } = await supabase.rpc('add_to_waitlist', {
  p_email: testEmail,
  p_user_type: 'customer',
  p_utm_source: 'test'
})

if (error) {
  console.log('❌ add_to_waitlist function not available')
  console.log('   Please run the schema manually in Supabase dashboard')
} else {
  console.log('✅ add_to_waitlist function works!')
  console.log('   Result:', JSON.stringify(data, null, 2))
}