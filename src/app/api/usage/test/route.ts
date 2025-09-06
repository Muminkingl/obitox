import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all API keys for this user
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id);

    if (apiKeysError) {
      return NextResponse.json({ error: 'Failed to fetch API keys', details: apiKeysError }, { status: 500 });
    }

    // Get the most recently used API key
    const apiKey = apiKeys?.sort((a, b) => {
      const aTime = new Date(a.last_used_at || 0).getTime();
      const bTime = new Date(b.last_used_at || 0).getTime();
      
      if (aTime !== bTime) {
        return bTime - aTime;
      }
      
      return (b.total_requests || 0) - (a.total_requests || 0);
    })[0];

    // Get provider usage for this API key
    const { data: providerUsage, error: providerError } = await supabase
      .from('provider_usage')
      .select('*')
      .eq('api_key_id', apiKey?.id)
      .order('provider');

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email
      },
      selectedApiKey: apiKey,
      providerUsage: providerUsage || [],
      totalApiKeys: apiKeys?.length || 0,
      expectedData: {
        totalFiles: 74, // From your Vercel data
        vercelUploads: 74,
        supabaseUploads: 36,
        uploadcareUploads: 33
      }
    });
  } catch (error) {
    console.error('Error in test API:', error);
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
  }
}
