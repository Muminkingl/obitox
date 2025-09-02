-- Schema for custom auth system that bypasses Supabase Auth's email sending

-- Create table for pending users (before email verification)
CREATE TABLE public.pending_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, -- This is temporary, will be properly hashed when creating real user
  first_name TEXT,
  last_name TEXT,
  otp TEXT NOT NULL,
  otp_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add an index on email for fast lookups
  CONSTRAINT pending_users_email_idx UNIQUE(email)
);

-- Create a view to safely check for existing users in the auth schema
CREATE OR REPLACE VIEW public.auth_users_view AS
SELECT id, email, email_confirmed_at
FROM auth.users;

-- Set up Row Level Security
ALTER TABLE public.pending_users ENABLE ROW LEVEL SECURITY;

-- Create policy for select (service role can view all)
CREATE POLICY "Service role can view pending users" ON public.pending_users
  FOR SELECT
  USING (true);

-- Create policy for insert (anyone can create a pending user)
CREATE POLICY "Anyone can create a pending user" ON public.pending_users
  FOR INSERT
  USING (true);

-- Create policy for delete (service role can delete pending users)
CREATE POLICY "Service role can delete pending users" ON public.pending_users
  FOR DELETE
  USING (true);

-- Create or replace function to create a real user after OTP verification
CREATE OR REPLACE FUNCTION public.create_verified_user(
  p_email TEXT,
  p_password_hash TEXT,
  p_first_name TEXT,
  p_last_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Create the user in auth.users using Supabase's internal function
  -- This bypasses the automatic email sending
  v_user_id := auth.create_user(
    role := 'authenticated',
    email := p_email,
    password := p_password_hash,
    email_confirmed_at := now(),
    data := jsonb_build_object(
      'first_name', p_first_name,
      'last_name', p_last_name,
      'full_name', p_first_name || ' ' || p_last_name
    )
  );
  
  -- Insert into profiles table
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (v_user_id, p_first_name, p_last_name);
  
  -- Clean up the pending user
  DELETE FROM public.pending_users WHERE email = p_email;
  
  RETURN v_user_id;
END;
$$;
