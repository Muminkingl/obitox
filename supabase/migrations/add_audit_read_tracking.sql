-- ========================================
-- AUDIT LOGS: Add Read Tracking
-- Run this in Supabase SQL Editor
-- ========================================

-- Step 1: Add columns for tracking read status
ALTER TABLE audit_logs
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- Step 2: Create performance indexes
-- Partial index for unread critical/warning logs (very fast queries)
CREATE INDEX IF NOT EXISTS idx_audit_logs_unread 
ON audit_logs(user_id, is_read, event_category, created_at DESC)
WHERE is_read = FALSE AND event_category IN ('warning', 'critical');

-- Index for notifications query
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_category_read
ON audit_logs(user_id, event_category, is_read, created_at DESC);

-- Step 3: Verify the migration
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'audit_logs' 
AND column_name IN ('is_read', 'read_at')
ORDER BY column_name;

-- Expected output:
-- is_read    | boolean | YES | false
-- read_at    | timestamp with time zone | YES | NULL

-- Step 4: Check current data
SELECT 
  COUNT(*) as total_logs,
  SUM(CASE WHEN is_read IS NULL THEN 1 ELSE 0 END) as null_is_read,
  SUM(CASE WHEN is_read = false THEN 1 ELSE 0 END) as unread_count,
  SUM(CASE WHEN is_read = true THEN 1 ELSE 0 END) as read_count
FROM audit_logs;

-- You should see all existing logs have is_read = NULL or false
