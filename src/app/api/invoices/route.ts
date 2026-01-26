import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    const startTime = Date.now();

    try {
        // 1. Authentication
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. Parse query parameters
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
        const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);
        const status = searchParams.get('status'); // 'paid', 'pending', etc.

        // 3. Build query
        let query = supabase
            .from('invoices')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status) {
            query = query.eq('status', status);
        }

        const { data: invoices, error, count } = await query;

        if (error) {
            console.error('[INVOICES API] Query error:', error);
            throw error;
        }

        // 4. Convert cents to dollars for frontend
        const formattedInvoices = (invoices || []).map(inv => ({
            ...inv,
            amount: inv.amount_cents / 100,
            tax: inv.tax_cents / 100,
            discount: inv.discount_cents / 100,
            total: inv.total_cents / 100
        }));

        const processingTime = Date.now() - startTime;

        return NextResponse.json(
            {
                success: true,
                invoices: formattedInvoices,
                total: count || 0,
                hasMore: (offset + limit) < (count || 0)
            },
            {
                headers: {
                    // Cache for 60 seconds (invoices don't change often)
                    'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
                    'X-Response-Time': `${processingTime}ms`
                }
            }
        );

    } catch (error: any) {
        console.error('[INVOICES API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoices' },
            { status: 500 }
        );
    }
}
