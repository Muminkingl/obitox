-- Check for duplicate lol.com domains
-- Run this in Supabase SQL Editor to see what's in the database

SELECT 
  id,
  user_id,
  name,
  normalized_name,
  status,
  verification_token,
  created_at
FROM domains
WHERE normalized_name = 'lol.com'
ORDER BY created_at ASC;

-- Expected: Should see 2 rows (the bug!)
-- After fix: Should only see 1 row
