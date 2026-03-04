/**
 * Expire Stale Payments Cron Job
 * GET /api/cron/expire-payments
 * 
 * ✅ SECURITY FIX #4: Cleanup stale payment links
 * Runs every 6 hours via Vercel cron
 * Marks payments stuck in "created" status for 24+ hours as expired
 */

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const startTime = Date.now();

        // Expire payments older than 24 hours
        const expirationThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        // Note: using 'cancelled' as 'expired' is not in the allowed status list
        // Allowed: pending, completed, failed, cancelled
        const { data, error } = await supabase
            .from('billing_transactions')
            .update({ status: 'cancelled' })
            .eq('status', 'pending')
            .lt('created_at', expirationThreshold)
            .select('id, wayl_reference_id, user_id');

        if (error) {
            console.error('[CRON] Error expiring payments:', error);
            throw error;
        }

        const expiredCount = data?.length || 0;

        console.log('[CRON] Expired stale payments:', {
            count: expiredCount,
            threshold: expirationThreshold,
            processingTimeMs: Date.now() - startTime
        });

        // Log expired payments for audit
        if (expiredCount > 0) {
            for (const payment of data) {
                await supabase.from('audit_logs').insert({
                    user_id: payment.user_id,
                    event_type: 'payment_expired',
                    event_category: 'info',
                    resource_type: 'billing',
                    resource_id: payment.id,
                    description: `Payment link expired: ${payment.wayl_reference_id}`
                });
            }
        }

        return NextResponse.json({
            success: true,
            expiredCount,
            processingTimeMs: Date.now() - startTime
        });

    } catch (error: any) {
        console.error('[CRON ERROR]', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
