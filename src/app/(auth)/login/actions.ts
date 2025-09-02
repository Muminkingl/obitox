'use server';

import { createClient } from '@/lib/supabase/server';
import { FormError } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // Try to sign in with email and password
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Login error:', signInError);
      
      // Handle different types of login errors
      if (signInError.message?.includes('Invalid login credentials')) {
        return FormError('Invalid email or password. Please check your credentials and try again.');
      } else if (signInError.message?.includes('Email not confirmed')) {
        return FormError('Please verify your email address before signing in.');
      } else if (signInError.message?.includes('Too many requests')) {
        return FormError('Too many login attempts. Please wait a moment and try again.');
      } else {
        return FormError('Unable to sign in. Please try again.');
      }
    }

    // Check if user signed in successfully
    if (signInData.user && signInData.session) {
      console.log('User signed in successfully:', signInData.user.email);
      
      // Return success response instead of redirect - let client handle it
      return {
        success: true,
        message: 'Signed in successfully!',
        redirectTo: '/dashboard/usage'
      };
    } else {
      return FormError('Sign in failed. Please try again.');
    }

  } catch (error) {
    console.error('Unexpected login error:', error);
    return FormError('An unexpected error occurred. Please try again.');
  }
}