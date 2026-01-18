/**
 * REDIS CONNECTION DIAGNOSTIC TEST
 * Simple test to debug Upstash connection
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import Redis from 'ioredis';

async function testRedisConnection() {
    console.log('\n🔍 REDIS CONNECTION DIAGNOSTIC\n');
    console.log('='.repeat(60));

    const redisUrl = process.env.REDIS_URL;
    console.log('\n📝 Environment Check:');
    console.log(`REDIS_URL exists: ${!!redisUrl}`);
    console.log(`REDIS_URL value: ${redisUrl?.substring(0, 30)}...`);

    if (!redisUrl) {
        console.log('❌ REDIS_URL not found in environment');
        return;
    }

    // Test 1: Basic connection
    console.log('\n\n📝 TEST 1: Basic Connection (No TLS)');
    console.log('-'.repeat(60));

    try {
        const redis1 = new Redis(redisUrl, {
            maxRetriesPerRequest: 1,
            connectTimeout: 10000,
            enableReadyCheck: true,
            enableOfflineQueue: false
        });

        redis1.on('connect', () => console.log('✅ Connect event fired'));
        redis1.on('ready', () => console.log('✅ Ready event fired'));
        redis1.on('error', (err) => console.log('❌ Error event:', err.message));
        redis1.on('close', () => console.log('⚠️  Close event fired'));
        redis1.on('end', () => console.log('⚠️  End event fired'));

        console.log('Attempting to ping...');
        const pong = await redis1.ping();
        console.log(`✅ PING successful: ${pong}`);

        await redis1.quit();
        console.log('✅ Test 1 PASSED');

    } catch (error) {
        console.log(`❌ Test 1 FAILED: ${error.message}`);
    }

    // Test 2: With TLS enabled
    console.log('\n\n📝 TEST 2: Connection with TLS Enabled');
    console.log('-'.repeat(60));

    try {
        // Check if URL uses rediss:// (TLS)
        const usesTLS = redisUrl.startsWith('rediss://');
        console.log(`URL protocol: ${usesTLS ? 'rediss:// (TLS)' : 'redis:// (Plain)'}`);

        const redis2 = new Redis(redisUrl, {
            maxRetriesPerRequest: 1,
            connectTimeout: 10000,
            enableReadyCheck: true,
            enableOfflineQueue: false,
            tls: {
                rejectUnauthorized: false // Accept self-signed certificates (Upstash uses this)
            }
        });

        redis2.on('connect', () => console.log('✅ Connect event fired'));
        redis2.on('ready', () => console.log('✅ Ready event fired'));
        redis2.on('error', (err) => console.log('❌ Error event:', err.message));
        redis2.on('close', () => console.log('⚠️  Close event fired'));

        console.log('Attempting to ping...');
        const pong = await redis2.ping();
        console.log(`✅ PING successful: ${pong}`);

        // Try a SET/GET operation
        console.log('\nTesting SET/GET operations...');
        await redis2.set('test:key', 'Hello Upstash!');
        const value = await redis2.get('test:key');
        console.log(`✅ SET/GET successful: ${value}`);

        await redis2.del('test:key');
        await redis2.quit();
        console.log('✅ Test 2 PASSED - CONNECTION WORKING! 🎉');

    } catch (error) {
        console.log(`❌ Test 2 FAILED: ${error.message}`);
        console.log('\n💡 Tip: Upstash requires TLS. Your URL should start with rediss://');
    }

    // Test 3: Parse URL and show details
    console.log('\n\n📝 TEST 3: URL Parse Check');
    console.log('-'.repeat(60));

    try {
        const url = new URL(redisUrl);
        console.log(`Protocol: ${url.protocol}`);
        console.log(`Hostname: ${url.hostname}`);
        console.log(`Port: ${url.port}`);
        console.log(`Username: ${url.username || 'default'}`);
        console.log(`Password: ${url.password ? '***' + url.password.slice(-4) : 'none'}`);

        if (url.protocol === 'redis:' && url.hostname.includes('upstash.io')) {
            console.log('\n⚠️  WARNING: You\'re using redis:// with Upstash!');
            console.log('💡 Upstash requires TLS. Change to rediss:// (double s)');
            console.log('\n✅ RECOMMENDED FIX:');
            console.log(`REDIS_URL="${redisUrl.replace('redis://', 'rediss://')}"`);
        }

    } catch (error) {
        console.log(`❌ Failed to parse URL: ${error.message}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🏁 Diagnostic complete!\n');
}

testRedisConnection().catch(console.error);
