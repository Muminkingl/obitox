import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateInvoicePDF } from '@/lib/invoices/pdf-generator';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
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

        // 2. Get invoice IDs from request body
        const body = await request.json();
        const { invoiceIds } = body;

        if (!invoiceIds || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
            return NextResponse.json(
                { error: 'No invoices selected' },
                { status: 400 }
            );
        }

        // 3. Validate UUIDs
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        for (const id of invoiceIds) {
            if (!uuidRegex.test(id)) {
                return NextResponse.json(
                    { error: `Invalid invoice ID: ${id}` },
                    { status: 400 }
                );
            }
        }

        // 4. Fetch all invoices (RLS ensures user owns them)
        const { data: invoices, error } = await supabase
            .from('invoices')
            .select('*')
            .in('id', invoiceIds)
            .eq('user_id', user.id)
            .is('deleted_at', null);

        if (error || !invoices || invoices.length === 0) {
            console.error('[BULK DOWNLOAD] No invoices found');
            return NextResponse.json(
                { error: 'No invoices found' },
                { status: 404 }
            );
        }

        // 5. Create ZIP file
        const zip = new JSZip();

        for (const invoice of invoices) {
            const pdfBuffer = await generateInvoicePDF(invoice);
            zip.file(`invoice-${invoice.invoice_number}.pdf`, pdfBuffer);

            // Log each download (audit trail)
            await supabase.from('invoice_audit_log').insert({
                invoice_id: invoice.id,
                user_id: user.id,
                action: 'pdf_downloaded_bulk',
                metadata: {
                    ip_address: request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '::1',
                    user_agent: request.headers.get('user-agent') || 'unknown',
                    bulk_download_count: invoices.length
                }
            });
        }

        // 6. Generate ZIP buffer
        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        // 7. Return ZIP file
        return new NextResponse(new Uint8Array(zipBuffer), {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="invoices-${new Date().toISOString().split('T')[0]}.zip"`,
                'Content-Length': String(zipBuffer.length)
            }
        });

    } catch (error: any) {
        console.error('[BULK DOWNLOAD] Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate ZIP' },
            { status: 500 }
        );
    }
}