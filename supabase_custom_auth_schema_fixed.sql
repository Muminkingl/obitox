-- Create table for pending users (before email verification)
CREATE TABLE IF NOT EXISTS public.pending_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,            -- temporary hash; replace after verification
  first_name TEXT,
  last_name TEXT,
  otp TEXT NOT NULL,
  otp_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT pending_users_email_idx UNIQUE(email)   -- unique index on email
);

-- View to safely check existing auth users
CREATE OR REPLACE VIEW public.auth_users_view AS
SELECT id, email, email_confirmed_at
FROM auth.users;

-- Enable Row Level Security
ALTER TABLE public.pending_users ENABLE ROW LEVEL SECURITY;

-- SELECT policy (service role can view all)
CREATE POLICY "Service role can view pending users"
  ON public.pending_users
  FOR SELECT
  USING (true);

-- INSERT policy (anyone can create a pending user)
CREATE POLICY "Anyone can create a pending user"
  ON public.pending_users
  FOR INSERT
  WITH CHECK (true);   -- correct clause for INSERT

-- DELETE policy (service role can delete pending users)
CREATE POLICY "Service role can delete pending users"
  ON public.pending_users
  FOR DELETE
  USING (true);

-- Function to turn a verified pending user into a real Supabase user
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
  -- Create the user in auth.users without sending the email
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

  -- Populate an associated profile (if you have a profiles table)
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (v_user_id, p_first_name, p_last_name);

  -- Remove the row from pending_users now that verification succeeded
  DELETE FROM public.pending_users WHERE email = p_email;

  RETURN v_user_id;
END;
$$;
