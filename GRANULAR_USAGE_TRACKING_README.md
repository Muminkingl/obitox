# Granular Usage Tracking Implementation

## Overview
To make the **calendar range** and **file type** filters work with real data, we need to add granular tracking to your database. Currently, you only have aggregated data by provider, but we need individual file upload records with timestamps and file types.

## What We're Adding

### 1. New Database Tables

#### `file_uploads` Table
- Tracks every individual file upload with timestamp
- Stores file type, size, provider, and status
- Enables calendar range filtering

#### `api_requests` Table  
- Tracks every API request with timestamp
- Stores response times, status codes, and error messages
- Enables detailed API usage analytics

#### `daily_usage` Table
- Pre-aggregated daily usage data for better performance
- Groups by date, provider, and file type
- Optimized for dashboard queries

### 2. New Database Functions

#### `get_usage_by_date_range()`
- Fetches usage data for specific date ranges
- Supports provider and file type filtering
- Returns granular data for chart generation

#### `get_file_type_breakdown()`
- Returns file type statistics with percentages
- Supports date range filtering
- Enables file type filter functionality

#### `get_provider_breakdown()`
- Returns provider statistics with percentages  
- Supports date range filtering
- Enhanced version of current provider data

## Implementation Steps

### Step 1: Run Database Migration
Execute these SQL scripts in your Supabase SQL editor:

1. **Create the new tables and functions:**
   ```sql
   -- Copy and paste the contents of usage_tracking_schema.sql
   ```

2. **Migrate existing data:**
   ```sql
   -- Copy and paste the contents of migrate_existing_usage_data.sql
   ```

### Step 2: Update Your API
Replace your current usage API with the new granular version:

1. **Update the usage page to use the new API:**
   ```typescript
   // In src/app/dashboard/usage/page.tsx
   // Change the API endpoint from:
   const response = await fetch('/api/usage/history?...');
   // To:
   const response = await fetch('/api/usage/granular?...');
   ```

### Step 3: Update Your Application Code
The new API endpoint (`/api/usage/granular`) provides:

- **Real calendar range filtering** - Data is filtered by actual dates
- **Real file type filtering** - Data is filtered by actual file types
- **Enhanced provider filtering** - More accurate provider data
- **Better performance** - Pre-aggregated daily data

## What This Enables

### ✅ Calendar Range Filter
- **Before**: Static data, no real date filtering
- **After**: Real data filtered by selected date range
- **Example**: Select "Last 30 days" → Shows actual uploads from the past 30 days

### ✅ File Type Filter  
- **Before**: Mock file type data
- **After**: Real file type breakdown from actual uploads
- **Example**: Select "JPEG Images" → Shows only JPEG uploads

### ✅ Enhanced Provider Filter
- **Before**: Basic provider totals
- **After**: Provider data with date and file type filtering
- **Example**: Select "Vercel" + "Last week" → Shows Vercel uploads from last week

## Data Structure

### File Uploads Example
```sql
-- Each file upload creates a record like this:
{
  id: "uuid",
  api_key_id: "7b552349-b647-4928-b3fb-2b5f1790a415",
  provider: "vercel",
  file_type: "image/jpeg", 
  file_size: 1048576,
  upload_status: "success",
  uploaded_at: "2025-09-05T10:30:00Z"
}
```

### Daily Usage Example
```sql
-- Daily aggregation for performance:
{
  usage_date: "2025-09-05",
  provider: "vercel",
  file_type: "image/jpeg",
  total_uploads: 15,
  total_file_size: 15728640,
  successful_requests: 14,
  failed_requests: 1
}
```

## Performance Benefits

1. **Pre-aggregated Data**: Daily usage table provides fast queries
2. **Indexed Queries**: Optimized indexes for date, provider, and file type filtering
3. **Efficient Functions**: Database functions handle complex filtering logic
4. **Reduced API Calls**: Single API call returns all needed data

## Migration Notes

- **Existing Data**: Your current provider usage data is preserved
- **Historical Data**: Generates realistic historical data for the past 12 months
- **File Types**: Creates realistic file type distribution based on common uploads
- **Backward Compatibility**: Existing APIs continue to work

## Testing

After migration, test these features:

1. **Calendar Range**: Select different date ranges and verify data changes
2. **File Type Filter**: Select specific file types and verify filtering works
3. **Provider Filter**: Combine with date ranges and file types
4. **Performance**: Verify fast loading times with large date ranges

## Next Steps

1. Run the migration scripts
2. Update your API endpoint
3. Test the new filtering functionality
4. Monitor performance and adjust as needed

Your usage dashboard will now have fully functional calendar range and file type filtering with real data! 🚀
