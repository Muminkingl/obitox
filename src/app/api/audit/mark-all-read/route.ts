/**
 * Mark All Audit Logs as Read API
 * POST /api/audit/mark-all-read
 * 
 * Performance optimized: Single bulk update with proper filtering
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const supabase = await createClient();

        // Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Use RPC function to bypass PostgREST schema cache issues
        const { data, error: updateError } = await supabase
            .rpc('mark_all_audit_logs_read');

        if (updateError) {
            console.error('Failed to mark all logs as read:', updateError);
            return NextResponse.json(
                { success: false, error: 'Failed to mark all logs as read' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            markedCount: data || 0,
        });

    } catch (error: any) {
        console.error('Mark all read API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
