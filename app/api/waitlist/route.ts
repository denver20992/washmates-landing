import { NextRequest, NextResponse } from 'next/server'
import { addToWaitlist } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, userType } = body

    // Validate input
    if (!email || !userType) {
      return NextResponse.json(
        { error: 'Email and user type are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate user type
    if (!['customer', 'washmate'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      )
    }

    // Get metadata from request
    const metadata = {
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      user_agent: request.headers.get('user-agent') || undefined,
      referrer: request.headers.get('referer') || undefined,
      utm_source: new URL(request.url).searchParams.get('utm_source') || undefined,
      utm_medium: new URL(request.url).searchParams.get('utm_medium') || undefined,
      utm_campaign: new URL(request.url).searchParams.get('utm_campaign') || undefined,
    }

    // Add to waitlist (handles both new and existing users)
    const result = await addToWaitlist(email, userType, metadata)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to add to waitlist' },
        { status: 500 }
      )
    }

    // Parse the response from stored procedure
    const data = result.data as any
    const isNew = data?.is_new || false
    const waitlistPosition = data?.waitlist_position || null

    return NextResponse.json({
      success: true,
      message: isNew 
        ? `Welcome to the waitlist! You're #${waitlistPosition} in line.`
        : 'Welcome back! We already have you on the list.',
      isNew,
      waitlistPosition,
      userId: data?.user_id
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for checking if email exists (optional)
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const { checkEmailExists } = await import('@/lib/supabase')
    const result = await checkEmailExists(email)

    return NextResponse.json({
      exists: result.exists,
      error: result.error
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}