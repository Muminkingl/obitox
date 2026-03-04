import Redis from 'ioredis';

let redis: Redis | null = null;

/**
 * Get or create Redis client instance
 * Supports both local Redis and Upstash
 */
export function getRedisClient(): Redis {
    if (!redis) {
        const redisUrl = process.env.REDIS_URL;

        if (!redisUrl) {
            throw new Error('Redis not configured');
        }

        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
                if (times > 3) {
                    return null;
                }
                return Math.min(times * 50, 2000);
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        redis.on('error', (err) => {
            console.error('[Redis] Connection error:', err.message);
        });
    }

    return redis;
}

/**
 * Test Redis connection
 */
export async function testRedisConnection(): Promise<boolean> {
    try {
        const client = getRedisClient();
        await client.ping();
        return true;
    } catch (error) {
        console.error('[Redis] Connection test failed:', error);
        return false;
    }
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
    if (redis) {
        await redis.quit();
        redis = null;
    }
}
