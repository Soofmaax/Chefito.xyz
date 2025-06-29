/*
  # User Subscription Management

  1. New Tables
    - `user_subscriptions` - Track user subscription status from RevenueCat
    - `subscription_plans` - Available subscription plans
    - `subscription_events` - Log subscription events from RevenueCat webhooks

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access patterns
*/

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  revenuecat_customer_id text NOT NULL,
  plan_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'expired', 'trial')),
  is_active boolean DEFAULT true,
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  canceled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, plan_id)
);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  interval text NOT NULL CHECK (interval IN ('monthly', 'yearly', 'lifetime')),
  features jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscription events table (for webhook logging)
CREATE TABLE IF NOT EXISTS subscription_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  revenuecat_customer_id text NOT NULL,
  event_type text NOT NULL,
  plan_id text,
  raw_data jsonb NOT NULL,
  processed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Add subscription_status to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_status text DEFAULT 'free';
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- Policies for user_subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for subscription_plans
CREATE POLICY "Anyone can read active subscription plans"
  ON subscription_plans FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Policies for subscription_events (admin only)
CREATE POLICY "Service role can manage events"
  ON subscription_events FOR ALL
  TO service_role;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_revenuecat_customer_id ON user_subscriptions(revenuecat_customer_id);
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
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, description, price, currency, interval, features)
VALUES 
  ('free', 'Free Plan', 'Basic access with limited features', 0, 'EUR', 'monthly', 
   '[{"name": "2 recipes with voice guidance", "included": true}, 
     {"name": "Step-by-step instructions", "included": true},
     {"name": "Community support", "included": true}]'),
  ('premium_monthly', 'Premium Monthly', 'Full access to all features', 19.99, 'EUR', 'monthly', 
   '[{"name": "Unlimited recipes", "included": true}, 
     {"name": "Voice guidance", "included": true},
     {"name": "AI cooking assistant", "included": true},
     {"name": "Priority support", "included": true}]'),
  ('premium_yearly', 'Premium Yearly', 'Full access with annual discount', 199.99, 'EUR', 'yearly', 
   '[{"name": "Unlimited recipes", "included": true}, 
     {"name": "Voice guidance", "included": true},
     {"name": "AI cooking assistant", "included": true},
     {"name": "Priority support", "included": true},
     {"name": "2 months free", "included": true}]')
ON CONFLICT (id) DO NOTHING;