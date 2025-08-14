-- WashMates Unified User Database Schema
-- This schema integrates waitlist signups with the main app user system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main users table (for both waitlist and app users)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_type VARCHAR(20) CHECK (user_type IN ('customer', 'washmate')),
  
  -- Waitlist fields
  joined_waitlist_at TIMESTAMP WITH TIME ZONE,
  waitlist_position INTEGER,
  waitlist_status VARCHAR(20) DEFAULT 'pending' CHECK (waitlist_status IN ('pending', 'invited', 'activated', 'declined')),
  
  -- App user fields (populated when they sign up)
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  password_hash TEXT,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  activated_at TIMESTAMP WITH TIME ZONE, -- When they create full account
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  -- Marketing & Analytics
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  referrer VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  
  -- Preferences
  marketing_consent BOOLEAN DEFAULT true,
  sms_consent BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  
  -- Location (for matching customers with washmates)
  postal_code VARCHAR(10),
  city VARCHAR(100),
  province VARCHAR(50) DEFAULT 'Ontario',
  country VARCHAR(50) DEFAULT 'Canada',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(LOWER(email));
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_waitlist_status ON users(waitlist_status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_postal_code ON users(postal_code);
CREATE INDEX idx_users_waitlist_position ON users(waitlist_position) WHERE waitlist_position IS NOT NULL;

-- Invitation tracking table
CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invitation_code VARCHAR(50) UNIQUE DEFAULT UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW() + INTERVAL '30 days'),
  email_sent BOOLEAN DEFAULT false,
  sms_sent BOOLEAN DEFAULT false,
  metadata JSONB
);

CREATE INDEX idx_invitations_code ON invitations(invitation_code);
CREATE INDEX idx_invitations_user_id ON invitations(user_id);

-- Waitlist analytics view
CREATE VIEW waitlist_analytics AS
SELECT 
  DATE(created_at) as signup_date,
  user_type,
  COUNT(*) as total_signups,
  COUNT(DISTINCT postal_code) as unique_postal_codes,
  COUNT(CASE WHEN waitlist_status = 'activated' THEN 1 END) as converted_users,
  COUNT(CASE WHEN utm_source IS NOT NULL THEN 1 END) as tracked_signups
FROM users
WHERE joined_waitlist_at IS NOT NULL
GROUP BY DATE(created_at), user_type;

-- User conversion funnel view
CREATE VIEW conversion_funnel AS
SELECT 
  user_type,
  COUNT(*) FILTER (WHERE joined_waitlist_at IS NOT NULL) as waitlist_signups,
  COUNT(*) FILTER (WHERE waitlist_status = 'invited') as invited,
  COUNT(*) FILTER (WHERE email_verified = true) as email_verified,
  COUNT(*) FILTER (WHERE activated_at IS NOT NULL) as fully_activated,
  ROUND(100.0 * COUNT(*) FILTER (WHERE activated_at IS NOT NULL) / 
    NULLIF(COUNT(*) FILTER (WHERE joined_waitlist_at IS NOT NULL), 0), 2) as conversion_rate
FROM users
GROUP BY user_type;

-- Function to add user to waitlist (creates or updates)
CREATE OR REPLACE FUNCTION add_to_waitlist(
  p_email VARCHAR,
  p_user_type VARCHAR,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_referrer VARCHAR DEFAULT NULL,
  p_utm_source VARCHAR DEFAULT NULL,
  p_utm_medium VARCHAR DEFAULT NULL,
  p_utm_campaign VARCHAR DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_is_new BOOLEAN;
  v_position INTEGER;
BEGIN
  -- Normalize email
  p_email := LOWER(TRIM(p_email));
  
  -- Check if user exists
  SELECT id INTO v_user_id FROM users WHERE LOWER(email) = p_email;
  
  IF v_user_id IS NULL THEN
    -- New user - calculate waitlist position
    SELECT COALESCE(MAX(waitlist_position), 0) + 1 INTO v_position
    FROM users WHERE user_type = p_user_type;
    
    -- Insert new user
    INSERT INTO users (
      email, user_type, joined_waitlist_at, waitlist_position,
      ip_address, user_agent, referrer,
      utm_source, utm_medium, utm_campaign
    ) VALUES (
      p_email, p_user_type, NOW(), v_position,
      p_ip_address, p_user_agent, p_referrer,
      p_utm_source, p_utm_medium, p_utm_campaign
    ) RETURNING id INTO v_user_id;
    
    v_is_new := true;
  ELSE
    -- Existing user - update their info
    UPDATE users SET
      user_type = COALESCE(p_user_type, user_type),
      joined_waitlist_at = COALESCE(joined_waitlist_at, NOW()),
      updated_at = NOW(),
      ip_address = COALESCE(p_ip_address, ip_address),
      user_agent = COALESCE(p_user_agent, user_agent),
      referrer = COALESCE(p_referrer, referrer),
      utm_source = COALESCE(p_utm_source, utm_source),
      utm_medium = COALESCE(p_utm_medium, utm_medium),
      utm_campaign = COALESCE(p_utm_campaign, utm_campaign)
    WHERE id = v_user_id
    RETURNING waitlist_position INTO v_position;
    
    v_is_new := false;
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'user_id', v_user_id,
    'is_new', v_is_new,
    'waitlist_position', v_position,
    'message', CASE 
      WHEN v_is_new THEN 'Welcome to the waitlist!'
      ELSE 'Welcome back! We already have you on the list.'
    END
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to invite users from waitlist
CREATE OR REPLACE FUNCTION invite_waitlist_users(
  p_limit INTEGER DEFAULT 10,
  p_user_type VARCHAR DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_invited_count INTEGER := 0;
  v_user RECORD;
  v_invitation_code VARCHAR;
BEGIN
  FOR v_user IN 
    SELECT id, email FROM users 
    WHERE waitlist_status = 'pending'
    AND (p_user_type IS NULL OR user_type = p_user_type)
    ORDER BY waitlist_position
    LIMIT p_limit
  LOOP
    -- Update user status
    UPDATE users SET 
      waitlist_status = 'invited',
      updated_at = NOW()
    WHERE id = v_user.id;
    
    -- Create invitation
    INSERT INTO invitations (user_id)
    VALUES (v_user.id);
    
    v_invited_count := v_invited_count + 1;
  END LOOP;
  
  RETURN json_build_object(
    'success', true,
    'invited_count', v_invited_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user by invitation code (for app signup)
CREATE OR REPLACE FUNCTION get_user_by_invitation(p_code VARCHAR)
RETURNS JSON AS $$
DECLARE
  v_user RECORD;
BEGIN
  SELECT 
    u.id,
    u.email,
    u.user_type,
    u.waitlist_position,
    i.id as invitation_id
  INTO v_user
  FROM invitations i
  JOIN users u ON u.id = i.user_id
  WHERE i.invitation_code = UPPER(p_code)
  AND i.expires_at > NOW()
  AND u.activated_at IS NULL;
  
  IF v_user.id IS NOT NULL THEN
    -- Mark invitation as clicked
    UPDATE invitations 
    SET clicked_at = COALESCE(clicked_at, NOW())
    WHERE id = v_user.invitation_id;
    
    RETURN json_build_object(
      'success', true,
      'user', json_build_object(
        'id', v_user.id,
        'email', v_user.email,
        'user_type', v_user.user_type,
        'waitlist_position', v_user.waitlist_position
      )
    );
  ELSE
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid or expired invitation code'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to join waitlist
CREATE POLICY "Allow anonymous waitlist signup" ON users
  FOR INSERT
  WITH CHECK (joined_waitlist_at IS NOT NULL);

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (auth.uid()::TEXT = id::TEXT OR auth.jwt() ->> 'email' = email);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid()::TEXT = id::TEXT OR auth.jwt() ->> 'email' = email);

-- Sample data for testing (remove in production)
-- INSERT INTO users (email, user_type, joined_waitlist_at, waitlist_position, postal_code)
-- VALUES 
--   ('customer1@test.com', 'customer', NOW(), 1, 'M5V 3A8'),
--   ('washmate1@test.com', 'washmate', NOW(), 1, 'M5V 3A8');