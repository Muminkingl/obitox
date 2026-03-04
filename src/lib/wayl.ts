/**
 * Wayl Payment Integration Helper
 * 
 * Provides functions to interact with the Wayl payment API.
 * Documentation: https://docs.thewayl.com/api
 */

const WAYL_API_BASE = 'https://api.thewayl.com/api/v1';

/**
 * Makes an authenticated request to the Wayl API
 */
async function waylFetch(endpoint: string, options: RequestInit = {}) {
    const waylToken = process.env.WAYL_TOKEN;

    if (!waylToken) {
        throw new Error('WAYL_TOKEN environment variable is not configured');
    }

    const response = await fetch(`${WAYL_API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-WAYL-AUTHENTICATION': waylToken,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Wayl API error (${response.status}): ${error}`);
    }

    return response.json();
}

/**
 * Creates a payment link via Wayl
 * 
 * @param amount - Amount in USD (e.g., 23 for $23)
 * @param currency - Currency code (default: USD)
 * @param referenceId - Unique reference ID for tracking this payment
 * @param redirectionUrl - URL to redirect user after payment
 * @returns Payment link data including payUrl
 */
export async function createPaymentLink(
    amount: number,
    currency: string,
    referenceId: string,
    redirectionUrl: string
): Promise<{ payUrl: string; referenceId: string }> {
    const data = await waylFetch('/links', {
        method: 'POST',
        body: JSON.stringify({
            amount,
            currency,
            referenceId,
            redirectionUrl,
        }),
    });

    return {
        payUrl: data.payUrl,
        referenceId: data.referenceId || referenceId,
    };
}

/**
 * Verifies payment status via Wayl API
 * 
 * @param referenceId - The reference ID from the payment link
 * @returns Payment status data
 */
export async function verifyPaymentStatus(referenceId: string): Promise<{
    status: 'pending' | 'paid' | 'failed' | 'cancelled';
    amount?: number;
    currency?: string;
    paidAt?: string;
}> {
    const data = await waylFetch(`/links/${referenceId}`, {
        method: 'GET',
    });

    return {
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        paidAt: data.paidAt,
    };
}

/**
 * Plan pricing configuration
 */
export const PLAN_PRICING = {
    pro: {
        monthly: 23,
        yearly: 19,
    },
    enterprise: {
        monthly: null, // Contact sales
        yearly: null,
    },
} as const;

/**
 * Get plan amount in USD
 */
export function getPlanAmount(plan: 'pro' | 'enterprise', billingCycle: 'monthly' | 'yearly' = 'monthly'): number {
    if (plan === 'enterprise') {
        throw new Error('Enterprise plans require custom pricing - contact sales');
    }

    return PLAN_PRICING[plan][billingCycle]!;
}
