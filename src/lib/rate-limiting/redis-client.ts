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
            console.warn('⚠️  REDIS_URL not set - Redis features disabled');
            throw new Error('Redis not configured');
        }

        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
                if (times > 3) {
                    console.error('❌ Redis connection failed after 3 retries');
                    return null;
                }
                return Math.min(times * 50, 2000);
            },
            tls: {
                rejectUnauthorized: false // Required for Upstash
            }
        });

        redis.on('connect', () => {
            console.log('✅ Redis connected successfully');
        });

        redis.on('error', (err) => {
            console.error('❌ Redis error:', err.message);
        });

        redis.on('close', () => {
            console.log('⚠️  Redis connection closed');
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
        console.log('✅ Redis connection test passed');
        return true;
    } catch (error) {
        console.error('❌ Redis connection test failed:', error);
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
