/**
 * Test Webhook Endpoint (DEV ONLY)
 * POST /api/webhooks/wayl/test
 * 
 * Simulates a Wayl webhook callback for testing
 * DO NOT DEPLOY TO PRODUCTION
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Only allow in development
const IS_DEV = process.env.NODE_ENV === 'development';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    if (!IS_DEV) {
        return NextResponse.json({ error: 'Test endpoint disabled in production' }, { status: 403 });
    }

    try {
        const { referenceId, status = 'Complete' } = await req.json();

        if (!referenceId) {
            return NextResponse.json({ error: 'referenceId required' }, { status: 400 });
        }

        console.log('[TEST WEBHOOK] Simulating webhook:', { referenceId, status });

        // Find the transaction
        const { data: transaction, error: txError } = await supabase
            .from('billing_transactions')
            .select('*')
            .eq('wayl_reference_id', referenceId)
            .single();

        if (txError || !transaction) {
            return NextResponse.json({
                error: 'Transaction not found',
                referenceId,
                hint: 'Make sure referenceId matches a pending transaction'
            }, { status: 404 });
        }

        if (transaction.webhook_received_at) {
            return NextResponse.json({
                error: 'Already processed',
                referenceId,
                status: transaction.status
            }, { status: 400 });
        }

        // Simulate webhook processing
        if (status === 'Complete') {
            // Get plan details
            const planTier = transaction.plan;
            const { data: plan, error: planError } = await supabase
                .from('subscription_plans')
                .select('*')
                .eq('tier', planTier)
                .single();

            if (planError || !plan) {
                return NextResponse.json({ error: 'Plan not found: ' + planTier }, { status: 404 });
            }

            // Calculate billing dates
            const now = new Date();
            const cycleEnd = new Date(now);
            if (transaction.billing_cycle === 'yearly') {
                cycleEnd.setFullYear(cycleEnd.getFullYear() + 1);
            } else {
                cycleEnd.setMonth(cycleEnd.getMonth() + 1);
            }

            // Update user profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    subscription_tier: plan.tier,
                    api_requests_limit: plan.api_requests_monthly,
                    billing_cycle_start: now.toISOString(),
                    billing_cycle_end: cycleEnd.toISOString()
                })
                .eq('id', transaction.user_id);

            if (updateError) {
                console.error('[TEST WEBHOOK] Failed to update profile:', updateError);
                return NextResponse.json({ error: 'Failed to update profile', details: updateError }, { status: 500 });
            }

            // Mark transaction complete
            await supabase
                .from('billing_transactions')
                .update({
                    status: 'completed',
                    webhook_received_at: new Date().toISOString()
                })
                .eq('id', transaction.id);

            // Create audit log entry
            const { error: auditError } = await supabase.from('audit_logs').insert({
                user_id: transaction.user_id,
                event_type: 'account_upgraded',
                event_category: 'info',
                resource_type: 'account', // Must be: api_key, usage_quota, account, or system
                resource_id: plan.id,
                description: `Account upgraded to ${plan.tier} (${transaction.billing_cycle})`,
                metadata: {
                    referenceId,
                    plan: plan.tier,
                    billingCycle: transaction.billing_cycle,
                    amount: transaction.amount
                }
            });

            if (auditError) {
                console.error('[TEST WEBHOOK] Failed to create audit log:', auditError);
            } else {
                console.log('[TEST WEBHOOK] Audit log created for account_upgraded');
            }

            // Get updated profile
            const { data: updatedProfile } = await supabase
                .from('profiles')
                .select('subscription_tier, api_requests_limit, billing_cycle_start, billing_cycle_end')
                .eq('id', transaction.user_id)
                .single();

            console.log('[TEST WEBHOOK] Successfully processed:', {
                userId: transaction.user_id,
                plan: plan.tier,
                billingCycle: transaction.billing_cycle
            });

            return NextResponse.json({
                success: true,
                message: 'Webhook simulated successfully',
                result: {
                    transactionId: transaction.id,
                    referenceId,
                    status: 'completed',
                    plan: plan.tier,
                    billingCycle: transaction.billing_cycle,
                    updatedProfile
                }
            });

        } else {
            // Mark as failed/cancelled
            await supabase
                .from('billing_transactions')
                .update({
                    status: 'failed',
                    webhook_received_at: new Date().toISOString()
                })
                .eq('id', transaction.id);

            return NextResponse.json({
                success: true,
                message: `Payment ${status} simulated`,
                referenceId,
                status: 'failed'
            });
        }

    } catch (error: any) {
        console.error('[TEST WEBHOOK ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
