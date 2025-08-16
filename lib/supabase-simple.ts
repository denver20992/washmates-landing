// Simple Supabase client for waitlist without custom functions
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Simple waitlist table operations
export async function addToWaitlistSimple(
  email: string,
  userType: 'customer' | 'washmate',
  metadata?: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    referrer?: string
  }
) {
  try {
    // First, check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('waitlist')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      // User already on waitlist
      return {
        success: true,
        isNew: false,
        message: 'You\'re already on the waitlist! We\'ll notify you soon.'
      }
    }

    // Add new user to waitlist
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        email: email.toLowerCase(),
        user_type: userType,
        utm_source: metadata?.utm_source,
        utm_medium: metadata?.utm_medium,
        utm_campaign: metadata?.utm_campaign,
        referrer: metadata?.referrer,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Waitlist signup error:', error)
      
      // If table doesn't exist, create it
      if (error.code === '42P01') {
        await createWaitlistTable()
        // Retry the insert
        return addToWaitlistSimple(email, userType, metadata)
      }
      
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      isNew: true,
      message: 'Welcome to the WashMates waitlist! We\'ll be in touch soon.',
      data
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

// Create simple waitlist table if it doesn't exist
async function createWaitlistTable() {
  try {
    const { error } = await supabase.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS waitlist (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          user_type VARCHAR(20) CHECK (user_type IN ('customer', 'washmate')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          utm_source VARCHAR(100),
          utm_medium VARCHAR(100),
          utm_campaign VARCHAR(100),
          referrer VARCHAR(255)
        );
      `
    })
    
    return !error
  } catch (err) {
    // If RPC doesn't work, we'll need manual creation
    console.log('Please create the waitlist table manually in Supabase')
    return false
  }
}

// Get waitlist stats
export async function getWaitlistStats() {
  const { data: customers } = await supabase
    .from('waitlist')
    .select('id')
    .eq('user_type', 'customer')

  const { data: washmates } = await supabase
    .from('waitlist')
    .select('id')
    .eq('user_type', 'washmate')

  return {
    totalCustomers: customers?.length || 0,
    totalWashmates: washmates?.length || 0,
    total: (customers?.length || 0) + (washmates?.length || 0)
  }
}

// Check if email exists
export async function checkEmailExists(email: string) {
  const { data, error } = await supabase
    .from('waitlist')
    .select('email')
    .eq('email', email.toLowerCase())
    .single()

  return !!data && !error
}