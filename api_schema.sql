-- Schema for API keys and subscription plans

-- Add subscription_plan enum type
CREATE TYPE public.subscription_plan AS ENUM ('basic', 'pro');

-- Add subscription fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_plan subscription_plan NOT NULL DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days');

-- Create API keys table
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_value TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT api_keys_name_user_id_key UNIQUE (name, user_id)
);

-- Set up Row Level Security on API keys
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only view their own API keys
CREATE POLICY "Users can view their own API keys" ON public.api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy so users can insert their own API keys (with additional checks in API layer)
CREATE POLICY "Users can create their own API keys" ON public.api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy so users can delete their own API keys
CREATE POLICY "Users can delete their own API keys" ON public.api_keys
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to count a user's API keys
CREATE OR REPLACE FUNCTION public.count_user_api_keys(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM public.api_keys 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user can create more API keys (based on plan limits)
CREATE OR REPLACE FUNCTION public.can_create_api_key(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  key_count INTEGER;
  user_plan subscription_plan;
  key_limit INTEGER;
BEGIN
  -- Get user's subscription plan
  SELECT subscription_plan INTO user_plan
  FROM public.profiles
  WHERE id = user_uuid;
  
  -- Set key limit based on plan
  IF user_plan = 'basic' THEN
    key_limit := 2;
  ELSIF user_plan = 'pro' THEN
    key_limit := 100; -- Large number for "unlimited"
  ELSE
    key_limit := 0;
  END IF;
  
  -- Count existing keys
  SELECT COUNT(*) INTO key_count
  FROM public.api_keys
  WHERE user_id = user_uuid;
  
  -- Return true if under limit
  RETURN key_count < key_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
