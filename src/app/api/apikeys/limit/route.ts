import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getRemainingApiKeys, getApiKeyLimit } from '@/lib/subscription';
import crypto from 'crypto';

// Helper function for request validation
async function validateRequest(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

// Helper function for standardized responses with security headers
function createResponse(success: boolean, data?: any, message?: string, status: number = 200) {
  const response = NextResponse.json({
    success,
    data: data || null,
    message: message || null
  }, { status });

  // Add security headers to prevent various attacks
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "default-src 'self'");
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  
  return response;
}

// Helper function for error responses with security headers
function createErrorResponse(message: string, status: number) {
  const response = NextResponse.json({
    success: false,
    data: null,
    error: message
  }, { status });

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "default-src 'self'");
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

  return response;
}

// Validate user ID format for security
function validateUserId(userId: string): boolean {
  // Assuming UUID format for user IDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
}

// GET /api/apikeys/limit - Get the API key limit and remaining keys for the user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Validate user authentication
    const user = await validateRequest(supabase);

    // Validate user ID format for security
    if (!validateUserId(user.id)) {
      return createErrorResponse('Invalid user authentication', 400);
    }

    // Validate request method (extra security)
    if (request.method !== 'GET') {
      return createErrorResponse('Method not allowed', 405);
    }

    // Get API key limits with enhanced error handling
    let limit: number;
    let remaining: number;

    try {
      limit = await getApiKeyLimit(user.id);
      
      // Validate limit is a positive number
      if (typeof limit !== 'number' || limit < 0 || !Number.isInteger(limit)) {
        throw new Error('Invalid API key limit returned');
      }
    } catch (limitError) {
      return createErrorResponse('Failed to retrieve API key limit', 500);
    }

    try {
      remaining = await getRemainingApiKeys(user.id);
      
      // Validate remaining is a non-negative number
      if (typeof remaining !== 'number' || remaining < 0 || !Number.isInteger(remaining)) {
        throw new Error('Invalid remaining API keys count returned');
      }
    } catch (remainingError) {
      return createErrorResponse('Failed to retrieve remaining API keys', 500);
    }

    // Validate that remaining doesn't exceed limit (data consistency check)
    if (remaining > limit) {
      // Log for monitoring but don't fail the request
      remaining = limit;
    }

    const used = limit - remaining;

    // Ensure used is not negative (additional data consistency check)
    const safeUsed = Math.max(0, used);
    const safeRemaining = Math.max(0, remaining);

    // Return with correct format for the frontend
    return NextResponse.json({
      limit,
      remaining: safeRemaining,
      used: safeUsed
    });

  } catch (error) {
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message === 'Unauthorized') {
        return createErrorResponse('Unauthorized', 401);
      }
      
      if (error.message.includes('Invalid user')) {
        return createErrorResponse('Invalid user authentication', 400);
      }
      
      if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        return createErrorResponse('Service temporarily unavailable', 503);
      }
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}

// OPTIONS method for CORS preflight (if needed)
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  
  // Add CORS headers if needed
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}