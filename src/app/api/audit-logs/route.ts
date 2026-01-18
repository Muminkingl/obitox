import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimit } from '@/lib/rate-limit';

/**
 * GET /api/audit-logs
 * Fetch audit logs for the authenticated user
 * 
 * Rate Limited: 100 requests per minute
 * Cached: 30 seconds
 * 
 * Query params:
 * - limit: Number of logs to fetch (default: 50, max: 100)
 * - offset: Pagination offset (default: 0)
 * - event_type: Filter by specific event type (optional)
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

            console.log(`[AUDIT LOGS] ❌ Rate limited IP: ${ip}`);

            return NextResponse.json(
                {
                    error: 'Too many requests. Please slow down.',
                    retryAfter
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(retryAfter),
                        'X-RateLimit-Limit': '100',
                        'X-RateLimit-Remaining': '0'
                    }
                }
            );
        }

        console.log(`[AUDIT LOGS] ✅ Request allowed (${rateLimitResult.remaining} remaining)`);

        // 2. Get authenticated user
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 3. Parse query parameters
        const { searchParams } = new URL(request.url);
        const limitStr = searchParams.get('limit') || '50';
        const offsetStr = searchParams.get('offset') || '0';
        const eventType = searchParams.get('event_type');

        // Validate and sanitize limit (max 100)
        let limit = parseInt(limitStr);
        if (isNaN(limit) || limit < 1) limit = 50;
        if (limit > 100) limit = 100;

        // Validate and sanitize offset
        let offset = parseInt(offsetStr);
        if (isNaN(offset) || offset < 0) offset = 0;

        console.log(`[AUDIT LOGS] Fetching logs: user=${user.id}, limit=${limit}, offset=${offset}, filter=${eventType || 'all'}`);

        // 4. Build query
        let query = supabase
            .from('audit_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply event type filter if provided
        if (eventType && typeof eventType === 'string') {
            query = query.eq('event_type', eventType);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('[AUDIT LOGS] Query error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const processingTime = Date.now() - startTime;

        console.log(`[AUDIT LOGS] ✅ Fetched ${data?.length || 0} logs in ${processingTime}ms`);

        // 5. Return with caching + rate limit headers
        return NextResponse.json(
            {
                logs: data || [],
                pagination: {
                    limit,
                    offset,
                    total: count || data?.length || 0,
                },
            },
            {
                headers: {
                    // Cache for 30 seconds
                    'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
                    // Rate limit info
                    'X-RateLimit-Limit': '100',
                    'X-RateLimit-Remaining': String(rateLimitResult.remaining),
                    'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
                    // Performance
                    'X-Response-Time': `${processingTime}ms`
                }
            }
        );

    } catch (error: any) {
        console.error('[AUDIT LOGS] Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
