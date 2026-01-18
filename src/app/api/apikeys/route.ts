import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { apiRateLimit } from '@/lib/rate-limit';

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
  const startTime = Date.now();

  try {
    // 1. Rate limiting (100 requests per minute)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '::1';

    const rateLimitResult = await apiRateLimit.check(ip);

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);

      console.log(`[API KEYS] ❌ Rate limited IP: ${ip}`);

      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', retryAfter },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Remaining': '0'
          }
        }
      );
    }

    const supabase = await createClient();

    // Validate user authentication
    const user = await validateRequest(supabase);

    // 2. Optimized query - only select needed columns, with limit
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key_value, created_at, last_used_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100); // Prevent fetching thousands of keys

    if (error) {
      console.error('[API KEYS] Query error:', error);

      // Handle specific error types
      if (error.code === 'PGRST301') {
        return createErrorResponse('No API keys found', 404);
      }

      return createErrorResponse('Failed to fetch API keys', 500);
    }

    if (!data) {
      return NextResponse.json({ apiKeys: [] });
    }

    // Mask the key values for security - show only first 7 characters and last 4
    const maskedData = data.map(key => ({
      ...key,
      key_value: `${key.key_value.substring(0, 7)}...${key.key_value.slice(-4)}`
    }));

    const processingTime = Date.now() - startTime;

    console.log(`[API KEYS] ✅ Fetched ${maskedData.length} keys in ${processingTime}ms`);

    // 3. Return with cache + rate limit headers
    return NextResponse.json(
      { apiKeys: maskedData },
      {
        headers: {
          // Cache for 30 seconds, allow stale for 60 seconds
          'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
          // Rate limit info
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          // Performance metrics
          'X-Response-Time': `${processingTime}ms`,
          // Security headers
          'X-Content-Type-Options': 'nosniff'
        }
      }
    );

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }

    console.error('[API KEYS] Internal error:', error);
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

    // 🚫 CHECK FOR PERMANENT BAN - CRITICAL SECURITY
    const { data: permanentBan } = await supabase
      .from('permanent_bans')
      .select('reason, banned_at')
      .eq('user_id', user.id)
      .single();

    if (permanentBan) {
      return NextResponse.json({
        success: false,
        error: 'ACCOUNT_PERMANENTLY_BANNED',
        message: 'Your account has been permanently banned from using this API',
        ban: {
          reason: permanentBan.reason,
          bannedAt: permanentBan.banned_at
        }
      }, { status: 403 });
    }

    // Check API key limit using subscription library
    const { getApiKeyLimit, getRemainingApiKeys } = await import('@/lib/subscription');

    const limit = await getApiKeyLimit(user.id);
    const remaining = await getRemainingApiKeys(user.id);

    if (remaining <= 0) {
      return createErrorResponse(
        `API key limit reached. You can create up to ${limit} API keys on your current plan.`,
        403
      );
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    const { name, challenge, solution } = requestBody;

    // 🔐 VERIFY PROOF-OF-WORK (CRITICAL SECURITY)
    if (!challenge || !solution) {
      return createErrorResponse('Missing PoW challenge or solution', 400);
    }

    try {
      // Fetch stored challenge from Redis
      const { getRedisClient } = await import('@/lib/rate-limiting/redis-client');
      const redis = getRedisClient();

      const challengeKey = `pow_challenge:${user.id}`;
      const storedData = await redis.get(challengeKey);

      if (!storedData) {
        return createErrorResponse('Invalid or expired challenge. Please request a new challenge.', 400);
      }

      const { challenge: storedChallenge, difficulty } = JSON.parse(storedData);

      // Verify challenge matches
      if (storedChallenge !== challenge) {
        return createErrorResponse('Challenge mismatch', 400);
      }

      // Verify PoW solution (hash must start with 'difficulty' leading zeros)
      // Frontend solves: hash(challenge + nonce), so verify: hash(challenge + solution)
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256').update(storedChallenge + String(solution)).digest('hex');
      const requiredPrefix = '0'.repeat(difficulty);

      if (!hash.startsWith(requiredPrefix)) {
        return createErrorResponse('Invalid PoW solution', 400);
      }

      // ✅ PoW verified! Delete challenge (one-time use)
      await redis.del(challengeKey);

    } catch (powError) {
      console.error('[POW VERIFICATION] Error:', powError);
      return createErrorResponse('PoW verification failed', 500);
    }

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

    // --- LAYER 2 SECURITY: Dual Key Generation ---

    // 1. Generate Public Key (ox_...) - Used for identification
    const publicKeyBytes = crypto.randomBytes(24).toString('hex');
    const apiKey = `ox_${publicKeyBytes}`;

    // 2. Generate Secret Key (sk_...) - Used for signing (NEVER STORED PLAIN)
    const secretKeyBytes = crypto.randomBytes(32).toString('hex');
    const apiSecret = `sk_${secretKeyBytes}`;

    // 3. Hash the secret (SHA-256)
    const secretHash = crypto
      .createHash('sha256')
      .update(apiSecret)
      .digest('hex');

    // Insert into database
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        name: sanitizedName,
        key_value: apiKey,       // Public Key
        secret_hash: secretHash, // Hashed Secret
        created_at: new Date().toISOString(),
        last_used_at: null,
      })
      .select('id, name, created_at, key_value')
      .single();

    if (error) {
      if (error.code === '23505') {
        return createErrorResponse('An API key with this name already exists', 409);
      }
      if (error.code === '23503') {
        return createErrorResponse('Invalid user reference', 400);
      }
      return createErrorResponse('Failed to create API key', 500);
    }

    if (!data) {
      return createErrorResponse('Failed to create API key', 500);
    }

    // 📝 LOG AUDIT EVENT: API Key Created
    try {
      const { logAuditEvent, maskApiKey } = await import('@/lib/audit-logger');
      await logAuditEvent({
        userId: user.id,
        eventType: 'api_key_created',
        resourceType: 'api_key',
        resourceId: data.id,
        description: `Created API key "${sanitizedName}"`,
        metadata: {
          key_name: sanitizedName,
          key_prefix: maskApiKey(data.key_value),
          created_at: data.created_at,
        },
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      });
    } catch (auditError) {
      console.error('[AUDIT LOG] Failed to log api_key_created:', auditError);
    }

    // Return keys to user (THIS IS THE ONLY TIME SECRET IS SHOWN)
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        created_at: data.created_at,
        apiKey: data.key_value, // Public Key
        apiSecret: apiSecret,   // Secret Key (Plaintext, shown ONCE)
        warning: 'SAVE THESE KEYS! Secret key will never be shown again.'
      }
    }, { status: 201 });

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }
    return createErrorResponse('Internal server error', 500);
  }
}
