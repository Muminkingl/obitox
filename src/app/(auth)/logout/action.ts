'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function logout() {
  const supabase = await createClient();
  
  try {
    // Sign the user out
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error during logout:', error);
  }

  // Redirect to the login page after logout
  redirect('/login');
}

