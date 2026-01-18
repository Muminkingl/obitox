/**
 * Next.js Instrumentation Hook
 * 
 * This runs in Node.js runtime (not Edge) when the server starts
 * Perfect for initializing cron jobs!
 * 
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
    // Only run on server
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // DNS verification cron removed - domains feature deprecated
        // const { startDNSVerificationCron } = await import('@/lib/domains/verify-domains-cron');
        // startDNSVerificationCron();

        console.log('✅ Server instrumentation initialized');
    }
}
