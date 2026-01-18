/**
 * Rate Limiting Infrastructure
 * 
 * Uses existing ioredis client for rate limiting
 * Sliding window algorithm with Redis
 */

import { getRedisClient } from './rate-limiting/redis-client';

interface RateLimitResult {
    success: boolean;
    remaining: number;
    reset: number;
}

/**
 * Simple rate limiter using ioredis
 * Implements sliding window algorithm
 */
class SimpleRateLimiter {
    private prefix: string;
    private limit: number;
    private windowSeconds: number;

    constructor(prefix: string, limit: number, windowSeconds: number) {
        this.prefix = prefix;
        this.limit = limit;
        this.windowSeconds = windowSeconds;
    }

    async check(identifier: string): Promise<RateLimitResult> {
        try {
            const redis = getRedisClient();
            const key = `${this.prefix}:${identifier}`;
            const now = Date.now();
            const windowStart = now - (this.windowSeconds * 1000);

            console.log(`[RATE LIMIT] Checking ${key}, limit: ${this.limit}, window: ${this.windowSeconds}s`);

            // Use Redis transaction (pipeline) for atomicity
            const pipeline = redis.pipeline();

            // 1. Remove old entries outside the window
            pipeline.zremrangebyscore(key, 0, windowStart);

            // 2. Add current request
            const member = `${now}-${Math.random()}`;
            pipeline.zadd(key, now, member);

            // 3. Count total requests in window (including new one)
            pipeline.zcard(key);

            // 4. Set expiry (will only apply if key doesn't exist)
            pipeline.expire(key, this.windowSeconds, 'NX'); // NX = only if no expiry exists

            // Execute atomically
            const results = await pipeline.exec();

            if (!results) {
                throw new Error('Pipeline execution failed');
            }

            // Parse results
            const removedCount = results[0][1] as number;
            const zcardResult = results[2][1] as number;

            console.log(`[RATE LIMIT] Removed ${removedCount} old entries`);
            console.log(`[RATE LIMIT] Current count: ${zcardResult}/${this.limit}`);

            // Check if limit exceeded
            if (zcardResult > this.limit) {
                // Remove the request we just added (rollback)
                await redis.zrem(key, member);
                
                console.log(`[RATE LIMIT] ❌ BLOCKED - Limit exceeded (${zcardResult}/${this.limit})`);

                // Calculate reset time (when oldest request expires)
                const oldestRequest = await redis.zrange(key, 0, 0, 'WITHSCORES');
                const resetTime = oldestRequest.length > 0
                    ? parseInt(oldestRequest[1] as string) + (this.windowSeconds * 1000)
                    : now + (this.windowSeconds * 1000);

                return {
                    success: false,
                    remaining: 0,
                    reset: resetTime
                };
            }

            const remaining = this.limit - zcardResult;
            console.log(`[RATE LIMIT] ✅ ALLOWED - Remaining: ${remaining}/${this.limit}`);

            return {
                success: true,
                remaining,
                reset: now + (this.windowSeconds * 1000)
            };

        } catch (error) {
            console.error('[RATE LIMIT ERROR]', error);
            // On error, allow request (fail open)
            return {
                success: true,
                remaining: this.limit,
                reset: Date.now() + (this.windowSeconds * 1000)
            };
        }
    }
}

/**
 * Subscription endpoint rate limit: 10 requests per 60 seconds per IP
 * Prevents spam refreshing of /api/subscription
 */
export const subscriptionRateLimit = new SimpleRateLimiter(
    'ratelimit:subscription',
    10,
    60
);

/**
 * General API rate limit: 100 requests per minute per IP
 */
export const apiRateLimit = new SimpleRateLimiter(
    'ratelimit:api',
    100,
    60
);

/**
 * Strict rate limit for sensitive endpoints: 5 requests per minute
 */
export const strictRateLimit = new SimpleRateLimiter(
    'ratelimit:strict',
    5,
    60
);