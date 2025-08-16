import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nbgyqumfkartcpewfuwn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZ3lxdW1ma2FydGNwZXdmdXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MjA4OTcsImV4cCI6MjA2NDI5Njg5N30.XmD-wmzxsG6h2ntW-sSljd3P92pNi6fusV2ntVPtR_M'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 Testing Supabase connection...\n')

// Check what tables exist
try {
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
  
  if (error) {
    // This is normal - we'll check tables differently
    console.log('Checking tables using a different method...')
    
    // Try to query the users table
    const { error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(0)
    
    if (!usersError) {
      console.log('✅ "users" table exists!')
    } else {
      console.log('❌ "users" table does not exist')
      console.log('   Run the schema from /supabase/unified-user-schema.sql')
    }
    
    // Try to query the waitlist table
    const { error: waitlistError } = await supabase
      .from('waitlist')
      .select('count')
      .limit(0)
    
    if (!waitlistError) {
      console.log('✅ "waitlist" table exists (old schema)')
    }
    
    // Try to query invitations table
    const { error: invError } = await supabase
      .from('invitations')
      .select('count')
      .limit(0)
    
    if (!invError) {
      console.log('✅ "invitations" table exists!')
    }
  }
  
  // Test adding to waitlist
  console.log('\n📝 Testing waitlist signup...')
  const testEmail = `test-${Date.now()}@washmates.ca`
  
  const { data: signupData, error: signupError } = await supabase
    .rpc('add_to_waitlist', {
      p_email: testEmail,
      p_user_type: 'customer',
      p_ip_address: null,
      p_user_agent: 'Test Script',
      p_referrer: null,
      p_utm_source: 'test',
      p_utm_medium: null,
      p_utm_campaign: null
    })
  
  if (signupError) {
    console.log('❌ add_to_waitlist function not found')
    console.log('   The unified schema needs to be run first')
    console.log('   Error:', signupError.message)
  } else {
    console.log('✅ Successfully added test signup!')
    console.log('   Response:', JSON.stringify(signupData, null, 2))
    
    // Check if user was created
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single()
    
    if (user) {
      console.log('\n✅ User created successfully:')
      console.log(`   Email: ${user.email}`)
      console.log(`   Type: ${user.user_type}`)
      console.log(`   Position: #${user.waitlist_position}`)
      console.log(`   Status: ${user.waitlist_status}`)
    }
  }
  
  // Check existing users
  console.log('\n📊 Checking existing waitlist users...')
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('email, user_type, waitlist_position, created_at')
    .not('joined_waitlist_at', 'is', null)
    .order('waitlist_position')
    .limit(5)
  
  if (users && users.length > 0) {
    console.log(`✅ Found ${users.length} waitlist users:`)
    users.forEach(u => {
      console.log(`   #${u.waitlist_position} - ${u.email} (${u.user_type})`)
    })
  } else if (!usersError) {
    console.log('📭 No waitlist users found yet')
  }
  
} catch (err) {
  console.error('Error:', err)
}

console.log('\n✨ Test complete!')
console.log('Next step: Visit http://localhost:3000 to test the signup form')