import { Redis } from 'ioredis';

interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

export class RateLimiter {
    private redis: Redis;
    private limit: number;
    private windowSeconds: number;

    constructor(redis: Redis, limit: number, windowSeconds: number = 60) {
        this.redis = redis;
        this.limit = limit;
        this.windowSeconds = windowSeconds;
    }

    async check(identifier: string): Promise<RateLimitResult> {
        const key = `ratelimit:${identifier}`;
        const now = Date.now();
        const windowStart = now - (this.windowSeconds * 1000);

        try {
            // Remove old entries
            await this.redis.zremrangebyscore(key, 0, windowStart);

            // Count current entries
            const zcardResult = await this.redis.zcard(key);

            if (zcardResult >= this.limit) {
                const ttl = await this.redis.ttl(key);
                return {
                    success: false,
                    limit: this.limit,
                    remaining: 0,
                    reset: now + (ttl * 1000)
                };
            }

            // Add new entry
            await this.redis.zadd(key, now, `${now}-${Math.random()}`);
            await this.redis.expire(key, this.windowSeconds);

            const remaining = this.limit - zcardResult - 1;
            return {
                success: true,
                limit: this.limit,
                remaining: Math.max(0, remaining),
                reset: now + (this.windowSeconds * 1000)
            };
        } catch (error) {
            console.error('[Rate Limit] Error:', error);
            // Fail open - allow request on error
            return {
                success: true,
                limit: this.limit,
                remaining: this.limit,
                reset: now + (this.windowSeconds * 1000)
            };
        }
    }
}

// Singleton instance
let rateLimiter: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
    if (!rateLimiter) {
        const redis = new Redis(process.env.REDIS_URL!, {
            maxRetriesPerRequest: 3,
            tls: { rejectUnauthorized: false }
        });
        rateLimiter = new RateLimiter(redis, 100, 60);
    }
    return rateLimiter;
}

// Export convenience instance for API routes
export const apiRateLimit = {
    check: async (identifier: string): Promise<RateLimitResult> => {
        const limiter = getRateLimiter();
        return limiter.check(identifier);
    }
};

// Subscription endpoint rate limiter (10 requests per 60 seconds)
let subscriptionLimiter: RateLimiter | null = null;

export const subscriptionRateLimit = {
    check: async (identifier: string): Promise<RateLimitResult> => {
        if (!subscriptionLimiter) {
            const redis = new Redis(process.env.REDIS_URL!, {
                maxRetriesPerRequest: 3,
                tls: { rejectUnauthorized: false }
            });
            subscriptionLimiter = new RateLimiter(redis, 10, 60);
        }
        return subscriptionLimiter.check(identifier);
    }
};