
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function inspect() {
    console.log('Inspecting api_usage_logs columns...');
    // Since we can't query information_schema easily with js client easily without permissions sometimes, 
    // let's just try to select * limit 1 and see keys
    const { data, error } = await supabase.from('api_usage_logs').select('*').limit(1);
    if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    } else {
        console.log('No data found, or error:', error);
    }
}

inspect();
