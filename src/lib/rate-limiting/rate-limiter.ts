import { getRedisClient } from './redis-client';
import { checkMemoryRateLimit } from './memory-guard';
import { RATE_LIMIT_CONFIG, type UserTier, type Operation } from './config';

export interface RateLimitResult {
    allowed: boolean;
    current: number;
    limit: number;
    resetIn: number;
    layer: 'memory' | 'redis' | 'quota';
}

/**
 * Multi-layer rate limiting check
 * 
 * Layer 1: Memory guard (instant, prevents server overload)
 * Layer 2: Redis distributed limiting (per-hour limits)
 * Layer 3: Database quota (total limits)
 */
export async function checkRateLimit(
    userId: string,
    operation: Operation,
    tier: UserTier
): Promise<RateLimitResult> {
    // ==========================================
    // LAYER 1: MEMORY GUARD (0-2ms)
    // ==========================================
    const memoryLimit = RATE_LIMIT_CONFIG.MEMORY[operation];
    const memoryCheck = checkMemoryRateLimit(userId, operation, memoryLimit);

    if (!memoryCheck.allowed) {
        console.warn(`⚠️  Memory rate limit hit: ${userId} - ${operation}`);
        return {
            allowed: false,
            current: memoryCheck.current,
            limit: memoryLimit,
            resetIn: memoryCheck.resetIn,
            layer: 'memory'
        };
    }

    // ==========================================
    // LAYER 2: REDIS DISTRIBUTED LIMIT (5-20ms)
    // ==========================================
    try {
        const redis = getRedisClient();

        const hourlyLimits = RATE_LIMIT_CONFIG.HOURLY[tier];
        const hourlyLimit = hourlyLimits[operation];

        // -1 means unlimited
        if (hourlyLimit === -1) {
            return {
                allowed: true,
                current: 0,
                limit: -1,
                resetIn: 0,
                layer: 'redis'
            };
        }

        const key = `ratelimit:hourly:${operation}:${userId}`;
        const current = await redis.incr(key);

        // Set expiry on first increment
        if (current === 1) {
            await redis.expire(key, 3600); // 1 hour
        }

        const ttl = await redis.ttl(key);

        if (current > hourlyLimit) {
            console.warn(`⚠️  Redis rate limit hit: ${userId} - ${operation} (${current}/${hourlyLimit})`);
            return {
                allowed: false,
                current,
                limit: hourlyLimit,
                resetIn: ttl,
                layer: 'redis'
            };
        }

        return {
            allowed: true,
            current,
            limit: hourlyLimit,
            resetIn: ttl,
            layer: 'redis'
        };

    } catch (error) {
        // If Redis fails, fall back to memory-only rate limiting
        console.error('❌ Redis rate limit check failed:', error);
        console.log('⚠️  Falling back to memory-only rate limiting');

        return {
            allowed: memoryCheck.allowed,
            current: memoryCheck.current,
            limit: memoryLimit,
            resetIn: memoryCheck.resetIn,
            layer: 'memory'
        };
    }
}

/**
 * Reset rate limit for a user (admin function)
 */
export async function resetRateLimit(
    userId: string,
    operation: Operation
): Promise<void> {
    try {
        const redis = getRedisClient();

        const key = `ratelimit:hourly:${operation}:${userId}`;
        await redis.del(key);

        console.log(`✅ Rate limit reset for ${userId} - ${operation}`);
    } catch (error) {
        console.error('❌ Failed to reset rate limit:', error);
    }
}

/**
 * Get current rate limit status for a user
 */
export async function getRateLimitStatus(
    userId: string,
    operation: Operation,
    tier: UserTier
): Promise<{ current: number; limit: number; resetIn: number }> {
    try {
        const redis = getRedisClient();

        const hourlyLimits = RATE_LIMIT_CONFIG.HOURLY[tier];
        const limit = hourlyLimits[operation];

        if (limit === -1) {
            return { current: 0, limit: -1, resetIn: 0 };
        }

        const key = `ratelimit:hourly:${operation}:${userId}`;
        const current = await redis.get(key);
        const ttl = await redis.ttl(key);

        return {
            current: current ? parseInt(current) : 0,
            limit,
            resetIn: ttl > 0 ? ttl : 3600
        };
    } catch (error) {
        console.error('❌ Failed to get rate limit status:', error);
        return { current: 0, limit: 0, resetIn: 0 };
    }
}
