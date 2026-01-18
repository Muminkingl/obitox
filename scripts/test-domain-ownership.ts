/**
 * Test Global Domain Uniqueness Security Fix
 *
 * Run: npx tsx scripts/test-domain-ownership.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const API_BASE = 'http://localhost:3000';

interface TestResult {
  test: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

/**
 * =========================
 * AUTH COOKIES
 * =========================
 * IMPORTANT:
 * - Do NOT add newlines
 * - Do NOT URL encode
 * - Keep exactly: name=value; name=value
 */

// User A — akramhafif2005@gmail.com
const USER_A_COOKIE =
  'sb-mexdnzyfjyhwqsosbizu-auth-token.0=PASTE_USER_A_TOKEN_0;' +
  ' sb-mexdnzyfjyhwqsosbizu-auth-token.1=PASTE_USER_A_TOKEN_1';

// User B — akramhafif2006@gmail.com
const USER_B_COOKIE =
  'sb-mexdnzyfjyhwqsosbizu-auth-token.0=PASTE_USER_B_TOKEN_0;' +
  ' sb-mexdnzyfjyhwqsosbizu-auth-token.1=PASTE_USER_B_TOKEN_1';

async function testDomainOwnership() {
  console.log('🧪 TESTING GLOBAL DOMAIN UNIQUENESS\n');
  console.log('================================================\n');

  // ------------------------------------------------------------
  // TEST 1: User A adds domain
  // ------------------------------------------------------------
  console.log('TEST 1: User A adds test-domain.com');

  try {
    const response1 = await fetch(`${API_BASE}/api/domains`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': USER_A_COOKIE
      },
      body: JSON.stringify({ domainName: 'test-domain.com' })
    });

    const data1 = await response1.json();

    if (response1.ok && data1.success) {
      console.log('   ✅ User A successfully added test-domain.com');
      results.push({
        test: 'User A adds domain',
        passed: true,
        details: 'Domain created successfully'
      });
    } else {
      console.log('   ❌ Failed to add domain');
      results.push({
        test: 'User A adds domain',
        passed: false,
        details: data1.error
      });
    }
  } catch (error: any) {
    results.push({
      test: 'User A adds domain',
      passed: false,
      details: error.message
    });
  }

  console.log('');

  // ------------------------------------------------------------
  // TEST 2: User B tries same domain
  // ------------------------------------------------------------
  console.log('TEST 2: User B tries to add test-domain.com (should be blocked)');

  try {
    const response2 = await fetch(`${API_BASE}/api/domains`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': USER_B_COOKIE
      },
      body: JSON.stringify({ domainName: 'test-domain.com' })
    });

    const data2 = await response2.json();

    if (response2.status === 409 && data2.code === 'DOMAIN_CLAIMED') {
      console.log('   ✅ User B correctly blocked!');
      results.push({
        test: 'User B blocked from duplicate',
        passed: true,
        details: '409 DOMAIN_CLAIMED'
      });
    } else {
      console.log('   ❌ SECURITY BUG');
      results.push({
        test: 'User B blocked from duplicate',
        passed: false,
        details: 'Duplicate domain allowed'
      });
    }
  } catch (error: any) {
    results.push({
      test: 'User B blocked from duplicate',
      passed: false,
      details: error.message
    });
  }

  console.log('');

  // ------------------------------------------------------------
  // TEST 3: Case normalization
  // ------------------------------------------------------------
  console.log('TEST 3: User B tries TEST-DOMAIN.COM');

  try {
    const response3 = await fetch(`${API_BASE}/api/domains`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': USER_B_COOKIE
      },
      body: JSON.stringify({ domainName: 'TEST-DOMAIN.COM' })
    });

    const data3 = await response3.json();

    if (response3.status === 409 && data3.code === 'DOMAIN_CLAIMED') {
      console.log('   ✅ Uppercase correctly blocked');
      results.push({
        test: 'Case normalization',
        passed: true,
        details: 'Uppercase variant blocked'
      });
    } else {
      results.push({
        test: 'Case normalization',
        passed: false,
        details: 'Uppercase bypass'
      });
    }
  } catch (error: any) {
    results.push({
      test: 'Case normalization',
      passed: false,
      details: error.message
    });
  }

  console.log('\n================================================');
  console.log('📊 TEST RESULTS SUMMARY\n');

  const passed = results.filter(r => r.passed).length;

  results.forEach(r => {
    console.log(`${r.passed ? '✅' : '❌'} ${r.test}: ${r.details}`);
  });

  console.log(`\nTotal: ${passed}/${results.length} tests passed`);
}

testDomainOwnership().catch(console.error);
