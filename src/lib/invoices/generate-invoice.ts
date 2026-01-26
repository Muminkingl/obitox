// src/lib/invoices/generate-invoice.ts
import { createClient } from '@supabase/supabase-js';

// Admin client for server-side operations (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);


export interface InvoiceGenerationData {
    transactionId: string;
    userId: string;
    planName: string;
    billingCycle: 'monthly' | 'yearly';
    amount: number;       // Amount in smallest currency unit (cents for USD, whole for IQD)
    currency: string;     // e.g., 'USD', 'IQD'
    tax?: number;
    discount?: number;
    billingAddress?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country: string;
    };
}

export interface Invoice {
    id: string;
    invoice_number: string;
    user_id: string;
    transaction_id: string;
    total_cents: number;
    status: string;
    invoice_date: string;
}

/**
 * Generate invoice with full transaction safety
 * This function is idempotent - calling it multiple times won't create duplicates
 */
export async function generateInvoice(
    data: InvoiceGenerationData
): Promise<Invoice> {
    // Use admin client (already defined at top of file)

    try {
        // 1. Check if invoice already exists for this transaction (idempotency)
        const { data: existingInvoice } = await supabaseAdmin
            .from('invoices')
            .select('*')
            .eq('transaction_id', data.transactionId)
            .maybeSingle();


        if (existingInvoice) {
            console.log(`[INVOICE] Already exists for transaction ${data.transactionId}`);
            return existingInvoice;
        }

        // 2. Store amounts directly (already in smallest unit from transaction)
        const amountCents = data.amount;
        const taxCents = data.tax || 0;
        const discountCents = data.discount || 0;
        const totalCents = amountCents + taxCents - discountCents;

        // 3. Validate amounts
        if (totalCents <= 0) {
            throw new Error('Invalid invoice total: must be greater than 0');
        }

        if (amountCents < 0 || taxCents < 0 || discountCents < 0) {
            throw new Error('Invalid amounts: cannot be negative');
        }

        // 4. Calculate dates
        const invoiceDate = new Date();
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + 30); // 30 days payment term

        // 5. Generate invoice number (atomic operation)
        const { data: invoiceNumber, error: numberError } = await supabaseAdmin
            .rpc('generate_invoice_number');

        if (numberError || !invoiceNumber) {
            throw new Error('Failed to generate invoice number: ' + numberError?.message);
        }

        console.log(`[INVOICE] Generated number: ${invoiceNumber}`);

        // 6. Create invoice record
        const { data: invoice, error: insertError } = await supabaseAdmin
            .from('invoices')
            .insert({
                invoice_number: invoiceNumber,
                user_id: data.userId,
                transaction_id: data.transactionId,
                plan_name: data.planName,
                billing_cycle: data.billingCycle,
                amount_cents: amountCents,
                tax_cents: taxCents,
                discount_cents: discountCents,
                total_cents: totalCents,
                currency: data.currency,
                invoice_date: invoiceDate.toISOString(),
                due_date: dueDate.toISOString(),
                paid_date: invoiceDate.toISOString(), // Paid immediately via Wayl
                status: 'paid',
                billing_address: data.billingAddress || null,
                metadata: {
                    generated_at: new Date().toISOString(),
                    generation_method: 'webhook',
                    wayl_transaction_id: data.transactionId
                }
            })
            .select()
            .single();

        if (insertError) {
            console.error('[INVOICE] Insert error:', insertError);
            throw new Error('Failed to create invoice: ' + insertError.message);
        }

        console.log(`[INVOICE] ✅ Created invoice ${invoice.invoice_number} for user ${data.userId}`);

        return invoice;

    } catch (error: any) {
        console.error('[INVOICE] Generation failed:', error);
        throw error;
    }
}

/**
 * Calculate tax based on user's location
 * (Implement based on your tax requirements)
 */
export function calculateTax(
    amount: number,
    country: string,
    state?: string
): number {
    // TODO: Implement tax calculation logic
    // For now, return 0 (no tax)

    // Example for US:
    // if (country === 'US') {
    //   const stateTaxRates = { 'CA': 0.0725, 'NY': 0.04, ... };
    //   return amount * (stateTaxRates[state] || 0);
    // }

    return 0;
}
