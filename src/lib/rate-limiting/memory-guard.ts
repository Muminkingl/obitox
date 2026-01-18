/**
 * In-memory rate limiting guard
 * Provides fast, lightweight protection against rapid requests
 * 
 * This is Layer 1 of our defense - catches abuse before hitting Redis/DB
 */

interface RateLimitRecord {
    count: number;
    resetAt: number;
}

// In-memory store
const requestCounts = new Map<string, RateLimitRecord>();

/**
 * Check if request is allowed based on in-memory rate limit
 * 
 * @param userId - User identifier
 * @param operation - Operation type (e.g., 'domain-create')
 * @param limit - Max requests per window (default: 10)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 */
export function checkMemoryRateLimit(
    userId: string,
    operation: string,
    limit: number = 10,
    windowMs: number = 60 * 1000
): { allowed: boolean; resetIn: number; current: number } {
    const key = `${userId}:${operation}`;
    const now = Date.now();

    const record = requestCounts.get(key);

    // No record or window expired - start new window
    if (!record || now > record.resetAt) {
        requestCounts.set(key, {
            count: 1,
            resetAt: now + windowMs
        });

        return {
            allowed: true,
            resetIn: Math.ceil(windowMs / 1000),
            current: 1
        };
    }

    // Check if limit exceeded
    if (record.count >= limit) {
        const resetIn = Math.ceil((record.resetAt - now) / 1000);
        return {
            allowed: false,
            resetIn,
            current: record.count
        };
    }

    // Increment count
    record.count++;
    requestCounts.set(key, record);

    const resetIn = Math.ceil((record.resetAt - now) / 1000);
    return {
        allowed: true,
        resetIn,
        current: record.count
    };
}

/**
 * Cleanup expired entries (runs periodically)
 * Prevents memory leaks from old rate limit records
 */
export function cleanupExpiredRecords(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, record] of requestCounts.entries()) {
        if (now > record.resetAt) {
            requestCounts.delete(key);
            cleaned++;
        }
    }

    if (cleaned > 0) {
        console.log(`🧹 Cleaned up ${cleaned} expired rate limit records`);
    }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredRecords, 5 * 60 * 1000);

/**
 * Get current in-memory rate limit stats (for debugging)
 */
export function getMemoryStats() {
    return {
        totalKeys: requestCounts.size,
        memoryUsageApprox: requestCounts.size * 50 // ~50 bytes per entry
    };
}
