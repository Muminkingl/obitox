-- 🧪 VERIFY FRONTEND FILTERS SETUP
-- Run this in your Supabase SQL Editor to verify everything is working

-- ============================================
-- TEST 1: Check if tables were created
-- ============================================

SELECT 
  'Tables Created' as test_name,
  table_name,
  '✅' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('file_uploads', 'daily_usage', 'api_requests')
ORDER BY table_name;

i got `[
  {
    "test_name": "Tables Created",
    "table_name": "api_requests",
    "status": "✅"
  },
  {
    "test_name": "Tables Created",
    "table_name": "daily_usage",
    "status": "✅"
  },
  {
    "test_name": "Tables Created",
    "table_name": "file_uploads",
    "status": "✅"
  }
]`
-- ============================================
-- TEST 2: Check if views were created
-- ============================================

SELECT 
  'Views Created' as test_name,
  table_name as view_name,
  '✅' as status
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name IN ('provider_usage_detailed', 'daily_usage_summary')
ORDER BY table_name;

i got `[
  {
    "test_name": "Views Created",
    "view_name": "daily_usage_summary",
    "status": "✅"
  },
  {
    "test_name": "Views Created",
    "view_name": "provider_usage_detailed",
    "status": "✅"
  }
]`
-- ============================================
-- TEST 3: Check sample data
-- ============================================

SELECT 
  'Sample Data' as test_name,
  'file_uploads' as table_name,
  COUNT(*) as record_count,
  '✅' as status
FROM file_uploads;
i got `[
  {
    "test_name": "Sample Data",
    "table_name": "file_uploads",
    "record_count": 30,
    "status": "✅"
  }
]`

SELECT 
  'Sample Data' as test_name,
  'daily_usage' as table_name,
  COUNT(*) as record_count,
  '✅' as status
FROM daily_usage;

i go t`[
  {
    "test_name": "Sample Data",
    "table_name": "daily_usage",
    "record_count": 26,
    "status": "✅"
  }
]`


SELECT 
  'Sample Data' as test_name,
  'api_requests' as table_name,
  COUNT(*) as record_count,
  '✅' as status
FROM api_requests;
i got `[
  {
    "test_name": "Sample Data",
    "table_name": "api_requests",
    "record_count": 30,
    "status": "✅"
  }
]`
-- ============================================
-- TEST 4: Test Provider Filter
-- ============================================

SELECT 
  'Provider Filter Test' as test_name,
  provider,
  COUNT(*) as file_count,
  SUM(file_size) as total_size
FROM file_uploads 
GROUP BY provider
ORDER BY total_size DESC;

i got `[
  {
    "test_name": "Provider Filter Test",
    "provider": "vercel",
    "file_count": 10,
    "total_size": "76188668"
  },
  {
    "test_name": "Provider Filter Test",
    "provider": "uploadcare",
    "file_count": 10,
    "total_size": "44473577"
  },
  {
    "test_name": "Provider Filter Test",
    "provider": "supabase",
    "file_count": 10,
    "total_size": "14195861"
  }
]`
-- ============================================
-- TEST 5: Test File Type Filter
-- ============================================

SELECT 
  'File Type Filter Test' as test_name,
  file_type,
  COUNT(*) as upload_count,
  SUM(file_size) as total_size
FROM file_uploads 
GROUP BY file_type
ORDER BY upload_count DESC;

i got `[
  {
    "test_name": "File Type Filter Test",
    "file_type": "image/jpeg",
    "upload_count": 30,
    "total_size": "134858106"
  }
]`
-- ============================================
-- TEST 6: Test Date Range Filter
-- ============================================

SELECT 
  'Date Range Filter Test' as test_name,
  uploaded_at::DATE as upload_date,
  COUNT(*) as daily_uploads,
  SUM(file_size) as daily_size
FROM file_uploads 
WHERE uploaded_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY uploaded_at::DATE
ORDER BY upload_date DESC
LIMIT 5;
i got `[
  {
    "test_name": "Date Range Filter Test",
    "upload_date": "2025-09-05",
    "daily_uploads": 1,
    "daily_size": "9352075"
  },
  {
    "test_name": "Date Range Filter Test",
    "upload_date": "2025-09-03",
    "daily_uploads": 2,
    "daily_size": "5748640"
  },
  {
    "test_name": "Date Range Filter Test",
    "upload_date": "2025-09-02",
    "daily_uploads": 3,
    "daily_size": "17803767"
  },
  {
    "test_name": "Date Range Filter Test",
    "upload_date": "2025-09-01",
    "daily_uploads": 1,
    "daily_size": "4686021"
  },
  {
    "test_name": "Date Range Filter Test",
    "upload_date": "2025-08-30",
    "daily_uploads": 2,
    "daily_size": "7842063"
  }
]`

-- ============================================
-- TEST 7: Test Combined Filters
-- ============================================

SELECT 
  'Combined Filter Test' as test_name,
  provider,
  file_type,
  COUNT(*) as upload_count,
  SUM(file_size) as total_size
FROM file_uploads 
WHERE provider = 'vercel'
  AND file_type = 'image/jpeg'
  AND uploaded_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY provider, file_type;

i got `[
  {
    "test_name": "Combined Filter Test",
    "provider": "vercel",
    "file_type": "image/jpeg",
    "upload_count": 10,
    "total_size": "76188668"
  }
]`
-- ============================================
-- TEST 8: Test Views
-- ============================================

SELECT 
  'Provider Usage Detailed View' as test_name,
  provider,
  upload_count,
  total_file_size,
  '✅' as status
FROM provider_usage_detailed 
LIMIT 3;

i got `[
  {
    "test_name": "Provider Usage Detailed View",
    "provider": "uploadcare",
    "upload_count": 33,
    "total_file_size": 32506996,
    "status": "✅"
  },
  {
    "test_name": "Provider Usage Detailed View",
    "provider": "vercel",
    "upload_count": 74,
    "total_file_size": 387399573,
    "status": "✅"
  },
  {
    "test_name": "Provider Usage Detailed View",
    "provider": "supabase",
    "upload_count": 36,
    "total_file_size": 17826752,
    "status": "✅"
  }
]`

SELECT 
  'Daily Usage Summary View' as test_name,
  usage_date,
  provider,
  total_uploads,
  total_file_size,
  '✅' as status
FROM daily_usage_summary 
ORDER BY usage_date DESC
LIMIT 5;
i got `[
  {
    "test_name": "Daily Usage Summary View",
    "usage_date": "2025-09-05",
    "provider": "vercel",
    "total_uploads": 1,
    "total_file_size": "9352075",
    "status": "✅"
  },
  {
    "test_name": "Daily Usage Summary View",
    "usage_date": "2025-09-03",
    "provider": "supabase",
    "total_uploads": 1,
    "total_file_size": "1564986",
    "status": "✅"
  },
  {
    "test_name": "Daily Usage Summary View",
    "usage_date": "2025-09-03",
    "provider": "uploadcare",
    "total_uploads": 1,
    "total_file_size": "4183654",
    "status": "✅"
  },
  {
    "test_name": "Daily Usage Summary View",
    "usage_date": "2025-09-02",
    "provider": "vercel",
    "total_uploads": 2,
    "total_file_size": "15838469",
    "status": "✅"
  },
  {
    "test_name": "Daily Usage Summary View",
    "usage_date": "2025-09-02",
    "provider": "supabase",
    "total_uploads": 1,
    "total_file_size": "1965298",
    "status": "✅"
  }
]`
-- ============================================
-- TEST 9: Test Indexes
-- ============================================

SELECT 
  'Indexes Created' as test_name,
  indexname,
  tablename,
  '✅' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('file_uploads', 'daily_usage', 'api_requests')
ORDER BY tablename, indexname;
i got `[
  {
    "test_name": "Indexes Created",
    "indexname": "api_requests_pkey",
    "tablename": "api_requests",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_api_requests_api_key_id",
    "tablename": "api_requests",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_api_requests_provider",
    "tablename": "api_requests",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_api_requests_request_type",
    "tablename": "api_requests",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_api_requests_requested_at",
    "tablename": "api_requests",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_api_requests_status_code",
    "tablename": "api_requests",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_api_requests_user_id",
    "tablename": "api_requests",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "daily_usage_api_key_id_usage_date_provider_file_type_key",
    "tablename": "daily_usage",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "daily_usage_pkey",
    "tablename": "daily_usage",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_daily_usage_api_key_id",
    "tablename": "daily_usage",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_daily_usage_date",
    "tablename": "daily_usage",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_daily_usage_file_type",
    "tablename": "daily_usage",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_daily_usage_provider",
    "tablename": "daily_usage",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_daily_usage_user_id",
    "tablename": "daily_usage",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "file_uploads_pkey",
    "tablename": "file_uploads",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_file_uploads_api_key_id",
    "tablename": "file_uploads",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_file_uploads_file_type",
    "tablename": "file_uploads",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_file_uploads_provider",
    "tablename": "file_uploads",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_file_uploads_status",
    "tablename": "file_uploads",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_file_uploads_uploaded_at",
    "tablename": "file_uploads",
    "status": "✅"
  },
  {
    "test_name": "Indexes Created",
    "indexname": "idx_file_uploads_user_id",
    "tablename": "file_uploads",
    "status": "✅"
  }
]`
-- ============================================
-- TEST 10: Test RLS Policies
-- ============================================

SELECT 
  'RLS Policies' as test_name,
  schemaname,
  tablename,
  policyname,
  '✅' as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('file_uploads', 'daily_usage', 'api_requests')
ORDER BY tablename, policyname;

i got `[
  {
    "test_name": "RLS Policies",
    "schemaname": "public",
    "tablename": "api_requests",
    "policyname": "Users can insert their own api requests",
    "status": "✅"
  },
  {
    "test_name": "RLS Policies",
    "schemaname": "public",
    "tablename": "api_requests",
    "policyname": "Users can update their own api requests",
    "status": "✅"
  },
  {
    "test_name": "RLS Policies",
    "schemaname": "public",
    "tablename": "api_requests",
    "policyname": "Users can view their own api requests",
    "status": "✅"
  },
  {
    "test_name": "RLS Policies",
    "schemaname": "public",
    "tablename": "daily_usage",
    "policyname": "Users can insert their own daily usage",
    "status": "✅"
  },
  {
    "test_name": "RLS Policies",
    "schemaname": "public",
    "tablename": "daily_usage",
    "policyname": "Users can update their own daily usage",
    "status": "✅"
  },
  {
    "test_name": "RLS Policies",
    "schemaname": "public",
    "tablename": "daily_usage",
    "policyname": "Users can view their own daily usage",
    "status": "✅"
  },
  {
    "test_name": "RLS Policies",
    "schemaname": "public",
    "tablename": "file_uploads",
    "policyname": "Users can insert their own file uploads",
    "status": "✅"
  },
  {
    "test_name": "RLS Policies",
    "schemaname": "public",
    "tablename": "file_uploads",
    "policyname": "Users can update their own file uploads",
    "status": "✅"
  },
  {
    "test_name": "RLS Policies",
    "schemaname": "public",
    "tablename": "file_uploads",
    "policyname": "Users can view their own file uploads",
    "status": "✅"
  }
]`
-- ============================================
-- SUCCESS
-- ============================================
