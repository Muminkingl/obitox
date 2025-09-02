-- Schema for OTP verification system

-- Create user_otps table to store one-time passwords
CREATE TABLE public.user_otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Add an index on email for fast lookups
  CONSTRAINT user_otps_email_idx UNIQUE(email)
);

-- Set up Row Level Security
ALTER TABLE public.user_otps ENABLE ROW LEVEL SECURITY;

-- Create policy for insert (only service role can insert)
CREATE POLICY "Service role can insert OTPs" ON public.user_otps
  FOR INSERT 
  TO authenticated
  USING (true);

-- Create policy for select (users can only view their own OTPs)
CREATE POLICY "Users can view their own OTPs" ON public.user_otps
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = user_otps.email
  ));

-- Create policy for delete (users can only delete their own OTPs)
CREATE POLICY "Users can delete their own OTPs" ON public.user_otps
  FOR DELETE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = user_otps.email
  ));

-- Create or replace function to automatically add profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      ''
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add any additional profile fields here
  CONSTRAINT username_length CHECK (char_length(first_name) >= 1)
);

-- Set up Row Level Security on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
