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

  return response;
}

// DELETE /api/apikeys/:id - Delete an API key
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const requestId = crypto.randomUUID();

  try {
    const supabase = await createClient();

    // Validate user authentication
    const user = await validateRequest(supabase);

    // Next.js 15: Await params before accessing properties
    const params = await context.params;
    const id = params.id;

    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return createErrorResponse('API key ID is required and must be valid', 400);
    }

    // Sanitize ID parameter - should be UUID format for better security
    const sanitizedId = id.trim();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(sanitizedId)) {
      return createErrorResponse('Invalid API key ID format', 400);
    }

    // Fetch key details before deletion for audit log
    const { data: keyToDelete } = await supabase
      .from('api_keys')
      .select('id, name, key_value')
      .eq('id', sanitizedId)
      .eq('user_id', user.id)
      .single();

    if (!keyToDelete) {
      return createErrorResponse('API key not found or access denied', 404);
    }

    // Delete the API key (RLS will ensure the user can only delete their own keys)
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', sanitizedId)
      .eq('user_id', user.id);

    if (error) {
      // Handle specific error types
      if (error.code === 'PGRST116') {
        return createErrorResponse('API key not found or access denied', 404);
      }

      return createErrorResponse('Failed to delete API key', 500);
    }

    // 📝 LOG AUDIT EVENT: API Key Deleted
    try {
      const { logAuditEvent, maskApiKey } = await import('@/lib/audit-logger');
      await logAuditEvent({
        userId: user.id,
        eventType: 'api_key_deleted',
        resourceType: 'api_key',
        resourceId: keyToDelete.id,
        description: `Deleted API key "${keyToDelete.name}"`,
        metadata: {
          key_name: keyToDelete.name,
          key_prefix: maskApiKey(keyToDelete.key_value),
          deleted_at: new Date().toISOString(),
        },
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      });
    } catch (auditError) {
      console.error('[AUDIT LOG] Failed to log api_key_deleted:', auditError);
    }

    return createResponse(true, null, 'API key deleted successfully');

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }

    return createErrorResponse('Internal server error', 500);
  }
}

// PATCH /api/apikeys/:id - Update an API key (name only)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const requestId = crypto.randomUUID();

  try {
    const supabase = await createClient();

    // Validate user authentication
    const user = await validateRequest(supabase);

    // Next.js 15: Await params before accessing properties
    const params = await context.params;
    const id = params.id;

    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return createErrorResponse('API key ID is required and must be valid', 400);
    }

    // Sanitize ID parameter - should be UUID format for better security
    const sanitizedId = id.trim();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(sanitizedId)) {
      return createErrorResponse('Invalid API key ID format', 400);
    }

    // Strict content type validation to prevent CORS and other attacks
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.toLowerCase().startsWith('application/json')) {
      return createErrorResponse('Content-Type must be application/json', 415); // 415 Unsupported Media Type
    }

    // Check content length to prevent large payload attacks
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024) { // 1KB limit
      return createErrorResponse('Request payload too large', 413); // 413 Payload Too Large
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    const { name } = requestBody;

    // Enhanced input validation and sanitization for security
    if (!name || typeof name !== 'string') {
      return createErrorResponse('API key name must be a string', 400);
    }

    // Sanitize input to prevent XSS and other attacks
    let sanitizedName = name
      .trim() // Remove whitespace
      .replace(/[<>"'&]/g, '') // Remove HTML/XML special characters to prevent XSS
      .replace(/[^\w\s\-_.]/g, '') // Only allow alphanumeric, spaces, hyphens, underscores, dots
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .slice(0, 30); // Limit to 30 characters

    // Validate sanitized name
    if (sanitizedName.length === 0) {
      return createErrorResponse('API key name contains invalid characters or is empty', 400);
    }

    if (sanitizedName.length < 3) {
      return createErrorResponse('API key name must be at least 3 characters long', 400);
    }

    if (sanitizedName.length > 30) {
      return createErrorResponse('API key name must not exceed 30 characters', 400);
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
        return createErrorResponse('Invalid characters detected in name', 400);
      }
    }

    // Fetch old name for audit log
    const { data: oldKey } = await supabase
      .from('api_keys')
      .select('id, name, key_value')
      .eq('id', sanitizedId)
      .eq('user_id', user.id)
      .single();

    if (!oldKey) {
      return createErrorResponse('API key not found or access denied', 404);
    }

    const oldName = oldKey.name;

    // Update the API key name (RLS will ensure the user can only update their own keys)
    const { data, error } = await supabase
      .from('api_keys')
      .update({ name: sanitizedName })
      .eq('id', sanitizedId)
      .eq('user_id', user.id)
      .select('id, name, created_at')
      .single();

    if (error) {
      // Handle specific error types
      if (error.code === 'PGRST116') {
        return createErrorResponse('API key not found or access denied', 404);
      }

      if (error.code === '23505') { // Unique constraint violation
        return createErrorResponse('An API key with this name already exists', 409);
      }

      return createErrorResponse('Failed to update API key', 500);
    }

    if (!data) {
      return createErrorResponse('API key not found or access denied', 404);
    }

    // 📝 LOG AUDIT EVENT: API Key Renamed
    try {
      const { logAuditEvent, maskApiKey } = await import('@/lib/audit-logger');
      await logAuditEvent({
        userId: user.id,
        eventType: 'api_key_renamed',
        resourceType: 'api_key',
        resourceId: data.id,
        description: `Renamed API key from "${oldName}" to "${sanitizedName}"`,
        metadata: {
          old_name: oldName,
          new_name: sanitizedName,
          key_prefix: maskApiKey(oldKey.key_value),
        },
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      });
    } catch (auditError) {
      console.error('[AUDIT LOG] Failed to log api_key_renamed:', auditError);
    }

    return createResponse(true, { apiKey: data }, 'API key updated successfully');

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401);
    }

    return createErrorResponse('Internal server error', 500);
  }
}