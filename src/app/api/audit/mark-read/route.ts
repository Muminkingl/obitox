/**
 * Mark Audit Logs as Read API
 * POST /api/audit/mark-read
 * 
 * Rate Limited: 50 requests per minute (strict)
 * Performance optimized: Batch mark multiple logs in single transaction
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        // 1. STRICT rate limiting (50 requests per minute)
        // This is a write operation, so more restrictive
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
            req.headers.get('x-real-ip') ||
            '::1';

        const rateLimitResult = await apiRateLimit.check(ip);

        if (!rateLimitResult.success) {
            const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);

            console.log(`[MARK READ] ❌ Rate limited IP: ${ip}`);

            return NextResponse.json(
                {
                    success: false,
                    error: 'Too many mark-read requests. Please wait.',
                    retryAfter
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(retryAfter),
                        'X-RateLimit-Remaining': '0'
                    }
                }
            );
        }

        //2. Get authenticated user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 3. Parse request body
        const body = await req.json();
        const { logIds } = body;

        // Validate input
        if (!Array.isArray(logIds) || logIds.length === 0) {
            return NextResponse.json(
                { success: false, error: 'logIds must be a non-empty array' },
                { status: 400 }
            );
        }

        // Limit batch size (prevent abuse)
        if (logIds.length > 100) {
            return NextResponse.json(
                { success: false, error: 'Cannot mark more than 100 logs at once' },
                { status: 400 }
            );
        }

        console.log(`[MARK READ] Marking ${logIds.length} logs as read for user ${user.id}`);

        // 4. Use RPC function to mark logs as read
        // This bypasses PostgREST schema cache issues
        let markedCount = 0;
        for (const logId of logIds) {
            const { data, error } = await supabase.rpc('mark_audit_log_read', { log_id: logId });
            if (!error && data) {
                markedCount++;
            }
        }

        console.log(`[MARK READ] ✅ Marked ${markedCount} logs as read`);

        // 5. Get remaining unread count using RPC
        const { data: remainingCount, error: countError } = await supabase.rpc('get_unread_audit_count');

        // 6. Return success
        return NextResponse.json(
            {
                success: true,
                markedCount,
                remainingUnread: countError ? 0 : (remainingCount || 0),
            },
            {
                headers: {
                    'X-RateLimit-Remaining': String(rateLimitResult.remaining)
                }
            }
        );

    } catch (error: any) {
        console.error('[MARK READ] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
