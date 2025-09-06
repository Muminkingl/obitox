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

    // Get provider usage for all API keys
    let allProviderUsage = [];
    if (apiKeys && apiKeys.length > 0) {
      for (const apiKey of apiKeys) {
        const { data: providerUsage, error: providerError } = await supabase
          .from('provider_usage')
          .select('*')
          .eq('api_key_id', apiKey.id);
        
        if (!providerError && providerUsage) {
          allProviderUsage.push(...providerUsage);
        }
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email
      },
      apiKeys: apiKeys || [],
      providerUsage: allProviderUsage,
      totalApiKeys: apiKeys?.length || 0,
      totalProviderUsage: allProviderUsage.length
    });
  } catch (error) {
    console.error('Error in debug API:', error);
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
  }
}
