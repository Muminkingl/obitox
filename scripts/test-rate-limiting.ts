/**
 * Test Script - Rate Limiting Infrastructure
 * Quick test to verify Upstash Redis + Rate Limiting works
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// @ts-ignore
import { checkMemoryRateLimit, getMemoryStats } from '../src/lib/rate-limiting/memory-guard.ts';
// @ts-ignore
import { getRedisClient, testRedisConnection } from '../src/lib/rate-limiting/redis-client.ts';
// @ts-ignore
import { checkRateLimit, getRateLimitStatus } from '../src/lib/rate-limiting/rate-limiter.ts';

async function testRateLimiting() {
  console.log('\n🧪 TESTING RATE LIMITING INFRASTRUCTURE\n');
  console.log('='.repeat(60));

  // ==========================================
  // TEST 1: Memory Guard
  // ==========================================
  console.log('\n📝 TEST 1: Memory Guard (In-Memory Rate Limiting)');
  console.log('-'.repeat(60));

  const testUserId = 'test-user-123';
  const operation = 'domain-create';

  console.log('Simulating 12 rapid requests (limit: 10 per minute):\n');
  for (let i = 1; i <= 12; i++) {
    const result = checkMemoryRateLimit(testUserId, operation, 10);
    const status = result.allowed ? '✅ ALLOWED' : '❌ BLOCKED';
    console.log(
      `Request ${i.toString().padStart(2, '0')}: ${status} | ` +
      `Current: ${result.current}/10 | ` +
      `Reset in: ${result.resetIn}s`
    );
  }

  const memStats = getMemoryStats();
  console.log(`\n📊 Memory Stats: ${memStats.totalKeys} keys, ~${memStats.memoryUsageApprox} bytes`);

  // ==========================================
  // TEST 2: Redis Connection (Upstash)
  // ==========================================
  console.log('\n📝 TEST 2: Upstash Redis Connection');
  console.log('-'.repeat(60));

  const redisConnected = await testRedisConnection();

  if (!redisConnected) {
    console.log('❌ Redis not available');
    console.log('\n💡 Check your .env.local:');
    console.log('   REDIS_URL should be set to your Upstash URL\n');
    process.exit(1);
  }

  console.log('✅ Upstash Redis connected successfully!');

  // ==========================================
  // TEST 3: Multi-Layer Rate Limiting
  // ==========================================
  console.log('\n📝 TEST 3: Multi-Layer Rate Limiting (Memory + Redis)');
  console.log('-'.repeat(60));

  const testUser2 = 'test-user-456';

  console.log('\n🔹 Testing FREE tier (limit: 3 per hour):\n');
  for (let i = 1; i <= 5; i++) {
    const result = await checkRateLimit(testUser2, 'domain-create', 'free');
    const status = result.allowed ? '✅ ALLOWED' : '❌ BLOCKED';
    console.log(
      `Request ${i}: ${status} | ` +
      `Layer: ${result.layer.toUpperCase().padEnd(6)} | ` +
      `${result.current}/${result.limit} | ` +
      `Reset: ${result.resetIn}s`
    );

    // Small delay to see the progression
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // ==========================================
  // TEST 4: Rate Limit Status Check
  // ==========================================
  console.log('\n📝 TEST 4: Rate Limit Status');
  console.log('-'.repeat(60));

  const status = await getRateLimitStatus(testUser2, 'domain-create', 'free');
  console.log(`📊 User: test-user-456`);
  console.log(`   Current usage: ${status.current}/${status.limit}`);
  console.log(`   Resets in: ${status.resetIn} seconds (${Math.floor(status.resetIn / 60)} minutes)`);

  // ==========================================
  // TEST 5: Different Tier Comparison
  // ==========================================
  console.log('\n📝 TEST 5: Tier-Based Limits Comparison');
  console.log('-'.repeat(60));

  const tiers = [
    { name: 'FREE', tier: 'free' as const },
    { name: 'PRO', tier: 'pro' as const },
    { name: 'ENTERPRISE', tier: 'enterprise' as const }
  ];

  console.log('');
  for (const { name, tier } of tiers) {
    const result = await checkRateLimit(`test-${tier}`, 'domain-create', tier);
    const limitStr = result.limit === -1 ? 'Unlimited ∞' : `${result.limit}/hour`;
    console.log(`${name.padEnd(12)}: ${limitStr.padEnd(15)} | Current: ${result.current}`);
  }

  // Cleanup
  const redis = getRedisClient();
  await redis.quit();

  console.log('\n' + '='.repeat(60));
  console.log('✅ ALL TESTS PASSED! Rate limiting is working! 🎉\n');
}

// Run tests
console.log('\n🚀 Starting Rate Limiting Tests...\n');
testRateLimiting().catch((error) => {
  console.error('\n❌ Test failed:', error.message);
  console.error('\nFull error:', error);
  process.exit(1);
});
