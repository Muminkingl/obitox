import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function debugBanCheck() {
    console.log('🔍 Debugging Permanent Ban Alert Issue\n');

    // Get all permanent bans
    const { data: allBans, error: bansError } = await supabase
        .from('permanent_bans')
        .select('*');

    console.log('📋 All Permanent Bans in Database:');
    console.log('Count:', allBans?.length || 0);
    if (allBans && allBans.length > 0) {
        allBans.forEach((ban, i) => {
            console.log(`\nBan ${i + 1}:`);
            console.log('  ID:', ban.id);
            console.log('  User ID:', ban.user_id);
            console.log('  Banned At:', ban.banned_at);
            console.log('  Reason:', ban.reason);
            console.log('  Can Appeal:', ban.can_appeal);
        });
    }

    // Get all users (profiles)
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email');

    console.log('\n\n👥 User Profiles in Database:');
    console.log('Count:', profiles?.length || 0);
    if (profiles && profiles.length > 0) {
        profiles.forEach((profile, i) => {
            console.log(`\nUser ${i + 1}:`);
            console.log('  ID:', profile.id);
            console.log('  Email:', profile.email || 'N/A');
        });
    }

    // Check if any ban user_id matches any profile id
    console.log('\n\n🔗 Matching Bans to Users:');
    if (allBans && profiles) {
        allBans.forEach(ban => {
            const matchingUser = profiles.find(p => p.id === ban.user_id);
            if (matchingUser) {
                console.log(`✅ Ban for user ${ban.user_id} (${matchingUser.email}) - MATCH`);
            } else {
                console.log(`❌ Ban for user ${ban.user_id} - NO MATCHING USER FOUND`);
            }
        });
    }
}

debugBanCheck();
