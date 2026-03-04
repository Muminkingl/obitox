/**
 * Billing Upgrade API Endpoint
 * POST /api/billing/upgrade
 * 
 * Creates a Wayl payment link for plan upgrades
 */

import { createClient } from '@/lib/supabase/server';
import { createPaymentLink, getPlanAmount } from '@/lib/wayl';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
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

        // 2. Parse request body
        const body = await req.json();
        const { plan, billingCycle = 'monthly' } = body;

        // 3. Validate plan
        if (!plan || !['pro', 'enterprise'].includes(plan)) {
            return NextResponse.json(
                { success: false, error: 'Invalid plan. Must be "pro" or "enterprise"' },
                { status: 400 }
            );
        }

        // Enterprise requires contact sales
        if (plan === 'enterprise') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Enterprise plans require custom pricing. Please contact sales.',
                    contactUrl: '/contact'
                },
                { status: 400 }
            );
        }

        // 4. Check for existing pending transactions
        const { data: existingPending } = await supabase
            .from('billing_transactions')
            .select('id, reference_id, created_at')
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .single();

        // If there's a recent pending transaction (< 10 minutes old), reuse it
        if (existingPending) {
            const createdAt = new Date(existingPending.created_at);
            const minutesAgo = (Date.now() - createdAt.getTime()) / 1000 / 60;

            if (minutesAgo < 10) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'You already have a pending payment. Please complete or cancel it first.',
                        pendingReferenceId: existingPending.reference_id
                    },
                    { status: 409 }
                );
            }
        }

        // 5. Get plan amount
        const amount = getPlanAmount(plan, billingCycle as 'monthly' | 'yearly');

        // 6. Generate unique reference ID
        const referenceId = `upgrade_${user.id}_${Date.now()}`;

        // 7. Get app URL for redirect
        const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const redirectionUrl = `${appUrl}/billing/success`;

        // 8. Create payment link via Wayl
        const { payUrl } = await createPaymentLink(
            amount,
            'USD',
            referenceId,
            redirectionUrl
        );

        // 9. Store pending transaction in database
        const { error: insertError } = await supabase
            .from('billing_transactions')
            .insert({
                user_id: user.id,
                reference_id: referenceId,
                plan,
                amount,
                currency: 'USD',
                status: 'pending',
                wayl_payment_url: payUrl,
                metadata: {
                    billing_cycle: billingCycle,
                    created_from: 'pricing_page',
                }
            });

        if (insertError) {
            console.error('Failed to create billing transaction:', insertError);
            return NextResponse.json(
                { success: false, error: 'Failed to initialize payment' },
                { status: 500 }
            );
        }

        // 10. Return payment URL
        return NextResponse.json({
            success: true,
            payUrl,
            referenceId,
        });

    } catch (error: any) {
        console.error('Billing upgrade error:', error);

        // Handle Wayl API errors specifically
        if (error.message?.includes('Wayl API error')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Payment service unavailable. Please try again later.',
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
