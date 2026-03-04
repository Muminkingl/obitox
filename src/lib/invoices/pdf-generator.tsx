// src/lib/invoices/pdf-generator.ts
import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    pdf,
    Line,
    Svg,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

// ─── Design tokens ────────────────────────────────────────────────────────────
const BRAND = '#0F172A';   // near-black
const ACCENT = '#2563EB';   // electric blue
const ACCENT2 = '#DBEAFE';   // ice blue (tint)
const MUTED = '#64748B';   // slate
const BORDER = '#E2E8F0';   // light slate
const WHITE = '#FFFFFF';
const SUCCESS = '#059669';   // emerald
const WARN = '#D97706';   // amber
const DANGER = '#DC2626';   // red

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: BRAND,
        backgroundColor: WHITE,
        paddingTop: 0,
        paddingBottom: 60,
        paddingLeft: 0,
        paddingRight: 0,
    },

    // ── Hero band at top ──────────────────────────────────────────────────────
    heroBand: {
        backgroundColor: BRAND,
        paddingTop: 36,
        paddingBottom: 36,
        paddingLeft: 48,
        paddingRight: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    heroLeft: {
        flexDirection: 'column',
    },
    brandName: {
        fontSize: 26,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
        letterSpacing: 1,
    },
    brandTagline: {
        fontSize: 8,
        color: '#94A3B8',
        marginTop: 3,
        letterSpacing: 0.5,
    },
    heroRight: {
        alignItems: 'flex-end',
    },
    heroInvoiceLabel: {
        fontSize: 8,
        color: '#94A3B8',
        letterSpacing: 2,
        marginBottom: 4,
    },
    heroInvoiceNumber: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
    },

    // ── Accent stripe under hero ──────────────────────────────────────────────
    accentStripe: {
        backgroundColor: ACCENT,
        height: 4,
    },

    // ── Body padding wrapper ──────────────────────────────────────────────────
    body: {
        paddingLeft: 48,
        paddingRight: 48,
        paddingTop: 32,
    },

    // ── Status pill ───────────────────────────────────────────────────────────
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
    },
    pill: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 20,
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1,
    },
    pillPaid: { backgroundColor: '#D1FAE5', color: SUCCESS },
    pillPending: { backgroundColor: '#FEF3C7', color: WARN },
    pillFailed: { backgroundColor: '#FEE2E2', color: DANGER },

    // ── Two-column info block ─────────────────────────────────────────────────
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    infoCol: {
        width: '47%',
    },
    infoColTitle: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: MUTED,
        letterSpacing: 1.5,
        marginBottom: 10,
    },
    infoLine: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    infoLabel: {
        width: 90,
        fontSize: 9,
        color: MUTED,
    },
    infoValue: {
        flex: 1,
        fontSize: 9,
        color: BRAND,
        fontFamily: 'Helvetica-Bold',
    },
    addressLine: {
        fontSize: 9,
        color: BRAND,
        marginBottom: 3,
        lineHeight: 1.4,
    },

    // ── Divider ───────────────────────────────────────────────────────────────
    divider: {
        borderBottom: 1,
        borderBottomColor: BORDER,
        marginBottom: 28,
    },

    // ── Items table ───────────────────────────────────────────────────────────
    tableLabel: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: MUTED,
        letterSpacing: 1.5,
        marginBottom: 10,
    },
    tableHead: {
        flexDirection: 'row',
        backgroundColor: BRAND,
        borderRadius: 4,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        marginBottom: 2,
    },
    tableHeadCell: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: '#94A3B8',
        letterSpacing: 0.8,
    },
    tableRow: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 12,
        paddingRight: 12,
        borderBottom: 1,
        borderBottomColor: BORDER,
    },
    tableRowAlt: {
        backgroundColor: '#F8FAFC',
    },
    tableCell: {
        fontSize: 9,
        color: BRAND,
    },
    colDesc: { flex: 4 },
    colCycle: { flex: 2, textAlign: 'center' },
    colAmt: { flex: 2, textAlign: 'right' },

    // ── Totals block ──────────────────────────────────────────────────────────
    totalsWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 24,
        marginBottom: 32,
    },
    totalsBox: {
        width: 260,
    },
    totalLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLineLabel: {
        fontSize: 9,
        color: MUTED,
    },
    totalLineValue: {
        fontSize: 9,
        color: BRAND,
        fontFamily: 'Helvetica-Bold',
    },
    grandTotalBox: {
        backgroundColor: ACCENT,
        borderRadius: 6,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    grandTotalLabel: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
        letterSpacing: 0.5,
    },
    grandTotalValue: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
    },

    // ── Payment confirmation box ───────────────────────────────────────────────
    paymentBox: {
        backgroundColor: '#F0FDF4',
        borderLeft: 3,
        borderLeftColor: SUCCESS,
        borderRadius: 4,
        padding: 14,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    paymentBoxText: {
        fontSize: 9,
        color: '#065F46',
        flex: 1,
    },
    paymentBoxBold: {
        fontFamily: 'Helvetica-Bold',
        color: SUCCESS,
    },

    // ── Footer ────────────────────────────────────────────────────────────────
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 16,
        paddingBottom: 20,
        paddingLeft: 48,
        paddingRight: 48,
        backgroundColor: '#F8FAFC',
        borderTop: 1,
        borderTopColor: BORDER,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLeft: {
        fontSize: 8,
        color: MUTED,
    },
    footerRight: {
        fontSize: 8,
        color: ACCENT,
        fontFamily: 'Helvetica-Bold',
    },
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface InvoiceData {
    id: string;
    invoice_number: string;
    invoice_date: string;
    due_date?: string;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (cents: number, currency = 'USD'): string => {
    const symbols: Record<string, string> = { USD: '$', EUR: '€', IQD: 'IQD ' };
    return `${symbols[currency] ?? '$'}${(cents / 100).toFixed(2)}`;
};

const fmtDate = (iso: string) => format(new Date(iso), 'MMM dd, yyyy');

const pillStyle = (status: string) => {
    if (status === 'pending') return [s.pill, s.pillPending];
    if (status === 'failed') return [s.pill, s.pillFailed];
    return [s.pill, s.pillPaid];
};

// ─── PDF Component ────────────────────────────────────────────────────────────
const InvoicePDF: React.FC<{ invoice: InvoiceData }> = ({ invoice }) => {
    const {
        invoice_number, invoice_date, due_date, paid_date,
        status, plan_name, billing_cycle,
        amount_cents, tax_cents, discount_cents, total_cents,
        currency, billing_address,
    } = invoice;

    const billingLabel = billing_cycle === 'monthly' ? 'Monthly' : 'Annual';

    return (
        <Document
            title={`Invoice ${invoice_number}`}
            author="ObitoX"
            subject="Subscription Invoice"
        >
            <Page size="A4" style={s.page}>

                {/* ── Hero band ── */}
                <View style={s.heroBand}>
                    <View style={s.heroLeft}>
                        <Text style={s.brandName}>OBITOX</Text>
                        <Text style={s.brandTagline}>PROFESSIONAL API SOLUTIONS</Text>
                    </View>
                    <View style={s.heroRight}>
                        <Text style={s.heroInvoiceLabel}>INVOICE</Text>
                        <Text style={s.heroInvoiceNumber}>#{invoice_number}</Text>
                    </View>
                </View>

                {/* ── Blue accent stripe ── */}
                <View style={s.accentStripe} />

                {/* ── Body ── */}
                <View style={s.body}>

                    {/* ── Status pill ── */}
                    <View style={s.statusRow}>
                        <View style={pillStyle(status)}>
                            <Text>● {status.toUpperCase()}</Text>
                        </View>
                    </View>

                    {/* ── Info grid ── */}
                    <View style={s.infoGrid}>

                        {/* Bill To */}
                        <View style={s.infoCol}>
                            <Text style={s.infoColTitle}>BILL TO</Text>
                            {billing_address ? (
                                <>
                                    {billing_address.street && <Text style={s.addressLine}>{billing_address.street}</Text>}
                                    {billing_address.city && (
                                        <Text style={s.addressLine}>
                                            {billing_address.city}
                                            {billing_address.state ? `, ${billing_address.state}` : ''}
                                            {billing_address.zip ? `  ${billing_address.zip}` : ''}
                                        </Text>
                                    )}
                                    {billing_address.country && <Text style={s.addressLine}>{billing_address.country}</Text>}
                                </>
                            ) : (
                                <Text style={[s.addressLine, { color: MUTED }]}>No billing address on file</Text>
                            )}
                        </View>

                        {/* Invoice details */}
                        <View style={s.infoCol}>
                            <Text style={s.infoColTitle}>INVOICE DETAILS</Text>

                            <View style={s.infoLine}>
                                <Text style={s.infoLabel}>Invoice date</Text>
                                <Text style={s.infoValue}>{fmtDate(invoice_date)}</Text>
                            </View>

                            {due_date && (
                                <View style={s.infoLine}>
                                    <Text style={s.infoLabel}>Due date</Text>
                                    <Text style={s.infoValue}>{fmtDate(due_date)}</Text>
                                </View>
                            )}

                            {paid_date && (
                                <View style={s.infoLine}>
                                    <Text style={s.infoLabel}>Paid on</Text>
                                    <Text style={[s.infoValue, { color: SUCCESS }]}>{fmtDate(paid_date)}</Text>
                                </View>
                            )}

                            <View style={s.infoLine}>
                                <Text style={s.infoLabel}>Currency</Text>
                                <Text style={s.infoValue}>{currency}</Text>
                            </View>

                            <View style={s.infoLine}>
                                <Text style={s.infoLabel}>Payment terms</Text>
                                <Text style={s.infoValue}>Due on receipt</Text>
                            </View>
                        </View>
                    </View>

                    {/* ── Divider ── */}
                    <View style={s.divider} />

                    {/* ── Items table ── */}
                    <Text style={s.tableLabel}>LINE ITEMS</Text>

                    <View style={s.tableHead}>
                        <Text style={[s.tableHeadCell, s.colDesc]}>DESCRIPTION</Text>
                        <Text style={[s.tableHeadCell, s.colCycle, { textAlign: 'center' }]}>BILLING</Text>
                        <Text style={[s.tableHeadCell, s.colAmt, { textAlign: 'right' }]}>AMOUNT</Text>
                    </View>

                    <View style={s.tableRow}>
                        <Text style={[s.tableCell, s.colDesc]}>
                            {plan_name} Plan — Subscription
                        </Text>
                        <Text style={[s.tableCell, s.colCycle, { textAlign: 'center' }]}>
                            {billingLabel}
                        </Text>
                        <Text style={[s.tableCell, s.colAmt, { textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>
                            {fmt(amount_cents, currency)}
                        </Text>
                    </View>

                    {/* ── Totals ── */}
                    <View style={s.totalsWrapper}>
                        <View style={s.totalsBox}>

                            <View style={s.totalLine}>
                                <Text style={s.totalLineLabel}>Subtotal</Text>
                                <Text style={s.totalLineValue}>{fmt(amount_cents, currency)}</Text>
                            </View>

                            {tax_cents > 0 && (
                                <View style={s.totalLine}>
                                    <Text style={s.totalLineLabel}>Tax</Text>
                                    <Text style={s.totalLineValue}>{fmt(tax_cents, currency)}</Text>
                                </View>
                            )}

                            {discount_cents > 0 && (
                                <View style={s.totalLine}>
                                    <Text style={s.totalLineLabel}>Discount</Text>
                                    <Text style={[s.totalLineValue, { color: SUCCESS }]}>
                                        −{fmt(discount_cents, currency)}
                                    </Text>
                                </View>
                            )}

                            <View style={s.grandTotalBox}>
                                <Text style={s.grandTotalLabel}>TOTAL DUE</Text>
                                <Text style={s.grandTotalValue}>{fmt(total_cents, currency)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* ── Payment confirmation (paid only) ── */}
                    {status === 'paid' && paid_date && (
                        <View style={s.paymentBox}>
                            <Text style={s.paymentBoxText}>
                                <Text style={s.paymentBoxBold}>✓ Payment received</Text>
                                {'  '}This invoice was paid in full on {fmtDate(paid_date)}.
                                No further action is required.
                            </Text>
                        </View>
                    )}

                </View>

                {/* ── Footer ── */}
                <View style={s.footer} fixed>
                    <Text style={s.footerLeft}>
                        Thank you for your business.  ·  This invoice was generated electronically.
                    </Text>
                    <Text style={s.footerRight}>support@obitox.dev</Text>
                </View>

            </Page>
        </Document>
    );
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate invoice PDF buffer.
 * Call this from a Next.js Route Handler or Server Action — never from client code.
 */
export async function generateInvoicePDF(invoice: InvoiceData): Promise<Buffer> {
    try {
        const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();
        return Buffer.from(await blob.arrayBuffer());
    } catch (error) {
        console.error('[PDF] Generation failed:', error);
        throw new Error('Failed to generate PDF: ' + (error as Error).message);
    }
}

/**
 * Generate PDF, upload to Supabase Storage, update invoice record with URL + hash.
 *
 * FIX: removed unused startTime variable.
 * FIX: uses dynamic import for server-only modules (supabase/server, crypto).
 */
export async function generateAndStorePDF(
    invoiceId: string,
): Promise<{ url: string; hash: string }> {
    const { createClient } = await import('@/lib/supabase/server');
    const crypto = await import('crypto');

    const supabase = await createClient();

    // 1. Fetch invoice — select only needed columns, not select('*')
    const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select(`
            id, invoice_number, invoice_date, due_date, paid_date,
            status, plan_name, billing_cycle,
            amount_cents, tax_cents, discount_cents, total_cents,
            currency, billing_address, user_id
        `)
        .eq('id', invoiceId)
        .single();

    if (fetchError || !invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
    }

    // 2. Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice);

    // 3. Integrity hash
    const hash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
    const fileName = `invoices/${invoice.invoice_number}.pdf`;

    // 4. Upload (upsert — safe to re-run)
    const { error: uploadError } = await supabase
        .storage
        .from('invoices')
        .upload(fileName, pdfBuffer, { contentType: 'application/pdf', upsert: true });

    if (uploadError) throw uploadError;

    // 5. Public URL
    const { data: urlData } = supabase
        .storage
        .from('invoices')
        .getPublicUrl(fileName);

    // 6. Persist URL + hash on the invoice row
    await supabase
        .from('invoices')
        .update({
            pdf_url: urlData.publicUrl,
            pdf_hash: hash,
            pdf_generated_at: new Date().toISOString(),
        })
        .eq('id', invoiceId);

    return { url: urlData.publicUrl, hash };
}