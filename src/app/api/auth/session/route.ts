/**
 * Session Check Endpoint
 * 
 * Returns current user session if authenticated
 * GET /api/auth/session
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json(
                { user: null },
                { status: 401 }
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('[SESSION] Error:', error);
        return NextResponse.json(
            { user: null },
            { status: 500 }
        );
    }
}
