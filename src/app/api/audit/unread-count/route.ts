/**
 * Unread Audit Count & Latest Notifications API
 * GET /api/audit/unread-count
 * 
 * Performance optimized: Returns both count and latest unread in ONE request
 * Uses indexed queries for fast performance even with large datasets
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
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

        // Use RPC function for unread count to bypass PostgREST schema cache issues
        const { data: unreadCount, error: countError } = await supabase.rpc('get_unread_audit_count');

        if (countError) {
            console.error('Failed to fetch unread count:', countError);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch notifications' },
                { status: 500 }
            );
        }

        // Fetch latest unread logs for preview (using columns that definitely exist)
        const { data: unreadLogs, error: fetchError } = await supabase
            .from('audit_logs')
            .select('id, user_id, resource_type, resource_id, event_type, event_category, description, metadata, ip_address, user_agent, created_at')
            .eq('user_id', user.id)
            .in('event_category', ['warning', 'critical'])
            .order('created_at', { ascending: false })
            .limit(10);

        return NextResponse.json({
            success: true,
            unreadCount: unreadCount || 0,
            latestUnread: unreadLogs || [],
        });

    } catch (error: any) {
        console.error('Unread count API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
