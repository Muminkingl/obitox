/**
 * REDIS CONNECTION TEST - SIMPLIFIED
 * Testing Upstash Redis with TLS
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import Redis from 'ioredis';

async function testRedis() {
    console.log('\n🔍 TESTING UPSTASH REDIS CONNECTION\n');
    console.log('='.repeat(60));

    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
        console.log('❌ REDIS_URL not found');
        return;
    }

    console.log(`\n✅ REDIS_URL configured: ${redisUrl.substring(0, 30)}...`);
    console.log(`✅ Protocol: ${redisUrl.startsWith('rediss://') ? 'TLS (rediss://)' : 'Plain (redis://)'}\n`);

    console.log('📝 Creating Redis client...');

    const redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        connectTimeout: 10000,
        tls: {
            rejectUnauthorized: false // Required for Upstash
        }
    });

    redis.on('connect', () => console.log('   ✅ Connected'));
    redis.on('ready', () => console.log('   ✅ Ready'));
    redis.on('error', (err) => console.log(`   ❌ Error: ${err.message}`));

    try {
        console.log('\n📝 Testing PING command...');
        const pong = await redis.ping();
        console.log(`   ✅ PING → ${pong}`);

        console.log('\n📝 Testing SET command...');
        await redis.set('test:hello', 'Hello from ObitoX!', 'EX', 60);
        console.log('   ✅ SET successful');

        console.log('\n📝 Testing GET command...');
        const value = await redis.get('test:hello');
        console.log(`   ✅ GET → "${value}"`);

        console.log('\n📝 Testing INCR command (rate limiting simulation)...');
        const count1 = await redis.incr('test:counter');
        const count2 = await redis.incr('test:counter');
        const count3 = await redis.incr('test:counter');
        console.log(`   ✅ INCR → ${count1}, ${count2}, ${count3}`);

        console.log('\n📝 Testing TTL command...');
        await redis.expire('test:counter', 3600);
        const ttl = await redis.ttl('test:counter');
        console.log(`   ✅ TTL → ${ttl} seconds`);

        console.log('\n📝 Cleanup...');
        await redis.del('test:hello', 'test:counter');
        console.log('   ✅ Cleaned up test keys');

        await redis.quit();
        console.log('   ✅ Connection closed');

        console.log('\n' + '='.repeat(60));
        console.log('🎉 ALL TESTS PASSED! Redis is working perfectly! 🎉');
        console.log('='.repeat(60) + '\n');

    } catch (error: any) {
        console.log(`\n❌ Test failed: ${error.message}\n`);
        await redis.quit();
    }
}

testRedis();
