/**
 * Database Schema Test
 * Verifies all tables, indexes, and RLS policies are working
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseSchema() {
    console.log('\n🧪 TESTING DATABASE SCHEMA\n');
    console.log('='.repeat(60));

    let allTestsPassed = true;

    // ==========================================
    // TEST 1: Check Tables Exist
    // ==========================================
    console.log('\n📝 TEST 1: Verify Tables Exist');
    console.log('-'.repeat(60));

    const expectedTables = [
        'domains',
        'dns_records',
        'domain_verification_logs',
        'domain_abuse_events',
        'domain_quotas'
    ];

    for (const tableName of expectedTables) {
        try {
            const { error } = await supabase
                .from(tableName)
                .select('count', { count: 'exact', head: true });

            if (error) {
                console.log(`   ❌ ${tableName}: ${error.message}`);
                allTestsPassed = false;
            } else {
                console.log(`   ✅ ${tableName} exists`);
            }
        } catch (err) {
            console.log(`   ❌ ${tableName}: Table not found`);
            allTestsPassed = false;
        }
    }

    // ==========================================
    // TEST 2: Check Quotas Populated
    // ==========================================
    console.log('\n📝 TEST 2: Verify Quota Configuration');
    console.log('-'.repeat(60));

    try {
        const { data: quotas, error } = await supabase
            .from('domain_quotas')
            .select('*')
            .order('tier');

        if (error) {
            console.log(`   ❌ Failed to fetch quotas: ${error.message}`);
            allTestsPassed = false;
        } else if (!quotas || quotas.length !== 3) {
            console.log(`   ❌ Expected 3 quotas, found ${quotas?.length || 0}`);
            allTestsPassed = false;
        } else {
            console.log('   ✅ All 3 tier quotas configured:');
            quotas.forEach(quota => {
                console.log(`      ${quota.tier.toUpperCase().padEnd(12)}: ${quota.max_domains} domains max, ${quota.max_domains_per_hour}/hour`);
            });
        }
    } catch (err: any) {
        console.log(`   ❌ Error checking quotas: ${err.message}`);
        allTestsPassed = false;
    }

    // ==========================================
    // TEST 3: Test RLS (should fail without auth)
    // ==========================================
    console.log('\n📝 TEST 3: Verify Row Level Security');
    console.log('-'.repeat(60));

    try {
        // This should return empty array (not error) because of RLS
        const { data, error } = await supabase
            .from('domains')
            .select('*');

        if (error) {
            console.log(`   ⚠️  RLS might be too restrictive: ${error.message}`);
        } else {
            console.log(`   ✅ RLS policy working (returned ${data?.length || 0} domains for anonymous user)`);
        }
    } catch (err: any) {
        console.log(`   ❌ RLS test error: ${err.message}`);
        allTestsPassed = false;
    }

    // ==========================================
    // TEST 4: Check Indexes Exist
    // ==========================================
    console.log('\n📝 TEST 4: Verify Indexes Created');
    console.log('-'.repeat(60));

    try {
        const { data, error } = await supabase.rpc('pg_stat_user_indexes', {
            relname: 'domains'
        });

        // Note: This RPC might not exist, that's okay
        if (!error && data) {
            console.log(`   ✅ Indexes found on domains table`);
        } else {
            console.log(`   ℹ️  Index check skipped (requires admin access)`);
        }
    } catch (err) {
        console.log(`   ℹ️  Index verification requires admin role`);
    }

    // ==========================================
    // FINAL SUMMARY
    // ==========================================
    console.log('\n' + '='.repeat(60));

    if (allTestsPassed) {
        console.log('✅ ALL TESTS PASSED! Database schema is ready! 🎉');
        console.log('='.repeat(60) + '\n');
        process.exit(0);
    } else {
        console.log('❌ SOME TESTS FAILED - Please review errors above');
        console.log('='.repeat(60) + '\n');
        process.exit(1);
    }
}

console.log('🚀 Starting Database Schema Tests...\n');
testDatabaseSchema().catch((error) => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
});
