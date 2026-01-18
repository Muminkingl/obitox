
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLogs() {
    console.log('Checking Logs for Specific Key (ending in f79f)...');

    // Find the key
    const { data: keys, error: keyError } = await supabase
        .from('api_keys')
        .select('id, key_value, user_id')
        .like('key_value', '%f79f');

    if (keyError || !keys || keys.length === 0) {
        console.error('Key not found!', keyError);
        return;
    }

    const targetKey = keys[0];
    console.log(`Found Key: ${targetKey.id} (User: ${targetKey.user_id})`);

    // Get logs for this key
    const { data: logs, error } = await supabase
        .from('api_usage_logs')
        .select('created_at, request_count, api_key_id')
        .eq('api_key_id', targetKey.id);

    if (error) {
        console.error('Error fetching logs:', error);
        return;
    }

    let totalRequests = 0;
    let decRequests = 0;
    let janRequests = 0;

    logs.forEach(log => {
        const count = log.request_count || 1;
        totalRequests += count;

        const date = new Date(log.created_at);
        if (date.getMonth() === 11 && date.getFullYear() === 2025) { // Dec 2025
            decRequests += count;
        } else if (date.getMonth() === 0 && date.getFullYear() === 2026) { // Jan 2026
            janRequests += count;
        }
    });

    console.log('--- Breakdown for Key ---');
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Dec 2025: ${decRequests}`);
    console.log(`Jan 2026: ${janRequests}`);

    // Check profile counter
    const { data: profile } = await supabase.from('profiles').select('api_requests_used').eq('id', targetKey.user_id).single();
    console.log(`Profile Counter (api_requests_used): ${profile?.api_requests_used}`);
}

checkLogs();
