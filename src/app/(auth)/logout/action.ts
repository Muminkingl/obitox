'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function logout() {
  const supabase = await createClient();

  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('[Logout] Error:', error);
  }

  redirect('/login');
}
