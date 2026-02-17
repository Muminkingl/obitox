import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature } from '@/lib/verify-webhook-signature';
import { generateInvoice } from '@/lib/invoices/generate-invoice';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const payload = JSON.parse(body);

        const signature = req.headers.get('x-wayl-signature') || '';

        // Verify signature
        const isValid = verifyWebhookSignature(
            body,
            signature,
            process.env.WAYL_WEBHOOK_SECRET!
        );

        if (!isValid) {
            console.error('[WEBHOOK] Invalid signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 200 });
        }

        // Replay protection
        const webhookTimestamp = payload.timestamp || payload.createdAt;
        if (webhookTimestamp) {
            const age = Date.now() - new Date(webhookTimestamp).getTime();
            if (age > 5 * 60 * 1000) {
                console.error('[WEBHOOK] Webhook expired, possible replay attack');
                return NextResponse.json({ error: 'Webhook expired' }, { status: 200 });
            }
        }

        const { referenceId, status, amount: webhookAmount } = payload;

        if (!referenceId) {
            console.error('[WEBHOOK] Missing referenceId');
            return NextResponse.json({ error: 'Missing referenceId' }, { status: 200 });
        }

        // Load transaction
        const { data: transaction, error: txError } = await supabase
            .from('billing_transactions')
            .select('*')
            .eq('wayl_reference_id', referenceId)
            .single();

        if (txError || !transaction) {
            console.error('[WEBHOOK] Transaction not found:', referenceId);
            return NextResponse.json({ error: 'Transaction not found' }, { status: 200 });
        }

        // Idempotency check
        if (transaction.webhook_received_at) {
            return NextResponse.json({ status: 'already_processed' }, { status: 200 });
        }

        // Amount verification
        if (webhookAmount) {
            const amountDiff = Math.abs(webhookAmount - transaction.amount);
            if (amountDiff > 1) {
                console.error('[WEBHOOK] AMOUNT MISMATCH DETECTED!');
                return NextResponse.json({ error: 'Amount mismatch' }, { status: 200 });
            }
        }

        // Handle payment status
        if (status === 'Complete') {
            const planTier = transaction.plan;

            const { data: plan, error: planError } = await supabase
                .from('subscription_plans')
                .select('*')
                .eq('tier', planTier)
                .single();

            if (planError || !plan) {
                throw new Error('Plan not found: ' + planTier);
            }

            // Calculate billing dates
            const now = new Date();
            const cycleEnd = new Date(now);
            if (transaction.billing_cycle === 'yearly') {
                cycleEnd.setFullYear(cycleEnd.getFullYear() + 1);
            } else {
                cycleEnd.setMonth(cycleEnd.getMonth() + 1);
            }

            // Update user account
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    subscription_tier_paid: plan.tier,
                    subscription_status: 'active',
                    billing_cycle_start: now.toISOString(),
                    billing_cycle_end: cycleEnd.toISOString()
                })
                .eq('id', transaction.user_id);

            if (updateError) {
                console.error('[WEBHOOK] Failed to update profile:', updateError);
                throw updateError;
            }

            // Mark transaction complete
            await supabase
                .from('billing_transactions')
                .update({
                    status: 'completed',
                    webhook_received_at: new Date().toISOString()
                })
                .eq('id', transaction.id);

            // Log audit event
            await supabase.from('audit_logs').insert({
                user_id: transaction.user_id,
                event_type: 'account_upgraded',
                event_category: 'info',
                resource_type: 'account',
                resource_id: plan.id,
                description: `Account upgraded to ${plan.tier} (${transaction.billing_cycle})`,
                metadata: { referenceId, plan: plan.tier, billingCycle: transaction.billing_cycle, amount: transaction.amount }
            });

            // Generate invoice
            try {
                const usdPriceCents = transaction.billing_cycle === 'yearly'
                    ? plan.yearly_price_usd || 0
                    : plan.monthly_price_usd || 0;

                await generateInvoice({
                    transactionId: transaction.id,
                    userId: transaction.user_id,
                    planName: plan.name || plan.tier,
                    billingCycle: transaction.billing_cycle,
                    amount: usdPriceCents,
                    currency: 'USD',
                    tax: 0,
                    discount: 0,
                    billingAddress: { country: 'US' }
                });
            } catch (invoiceError: any) {
                console.error('[WEBHOOK] Invoice generation failed:', invoiceError);
            }

            return NextResponse.json({ status: 'success' });

        } else if (status === 'Failed' || status === 'Cancelled') {
            // Mark transaction as failed
            await supabase
                .from('billing_transactions')
                .update({
                    status: 'failed',
                    webhook_received_at: new Date().toISOString()
                })
                .eq('id', transaction.id);

            return NextResponse.json({ status: 'failed' });

        } else {
            console.error('[WEBHOOK] Unknown status:', status);
            return NextResponse.json({ status: 'unknown' }, { status: 200 });
        }

    } catch (error: any) {
        console.error('[WEBHOOK ERROR]', error);

        // Log error to database for debugging
        try {
            await supabase.from('webhook_errors').insert({
                error_message: error.message,
                error_stack: error.stack,
                created_at: new Date().toISOString()
            });
        } catch (logError) {
            // Silently fail
        }

        return NextResponse.json({ error: 'Internal error' }, { status: 200 });
    }
}
