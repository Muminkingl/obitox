import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getRemainingApiKeys, getApiKeyLimit } from '@/lib/subscription';
import { apiRateLimit } from '@/lib/rate-limit';

// Helper function for request validation
async function validateRequest(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Unauthorized');
    }
    return user;
}

/**
 * Combined endpoint that returns both API keys and metadata in a single request
 * Reduces API calls from 2 to 1
 */
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

            console.log(`[API KEYS COMBINED] ❌ Rate limited IP: ${ip}`);

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

        console.log('[API KEYS COMBINED] Fetching all data in parallel...');

        // 2. ✅ SINGLE TRANSACTION - Fetch everything at once
        const [keysResult, limitValue, remainingValue] = await Promise.all([
            // Get API keys
            supabase
                .from('api_keys')
                .select('id, name, key_value, created_at, last_used_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(100),

            // Get limit
            getApiKeyLimit(user.id),

            // Get remaining
            getRemainingApiKeys(user.id)
        ]);

        // Check for errors
        if (keysResult.error) {
            console.error('[API KEYS COMBINED] Keys query error:', keysResult.error);
            throw keysResult.error;
        }

        const apiKeys = keysResult.data || [];

        // Mask the key values for security
        const maskedKeys = apiKeys.map(key => ({
            ...key,
            key_value: `${key.key_value.substring(0, 7)}...${key.key_value.slice(-4)}`
        }));

        // Calculate metadata
        const limit = limitValue || 0;
        const remaining = remainingValue || 0;
        const used = Math.max(0, limit - remaining);

        const processingTime = Date.now() - startTime;

        console.log(`[API KEYS COMBINED] ✅ Fetched ${maskedKeys.length} keys + metadata in ${processingTime}ms`);

        // 3. Return combined response with cache headers
        return NextResponse.json(
            {
                success: true,
                apiKeys: maskedKeys,
                metadata: {
                    limit,
                    remaining: Math.max(0, remaining),
                    used
                }
            },
            {
                headers: {
                    // Cache for 30 seconds
                    'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
                    // Rate limit info
                    'X-RateLimit-Limit': '100',
                    'X-RateLimit-Remaining': String(rateLimitResult.remaining),
                    'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
                    // Performance metrics
                    'X-Response-Time': `${processingTime}ms`,
                    // Security
                    'X-Content-Type-Options': 'nosniff'
                }
            }
        );

    } catch (error: any) {
        console.error('[API KEYS COMBINED] Error:', error);

        if (error?.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
