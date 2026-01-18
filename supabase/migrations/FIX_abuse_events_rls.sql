-- ============================================
-- FIX: Add INSERT policy for domain_abuse_events
-- ============================================
-- 
-- ISSUE: Can't log abuse events due to missing INSERT RLS policy
-- Run this in Supabase SQL Editor
-- ============================================

-- Add INSERT policy for domain_abuse_events
CREATE POLICY "Users can insert abuse events for themselves" 
  ON domain_abuse_events FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add INSERT policy for domain_verification_logs  
CREATE POLICY "Users can insert verification logs for own domains" 
  ON domain_verification_logs FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM domains 
      WHERE domains.id = domain_verification_logs.domain_id 
      AND domains.user_id = auth.uid()
    )
  );

-- Verify policies created
DO $$
DECLARE
  abuse_count INTEGER;
  log_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO abuse_count 
  FROM pg_policies 
  WHERE tablename = 'domain_abuse_events';
  
  SELECT COUNT(*) INTO log_count 
  FROM pg_policies 
  WHERE tablename = 'domain_verification_logs';
  
  RAISE NOTICE '✅ domain_abuse_events has % policies', abuse_count;
  RAISE NOTICE '✅ domain_verification_logs has % policies', log_count;
END $$;
