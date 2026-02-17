// src/lib/invoices/pdf-generator.ts
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { format } from 'date-fns';
import style from 'styled-jsx/style';

// Enterprise-grade PDF styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff'
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        paddingBottom: 20,
        borderBottom: 2,
        borderBottomColor: '#2563eb'
    },
    logo: {
        width: 120,
        height: 40
    },
    companyInfo: {
        textAlign: 'right',
        fontSize: 9,
        color: '#666'
    },

    // Invoice title
    invoiceTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 5
    },
    invoiceNumber: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 30
    },

    // Status badge
    statusBadge: {
        backgroundColor: '#10b981',
        color: '#ffffff',
        padding: '4 12',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 20
    },
    statusBadgePending: {
        backgroundColor: '#f59e0b'
    },
    statusBadgeFailed: {
        backgroundColor: '#ef4444'
    },

    // Info sections
    section: {
        marginBottom: 30
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },

    // Two-column layout
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    column: {
        width: '48%'
    },

    // Info rows
    infoRow: {
        flexDirection: 'row',
        marginBottom: 6
    },
    label: {
        width: 120,
        fontSize: 9,
        color: '#64748b',
        fontWeight: 'bold'
    },
    value: {
        flex: 1,
        fontSize: 10,
        color: '#1e293b'
    },

    // Line items table
    table: {
        marginTop: 20,
        marginBottom: 20
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        padding: 10,
        borderRadius: 4,
        marginBottom: 5
    },
    tableHeaderText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#475569',
        textTransform: 'uppercase'
    },
    tableRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottom: 1,
        borderBottomColor: '#e2e8f0'
    },
    tableCell: {
        fontSize: 10,
        color: '#1e293b'
    },

    // Totals
    totalsSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTop: 2,
        borderTopColor: '#e2e8f0'
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingRight: 10
    },
    totalLabel: {
        fontSize: 10,
        color: '#64748b'
    },
    totalValue: {
        fontSize: 10,
        color: '#1e293b',
        width: 100,
        textAlign: 'right'
    },
    grandTotal: {
        marginTop: 10,
        paddingTop: 10,
        borderTop: 2,
        borderTopColor: '#2563eb'
    },
    grandTotalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1e293b'
    },
    grandTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2563eb'
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        paddingTop: 20,
        borderTop: 1,
        borderTopColor: '#e2e8f0',
        fontSize: 8,
        color: '#94a3b8',
        textAlign: 'center'
    },

    // Notes
    notes: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#f8fafc',
        borderRadius: 4,
        fontSize: 9,
        color: '#475569'
    }
});

interface InvoiceData {
    id: string;
    invoice_number: string;
    invoice_date: string;
    due_date: string;
    paid_date?: string;
    status: string;
    plan_name: string;
    billing_cycle: string;
    amount_cents: number;
    tax_cents: number;
    discount_cents: number;
    total_cents: number;
    currency: string;
    billing_address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    user_id: string;
}

// Helper to format cents to currency
const formatCurrency = (cents: number, currency: string = 'USD'): string => {
    const amount = cents / 100;
    const currencySymbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        IQD: 'IQD '
    };
    const symbol = currencySymbols[currency] || '$';
    return `${symbol}${amount.toFixed(2)}`;
};

// Helper to get status badge style
const getStatusBadgeStyle = (status: string) => {
    const baseStyle = styles.statusBadge;
    if (status === 'pending') return [baseStyle, styles.statusBadgePending];
    if (status === 'failed') return [baseStyle, styles.statusBadgeFailed];
    return baseStyle;
};

// Main PDF Document Component
const InvoicePDF: React.FC<{ invoice: InvoiceData }> = ({ invoice }) => {
    const {
        invoice_number,
        invoice_date,
        due_date,
        paid_date,
        status,
        plan_name,
        billing_cycle,
        amount_cents,
        tax_cents,
        discount_cents,
        total_cents,
        currency,
        billing_address
    } = invoice;

    return (
        <Document>
        <Page size= "A4" style = { styles.page } >
            {/* Header */ }
            < View style = { styles.header } >
                <View>
                {/* Company Logo - Replace with your actual logo */ }
                < Text style = {{ fontSize: 24, fontWeight: 'bold', color: '#2563eb' }
}>
    ObitoX
    </Text>
    < Text style = {{ fontSize: 9, color: '#64748b', marginTop: 5 }}>
        Professional API Solutions
            </Text>
            </View>

            < View style = { styles.companyInfo } >
                <Text>ObitoX Inc.</Text>
                    < Text > 1234 Tech Street </Text>
                        < Text > San Francisco, CA 94102 </Text>
                            < Text > United States </Text>
                                < Text style = {{ marginTop: 5 }}> support@obitox.com</Text>
                                    < Text > www.obitox.com </Text>
                                    </View>
                                    </View>

{/* Invoice Title & Number */ }
<View style={ { marginBottom: 30 } }>
    <Text style={ styles.invoiceTitle }> INVOICE </Text>
        < Text style = { styles.invoiceNumber } >#{ invoice_number } </Text>
            < View style = { getStatusBadgeStyle(status) } >
                <Text>{ status.toUpperCase() } </Text>
                </View>
                </View>

{/* Billing Info Row */ }
<View style={ styles.row }>
    {/* Bill To */ }
    < View style = { styles.column } >
        <Text style={ styles.sectionTitle }> Bill To </Text>
{
    billing_address ? (
        <>
        { billing_address.street && <Text style={ styles.value }> { billing_address.street } </Text>
}
{
    billing_address.city && (
        <Text style={ styles.value }>
            { billing_address.city }
    { billing_address.state && `, ${billing_address.state}` } { billing_address.zip }
    </Text>
                )
}
{ billing_address.country && <Text style={ styles.value }> { billing_address.country } </Text> }
</>
            ) : (
    <Text style= { styles.value } > No billing address provided </Text>
            )}
</View>

{/* Invoice Details */ }
<View style={ styles.column }>
    <View style={ styles.infoRow }>
        <Text style={ styles.label }> Invoice Date: </Text>
            < Text style = { styles.value } >
                { format(new Date(invoice_date), 'MMM dd, yyyy')}
</Text>
    </View>
    < View style = { styles.infoRow } >
        <Text style={ styles.label }> Due Date: </Text>
            < Text style = { styles.value } >
                { format(new Date(due_date), 'MMM dd, yyyy')}
</Text>
    </View>
{
    paid_date && (
        <View style={ styles.infoRow }>
            <Text style={ styles.label }> Paid Date: </Text>
                < Text style = { styles.value } >
                    { format(new Date(paid_date), 'MMM dd, yyyy')
}
</Text>
    </View>
            )}
<View style={ styles.infoRow }>
    <Text style={ styles.label }> Payment Terms: </Text>
        < Text style = { styles.value } > Net 30 </Text>
            </View>
            </View>
            </View>

{/* Line Items Table */ }
<View style={ styles.table }>
    <Text style={ styles.sectionTitle }> Items </Text>

{/* Table Header */ }
<View style={ styles.tableHeader }>
    <Text style={ [styles.tableHeaderText, { flex: 3 }] }> Description </Text>
        < Text style = { [styles.tableHeaderText, { flex: 1, textAlign: 'center' }]} > Billing </Text>
            < Text style = { [styles.tableHeaderText, { flex: 1, textAlign: 'right' }]} > Amount </Text>
                </View>

{/* Table Row */ }
<View style={ styles.tableRow }>
    <Text style={ [styles.tableCell, { flex: 3 }] }>
        { plan_name } Plan Subscription
            </Text>
            < Text style = { [styles.tableCell, { flex: 1, textAlign: 'center' }]} >
                { billing_cycle === 'monthly' ? 'Monthly' : 'Yearly'}
</Text>
    < Text style = { [styles.tableCell, { flex: 1, textAlign: 'right' }]} >
        { formatCurrency(amount_cents, currency) }
        </Text>
        </View>
        </View>

{/* Totals Section */ }
<View style={ styles.totalsSection }>
    {/* Subtotal */ }
    < View style = { styles.totalRow } >
        <Text style={ styles.totalLabel }> Subtotal </Text>
            < Text style = { styles.totalValue } >
                { formatCurrency(amount_cents, currency) }
                </Text>
                </View>

{/* Tax */ }
{
    tax_cents > 0 && (
        <View style={ styles.totalRow }>
            <Text style={ styles.totalLabel }> Tax </Text>
                < Text style = { styles.totalValue } >
                    { formatCurrency(tax_cents, currency) }
                    </Text>
                    </View>
          )
}

{/* Discount */ }
{
    discount_cents > 0 && (
        <View style={ styles.totalRow }>
            <Text style={ styles.totalLabel }> Discount </Text>
                < Text style = { styles.totalValue } >
                    -{ formatCurrency(discount_cents, currency) }
                    </Text>
                    </View>
          )
}

{/* Grand Total */ }
<View style={ [styles.totalRow, styles.grandTotal] }>
    <Text style={ styles.grandTotalLabel }> Total Due </Text>
        < Text style = { styles.grandTotalValue } >
            { formatCurrency(total_cents, currency) }
            </Text>
            </View>
            </View>

{/* Payment Information */ }
{
    status === 'paid' && (
        <View style={ styles.notes }>
            <Text style={ { fontWeight: 'bold', marginBottom: 5 } }>✓ Payment Received </Text>
                <Text>
              This invoice has been paid in full.Thank you for your business!
        </Text>
            { paid_date && (
            <Text style= {{ marginTop: 5 }
}>
    Payment received on { format(new Date(paid_date), 'MMMM dd, yyyy') }
</Text>
            )}
</View>
        )}

{/* Footer */ }
<View style={ styles.footer }>
    <Text>Thank you for your business! </Text>
        < Text style = {{ marginTop: 5 }}>
            This invoice was generated electronically and is valid without a signature.
          </Text>
                < Text style = {{ marginTop: 5 }}>
                    Questions ? Contact us at support @obitox.com
</Text>
    </View>
    </Page>
    </Document>
  );
};

/**
 * Generate invoice PDF buffer
 * This is the main export function
 */
export async function generateInvoicePDF(invoice: InvoiceData): Promise<Buffer> {
    try {
        const startTime = Date.now();

        // Create PDF document
        const doc = <InvoicePDF invoice={ invoice } />;

        // Generate blob
        const blob = await pdf(doc).toBlob();

        // Convert to buffer
        const buffer = Buffer.from(await blob.arrayBuffer());

        return buffer;

    } catch (error) {
        console.error('[PDF] Generation failed:', error);
        throw new Error('Failed to generate PDF: ' + (error as Error).message);
    }
}

/**
 * Generate and store PDF (for background processing)
 */
export async function generateAndStorePDF(
    invoiceId: string
): Promise<{ url: string; hash: string }> {
    const { createClient } = await import('@/lib/supabase/server');
    const crypto = await import('crypto');

    try {
        const supabase = await createClient();

        // 1. Fetch invoice
        const { data: invoice, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('id', invoiceId)
            .single();

        if (error || !invoice) {
            throw new Error('Invoice not found');
        }

        // 2. Generate PDF
        const pdfBuffer = await generateInvoicePDF(invoice);

        // 3. Calculate hash for integrity
        const hash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');

        // 4. Upload to Supabase Storage (or S3)
        const fileName = `invoices/${invoice.invoice_number}.pdf`;

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('invoices')
            .upload(fileName, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (uploadError) {
            throw uploadError;
        }

        // 5. Get public URL
        const { data: urlData } = supabase
            .storage
            .from('invoices')
            .getPublicUrl(fileName);

        // 6. Update invoice record
        await supabase
            .from('invoices')
            .update({
                pdf_url: urlData.publicUrl,
                pdf_hash: hash,
                pdf_generated_at: new Date().toISOString()
            })
            .eq('id', invoiceId);

        return {
            url: urlData.publicUrl,
            hash
        };

    } catch (error) {
        console.error('[PDF] Storage failed:', error);
        throw error;
    }
}
