/**
 * Wayl Payment Gateway API Client
 * 
 * Centralized wrapper for all Wayl API interactions
 * Handles authentication, error handling, and logging
 */

const WAYL_API_URL = process.env.WAYL_API_URL || 'https://api.thewayl.com';
const WAYL_API_KEY = process.env.WAYL_API_KEY!;

if (!WAYL_API_KEY) {
    throw new Error('WAYL_API_KEY is not configured');
}

/**
 * Verify Wayl API key is valid
 */
export async function verifyAuthKey(): Promise<boolean> {
    try {
        const response = await fetch(`${WAYL_API_URL}/api/v1/verify-auth-key`, {
            headers: {
                'X-WAYL-AUTHENTICATION': WAYL_API_KEY
            }
        });

        return response.ok;
    } catch (error) {
        console.error('[WAYL] Failed to verify API key:', error);
        return false;
    }
}

/**
 * Create a payment link for checkout
 */
export async function createPaymentLink(params: {
    referenceId: string;
    total: number;
    currency: string;
    webhookUrl: string;
    webhookSecret: string;
    redirectionUrl: string;
    planName?: string;
}): Promise<{
    orderId: string;
    paymentUrl: string;
}> {
    try {
        // Build request body with correct lineItem array (per Wayl API docs)
        const requestBody = {
            referenceId: params.referenceId,
            total: params.total,
            currency: params.currency,
            customParameter: '',
            webhookUrl: params.webhookUrl || '',
            webhookSecret: params.webhookSecret || '1234567890',
            redirectionUrl: params.redirectionUrl,
            lineItem: [
                {
                    amount: params.total,
                    label: params.planName || 'Pro Subscription',
                    type: 'increase',
                    image: 'https://i.imgur.com/7MmN4jh_d.webp?maxwidth=760&fidelity=grand'
                }
            ]
        };

        const response = await fetch(`${WAYL_API_URL}/api/v1/links`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WAYL-AUTHENTICATION': WAYL_API_KEY
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            console.error('[WAYL] Payment link creation failed:', error);
            throw new Error(error.message || 'Payment link creation failed');
        }

        const response_data = await response.json();
        const data = response_data.data || response_data;

        return {
            orderId: data.id || data.orderId || data.referenceId,
            paymentUrl: data.url || data.paymentUrl || data.payUrl || data.link
        };
    } catch (error: any) {
        console.error('[WAYL] Error creating payment link:', error);
        throw error;
    }
}


/**
 * Create a refund for a completed payment
 */
export async function createRefund(params: {
    referenceId: string;
    amount: number;
    reason: string;
}): Promise<{
    refundId: string;
    status: string;
}> {
    try {
        if (params.reason.length < 100) {
            throw new Error('Refund reason must be at least 100 characters');
        }

        const response = await fetch(`${WAYL_API_URL}/api/v1/refunds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WAYL-AUTHENTICATION': WAYL_API_KEY
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            console.error('[WAYL] Refund creation failed:', error);
            throw new Error(error.message || 'Refund creation failed');
        }

        const data = await response.json();

        return {
            refundId: data.refundId || data.refund_id,
            status: data.status
        };
    } catch (error: any) {
        console.error('[WAYL] Error creating refund:', error);
        throw error;
    }
}
