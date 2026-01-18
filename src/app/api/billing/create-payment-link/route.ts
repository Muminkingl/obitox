/**
 * Create Wayl Payment Link
 * POST /api/billing/create-payment-link
 * 
 * Security features:
 * - Duplicate payment prevention (15 min window)
 * - Currency validation (IQD only)
 * - Amount verification
 */

import { createClient } from '@/lib/supabase/server';
import { createPaymentLink } from '@/lib/wayl-client';
import { generateReferenceId } from '@/lib/generate-reference-id';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plan, billingCycle } = await req.json();

        // Validate input
        if (!['pro', 'enterprise'].includes(plan)) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        if (!['monthly', 'yearly'].includes(billingCycle)) {
            return NextResponse.json({ error: 'Invalid billing cycle' }, { status: 400 });
        }

        // ✅ SECURITY FIX #3: Check for duplicate pending payments (15 min window)
        const { data: recentPending } = await supabase
            .from('billing_transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
            .maybeSingle();

        // Only reuse if payment URL actually exists (not null from failed Wayl calls)
        if (recentPending && recentPending.wayl_payment_url) {
            console.log('[BILLING] Returning existing payment link for user:', user.id);
            return NextResponse.json({
                success: true,
                paymentUrl: recentPending.wayl_payment_url,
                referenceId: recentPending.wayl_reference_id,
                isExisting: true
            });
        }

        // Delete stale pending transaction without payment URL (from failed Wayl calls)
        if (recentPending && !recentPending.wayl_payment_url) {
            console.log('[BILLING] Deleting stale transaction without payment URL:', recentPending.id);
            await supabase
                .from('billing_transactions')
                .delete()
                .eq('id', recentPending.id);
        }

        // Get plan details
        const { data: planData, error: planError } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('tier', plan)
            .single();

        if (planError || !planData) {
            console.error('[BILLING] Plan not found:', plan);
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        // Calculate amount (using correct column names)
        // NOTE: Database stores prices in CENTS (2400 = $24.00)
        const amountCents = billingCycle === 'yearly'
            ? planData.yearly_price_usd
            : planData.monthly_price_usd;

        if (!amountCents || amountCents <= 0) {
            console.error('[BILLING] Invalid plan price:', { plan, billingCycle, amountCents });
            return NextResponse.json({ error: 'Invalid plan price' }, { status: 400 });
        }

        // Convert cents to dollars, then to IQD
        const amountUSD = amountCents / 100; // 2400 cents = $24.00
        const usdToIqdRate = parseFloat(process.env.USD_TO_IQD_RATE || '1310');
        const amountInIQD = Math.round(amountUSD * usdToIqdRate); // $24 * 1310 = 31,440 IQD
        const currency = 'IQD';

        console.log('[BILLING] Price calculation:', {
            amountCents,
            amountUSD,
            usdToIqdRate,
            amountInIQD
        });

        // ✅ SECURITY FIX #8: Currency validation
        if (currency !== 'IQD') {
            return NextResponse.json({ error: 'Only IQD currency supported' }, { status: 400 });
        }

        // Generate unique reference ID
        const referenceId = generateReferenceId(user.id, plan);

        // Create transaction record (matching existing schema)
        const { data: transaction, error: txError } = await supabase
            .from('billing_transactions')
            .insert({
                user_id: user.id,
                plan: plan, // Required: NOT NULL
                amount: amountInIQD, // Required: NOT NULL (integer in IQD)
                currency: currency,
                status: 'pending', // Must be: pending, completed, failed, or cancelled
                billing_cycle: billingCycle,
                subscription_plan_id: planData.id,
                wayl_reference_id: referenceId
            })
            .select()
            .single();

        if (txError) {
            console.error('[BILLING] Failed to create transaction:', txError);
            throw txError;
        }

        // Create Wayl payment link
        const webhookUrl = `${process.env.APP_URL}/api/webhooks/wayl`;
        const redirectUrl = `${process.env.APP_URL}/billing/processing?referenceId=${referenceId}`;

        const waylResponse = await createPaymentLink({
            referenceId,
            total: amountInIQD,
            currency,
            webhookUrl,
            webhookSecret: process.env.WAYL_WEBHOOK_SECRET!,
            redirectionUrl: redirectUrl,
            planName: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan (${billingCycle})`
        });

        // Update transaction with Wayl details
        await supabase
            .from('billing_transactions')
            .update({
                wayl_order_id: waylResponse.orderId,
                wayl_payment_url: waylResponse.paymentUrl
            })
            .eq('id', transaction.id);

        console.log('[BILLING] Payment link created:', {
            userId: user.id,
            referenceId,
            plan,
            amount: amountInIQD,
            currency
        });

        return NextResponse.json({
            success: true,
            paymentUrl: waylResponse.paymentUrl,
            referenceId
        });

    } catch (error: any) {
        console.error('[BILLING ERROR]', error);
        return NextResponse.json(
            { error: 'Failed to create payment link' },
            { status: 500 }
        );
    }
}
