-- ============================================
-- FIX: Add missing RLS policies for dns_records
-- ============================================
-- 
-- ISSUE: DNS records can't be inserted because we only have
-- SELECT policy, but no INSERT/UPDATE/DELETE policies
-- 
-- Run this in Supabase SQL Editor
-- ============================================

-- Add INSERT policy for dns_records (when creating domain)
CREATE POLICY "Users can insert DNS records for own domains" 
  ON dns_records FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM domains 
      WHERE domains.id = dns_records.domain_id 
      AND domains.user_id = auth.uid()
    )
  );

-- Add UPDATE policy for dns_records (for verification status)
CREATE POLICY "Users can update DNS records for own domains" 
  ON dns_records FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM domains 
      WHERE domains.id = dns_records.domain_id 
      AND domains.user_id = auth.uid()
    )
  );

-- Add DELETE policy for dns_records (cascade when deleting domain)
CREATE POLICY "Users can delete DNS records for own domains" 
  ON dns_records FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM domains 
      WHERE domains.id = dns_records.domain_id 
      AND domains.user_id = auth.uid()
    )
  );

-- Verification query
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count 
  FROM pg_policies 
  WHERE tablename = 'dns_records';
  
  IF policy_count = 4 THEN
    RAISE NOTICE '✅ All 4 RLS policies created for dns_records!';
  ELSE
    RAISE WARNING '⚠️  Expected 4 policies but found %', policy_count;
  END IF;
END $$;
