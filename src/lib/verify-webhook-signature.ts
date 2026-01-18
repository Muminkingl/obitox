/**
 * Verify Wayl webhook signature
 * 
 * Ensures webhook requests are genuinely from Wayl
 * Uses HMAC SHA-256 for signature verification
 */

import crypto from 'crypto';

export function verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    try {
        if (!signature || !secret) {
            console.error('[WEBHOOK] Missing signature or secret');
            return false;
        }

        // Create HMAC with SHA-256
        const hmac = crypto.createHmac('sha256', secret);
        const expectedSignature = hmac.update(payload).digest('hex');

        // Timing-safe comparison to prevent timing attacks
        const isValid = crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );

        if (!isValid) {
            console.warn('[WEBHOOK] Signature mismatch');
        }

        return isValid;
    } catch (error) {
        console.error('[WEBHOOK] Signature verification error:', error);
        return false;
    }
}
