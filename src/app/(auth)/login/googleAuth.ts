'use server';

import { createClient } from '@/lib/supabase/server';
import { FormError } from '@/lib/utils';
import { headers } from 'next/headers';

export async function loginWithGoogle() {
  try {
    // Get headers asynchronously
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';
        
    // Create Supabase client
    const supabase = await createClient();
        
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error("OAuth error:", error);
      return FormError(error.message);
    }

    return { url: data.url };
  } catch (error) {
    console.error('Google login error:', error);
    return FormError('Failed to initiate Google sign-in');
  }
}