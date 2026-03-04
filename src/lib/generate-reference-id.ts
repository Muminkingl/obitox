/**
 * Generate unique Wayl reference ID
 * 
 * Format: wayl_{userId}_{plan}_{timestamp}
 * Example: wayl_abc123_pro_1706000000
 * 
 * This ID is used to:
 * - Track payments in our system
 * - Match webhook callbacks
 * - Handle refunds and reconciliation
 */

export function generateReferenceId(
    userId: string,
    plan: string
): string {
    const timestamp = Date.now();
    const cleanUserId = userId.replace(/-/g, '').substring(0, 12); // Remove dashes, limit length
    const cleanPlan = plan.toLowerCase();

    return `wayl_${cleanUserId}_${cleanPlan}_${timestamp}`;
}

/**
 * Parse reference ID to extract components
 */
export function parseReferenceId(referenceId: string): {
    userId: string;
    plan: string;
    timestamp: number;
} | null {
    const parts = referenceId.split('_');

    if (parts.length !== 4 || parts[0] !== 'wayl') {
        return null;
    }

    return {
        userId: parts[1],
        plan: parts[2],
        timestamp: parseInt(parts[3])
    };
}
