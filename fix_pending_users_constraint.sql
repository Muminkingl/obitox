-- Fix for pending_users check constraint issue
-- This script removes the problematic check constraint and provides a better solution

-- First, check if the constraint exists and drop it
DO $$
BEGIN
    -- Drop the check constraint if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.check_constraints 
        WHERE constraint_name = 'check_email_not_in_auth_users'
        AND table_name = 'pending_users'
    ) THEN
        ALTER TABLE public.pending_users 
        DROP CONSTRAINT check_email_not_in_auth_users;
        
        RAISE NOTICE 'Dropped check constraint: check_email_not_in_auth_users';
    ELSE
        RAISE NOTICE 'Check constraint check_email_not_in_auth_users does not exist';
    END IF;
END $$;

-- Alternative approach: Create a function to check for existing users
-- This is more flexible and can be called from the application
CREATE OR REPLACE FUNCTION public.email_exists_in_auth(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM auth.users 
        WHERE email = email_to_check
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.email_exists_in_auth(TEXT) TO authenticated;

-- Optional: Create a trigger to prevent duplicate emails at the database level
-- This is more robust than a check constraint
CREATE OR REPLACE FUNCTION public.prevent_duplicate_pending_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if email already exists in auth.users
    IF EXISTS (
        SELECT 1 
        FROM auth.users 
        WHERE email = NEW.email
    ) THEN
        RAISE EXCEPTION 'Email % already exists in auth.users', NEW.email
            USING ERRCODE = '23514';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS check_pending_user_email ON public.pending_users;
CREATE TRIGGER check_pending_user_email
    BEFORE INSERT ON public.pending_users
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_duplicate_pending_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.prevent_duplicate_pending_user() TO authenticated;
