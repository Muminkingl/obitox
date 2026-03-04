import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const providers = searchParams.get('providers')?.split(',') || null;
    const fileTypes = searchParams.get('fileTypes')?.split(',') || null;
    
    console.log('Granular usage parameters:', { startDate, endDate, providers, fileTypes });
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's API keys
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id);

    if (apiKeysError) {
      console.error('Error fetching API keys:', apiKeysError);
      return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
    }

    if (!apiKeys || apiKeys.length === 0) {
      return NextResponse.json({ 
        monthlyData: [],
        providerBreakdown: [],
        fileTypeBreakdown: [],
        currentUsage: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          totalFileSize: 0,
          totalFilesUploaded: 0,
          lastUsedAt: null
        }
      });
    }

    // Get the most recently used API key
    const apiKey = apiKeys.sort((a, b) => {
      const aTime = new Date(a.last_used_at || 0).getTime();
      const bTime = new Date(b.last_used_at || 0).getTime();
      return bTime - aTime;
    })[0];

    // Parse date range
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 year ago
    const end = endDate ? new Date(endDate) : new Date();

    // Get usage data by date range using the new function
    const { data: usageData, error: usageError } = await supabase
      .rpc('get_usage_by_date_range', {
        p_api_key_id: apiKey.id,
        p_start_date: start.toISOString().split('T')[0],
        p_end_date: end.toISOString().split('T')[0],
        p_providers: providers,
        p_file_types: fileTypes
      });

    if (usageError) {
      console.error('Error fetching usage data:', usageError);
      return NextResponse.json({ error: 'Failed to fetch usage data' }, { status: 500 });
    }

    // Get provider breakdown
    const { data: providerBreakdown, error: providerError } = await supabase
      .rpc('get_provider_breakdown', {
        p_api_key_id: apiKey.id,
        p_start_date: start.toISOString().split('T')[0],
        p_end_date: end.toISOString().split('T')[0]
      });

    if (providerError) {
      console.error('Error fetching provider breakdown:', providerError);
    }

    // Get file type breakdown
    const { data: fileTypeBreakdown, error: fileTypeError } = await supabase
      .rpc('get_file_type_breakdown', {
        p_api_key_id: apiKey.id,
        p_start_date: start.toISOString().split('T')[0],
        p_end_date: end.toISOString().split('T')[0]
      });

    if (fileTypeError) {
      console.error('Error fetching file type breakdown:', fileTypeError);
    }

    // Generate monthly data from the granular data
    const monthlyData = generateMonthlyData(usageData || [], start, end);

    // Calculate current usage totals
    const currentUsage = {
      totalRequests: apiKey.total_requests || 0,
      successfulRequests: apiKey.successful_requests || 0,
      failedRequests: apiKey.failed_requests || 0,
      totalFileSize: apiKey.total_file_size || 0,
      totalFilesUploaded: apiKey.total_files_uploaded || 0,
      lastUsedAt: apiKey.last_used_at
    };

    // Format provider breakdown
    const formattedProviderBreakdown = (providerBreakdown || []).map(provider => ({
      id: provider.provider,
      label: getProviderLabel(provider.provider),
      value: provider.provider,
      percentage: provider.percentage,
      detail: provider.total_uploads.toString(),
      totalFileSize: provider.total_file_size,
      averageFileSize: provider.total_file_size / Math.max(provider.total_uploads, 1),
      lastUsedAt: provider.last_used_at
    }));

    // Format file type breakdown
    const formattedFileTypeBreakdown = (fileTypeBreakdown || []).map(fileType => ({
      id: fileType.file_type,
      label: getFileTypeLabel(fileType.file_type),
      value: fileType.file_type,
      percentage: fileType.percentage,
      detail: fileType.total_uploads.toString(),
      count: fileType.total_uploads
    }));

    return NextResponse.json({
      monthlyData,
      providerBreakdown: formattedProviderBreakdown,
      fileTypeBreakdown: formattedFileTypeBreakdown,
      currentUsage
    });

  } catch (error) {
    console.error('Error in granular usage API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateMonthlyData(usageData: any[], startDate: Date, endDate: Date) {
  const monthlyData: any[] = [];
  const currentDate = new Date(startDate);
  
  // Group data by month
  const monthlyGroups: { [key: string]: any[] } = {};
  
  usageData.forEach(record => {
    const monthKey = new Date(record.usage_date).toISOString().substring(0, 7); // YYYY-MM
    if (!monthlyGroups[monthKey]) {
      monthlyGroups[monthKey] = [];
    }
    monthlyGroups[monthKey].push(record);
  });

  // Generate data for each month
  while (currentDate <= endDate) {
    const monthKey = currentDate.toISOString().substring(0, 7);
    const monthData = monthlyGroups[monthKey] || [];
    
    // Calculate totals for this month
    const totalUploads = monthData.reduce((sum, record) => sum + (record.total_uploads || 0), 0);
    const totalFileSize = monthData.reduce((sum, record) => sum + (record.total_file_size || 0), 0);
    const totalRequests = monthData.reduce((sum, record) => sum + (record.successful_requests || 0) + (record.failed_requests || 0), 0);
    const successfulRequests = monthData.reduce((sum, record) => sum + (record.successful_requests || 0), 0);
    
    // Group by provider
    const providers: { [key: string]: number } = {};
    monthData.forEach(record => {
      if (!providers[record.provider]) {
        providers[record.provider] = 0;
      }
      providers[record.provider] += record.total_uploads || 0;
    });

    // Group by file type
    const fileTypes: { [key: string]: number } = {};
    monthData.forEach(record => {
      if (!fileTypes[record.file_type]) {
        fileTypes[record.file_type] = 0;
      }
      fileTypes[record.file_type] += record.total_uploads || 0;
    });

    monthlyData.push({
      month: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      uploads: totalUploads,
      bandwidth: totalFileSize / (1024 * 1024 * 1024), // Convert to GB
      apiCalls: totalRequests,
      successRate: totalRequests > 0 ? Math.round((successfulRequests / totalRequests) * 100) : 0,
      providers,
      fileTypes
    });

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return monthlyData;
}

function getProviderLabel(provider: string): string {
  const labels: { [key: string]: string } = {
    'supabase': 'Supabase Storage',
    'uploadcare': 'Uploadcare',
    'vercel': 'Vercel Blob'
  };
  return labels[provider] || provider;
}

function getFileTypeLabel(fileType: string): string {
  const labels: { [key: string]: string } = {
    'image/jpeg': 'JPEG Images',
    'image/png': 'PNG Images',
    'image/gif': 'GIF Images',
    'application/pdf': 'PDF Documents',
    'text/plain': 'Text Files',
    'video/mp4': 'MP4 Videos',
    'audio/mp3': 'MP3 Audio'
  };
  return labels[fileType] || fileType;
}
