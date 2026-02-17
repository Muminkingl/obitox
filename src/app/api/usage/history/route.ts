import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimit } from '@/lib/rate-limit';

// Default usage data
const defaultCurrentUsage = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalFileSize: 0,
  totalFilesUploaded: 0,
  lastUsedAt: null
};

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Rate limiting (100 requests per minute)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '::1';

    const rateLimitResult = await apiRateLimit.check(ip);

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);

      console.log(`[USAGE HISTORY] ❌ Rate limited IP: ${ip}`);

      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', retryAfter },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Remaining': '0'
          }
        }
      );
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const providers = searchParams.get('providers')?.split(',').filter(Boolean) || null;

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse date range
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 year ago
    const end = endDate ? new Date(endDate) : new Date();

    // Format dates for Supabase (YYYY-MM-DD)
    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];

    // ============================================================
    // FETCH DATA FROM NEW TABLES
    // ============================================================

    // 1. Get daily usage data from api_key_usage_daily for chart
    const { data: dailyUsage, error: dailyError } = await supabase
      .from('api_key_usage_daily')
      .select('*')
      .eq('user_id', user.id)
      .gte('usage_date', startDateStr)
      .lte('usage_date', endDateStr)
      .order('usage_date', { ascending: true });

    if (dailyError) {
      console.error('Error fetching daily usage:', dailyError);
    }

    // 2. Get aggregate provider stats from provider_usage
    const { data: providerStats, error: providerError } = await supabase
      .from('provider_usage')
      .select('*')
      .eq('user_id', user.id);

    if (providerError) {
      console.error('Error fetching provider stats:', providerError);
    }

    // 3. Get provider daily data for time-filtered breakdown (optional)
    let providerDailyData: any[] = [];
    if (providers && providers.length > 0) {
      const { data: providerDaily, error: providerDailyError } = await supabase
        .from('provider_usage_daily')
        .select('*')
        .eq('user_id', user.id)
        .in('provider', providers)
        .gte('usage_date', startDateStr)
        .lte('usage_date', endDateStr);

      if (providerDailyError) {
        console.error('Error fetching provider daily data:', providerDailyError);
      } else {
        providerDailyData = providerDaily || [];
      }
    }

    // 4. Get API keys for usage breakdown
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('api_keys')
      .select('id, name, key_value, created_at')
      .eq('user_id', user.id);

    if (apiKeysError) {
      console.error('Error fetching API keys:', apiKeysError);
    }

    // ============================================================
    // PROCESS DATA
    // ============================================================

    // Generate monthly data from daily usage
    const monthlyData = generateMonthlyDataFromDaily(dailyUsage || [], start, end);

    // Format provider breakdown
    const providerBreakdown = formatProviderBreakdown(providerStats || []);

    // Calculate current usage totals from daily data
    const activeDailyUsage = dailyUsage || [];
    const currentUsage = {
      totalRequests: activeDailyUsage.reduce((sum, day) => sum + (day.total_requests || 0), 0),
      successfulRequests: activeDailyUsage.reduce((sum, day) => sum + (day.successful_requests || 0), 0),
      failedRequests: activeDailyUsage.reduce((sum, day) => sum + (day.failed_requests || 0), 0),
      totalFileSize: activeDailyUsage.reduce((sum, day) => sum + (day.total_file_size || 0), 0),
      totalFilesUploaded: activeDailyUsage.reduce((sum, day) => sum + (day.total_files_uploaded || 0), 0),
      lastUsedAt: activeDailyUsage.length > 0
        ? activeDailyUsage[activeDailyUsage.length - 1].usage_date
        : null
    };

    // Calculate usage by API key
    const usageByKey = calculateUsageByKey(apiKeys || [], dailyUsage || []);

    // File type breakdown from provider_usage (file_type_counts field)
    const fileTypeBreakdown = extractFileTypeBreakdown(providerStats || []);

    const processingTime = Date.now() - startTime;

    // Return response with cache headers
    return NextResponse.json(
      {
        monthlyData,
        providerBreakdown,
        fileTypeBreakdown,
        currentUsage,
        usageByKey
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-Response-Time': `${processingTime}ms`
        }
      }
    );

  } catch (error) {
    console.error('Error in usage history API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Generate monthly data from daily usage records
 */
function generateMonthlyDataFromDaily(dailyUsage: any[], startDate: Date, endDate: Date) {
  const monthlyMap = new Map();
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // Initialize all months in the range
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    const monthLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        month: monthLabel,
        uploads: 0,
        bandwidth: 0,
        apiCalls: 0,
        successRate: 0,
        successfulRequests: 0
      });
    }

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Aggregate daily data into months
  dailyUsage.forEach(day => {
    const date = new Date(day.usage_date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

    if (monthlyMap.has(monthKey)) {
      const monthData = monthlyMap.get(monthKey);
      monthData.uploads += day.total_files_uploaded || 0;
      monthData.bandwidth += (day.total_file_size || 0) / (1024 * 1024); // Convert to MB
      monthData.apiCalls += day.total_requests || 0;
      monthData.successfulRequests += day.successful_requests || 0;
    }
  });

  // Calculate success rates
  monthlyMap.forEach((monthData) => {
    monthData.successRate = monthData.apiCalls > 0
      ? Math.round((monthData.successfulRequests / monthData.apiCalls) * 100)
      : 0;
    monthData.bandwidth = Math.round(monthData.bandwidth * 100) / 100;
  });

  // Convert to array and sort by date
  return Array.from(monthlyMap.entries())
    .map(([key, data]) => {
      const [year, month] = key.split('-');
      return {
        ...data,
        sortDate: new Date(parseInt(year), parseInt(month), 1)
      };
    })
    .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
    .map(({ sortDate, successfulRequests, ...data }) => data);
}

/**
 * Format provider breakdown from provider_usage table
 * Excludes 'vercel' provider as it has been removed
 */
function formatProviderBreakdown(providerStats: any[]) {
  if (!providerStats || providerStats.length === 0) {
    return [];
  }

  // Filter out vercel provider
  const filteredStats = providerStats.filter(p => p.provider !== 'vercel');
  
  const totalUploads = filteredStats.reduce((sum, p) => sum + (p.upload_count || 0), 0);

  return filteredStats.map(provider => ({
    id: provider.provider,
    label: getProviderLabel(provider.provider),
    value: provider.provider,
    percentage: totalUploads > 0 ? Math.round((provider.upload_count / totalUploads) * 100) : 0,
    detail: String(provider.upload_count || 0),
    count: provider.upload_count || 0,
    totalFileSize: provider.total_file_size || 0,
    averageFileSize: provider.average_file_size || 0,
    lastUsedAt: provider.last_used_at
  }));
}

/**
 * Extract file type breakdown from provider_usage file_type_counts
 * Excludes 'vercel' provider as it has been removed
 */
function extractFileTypeBreakdown(providerStats: any[]) {
  const fileTypeMap = new Map<string, number>();

  // Filter out vercel provider
  const filteredStats = providerStats.filter(p => p.provider !== 'vercel');

  filteredStats.forEach(provider => {
    if (provider.file_type_counts) {
      let counts = provider.file_type_counts;
      // Parse if it's a string
      if (typeof counts === 'string') {
        try {
          counts = JSON.parse(counts);
        } catch {
          return;
        }
      }

      // Aggregate file types across providers
      Object.entries(counts).forEach(([fileType, count]) => {
        const current = fileTypeMap.get(fileType) || 0;
        fileTypeMap.set(fileType, current + (count as number));
      });
    }
  });

  const totalFiles = Array.from(fileTypeMap.values()).reduce((sum, count) => sum + count, 0);

  return Array.from(fileTypeMap.entries()).map(([fileType, count]) => ({
    id: fileType,
    label: getFileTypeLabel(fileType),
    value: fileType,
    percentage: totalFiles > 0 ? Math.round((count / totalFiles) * 100) : 0,
    detail: String(count),
    count
  }));
}

/**
 * Calculate usage by API key from daily usage data
 */
function calculateUsageByKey(apiKeys: any[], dailyUsage: any[]) {
  // Group daily usage by api_key_id
  const usageByKeyId = new Map<string, { total: number; lastUsed: string | null }>();

  dailyUsage.forEach(day => {
    const keyId = day.api_key_id;
    const existing = usageByKeyId.get(keyId) || { total: 0, lastUsed: null };
    existing.total += day.total_requests || 0;
    if (!existing.lastUsed || day.usage_date > existing.lastUsed) {
      existing.lastUsed = day.usage_date;
    }
    usageByKeyId.set(keyId, existing);
  });

  // Map to API key details
  const activeKeyIds = new Set(apiKeys.map(k => k.id));
  const result: any[] = [];

  // Active keys
  apiKeys.forEach(key => {
    const usage = usageByKeyId.get(key.id) || { total: 0, lastUsed: null };
    result.push({
      id: key.id,
      name: key.name,
      key_value: key.key_value,
      usage: usage.total,
      last_used_at: usage.lastUsed
    });
  });

  // Deleted keys (usage exists but key doesn't)
  let deletedUsage = 0;
  let deletedLastUsed: string | null = null;
  usageByKeyId.forEach((usage, keyId) => {
    if (!activeKeyIds.has(keyId)) {
      deletedUsage += usage.total;
      if (!deletedLastUsed || (usage.lastUsed && usage.lastUsed > deletedLastUsed)) {
        deletedLastUsed = usage.lastUsed;
      }
    }
  });

  if (deletedUsage > 0) {
    result.push({
      id: 'deleted-keys',
      name: 'Deleted Keys',
      key_value: '...................',
      usage: deletedUsage,
      last_used_at: deletedLastUsed
    });
  }

  // Sort by usage descending
  result.sort((a, b) => b.usage - a.usage);

  return result;
}

/**
 * Get provider display label
 */
function getProviderLabel(provider: string): string {
  const labels: { [key: string]: string } = {
    'supabase': 'Supabase Storage',
    'uploadcare': 'Uploadcare',
    'r2': 'Cloudflare R2',
    's3': 'Amazon S3',
    'aws': 'AWS S3',
    'firebase': 'Firebase Storage'
    // Note: 'vercel' has been removed
  };
  return labels[provider] || provider.charAt(0).toUpperCase() + provider.slice(1);
}

/**
 * Get file type display label
 */
function getFileTypeLabel(fileType: string): string {
  const labels: { [key: string]: string } = {
    'image/jpeg': 'JPEG Images',
    'image/png': 'PNG Images',
    'image/gif': 'GIF Images',
    'image/webp': 'WebP Images',
    'application/pdf': 'PDF Documents',
    'text/plain': 'Text Files',
    'application/json': 'JSON Files',
    'text/csv': 'CSV Files',
    'video/mp4': 'MP4 Videos',
    'video/webm': 'WebM Videos',
    'audio/mp3': 'MP3 Audio',
    'audio/wav': 'WAV Audio'
  };
  return labels[fileType] || fileType;
}