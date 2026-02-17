# Usage Section Data Sources

This document explains where each piece of data in the Usage Dashboard (`/dashboard/usage`) is fetched from.

---

## 1. Monthly Quota

### Data Displayed
- **Plan Name** (e.g., "Free", "Pro", "Enterprise")
- **Requests Used** (e.g., 450)
- **Requests Limit** (e.g., 1,000)
- **Usage Percentage** (e.g., 45%)
- **Requests Remaining** (e.g., 550)

### Database Tables

| Data Field | Source Table | Column |
|------------|--------------|--------|
| Plan Name | `profiles_with_tier` (view) | `plan_name` |
| Subscription Tier | `profiles_with_tier` (view) | `subscription_tier` |
| Requests Limit | `profiles_with_tier` (view) | `api_requests_limit` |
| Requests Used | `quota_usage` | `request_count` |
| Billing Cycle Start | `profiles_with_tier` (view) | `billing_cycle_start` |
| Billing Cycle End | `profiles_with_tier` (view) | `billing_cycle_end` |

### API Endpoint
- **`GET /api/subscription`**

### Query Flow
```sql
-- 1. Get profile with computed tier (handles expiration)
SELECT id, subscription_tier, api_requests_limit, plan_name, billing_cycle_start, billing_cycle_end
FROM profiles_with_tier 
WHERE id = :user_id;

-- 2. Get actual usage count for current month
SELECT request_count 
FROM quota_usage 
WHERE user_id = :user_id AND month = :current_month;
```

### Key Notes
- **`profiles_with_tier`** is a database VIEW that computes the effective subscription tier in real-time
- It handles subscription expiration automatically (expired subscriptions show as "free" tier)
- Grace period (3 days after expiration) is also computed in this view
- **`quota_usage`** stores the actual request count per month

---

## 2. Total Uploads

### Data Displayed
- Total number of files uploaded (e.g., "1,234 files")

### Database Table
- **`api_key_usage_daily`**

### API Endpoint
- **`GET /api/usage/history`**

### Query
```sql
SELECT total_files_uploaded 
FROM api_key_usage_daily 
WHERE user_id = :user_id 
  AND usage_date BETWEEN :startDate AND :endDate;
```

### Calculation
```typescript
totalFilesUploaded = dailyUsage.reduce((sum, day) => 
  sum + (day.total_files_uploaded || 0), 0
);
```

---

## 3. Total API Calls

### Data Displayed
- Total number of API requests (e.g., "5,678 requests")

### Database Table
- **`api_key_usage_daily`**

### API Endpoint
- **`GET /api/usage/history`**

### Query
```sql
SELECT total_requests 
FROM api_key_usage_daily 
WHERE user_id = :user_id 
  AND usage_date BETWEEN :startDate AND :endDate;
```

### Calculation
```typescript
totalRequests = dailyUsage.reduce((sum, day) => 
  sum + (day.total_requests || 0), 0
);
```

---

## 4. Chart Data (Monthly Usage)

### Data Displayed
- **X-Axis**: Month labels (e.g., "Jan 2024", "Feb 2024")
- **Uploads Area**: Number of file uploads per month
- **API Calls Area**: Number of API requests per month

### Database Table
- **`api_key_usage_daily`**

### API Endpoint
- **`GET /api/usage/history`**

### Query
```sql
SELECT 
  usage_date,
  total_requests,
  total_files_uploaded,
  successful_requests,
  failed_requests,
  total_file_size
FROM api_key_usage_daily 
WHERE user_id = :user_id 
  AND usage_date BETWEEN :startDate AND :endDate
ORDER BY usage_date ASC;
```

### Processing
Daily data is aggregated into monthly buckets:

```typescript
function generateMonthlyDataFromDaily(dailyData, startDate, endDate) {
  const monthlyMap = new Map();
  
  dailyData.forEach(day => {
    const monthKey = format(day.usage_date, 'MMM yyyy'); // e.g., "Jan 2024"
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        month: monthKey,
        uploads: 0,
        apiCalls: 0,
        bandwidth: 0
      });
    }
    
    const monthData = monthlyMap.get(monthKey);
    monthData.uploads += day.total_files_uploaded || 0;
    monthData.apiCalls += day.total_requests || 0;
    monthData.bandwidth += day.total_file_size || 0;
  });
  
  return Array.from(monthlyMap.values());
}
```

---

## 5. Provider Usage Breakdown

### Data Displayed
- Provider name (e.g., "Supabase", "S3", "R2", "Uploadcare")
- Usage count and percentage
- Total file size
- Average file size
- Last used date

### Database Table
- **`provider_usage`**

### API Endpoint
- **`GET /api/usage/history`**

### Query
```sql
SELECT 
  provider,
  total_requests,
  total_files,
  total_file_size,
  avg_file_size,
  last_used_at
FROM provider_usage 
WHERE user_id = :user_id;
```

### Note
- **Vercel provider is filtered out** from the breakdown display
- Data is aggregated from `provider_usage_daily` into `provider_usage` table

---

## 6. File Type Breakdown

### Data Displayed
- File type (e.g., "JPEG", "PNG", "PDF")
- Count and percentage

### Database Table
- **`provider_usage`** (via `file_type_counts` JSONB column)

### API Endpoint
- **`GET /api/usage/history`**

### Query
```sql
SELECT file_type_counts 
FROM provider_usage 
WHERE user_id = :user_id;
```

### Processing
```typescript
function extractFileTypeBreakdown(providerStats) {
  const fileTypeMap = new Map();
  
  providerStats.forEach(provider => {
    const counts = provider.file_type_counts || {};
    Object.entries(counts).forEach(([fileType, count]) => {
      fileTypeMap.set(fileType, (fileTypeMap.get(fileType) || 0) + count);
    });
  });
  
  return Array.from(fileTypeMap.entries())
    .map(([label, count]) => ({
      id: label.toLowerCase(),
      label,
      value: count,
      percentage: calculatePercentage(count)
    }))
    .sort((a, b) => b.value - a.value);
}
```

---

## 7. Usage by API Key

### Data Displayed
- API Key name
- Key fragment (last 8 characters)
- Usage count
- Last used date

### Database Tables
- **`api_keys`** (for key metadata)
- **`api_key_usage_daily`** (for usage data)

### API Endpoint
- **`GET /api/usage/history`**

### Query
```sql
-- Get API keys
SELECT id, name, key_value, created_at 
FROM api_keys 
WHERE user_id = :user_id;

-- Get daily usage (already fetched)
SELECT * FROM api_key_usage_daily WHERE user_id = :user_id;
```

### Processing
```typescript
function calculateUsageByKey(apiKeys, dailyUsage) {
  return apiKeys.map(key => {
    const keyUsage = dailyUsage
      .filter(day => day.api_key_id === key.id)
      .reduce((sum, day) => sum + (day.total_requests || 0), 0);
    
    return {
      id: key.id,
      name: key.name,
      tokenFragment: key.key_value.slice(-8),
      usage: keyUsage,
      lastUsed: findLastUsedDate(dailyUsage, key.id)
    };
  });
}
```

---

## Summary Table

| Section | Data | Source Table | API Endpoint |
|---------|------|--------------|--------------|
| Monthly Quota | Plan, Limit, Used | `profiles_with_tier`, `quota_usage` | `/api/subscription` |
| Total Uploads | File count | `api_key_usage_daily` | `/api/usage/history` |
| Total API Calls | Request count | `api_key_usage_daily` | `/api/usage/history` |
| Chart | Monthly uploads/calls | `api_key_usage_daily` | `/api/usage/history` |
| Provider Breakdown | Provider stats | `provider_usage` | `/api/usage/history` |
| File Type Breakdown | File types | `provider_usage` | `/api/usage/history` |
| Usage by Key | Per-key usage | `api_keys`, `api_key_usage_daily` | `/api/usage/history` |

---

## Database Schema Reference

### `profiles_with_tier` (View)
```sql
-- Computed view that handles subscription expiration
CREATE VIEW profiles_with_tier AS
SELECT 
  id,
  subscription_tier,
  subscription_tier_paid,
  subscription_status,
  -- Computed fields for expiration
  CASE 
    WHEN subscription_ends_at < NOW() THEN true 
    ELSE false 
  END as is_subscription_expired,
  -- Grace period (3 days after expiration)
  CASE 
    WHEN subscription_ends_at < NOW() 
     AND subscription_ends_at > NOW() - INTERVAL '3 days' 
    THEN true 
    ELSE false 
  END as is_in_grace_period,
  api_requests_limit,
  billing_cycle_start,
  billing_cycle_end,
  plan_name
FROM profiles;
```

### `quota_usage`
```sql
CREATE TABLE quota_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  month TEXT, -- Format: "2024-01"
  request_count INTEGER DEFAULT 0,
  synced_at TIMESTAMPTZ
);
```

### `api_key_usage_daily`
```sql
CREATE TABLE api_key_usage_daily (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  api_key_id UUID REFERENCES api_keys(id),
  usage_date DATE,
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  total_files_uploaded INTEGER DEFAULT 0,
  total_file_size BIGINT DEFAULT 0
);
```

### `provider_usage`
```sql
CREATE TABLE provider_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  provider TEXT, -- 'supabase', 's3', 'r2', 'uploadcare', 'vercel'
  total_requests INTEGER DEFAULT 0,
  total_files INTEGER DEFAULT 0,
  total_file_size BIGINT DEFAULT 0,
  avg_file_size BIGINT DEFAULT 0,
  file_type_counts JSONB DEFAULT '{}',
  last_used_at TIMESTAMPTZ
);
```
