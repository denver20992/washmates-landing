import { createClient } from '@supabase/supabase-js'

// These will be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for unified user system
export interface User {
  id?: string
  email: string
  user_type: 'customer' | 'washmate'
  joined_waitlist_at?: string
  waitlist_position?: number
  waitlist_status?: 'pending' | 'invited' | 'activated' | 'declined'
  first_name?: string
  last_name?: string
  phone?: string
  postal_code?: string
  city?: string
  created_at?: string
  activated_at?: string
  marketing_consent?: boolean
  sms_consent?: boolean
}

// Helper function to add to waitlist (creates or updates user)
export async function addToWaitlist(
  email: string, 
  userType: 'customer' | 'washmate',
  metadata?: {
    ip_address?: string
    user_agent?: string
    referrer?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
  }
) {
  try {
    // Call the stored procedure that handles both new and existing users
    const { data, error } = await supabase
      .rpc('add_to_waitlist', {
        p_email: email,
        p_user_type: userType,
        p_ip_address: metadata?.ip_address || null,
        p_user_agent: metadata?.user_agent || null,
        p_referrer: metadata?.referrer || null,
        p_utm_source: metadata?.utm_source || null,
        p_utm_medium: metadata?.utm_medium || null,
        p_utm_campaign: metadata?.utm_campaign || null
      })

    if (error) throw error
    
    return { success: true, data, error: null }
  } catch (error) {
    console.error('Error adding to waitlist:', error)
    return { 
      success: false, 
      data: null, 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }
  }
}

// Function to get user by invitation code (for app signup)
export async function getUserByInvitation(invitationCode: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_user_by_invitation', {
        p_code: invitationCode
      })

    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error getting user by invitation:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }
  }
}

// Function to activate user account (when they complete signup in app)
export async function activateUser(
  userId: string,
  userData: {
    first_name: string
    last_name: string
    phone?: string
    postal_code?: string
    password_hash?: string
  }
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...userData,
        activated_at: new Date().toISOString(),
        waitlist_status: 'activated',
        email_verified: true
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    
    return { success: true, data, error: null }
  } catch (error) {
    console.error('Error activating user:', error)
    return { 
      success: false, 
      data: null, 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }
  }
}

// Function to get waitlist stats (for admin dashboard)
export async function getWaitlistStats() {
  try {
    const { data, error } = await supabase
      .from('waitlist_analytics')  // Changed to match unified schema view name
      .select('*')

    if (error) throw error
    
    return { success: true, data, error: null }
  } catch (error) {
    console.error('Error fetching waitlist stats:', error)
    return { 
      success: false, 
      data: null, 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }
  }
}

// Function to check if email already exists
export async function checkEmailExists(email: string) {
  try {
    const { data, error } = await supabase
      .from('users')  // Changed from 'waitlist' to 'users' for unified system
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
    
    return { exists: !!data, error: null }
  } catch (error) {
    console.error('Error checking email:', error)
    return { 
      exists: false, 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }
  }
}