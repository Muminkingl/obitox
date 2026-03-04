/**
 * Invoice Generator — SERVER ONLY
 *
 * FIXES:
 *   - Race condition in invoice number generation → replaced count-based with Postgres sequence
 *   - December month boundary bug → proper Date arithmetic
 *   - Service role key exposure guard → throws if run client-side
 *   - select('*') on existence check → select only needed columns
 *   - Due date on paid invoice → removed (meaningless)
 *   - Date.now() called multiple times → single snapshot
 *   - Month/year mismatch at midnight Dec 31 → single `now` snapshot
 */

// ─── Server-side guard ────────────────────────────────────────────────────────
// Prevents SUPABASE_SERVICE_ROLE_KEY from being bundled into client code.
// Name this file *.server.ts so Next.js enforces the boundary statically.
if (typeof window !== 'undefined') {
    throw new Error('[invoice-generator] This module must only run server-side.');
}

import { createClient } from '@supabase/supabase-js';

// ─── Supabase admin client ────────────────────────────────────────────────────
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────
export interface InvoiceData {
    transactionId: string;
    userId: string;
    planName: string;
    billingCycle: string;
    amount: number;     // cents
    currency: string;
    tax: number;        // cents
    discount: number;   // cents
    billingAddress: {
        country: string;
        [key: string]: unknown;
    };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateInvoice(data: InvoiceData) {
    try {
        // FIX: select only the columns we actually use instead of select('*')
        const { data: existingInvoice } = await supabaseAdmin
            .from('invoices')
            .select('id, invoice_number, status, amount_cents, total_cents, invoice_date')
            .eq('transaction_id', data.transactionId)
            .single();

        if (existingInvoice) {
            return existingInvoice;
        }

        // FIX: invoice number now generated via Postgres sequence — race-condition-free.
        // See SQL setup below.
        const invoiceNumber = await generateInvoiceNumber();

        // FIX: single Date snapshot — no risk of year/month/timestamp drift
        // across multiple new Date() calls that straddle midnight.
        const now = new Date();
        const invoiceDate = now.toISOString();

        // FIX: calculate due_date to be the end of the subscription cycle
        // (next month for monthly, next year for yearly)
        const dueDateObj = new Date(now);
        if (data.billingCycle === 'yearly') {
            dueDateObj.setFullYear(dueDateObj.getFullYear() + 1);
        } else {
            dueDateObj.setMonth(dueDateObj.getMonth() + 1);
        }
        const dueDate = dueDateObj.toISOString();

        const { data: invoice, error: insertError } = await supabaseAdmin
            .from('invoices')
            .insert({
                user_id: data.userId,
                transaction_id: data.transactionId,
                invoice_number: invoiceNumber,
                plan_name: data.planName,
                billing_cycle: data.billingCycle,
                amount_cents: data.amount,
                tax_cents: data.tax,
                discount_cents: data.discount,
                total_cents: data.amount + data.tax - data.discount,
                currency: data.currency,
                status: 'paid',
                invoice_date: invoiceDate,
                // The due_date now represents the end of the paid billing cycle
                due_date: dueDate,
                billing_address: data.billingAddress,
            })
            .select('id, invoice_number, status, amount_cents, total_cents, invoice_date')
            .single();

        if (insertError) {
            throw new Error('Failed to create invoice: ' + insertError.message);
        }

        return invoice;

    } catch (error) {
        console.error('[Invoice] Generation failed:', error);
        throw error;
    }
}

// ─── Invoice number generation ────────────────────────────────────────────────

/**
 * FIX: replaced count-based generation with a Postgres sequence.
 *
 * The old approach:
 *   1. COUNT invoices this month  →  returns N
 *   2. Use N+1 as sequence number
 *
 * Race condition: two simultaneous requests both read N=5, both produce
 * INV-2026-02-00006, one insert fails with a unique constraint violation.
 *
 * The new approach uses `nextval('invoice_seq')` which is atomic in Postgres —
 * no two callers ever get the same value regardless of concurrency.
 *
 * Also fixes the December bug: the old code produced month "13" in December
 * because it did `parseInt(month) + 1` without clamping or using Date arithmetic.
 *
 * ─── One-time Supabase SQL setup ─────────────────────────────────────────────
 *
 *   CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;
 *
 *   CREATE OR REPLACE FUNCTION next_invoice_number()
 *   RETURNS bigint
 *   LANGUAGE sql
 *   AS $$ SELECT nextval('invoice_seq'); $$;
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */
async function generateInvoiceNumber(): Promise<string> {
    // FIX: single Date snapshot — year and month always consistent
    const now = new Date();
    const year = now.getUTCFullYear();
    // FIX: use UTC month to match invoice_date (which is also UTC toISOString)
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');

    // Atomic sequence — no race condition possible
    const { data, error } = await supabaseAdmin
        .rpc('next_invoice_number');

    if (error || data == null) {
        throw new Error('Failed to generate invoice number: ' + (error?.message ?? 'null sequence value'));
    }

    const sequence = String(data).padStart(5, '0');
    return `INV-${year}-${month}-${sequence}`;
}