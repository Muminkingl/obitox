/**
 * Check Payment Status
 * GET /api/billing/check-status?referenceId=xxx
 * 
 * Used by frontend for polling (UX only, NOT for activation)
 * Webhook is the source of truth for account activation
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const referenceId = req.nextUrl.searchParams.get('referenceId');

        if (!referenceId) {
            return NextResponse.json({ error: 'Missing referenceId' }, { status: 400 });
        }

        // Validate ownership (security check)
        const { data: transaction, error } = await supabase
            .from('billing_transactions')
            .select('status, subscription_plan_id, wayl_payment_url')
            .eq('wayl_reference_id', referenceId)
            .eq('user_id', user.id) // Must belong to authenticated user
            .single();

        if (error || !transaction) {
            console.warn('[STATUS CHECK] Transaction not found or unauthorized:', {
                referenceId,
                userId: user.id
            });
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            status: transaction.status,
            paymentUrl: transaction.wayl_payment_url
        });

    } catch (error: any) {
        console.error('[STATUS CHECK ERROR]', error);
        return NextResponse.json(
            { error: 'Failed to check status' },
            { status: 500 }
        );
    }
}
