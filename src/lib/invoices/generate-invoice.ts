import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface InvoiceData {
    transactionId: string;
    userId: string;
    planName: string;
    billingCycle: string;
    amount: number;
    currency: string;
    tax: number;
    discount: number;
    billingAddress: {
        country: string;
        [key: string]: unknown;
    };
}

export async function generateInvoice(data: InvoiceData) {
    try {
        // Check if invoice already exists for this transaction
        const { data: existingInvoice } = await supabaseAdmin
            .from('invoices')
            .select('*')
            .eq('transaction_id', data.transactionId)
            .single();

        if (existingInvoice) {
            return existingInvoice;
        }

        // Generate invoice number
        const invoiceNumber = await generateInvoiceNumber();

        // Create invoice record
        const { data: invoice, error: insertError } = await supabaseAdmin
            .from('invoices')
            .insert({
                user_id: data.userId,
                transaction_id: data.transactionId,
                invoice_number: invoiceNumber,
                plan_name: data.planName,
                billing_cycle: data.billingCycle,
                subtotal: data.amount,
                tax: data.tax,
                discount: data.discount,
                total: data.amount + data.tax - data.discount,
                currency: data.currency,
                status: 'paid',
                invoice_date: new Date().toISOString(),
                due_date: new Date().toISOString(),
                billing_address: data.billingAddress
            })
            .select()
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

async function generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    // Get the count of invoices this month
    const { count } = await supabaseAdmin
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .gte('invoice_date', `${year}-${month}-01`)
        .lt('invoice_date', `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`);

    const sequence = String((count || 0) + 1).padStart(5, '0');
    return `INV-${year}-${month}-${sequence}`;
}
