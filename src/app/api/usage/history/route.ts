import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const providers = searchParams.get('providers')?.split(',').filter(Boolean) || null;
    const fileTypes = searchParams.get('fileTypes')?.split(',').filter(Boolean) || null;
    
    // Usage parameters
    
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
        currentUsage: defaultCurrentUsage
      });
    }

    // Get all API key IDs for the user
    const apiKeyIds = apiKeys.map(key => key.id);

    // Parse date range
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 year ago
    const end = endDate ? new Date(endDate) : new Date();


    // Build the file uploads query with all filters
    let fileUploadsQuery = supabase
      .from('file_uploads')
      .select('*')
      .in('api_key_id', apiKeyIds)
      .gte('uploaded_at', start.toISOString())
      .lte('uploaded_at', end.toISOString());

    // Apply provider filter
    if (providers && providers.length > 0) {
      fileUploadsQuery = fileUploadsQuery.in('provider', providers);
    }

    // Apply file type filter
    if (fileTypes && fileTypes.length > 0) {
      fileUploadsQuery = fileUploadsQuery.in('file_type', fileTypes);
    }

    const { data: fileUploads, error: uploadsError } = await fileUploadsQuery;

    if (uploadsError) {
      console.error('Error fetching file uploads:', uploadsError);
      return NextResponse.json({ error: 'Failed to fetch file uploads' }, { status: 500 });
    }


    // If no uploads found, return empty data
    if (!fileUploads || fileUploads.length === 0) {
      return NextResponse.json({
        monthlyData: [],
        providerBreakdown: [],
        fileTypeBreakdown: [],
        currentUsage: defaultCurrentUsage
      });
    }

     // Get provider breakdown from file uploads
     // Always include all providers even if there are no uploads in the date range
     const allProviders = ['supabase', 'uploadcare', 'vercel'];
     const providerBreakdown = fileUploads.length > 0 
       ? getProviderBreakdown(fileUploads) 
       : allProviders.map(provider => ({
           id: provider,
           label: getProviderLabel(provider),
           value: provider,
           percentage: 0,
           detail: '0',
           count: 0,
           totalFileSize: 0,
           averageFileSize: 0,
           successRate: 0,
           lastUsedAt: null
         }));

     // Get file type breakdown from file uploads
     // Always include common file types even if they're not in the current uploads
     // First get actual file types from uploads
     const uploadedFileTypes = fileUploads.length > 0
       ? [...new Set(fileUploads.map(upload => upload.file_type))]
       : [];
     
     // Add default file types if they don't exist in uploads
     const defaultFileTypes = ['image/jpeg', 'application/pdf', 'text/plain', 'video/mp4'];
     const allFileTypes = [...new Set([...uploadedFileTypes, ...defaultFileTypes])];
     
     // Get file type breakdown with actual data
     const actualFileTypeBreakdown = getFileTypeBreakdown(fileUploads);
     
     // Make sure all default file types are included
     const fileTypeBreakdown = allFileTypes.map(fileType => {
       const existing = actualFileTypeBreakdown.find(ft => ft.id === fileType);
       if (existing) return existing;
       
       return {
         id: fileType,
         label: getFileTypeLabel(fileType),
         value: fileType,
         percentage: 0,
         detail: '0',
         count: 0,
         totalFileSize: 0,
         averageFileSize: 0,
         lastUsedAt: null
       };
     });

    // Generate monthly data from file uploads
    // Always generate monthly data points even if there are no uploads
    const monthlyData = generateMonthlyDataFromUploads(fileUploads, start, end);

    // Calculate current usage from all file uploads (not just filtered ones)
    // Get all file uploads for current usage calculation
    const { data: allUploads, error: allUploadsError } = await supabase
      .from('file_uploads')
      .select('file_size, upload_status, uploaded_at')
      .in('api_key_id', apiKeyIds);

    const currentUsage = {
      totalRequests: allUploads?.length || 0,
      successfulRequests: allUploads?.filter(upload => upload.upload_status === 'success').length || 0,
      failedRequests: allUploads?.filter(upload => upload.upload_status !== 'success').length || 0,
      totalFileSize: allUploads?.reduce((sum, upload) => sum + (upload.file_size || 0), 0) || 0,
      totalFilesUploaded: allUploads?.length || 0,
      lastUsedAt: allUploads && allUploads.length > 0 
        ? allUploads.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())[0].uploaded_at
        : null
    };


    return NextResponse.json({
      monthlyData,
      providerBreakdown,
      fileTypeBreakdown,
      currentUsage
    });

  } catch (error) {
    console.error('Error in usage history API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to get provider breakdown from file uploads
function getProviderBreakdown(fileUploads: any[]) {
  const providerMap = new Map();
  
  fileUploads.forEach(upload => {
    const provider = upload.provider;
    if (!providerMap.has(provider)) {
      providerMap.set(provider, {
        provider,
        upload_count: 0,
        total_file_size: 0,
        successful_uploads: 0,
        failed_uploads: 0,
        uploads: []
      });
    }
    
    const providerData = providerMap.get(provider);
    providerData.upload_count++;
    providerData.total_file_size += upload.file_size || 0;
    providerData.uploads.push(upload);
    
    if (upload.upload_status === 'success') {
      providerData.successful_uploads++;
    } else {
      providerData.failed_uploads++;
    }
  });

  const totalUploads = fileUploads.length;
  
  return Array.from(providerMap.values()).map(provider => ({
    id: provider.provider,
    label: getProviderLabel(provider.provider),
    value: provider.provider,
    percentage: totalUploads > 0 ? Math.round((provider.upload_count / totalUploads) * 100) : 0,
    detail: provider.upload_count.toString(),
    count: provider.upload_count,
    totalFileSize: provider.total_file_size,
    averageFileSize: provider.upload_count > 0 ? Math.round(provider.total_file_size / provider.upload_count) : 0,
    successRate: provider.upload_count > 0 ? Math.round((provider.successful_uploads / provider.upload_count) * 100) : 0,
    lastUsedAt: provider.uploads
      .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())[0]?.uploaded_at || null
  }));
}

// Helper function to get file type breakdown from file uploads
function getFileTypeBreakdown(fileUploads: any[]) {
  const fileTypeMap = new Map();
  
  fileUploads.forEach(upload => {
    const fileType = upload.file_type;
    if (!fileTypeMap.has(fileType)) {
      fileTypeMap.set(fileType, {
        file_type: fileType,
        upload_count: 0,
        total_file_size: 0,
        uploads: []
      });
    }
    
    const fileTypeData = fileTypeMap.get(fileType);
    fileTypeData.upload_count++;
    fileTypeData.total_file_size += upload.file_size || 0;
    fileTypeData.uploads.push(upload);
  });

  const totalUploads = fileUploads.length;
  
  return Array.from(fileTypeMap.values()).map(fileType => ({
    id: fileType.file_type,
    label: getFileTypeLabel(fileType.file_type),
    value: fileType.file_type,
    percentage: totalUploads > 0 ? Math.round((fileType.upload_count / totalUploads) * 100) : 0,
    detail: fileType.upload_count.toString(),
    count: fileType.upload_count,
    totalFileSize: fileType.total_file_size,
    averageFileSize: fileType.upload_count > 0 ? Math.round(fileType.total_file_size / fileType.upload_count) : 0,
    lastUsedAt: fileType.uploads
      .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())[0]?.uploaded_at || null
  }));
}

// Helper function to generate monthly data from file uploads
function generateMonthlyDataFromUploads(fileUploads: any[], startDate: Date, endDate: Date) {
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
        providers: {},
        fileTypes: {},
        successfulUploads: 0
      });
    }
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  // Group uploads by month
  fileUploads.forEach(upload => {
    const uploadDate = new Date(upload.uploaded_at);
    const monthKey = `${uploadDate.getFullYear()}-${uploadDate.getMonth()}`;
    
    if (monthlyMap.has(monthKey)) {
      const monthData = monthlyMap.get(monthKey);
      monthData.uploads++;
      monthData.bandwidth += (upload.file_size || 0) / (1024 * 1024); // Convert to MB (not GB)
      monthData.apiCalls++;
      
      if (upload.upload_status === 'success') {
        monthData.successfulUploads++;
      }
      
      // Track provider usage
      if (!monthData.providers[upload.provider]) {
        monthData.providers[upload.provider] = 0;
      }
      monthData.providers[upload.provider]++;
      
      // Track file type usage
      if (!monthData.fileTypes[upload.file_type]) {
        monthData.fileTypes[upload.file_type] = 0;
      }
      monthData.fileTypes[upload.file_type]++;
    }
  });

  // Calculate success rates and format data
  monthlyMap.forEach((monthData) => {
    monthData.successRate = monthData.apiCalls > 0 ? Math.round((monthData.successfulUploads / monthData.apiCalls) * 100) : 0;
    monthData.bandwidth = Math.round(monthData.bandwidth * 100) / 100; // Round to 2 decimal places
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
    .map(({ sortDate, ...data }) => data);
}

// Helper function to get provider label
function getProviderLabel(provider: string): string {
  const labels: { [key: string]: string } = {
    'supabase': 'Supabase Storage',
    'uploadcare': 'Uploadcare',
    'vercel': 'Vercel Blob',
    'aws': 'AWS S3',
    'firebase': 'Firebase Storage'
  };
  return labels[provider] || provider.charAt(0).toUpperCase() + provider.slice(1);
}

// Helper function to get file type label
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