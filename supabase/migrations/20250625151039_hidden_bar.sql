/*
  # Add Subscription Tracking

  1. New Tables
    - `user_subscriptions` - Track user subscription status
    - `subscription_events` - Log subscription events from RevenueCat

  2. Security
    - Enable RLS on new tables
    - Add policies for user access
*/

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  revenuecat_user_id text NOT NULL,
  product_id text NOT NULL,
  entitlement text NOT NULL DEFAULT 'premium',
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Subscription events table (for webhook logging)
CREATE TABLE IF NOT EXISTS subscription_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  revenuecat_user_id text NOT NULL,
  event_type text NOT NULL,
  product_id text,
  entitlements jsonb DEFAULT '{}',
  raw_data jsonb NOT NULL,
  processed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- Policies for user_subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage subscriptions"
  ON user_subscriptions FOR ALL
  TO service_role;

-- Policies for subscription_events (admin only)
CREATE POLICY "Service role can manage events"
  ON subscription_events FOR ALL
  TO service_role;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_revenuecat_user_id ON user_subscriptions(revenuecat_user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_event_type ON subscription_events(event_type);

-- Function to check if user has premium access
CREATE OR REPLACE FUNCTION has_premium_access(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_subscriptions 
    WHERE user_id = user_uuid 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update trigger for user_subscriptions
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();