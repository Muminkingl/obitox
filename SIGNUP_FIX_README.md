# Fix for Pending Users Check Constraint Error

## Problem
The signup process is failing with the error:
```
Error storing pending user: {
  code: '23514',
  details: null,
  hint: null,
  message: 'new row for relation "pending_users" violates check constraint "check_email_not_in_auth_users"'
}
```

## Root Cause
There's a check constraint `check_email_not_in_auth_users` on the `pending_users` table that prevents inserting emails that already exist in the `auth.users` table. This constraint was likely added directly to the database and is not visible in the codebase schema files.

## Solutions

### Solution 1: Database Migration (Recommended)
Run the SQL script `fix_pending_users_constraint.sql` to:
1. Remove the problematic check constraint
2. Create a more flexible database function to check for existing emails
3. Add a trigger-based approach for better error handling

### Solution 2: Application-Level Fix (Already Implemented)
The signup action has been updated to:
1. Check if the email already exists in `auth.users` before inserting into `pending_users`
2. Use a database function `email_exists_in_auth` for the check
3. Provide a fallback method if the function is not available
4. Return a user-friendly error message

## Files Modified
- `src/app/(auth)/signup/actions.ts` - Updated to check for existing users before insertion
- `fix_pending_users_constraint.sql` - Database migration script
- `SIGNUP_FIX_README.md` - This documentation

## How to Apply the Fix

### Step 1: Run the Database Migration
Execute the SQL script in your Supabase SQL editor:
```sql
-- Copy and paste the contents of fix_pending_users_constraint.sql
```

### Step 2: Verify the Application Changes
The signup action now includes proper email existence checking. Test the signup flow to ensure it works correctly.

## Testing
1. Try to sign up with an email that already exists in the system
2. Verify that you get a user-friendly error message
3. Try to sign up with a new email
4. Verify that the signup process completes successfully

## Environment Variables Required
Make sure you have the following environment variables set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations, optional)
- `RESEND_API_KEY` (for email sending)

## Alternative Approaches
If you prefer to keep the check constraint, you can:
1. Modify the constraint to be less restrictive
2. Use a different approach for handling duplicate emails
3. Implement a different user flow for existing users

The current solution provides the most user-friendly experience by checking for existing users before attempting to insert into the pending_users table.
