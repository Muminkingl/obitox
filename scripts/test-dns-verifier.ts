/**
 * Test DNS Verifier
 * 
 * Tests the DNS verification module with real domains
 * Run: npx tsx scripts/test-dns-verifier.ts
 */

import { verifyDNSRecord, verifyAllDNSRecords } from '../src/lib/domains/dns-verifier';

async function runTests() {
    console.log('🔍 DNS VERIFIER TEST SUITE\n');
    console.log('================================================\n');

    // Test 1: Verify Google's MX record
    console.log('TEST 1: Google MX Record');
    console.log('------------------------------------------------------------');

    const googleMXResult = await verifyDNSRecord('google.com', {
        type: 'MX',
        name: '@',
        value: 'smtp.google.com' // Google uses this
    });

    console.log('   Domain: google.com');
    console.log(`   Expected: MX record with smtp.google.com`);
    console.log(`   Result: ${googleMXResult.verified ? '✅ VERIFIED' : '❌ NOT FOUND'}`);
    if (googleMXResult.found) {
        console.log(`   Found: ${googleMXResult.found}`);
    }
    if (googleMXResult.error) {
        console.log(`   Error: ${googleMXResult.error}`);
    }
    console.log('');

    // Test 2: Verify Google's SPF record
    console.log('TEST 2: Google SPF Record (TXT)');
    console.log('------------------------------------------------------------');

    const googleSPFResult = await verifyDNSRecord('google.com', {
        type: 'TXT',
        name: '@',
        value: 'v=spf1' // Google has SPF
    });

    console.log('   Domain: google.com');
    console.log(`   Expected: TXT record starting with v=spf1`);
    console.log(`   Result: ${googleSPFResult.verified ? '✅ VERIFIED' : '❌ NOT FOUND'}`);
    if (googleSPFResult.found) {
        console.log(`   Found: ${googleSPFResult.found}`);
    }
    console.log('');

    // Test 3: Non-existent domain
    console.log('TEST 3: Non-existent Domain');
    console.log('------------------------------------------------------------');

    const fakeResult = await verifyDNSRecord('this-domain-definitely-does-not-exist-12345.com', {
        type: 'TXT',
        name: '@',
        value: 'test'
    });

    console.log('   Domain: this-domain-definitely-does-not-exist-12345.com');
    console.log(`   Result: ${fakeResult.verified ? '✅ VERIFIED' : '❌ NOT FOUND'} (expected)`);
    console.log(`   Error: ${fakeResult.error}`);
    console.log('');

    // Test 4: Verify multiple records (simulate real domain verification)
    console.log('TEST 4: Multiple Records (Simulated)');
    console.log('------------------------------------------------------------');

    const multipleRecords = [
        { type: 'MX', name: '@', value: 'smtp' },
        { type: 'TXT', name: '@', value: 'v=spf1' },
    ];

    const multiResult = await verifyAllDNSRecords('google.com', multipleRecords);

    console.log('   Domain: google.com');
    console.log(`   Total Records: ${multiResult.totalCount}`);
    console.log(`   Verified: ${multiResult.verifiedCount}`);
    console.log(`   All Verified: ${multiResult.allVerified ? '✅ YES' : '❌ NO'}`);
    console.log('');

    multiResult.results.forEach(({ record, result }, index) => {
        console.log(`   Record ${index + 1}: ${record.type}`);
        console.log(`     Status: ${result.verified ? '✅' : '❌'}`);
        if (result.found) {
            console.log(`     Found: ${result.found}`);
        }
        if (result.error) {
            console.log(`     Error: ${result.error}`);
        }
    });
    console.log('');

    // Test 5: DMARC record (subdomain)
    console.log('TEST 5: DMARC Record (Subdomain: _dmarc.google.com)');
    console.log('------------------------------------------------------------');

    const dmarcResult = await verifyDNSRecord('google.com', {
        type: 'TXT',
        name: '_dmarc',
        value: 'v=DMARC1'
    });

    console.log('   Domain: _dmarc.google.com');
    console.log(`   Expected: TXT record with v=DMARC1`);
    console.log(`   Result: ${dmarcResult.verified ? '✅ VERIFIED' : '❌ NOT FOUND'}`);
    if (dmarcResult.found) {
        console.log(`   Found: ${dmarcResult.found}`);
    }
    if (dmarcResult.error) {
        console.log(`   Error: ${dmarcResult.error}`);
    }
    console.log('');

    console.log('================================================');
    console.log('✅ DNS VERIFIER TESTS COMPLETE!\n');
    console.log('Next: Test with YOUR domain and see if it works!');
}

// Run tests
runTests().catch(console.error);
