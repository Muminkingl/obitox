import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
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

// Generate a cryptographically secure random API key with "ox_" prefix
function generateApiKey(): string {
  try {
    // Generate 32 random bytes for stronger security (64 hex characters)
    const randomBytes = crypto.randomBytes(32);
    const apiKey = `ox_${randomBytes.toString('hex')}`;
    
    // Additional entropy check
    if (apiKey.length !== 67) { // ox_ + 64 hex chars
      throw new Error('Invalid API key length generated');
    }
    
    return apiKey;
  } catch (error) {
    throw new Error('Failed to generate secure API key');
  }
}

// Validate and sanitize API key name
function validateAndSanitizeName(name: any): string {
  if (!name || typeof name !== 'string') {
    throw new Error('API key name must be a string');
  }

  // Sanitize input to prevent XSS and other attacks
  let sanitizedName = name
    .trim() // Remove whitespace
    .replace(/[<>\"'&]/g, '') // Remove HTML/XML special characters to prevent XSS
    .replace(/[^\w\s\-_.]/g, '') // Only allow alphanumeric, spaces, hyphens, underscores, dots
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .slice(0, 30); // Limit to 30 characters

  // Validate sanitized name
  if (sanitizedName.length === 0) {
    throw new Error('API key name contains invalid characters or is empty');
  }

  if (sanitizedName.length < 3) {
    throw new Error('API key name must be at least 3 characters long');
  }

  if (sanitizedName.length > 30) {
    throw new Error('API key name must not exceed 30 characters');
  }

  // Additional validation patterns
  if (sanitizedName.startsWith(' ') || sanitizedName.endsWith(' ')) {
    sanitizedName = sanitizedName.trim();
  }

  // Prevent common SQL injection patterns (extra protection)
  const sqlInjectionPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /insert\s+into/i,
    /update\s+set/i,
    /exec\s*\(/i,
    /script\s*>/i,
    /javascript:/i,
    /vbscript:/i,
    /onload\s*=/i,
    /onerror\s*=/i
  ];

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(sanitizedName)) {
      throw new Error('Invalid characters detected in name');
    }
  }

  return sanitizedName;
}

// GET /api/apikeys - Get all API keys for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Validate user authentication
    const user = await validateRequest(supabase);

    // Add rate limiting check (optional - implement based on your needs)
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Get user's API keys with enhanced error handling
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key_value, created_at, last_used_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      // Handle specific error types
      if (error.code === 'PGRST301') {
        return createErrorResponse('No API keys found', 404);
      }
      
      return createErrorResponse('Failed to fetch API keys', 500);
    }

    if (!data) {
      return createResponse(true, { apiKeys: [] }, 'No API keys found');
    }

    // Mask the key values for security - show only first 7 characters and last 4
    const maskedData = data.map(key => ({
      ...key,
      key_value: `${key.key_value.substring(0, 7)}...${key.key_value.slice(-4)}` 
    }));

    // Return with correct response format for the frontend
    return NextResponse.json({ apiKeys: maskedData });

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}

// POST /api/apikeys - Create a new API key for the current user
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Validate user authentication
    const user = await validateRequest(supabase);

    // Strict content type validation to prevent CORS and other attacks
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.toLowerCase().startsWith('application/json')) {
      return createErrorResponse('Content-Type must be application/json', 415);
    }

    // Check content length to prevent large payload attacks
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024) { // 1KB limit
      return createErrorResponse('Request payload too large', 413);
    }

    // Check if the user can create more API keys based on their plan
    const { data: canCreate, error: limitError } = await supabase
      .rpc('can_create_api_key', { user_uuid: user.id });

    if (limitError) {
      return createErrorResponse('Failed to verify API key limits', 500);
    }

    if (!canCreate) {
      return createErrorResponse("You've reached the API key limit for your plan", 403);
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    const { name } = requestBody;

    // Enhanced input validation and sanitization
    let sanitizedName: string;
    try {
      sanitizedName = validateAndSanitizeName(name);
    } catch (validationError) {
      return createErrorResponse(
        validationError instanceof Error ? validationError.message : 'Invalid name provided',
        400
      );
    }

    // Check for duplicate names for this user
    const { data: existingKey } = await supabase
      .from('api_keys')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', sanitizedName)
      .single();

    if (existingKey) {
      return createErrorResponse('An API key with this name already exists', 409);
    }

    // Generate a new API key with enhanced security
    let apiKeyValue: string;
    try {
      apiKeyValue = generateApiKey();
    } catch (keyGenError) {
      return createErrorResponse('Failed to generate secure API key', 500);
    }

    // Insert the new API key with transaction-like behavior
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        name: sanitizedName,
        key_value: apiKeyValue
      })
      .select('id, name, created_at')
      .single();

    if (error) {
      // Handle specific database errors
      if (error.code === '23505') { // Unique constraint violation
        return createErrorResponse('An API key with this name already exists', 409);
      }
      
      if (error.code === '23503') { // Foreign key constraint violation
        return createErrorResponse('Invalid user reference', 400);
      }
      
      return createErrorResponse('Failed to create API key', 500);
    }

    if (!data) {
      return createErrorResponse('Failed to create API key', 500);
    }

    // Return the full API key value - it will only be shown once
    // Add cache control headers to prevent caching of sensitive data
    return createResponse(
      true,
      {
        apiKey: {
          ...data,
          key_value: apiKeyValue, // Return the full API key value (only on creation)
          fullKeyValue: apiKeyValue // Additional field with the full key value
        }
      },
      'API key created successfully',
      201
    );

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}