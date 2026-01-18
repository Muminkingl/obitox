-- ============================================
-- OBITOX DOMAIN MANAGEMENT - DATABASE SCHEMA
-- Operation Fortress - Week 1, Day 1
-- ============================================
-- 
-- DEPLOYMENT INSTRUCTIONS:
-- 1. Open Supabase Dashboard → SQL Editor
-- 2. Create new query
-- 3. Copy-paste this ENTIRE file
-- 4. Click "RUN" 
-- 5. Verify all tables created successfully
--
-- NOTE: No email verification table needed (using Google OAuth)
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CLEANUP: Drop existing tables (if any)
-- This ensures a clean migration even if tables exist
-- ============================================

DROP TABLE IF EXISTS domain_abuse_events CASCADE;
DROP TABLE IF EXISTS domain_verification_logs CASCADE;
DROP TABLE IF EXISTS dns_records CASCADE;
DROP TABLE IF EXISTS domains CASCADE;
DROP TABLE IF EXISTS domain_quotas CASCADE;

-- ============================================
-- TABLE 1: DOMAINS
-- Core table for domain management
-- ============================================

CREATE TABLE domains (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User & Account
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_tier TEXT NOT NULL DEFAULT 'free',
  
  -- Domain Info
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL, -- lowercase for uniqueness
  
  -- Status Fields
  status TEXT NOT NULL DEFAULT 'pending',
  verification_status TEXT DEFAULT 'not_started',
  
  -- Verification Data
  verification_token TEXT UNIQUE,
  verification_attempts INTEGER DEFAULT 0,
  last_verification_attempt TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- DNS Record Verification Status
  mx_verified BOOLEAN DEFAULT FALSE,
  spf_verified BOOLEAN DEFAULT FALSE,
  dmarc_verified BOOLEAN DEFAULT FALSE,
  dkim_verified BOOLEAN DEFAULT FALSE,
  
  -- Configuration
  region TEXT DEFAULT 'us-east-1',
  provider TEXT DEFAULT 'aws-ses',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Abuse Prevention
  is_disposable BOOLEAN DEFAULT FALSE,
  abuse_score INTEGER DEFAULT 0,
  suspended_at TIMESTAMP WITH TIME ZONE,
  suspension_reason TEXT,
  
  -- Constraints
  CONSTRAINT unique_user_domain UNIQUE(user_id, normalized_name),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'verified', 'failed', 'suspended')),
  CONSTRAINT valid_verification_status CHECK (verification_status IN ('not_started', 'in_progress', 'completed', 'failed')),
  CONSTRAINT valid_tier CHECK (account_tier IN ('free', 'pro', 'enterprise'))
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_domains_user_id ON domains(user_id);
CREATE INDEX IF NOT EXISTS idx_domains_status ON domains(status);
CREATE INDEX IF NOT EXISTS idx_domains_normalized_name ON domains(normalized_name);
CREATE INDEX IF NOT EXISTS idx_domains_created_at ON domains(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_domains_verification_status ON domains(verification_status);

-- Composite Index for Quota Checks (active domains only)
CREATE INDEX IF NOT EXISTS idx_domains_user_status 
  ON domains(user_id, status) 
  WHERE status != 'suspended';

-- Add comment
COMMENT ON TABLE domains IS 'Main table for managing user domains with verification tracking and abuse prevention';

-- ============================================
-- TABLE 2: DNS RECORDS
-- Stores DNS records needed for domain verification
-- ============================================

CREATE TABLE dns_records (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Key
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  
  -- Record Details
  record_type TEXT NOT NULL,
  name TEXT NOT NULL,        -- e.g., '@', 'mail', '_dmarc'
  value TEXT NOT NULL,        -- The DNS value to add
  ttl INTEGER DEFAULT 3600,
  priority INTEGER,           -- For MX records
  
  -- Verification Status
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  last_check TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_record_type CHECK (record_type IN ('MX', 'TXT', 'CNAME', 'A', 'AAAA'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dns_records_domain_id ON dns_records(domain_id);
CREATE INDEX IF NOT EXISTS idx_dns_records_type ON dns_records(record_type);
CREATE INDEX IF NOT EXISTS idx_dns_records_verified ON dns_records(verified);

-- Add comment
COMMENT ON TABLE dns_records IS 'DNS records required for domain verification (MX, TXT, CNAME, etc.)';

-- ============================================
-- TABLE 3: DOMAIN VERIFICATION LOGS
-- Audit trail for all verification attempts
-- ============================================

CREATE TABLE domain_verification_logs (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Key
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  
  -- Verification Details
  check_type TEXT NOT NULL,
  result TEXT NOT NULL,
  
  -- DNS Results (stored as JSON)
  records_checked JSONB,
  errors JSONB,
  
  -- Context
  triggered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_check_type CHECK (check_type IN ('manual', 'automatic', 'cron')),
  CONSTRAINT valid_result CHECK (result IN ('success', 'failed', 'partial'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_verification_logs_domain_id ON domain_verification_logs(domain_id);
CREATE INDEX IF NOT EXISTS idx_verification_logs_created_at ON domain_verification_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_verification_logs_result ON domain_verification_logs(result);

-- Add comment
COMMENT ON TABLE domain_verification_logs IS 'Audit log of all domain verification attempts for debugging and compliance';

-- ============================================
-- TABLE 4: DOMAIN ABUSE EVENTS
-- Security monitoring and abuse tracking
-- ============================================

CREATE TABLE domain_abuse_events (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Target
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
  
  -- Event Type
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'low',
  
  -- Details
  description TEXT,
  metadata JSONB,
  
  -- Context
  ip_address TEXT,
  user_agent TEXT,
  
  -- Response
  action_taken TEXT,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_event_type CHECK (event_type IN (
    'rate_limit_exceeded',
    'invalid_domain',
    'disposable_email',
    'spam_detected',
    'quota_exceeded',
    'verification_spam',
    'suspicious_pattern'
  )),
  CONSTRAINT valid_severity CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  CONSTRAINT valid_action CHECK (action_taken IN ('blocked', 'flagged', 'suspended', 'none'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_abuse_events_user_id ON domain_abuse_events(user_id);
CREATE INDEX IF NOT EXISTS idx_abuse_events_severity ON domain_abuse_events(severity);
CREATE INDEX IF NOT EXISTS idx_abuse_events_created_at ON domain_abuse_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_abuse_events_event_type ON domain_abuse_events(event_type);

-- Composite index for security monitoring
CREATE INDEX IF NOT EXISTS idx_abuse_events_user_severity 
  ON domain_abuse_events(user_id, severity, created_at DESC);

-- Add comment
COMMENT ON TABLE domain_abuse_events IS 'Security monitoring table tracking abuse patterns and suspicious activity';

-- ============================================
-- TABLE 5: DOMAIN QUOTAS
-- Tier-based limits configuration
-- ============================================

CREATE TABLE domain_quotas (
  -- Primary Key
  tier TEXT PRIMARY KEY,
  
  -- Quota Limits
  max_domains INTEGER NOT NULL,
  max_domains_per_hour INTEGER NOT NULL,
  max_domains_per_day INTEGER NOT NULL,
  max_verification_attempts INTEGER NOT NULL,
  verification_cooldown_seconds INTEGER NOT NULL,
  
  -- Feature Flags
  custom_dns_allowed BOOLEAN DEFAULT FALSE,
  priority_verification BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_tier_name CHECK (tier IN ('free', 'pro', 'enterprise'))
);

-- Insert default quotas
INSERT INTO domain_quotas (
  tier, 
  max_domains, 
  max_domains_per_hour, 
  max_domains_per_day, 
  max_verification_attempts, 
  verification_cooldown_seconds,
  custom_dns_allowed,
  priority_verification
) VALUES
  -- FREE TIER: Conservative limits
  ('free', 3, 3, 5, 10, 300, FALSE, FALSE),
  
  -- PRO TIER: Higher limits for paying customers
  ('pro', 50, 20, 50, 50, 60, TRUE, TRUE),
  
  -- ENTERPRISE TIER: Generous limits
  ('enterprise', 1000, 100, 500, -1, 0, TRUE, TRUE)
ON CONFLICT (tier) DO NOTHING;

-- Add comment
COMMENT ON TABLE domain_quotas IS 'Tier-based quota configuration for domain management limits';

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Ensure users can only access their own data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE dns_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_abuse_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running migration)
DROP POLICY IF EXISTS "Users can view own domains" ON domains;
DROP POLICY IF EXISTS "Users can insert own domains" ON domains;
DROP POLICY IF EXISTS "Users can update own domains" ON domains;
DROP POLICY IF EXISTS "Users can delete own domains" ON domains;

DROP POLICY IF EXISTS "Users can view DNS records for own domains" ON dns_records;
DROP POLICY IF EXISTS "Users can view own verification logs" ON domain_verification_logs;
DROP POLICY IF EXISTS "Users can view own abuse events" ON domain_abuse_events;

-- DOMAINS: Full CRUD for own domains
CREATE POLICY "Users can view own domains" 
  ON domains FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own domains" 
  ON domains FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own domains" 
  ON domains FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own domains" 
  ON domains FOR DELETE 
  USING (auth.uid() = user_id);

-- DNS RECORDS: Can view records for own domains
CREATE POLICY "Users can view DNS records for own domains" 
  ON dns_records FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM domains 
      WHERE domains.id = dns_records.domain_id 
      AND domains.user_id = auth.uid()
    )
  );

-- VERIFICATION LOGS: Can view logs for own domains
CREATE POLICY "Users can view own verification logs" 
  ON domain_verification_logs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM domains 
      WHERE domains.id = domain_verification_logs.domain_id 
      AND domains.user_id = auth.uid()
    )
  );

-- ABUSE EVENTS: Can view own abuse events
CREATE POLICY "Users can view own abuse events" 
  ON domain_abuse_events FOR SELECT 
  USING (auth.uid() = user_id);

        -- ============================================
        -- HELPER FUNCTIONS
        -- Automatic timestamp updates and utilities
        -- ============================================

        -- Function to auto-update updated_at column
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Trigger for domains table
        DROP TRIGGER IF EXISTS update_domains_updated_at ON domains;
        CREATE TRIGGER update_domains_updated_at
            BEFORE UPDATE ON domains
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();

        -- Trigger for domain_quotas table
        DROP TRIGGER IF EXISTS update_domain_quotas_updated_at ON domain_quotas;
        CREATE TRIGGER update_domain_quotas_updated_at
            BEFORE UPDATE ON domain_quotas
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ANALYTICS VIEWS
-- Helpful views for monitoring
-- ============================================

-- View: Domain statistics by user
CREATE OR REPLACE VIEW domain_stats_by_user AS
SELECT 
  user_id,
  account_tier,
  COUNT(*) as total_domains,
  COUNT(*) FILTER (WHERE status = 'verified') as verified_domains,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_domains,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_domains,
  COUNT(*) FILTER (WHERE status = 'suspended') as suspended_domains,
  MAX(created_at) as last_domain_added
FROM domains
GROUP BY user_id, account_tier;

-- Add comment
COMMENT ON VIEW domain_stats_by_user IS 'Aggregated domain statistics per user for dashboard displays';

-- ============================================
-- VERIFICATION & HEALTH CHECK
-- ============================================

-- Check if all tables exist
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('domains', 'dns_records', 'domain_verification_logs', 'domain_abuse_events', 'domain_quotas');
  
  IF table_count = 5 THEN
    RAISE NOTICE '✅ All 5 tables created successfully!';
  ELSE
    RAISE EXCEPTION '❌ Expected 5 tables but found %', table_count;
  END IF;
END $$;

-- Check if quotas are populated
DO $$
DECLARE
  quota_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO quota_count FROM domain_quotas;
  
  IF quota_count = 3 THEN
    RAISE NOTICE '✅ All 3 tier quotas configured!';
  ELSE
    RAISE WARNING '⚠️  Expected 3 quotas but found %', quota_count;
  END IF;
END $$;

-- ============================================
-- MIGRATION COMPLETE! 🎉
-- ============================================

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '╔═══════════════════════════════════════════════════╗';
  RAISE NOTICE '║                                                   ║';
  RAISE NOTICE '║   🎉 MIGRATION COMPLETED SUCCESSFULLY! 🎉        ║';
  RAISE NOTICE '║                                                   ║';
  RAISE NOTICE '║   Tables Created:                                ║';
  RAISE NOTICE '║   ✅ domains (with RLS)                          ║';
  RAISE NOTICE '║   ✅ dns_records (with RLS)                      ║';
  RAISE NOTICE '║   ✅ domain_verification_logs (with RLS)         ║';
  RAISE NOTICE '║   ✅ dom_abuse_events (with RLS)                ║';
  RAISE NOTICE '║   ✅ domain_quotas                               ║';
  RAISE NOTICE '║                                                   ║';
  RAISE NOTICE '║   Extras:                                        ║';
  RAISE NOTICE '║   ✅ Indexes for performance                     ║';
  RAISE NOTICE '║   ✅ Auto-update triggers                        ║';
  RAISE NOTICE '║   ✅ Analytics view                              ║';
  RAISE NOTICE '║   ✅ Default tier quotas                         ║';
  RAISE NOTICE '║                                                   ║';
  RAISE NOTICE '║   Next Step: Test the schema! ✓                  ║';
  RAISE NOTICE '║                                                   ║';
  RAISE NOTICE '╚═══════════════════════════════════════════════════╝';
  RAISE NOTICE '';
END $$;
