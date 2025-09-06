'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { FormError } from '@/lib/utils';
import { z } from 'zod';
import { Resend } from 'resend';
import { redirect } from 'next/navigation';

// Initialize Resend with correct API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Schema for signup form validation
const signupSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email using Resend
async function sendOTPEmail(email: string, firstname: string, otp: string): Promise<void> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Tailark <onboarding@resend.dev>',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Tailark, ${firstname}!</h2>
          <p>Thank you for signing up. To verify your email address, please use the following code:</p>
          <div style="background-color: #f4f4f4; padding: 12px; text-align: center; font-size: 24px; letter-spacing: 8px; font-weight: bold;">
            ${otp}
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't sign up for Tailark, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send verification email');
    }

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function signup(prevState: any, formData: FormData) {
  // Check if Resend API key is available
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return {
      type: 'error',
      message: 'Email service is not configured'
    };
  }

  const supabase = await createClient();
  const adminSupabase = createAdminClient();
  
  // Validate form data
  const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, firstname, lastname } = validatedFields.data;
  
  try {
    // First, check if user already exists in auth.users using the database function
    const { data: emailExists, error: checkError } = await supabase
      .rpc('email_exists_in_auth', { email_to_check: email });
    
    if (checkError) {
      console.error('Error checking existing user:', checkError);
      // Fallback: try to sign in with the email to check if it exists
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy_password_to_check_existence'
      });
      
      // If sign in fails with "Invalid login credentials", the user exists
      if (signInError && signInError.message.includes('Invalid login credentials')) {
        return {
          type: 'error',
          message: 'This email is already registered. If you signed up with Google, please use the Google login button instead.'
        };
      }
    } else if (emailExists) {
      return {
        type: 'error',
        message: 'This email is already registered. If you signed up with Google, please use the Google login button instead.'
      };
    }

    // Check if there's a pending user with this email first
    const { data: existingPendingUser } = await supabase
      .from('pending_users')
      .select('email')
      .eq('email', email)
      .single();
      
    if (existingPendingUser) {
      // Delete the existing pending user - they're starting over
      await supabase
        .from('pending_users')
        .delete()
        .eq('email', email);
    }

    // Generate OTP first
    const otp = generateOTP();
    
    // Try to insert into pending_users table
    const { data, error } = await supabase
      .from('pending_users')
      .insert({
        email,
        password_hash: password, // Store raw password temporarily for custom flow
        first_name: firstname,
        last_name: lastname,
        otp,
        otp_expires_at: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes expiry
      })
      .select();
    
    if (error) {
      console.error('Error storing pending user:', error);
      
      // Check if error is due to unique constraint or existing user
      if (error.code === '23505' || error.message?.includes('duplicate key') || 
          error.message?.includes('already exists') || error.message?.includes('already registered')) {
        return {
          type: 'error',
          message: 'This email is already registered. If you signed up with Google, please use the Google login button instead.'
        };
      }
      
      return {
        type: 'error',
        message: 'An error occurred during signup'
      };
    }

    // Send OTP email
    try {
      await sendOTPEmail(email, firstname, otp);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Clean up the pending user since we couldn't send the email
      await supabase
        .from('pending_users')
        .delete()
        .eq('email', email);
      
      return {
        type: 'error',
        message: 'Failed to send verification email. Please try again.'
      };
    }

    // Return success with redirect information - THIS SHOULD GO TO OTP PAGE
    return { 
      success: true, 
      redirectTo: `/otp?email=${encodeURIComponent(email)}&custom=true`
    };
  } catch (error) {
    console.error('Error during signup:', error);
    return {
      type: 'error',
      message: 'An error occurred during signup'
    };
  }
}