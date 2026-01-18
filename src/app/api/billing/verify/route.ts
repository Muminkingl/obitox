/**
 * Billing Verification API Endpoint
 * POST /api/billing/verify
 * 
 * Verifies payment completion via Wayl API and upgrades user plan
 */

import { createClient } from '@/lib/supabase/server';
import { verifyPaymentStatus } from '@/lib/wayl';
import { NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit-logger';

export async function POST() {
    try {
        const supabase = await createClient();

        // 1. Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. Find pending transaction
        const { data: pendingTransaction, error: fetchError } = await supabase
            .from('billing_transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (fetchError || !pendingTransaction) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'No pending payment found',
                    hint: 'Please start a new upgrade from the pricing page'
                },
                { status: 404 }
            );
        }

        // 3. Verify payment with Wayl
        const paymentStatus = await verifyPaymentStatus(pendingTransaction.reference_id);

        if (paymentStatus.status !== 'paid') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Payment not completed',
                    status: paymentStatus.status,
                    hint: paymentStatus.status === 'pending'
                        ? 'Payment is still processing. Please wait a moment and try again.'
                        : 'Payment was not successful. Please try again.'
                },
                { status: 400 }
            );
        }

        // 4. Get plan limits from subscription_plans table
        const { data: planData, error: planError } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('tier', pendingTransaction.plan)
            .single();

        if (planError || !planData) {
            console.error('Failed to fetch plan data:', planError);
            return NextResponse.json(
                { success: false, error: 'Invalid plan configuration' },
                { status: 500 }
            );
        }

        // 5. Calculate billing cycle dates
        const now = new Date();
        const billingCycleStart = now;
        const billingCycleEnd = new Date(now);
        billingCycleEnd.setMonth(billingCycleEnd.getMonth() + 1);

        // 6. Update user profile with new plan (atomic transaction)
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                subscription_tier: pendingTransaction.plan,
                api_requests_limit: planData.api_requests_per_month,
                billing_cycle_start: billingCycleStart.toISOString(),
                billing_cycle_end: billingCycleEnd.toISOString(),
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Failed to update user profile:', updateError);
            return NextResponse.json(
                { success: false, error: 'Failed to upgrade account' },
                { status: 500 }
            );
        }

        // 7. Mark transaction as completed
        const { error: completeError } = await supabase
            .from('billing_transactions')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                metadata: {
                    ...pendingTransaction.metadata,
                    verified_at: new Date().toISOString(),
                    wayl_payment_status: paymentStatus,
                }
            })
            .eq('id', pendingTransaction.id);

        if (completeError) {
            console.error('Failed to mark transaction complete:', completeError);
            // Don't fail the request - user is already upgraded
        }

        // 8. Create audit log event
        await logAuditEvent({
            userId: user.id,
            eventType: 'account_upgraded',
            resourceType: 'account',
            resourceId: user.id,
            description: `Account upgraded from free to ${pendingTransaction.plan} plan`,
            metadata: {
                from_tier: 'free', // TODO: fetch from old profile data
                to_tier: pendingTransaction.plan,
                amount: pendingTransaction.amount,
                reference_id: pendingTransaction.reference_id,
            },
        });

        // 9. Return success
        return NextResponse.json({
            success: true,
            message: 'Account upgraded successfully',
            plan: pendingTransaction.plan,
            requestsLimit: planData.api_requests_per_month,
        });

    } catch (error: any) {
        console.error('Billing verification error:', error);

        // Handle Wayl API errors
        if (error.message?.includes('Wayl API error')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unable to verify payment. Please contact support.',
                    details: error.message
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
