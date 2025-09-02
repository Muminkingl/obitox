'use server';

import { createClient } from '@/lib/supabase/server';
import { FormError } from '@/lib/utils';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';

// Initialize Resend with correct API key
const resend = new Resend(process.env.RESEND_API_KEY);

const OTPSchema = z.object({
  code: z.string().min(6, 'OTP must be 6 digits'),
  email: z.string().email('Invalid email address'),
  custom: z.string().optional(),
});

// Generate a new 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email using Resend
async function sendOTPEmail(email: string, firstname: string, otp: string): Promise<void> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Tailark <noreply@tailark.com>',
      to: email,
      subject: 'Your New Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${firstname},</h2>
          <p>You requested a new verification code. Please use the following code:</p>
          <div style="background-color: #f4f4f4; padding: 12px; text-align: center; font-size: 24px; letter-spacing: 8px; font-weight: bold;">
            ${otp}
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
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

// Verify OTP submission
export async function verifyOTP(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const validatedFields = OTPSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { code, email, custom } = validatedFields.data;
  const isCustomFlow = custom === 'true';

  try {
    if (isCustomFlow) {
      // Custom flow - check OTP in pending_users table
      const { data: pendingUser, error: pendingUserError } = await supabase
        .from('pending_users')
        .select('*')
        .eq('email', email)
        .eq('otp', code)
        .single();

      if (pendingUserError || !pendingUser) {
        return FormError('Invalid or expired verification code');
      }

      // Check if OTP is expired
      const now = new Date();
      const expiresAt = new Date(pendingUser.otp_expires_at);
      
      if (now > expiresAt) {
        return FormError('Verification code has expired');
      }

      // Create user using Supabase Auth - handle provider conflicts properly
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: pendingUser.email,
        password: pendingUser.password_hash,
        options: {
          data: {
            first_name: pendingUser.first_name,
            last_name: pendingUser.last_name,
          },
          emailRedirectTo: undefined,
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        
        // Handle specific error scenarios
        if (signUpError.message?.includes('already registered') || 
            signUpError.message?.includes('already exists') ||
            signUpError.message?.includes('User already registered')) {
          
          // Check if the existing user was created via OAuth (Google)
          // If so, we should not allow email/password signup for the same email
          return FormError('This email is already registered with a different method (Google login). Please use Google to sign in instead.');
        } else {
          return FormError('Failed to create account: ' + signUpError.message);
        }
      }

      console.log('User created successfully:', authData);

      // Don't try to sign in the user - just clean up and redirect to login

      // Clean up pending user after successful creation/signin
      await supabase
        .from('pending_users')
        .delete()
        .eq('email', email);

      // Return success and redirect to login with success message
      return { 
        success: true, 
        message: 'Account created successfully! Please sign in with your credentials.',
        redirectTo: '/login?success=account_created' 
      };
    } else {
      // Original flow - check OTP in user_otps table
      const { data: otpData, error: otpError } = await supabase
        .from('user_otps')
        .select('*')
        .eq('email', email)
        .eq('otp', code)
        .single();

      if (otpError || !otpData) {
        return FormError('Invalid or expired verification code');
      }

      // Check if OTP is expired
      const now = new Date();
      const expiresAt = new Date(otpData.expires_at);
      
      if (now > expiresAt) {
        return FormError('Verification code has expired');
      }

      // Get user data to update email_confirmed_at
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData && userData.user) {
        // Mark email as verified in auth metadata
        await supabase.auth.updateUser({
          data: {
            email_confirmed_at: new Date().toISOString(),
          },
        });
        
        // Clean up used OTP
        await supabase
          .from('user_otps')
          .delete()
          .eq('email', email);
        
        // Return success instead of redirect - let client handle redirect
        return { 
          success: true, 
          message: 'Email verified successfully!',
          redirectTo: '/dashboard/usage' 
        };
      } else {
        return FormError('User not found');
      }
    }
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return FormError('An error occurred during verification');
  }
}

// Resend OTP action
export async function resendOTP(email: string, custom: string = 'false') {
  const supabase = await createClient();
  const isCustomFlow = custom === 'true';
  
  try {
    if (isCustomFlow) {
      // Get pending user information
      const { data: pendingUser, error: pendingUserError } = await supabase
        .from('pending_users')
        .select('*')
        .eq('email', email)
        .single();
        
      if (pendingUserError || !pendingUser) {
        return FormError('User not found');
      }
      
      // Generate new OTP
      const otp = generateOTP();
      
      // Update OTP and expiry
      await supabase
        .from('pending_users')
        .update({
          otp,
          otp_expires_at: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes expiry
        })
        .eq('email', email);
      
      // Send new OTP email
      await sendOTPEmail(email, pendingUser.first_name, otp);
    } else {
      // Original flow
      // Get user information
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData || !userData.user) {
        return FormError('User not found');
      }
      
      const firstName = userData.user.user_metadata?.first_name || 'User';
      
      // Generate new OTP
      const otp = generateOTP();
      
      // Delete existing OTPs for this email
      await supabase
        .from('user_otps')
        .delete()
        .eq('email', email);
      
      // Insert new OTP
      await supabase
        .from('user_otps')
        .insert({
          email,
          otp,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes expiry
        });
      
      // Send new OTP email
      await sendOTPEmail(email, firstName, otp);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error resending OTP:', error);
    return FormError('Failed to resend verification code');
  }
}