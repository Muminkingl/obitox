/**
 * Initialize DNS Verification Cron Job
 * 
 * This route starts the DNS verification cron job that runs every 20 minutes.
 * Call this once when the server starts to begin automatic domain verification.
 * 
 * GET /api/cron/start
 */

import { NextResponse } from 'next/server';
import { startDNSVerificationCron } from '@/lib/domains/verify-domains-cron';

// Track if cron job is already running
let cronStarted = false;

export async function GET() {
    if (cronStarted) {
        return NextResponse.json({
            success: true,
            message: 'Cron job already running',
            status: 'active'
        });
    }

    try {
        // Start the cron job
        startDNSVerificationCron();
        cronStarted = true;

        return NextResponse.json({
            success: true,
            message: 'DNS verification cron job started successfully',
            schedule: 'Every 20 minutes',
            status: 'active'
        });
    } catch (error: any) {
        console.error('Failed to start cron job:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to start cron job',
            details: error.message
        }, { status: 500 });
    }
}
