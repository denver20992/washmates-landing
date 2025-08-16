import { NextRequest, NextResponse } from 'next/server'
import { addToWaitlistSimple } from '@/lib/supabase-simple'

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
      referrer: request.headers.get('referer') || undefined,
      utm_source: new URL(request.url).searchParams.get('utm_source') || undefined,
      utm_medium: new URL(request.url).searchParams.get('utm_medium') || undefined,
      utm_campaign: new URL(request.url).searchParams.get('utm_campaign') || undefined,
    }

    // Add to waitlist (handles both new and existing users)
    const result = await addToWaitlistSimple(email, userType, metadata)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to add to waitlist' },
        { status: 500 }
      )
    }

    // Parse the response from simple function
    const isNew = result.isNew || false
    const message = result.message || 'Successfully added to waitlist!'

    return NextResponse.json({
      success: true,
      message,
      isNew
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

    const { checkEmailExists } = await import('@/lib/supabase-simple')
    const exists = await checkEmailExists(email)

    return NextResponse.json({
      exists
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}