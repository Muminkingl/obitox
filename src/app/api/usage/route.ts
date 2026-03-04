import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
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
        usage: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          totalFileSize: 0,
          totalFilesUploaded: 0,
          lastUsedAt: null
        },
        providerUsage: []
      });
    }

    // For now, let's get data for the first API key (you can modify this logic as needed)
    const apiKey = apiKeys[0];

    // Get provider usage data for this API key
    const { data: providerUsage, error: providerError } = await supabase
      .from('provider_usage')
      .select('*')
      .eq('api_key_id', apiKey.id)
      .order('provider');

    if (providerError) {
      console.error('Error fetching provider usage:', providerError);
      return NextResponse.json({ error: 'Failed to fetch provider usage' }, { status: 500 });
    }

    // Format the response
    const response = {
      usage: {
        totalRequests: apiKey.total_requests || 0,
        successfulRequests: apiKey.successful_requests || 0,
        failedRequests: apiKey.failed_requests || 0,
        totalFileSize: apiKey.total_file_size || 0,
        totalFilesUploaded: apiKey.total_files_uploaded || 0,
        lastUsedAt: apiKey.last_used_at
      },
      providerUsage: providerUsage || []
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in usage API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
