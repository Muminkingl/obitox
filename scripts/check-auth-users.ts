import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function getAuthUsers() {
    console.log('🔍 Checking Auth Users\n');

    // Get users from auth.users table (admin only)
    const { data: authUsers, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('❌ Error fetching auth users:', error.message);
        return;
    }

    console.log('👥 Auth Users:');
    console.log('Count:', authUsers?.users?.length || 0);

    if (authUsers?.users && authUsers.users.length > 0) {
        authUsers.users.forEach((user, i) => {
            console.log(`\nUser ${i + 1}:`);
            console.log('  ID:', user.id);
            console.log('  Email:', user.email);
            console.log('  Created:', user.created_at);
        });
    }

    // Now check if any match the banned user
    const bannedUserId = 'fbe54d31-4aea-47ed-bb1d-e79fd66eae50';
    const matchingUser = authUsers?.users?.find(u => u.id === bannedUserId);

    console.log('\n\n🔗 Checking Banned User ID Match:');
    console.log('Banned User ID:', bannedUserId);
    if (matchingUser) {
        console.log('✅ MATCH FOUND in auth.users!');
        console.log('   Email:', matchingUser.email);
    } else {
        console.log('❌ NO MATCH - This user_id does not exist in auth.users');
        console.log('\n💡 Solution: Update permanent_bans.user_id to match a real user ID from above');
    }
}

getAuthUsers();
