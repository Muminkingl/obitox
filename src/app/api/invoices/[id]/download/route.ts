import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateInvoicePDF } from '@/lib/invoices/pdf-generator';


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params (Next.js 15 requirement)
        const { id } = await params;

        // 1. Authentication
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return NextResponse.json(
                { error: 'Invalid invoice ID' },
                { status: 400 }
            );
        }


        // 3. Fetch invoice (RLS ensures user owns it)
        const { data: invoice, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .is('deleted_at', null)
            .single();

        if (error || !invoice) {
            console.error('[INVOICE DOWNLOAD] Not found:', id);
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        // 4. Generate PDF
        console.log(`[INVOICE DOWNLOAD] Generating PDF for ${invoice.invoice_number}`);
        const pdfBuffer = await generateInvoicePDF(invoice);

        // 5. Log download (audit trail)
        await supabase.from('invoice_audit_log').insert({
            invoice_id: invoice.id,
            user_id: user.id,
            action: 'pdf_downloaded',
            metadata: {
                ip_address: request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '::1',
                user_agent: request.headers.get('user-agent') || 'unknown'
            }
        });

        // 6. Return PDF
        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="invoice-${invoice.invoice_number}.pdf"`,
                'Content-Length': String(pdfBuffer.length)
            }
        });

    } catch (error: any) {
        console.error('[INVOICE DOWNLOAD] Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}
