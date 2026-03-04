import Link from "next/link";

export default function RateLimitsPage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    Rate Limits & Abuse
                </h1>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        We have 3 layers of rate limiting, not 1
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Most APIs say "rate limited" and don't explain how. We'll tell you exactly what happens at each layer.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Layer 1: Per-minute rate limit (per tier)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">What it does:</strong> Redis atomic operation, enforces per-tier rate limits per minute.
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <div className="text-neutral-500 mb-2">Free Tier</div>
                                <div className="text-neutral-300">10 requests/minute</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Pro Tier</div>
                                <div className="text-neutral-300">100 requests/minute</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Enterprise</div>
                                <div className="text-green-400">Custom</div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-neutral-700 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-neutral-500">Response time</div>
                                <div className="text-green-400 mt-1">~180ms (Redis latency)</div>
                            </div>
                            <div>
                                <div className="text-neutral-500">Window</div>
                                <div className="text-neutral-300 mt-1">Rolling 60 seconds</div>
                            </div>
                        </div>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Example:</strong> Bot making 100 requests/second → Blocked after 10, doesn't hit Redis or database.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Error response:</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                        <pre className="text-neutral-300 text-sm">
                            {`429 Too Many Requests
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_MEMORY",
  "limit": 10,
  "window": "1 minute",
  "resetIn": 45,
  "hint": "You're making requests too quickly. Slow down."
}`}
                        </pre>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Layer 2: Behavioral throttling — Slows down burst traffic
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">What it does:</strong> If you make ≥30 requests/minute, we add delays to slow you down (protect infrastructure).
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <div className="text-neutral-400">30-49 requests/minute</div>
                                <div className="text-yellow-400">+2 second delay</div>
                            </div>
                            <div className="flex justify-between border-t border-neutral-700 pt-3">
                                <div className="text-neutral-400">50+ requests/minute</div>
                                <div className="text-orange-400">+5 second delay</div>
                            </div>
                        </div>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Example:</strong> You make 45 requests in 1 minute → Requests still succeed but each waits 2s.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Layer 3: Monthly quota (Redis-cached) — Prevent overage charges
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">What it does:</strong> Enforces monthly request limits per tier. Cached in Redis for instant checks (NO database queries!).
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <div className="text-neutral-500 mb-2">Free Tier</div>
                                <div className="text-neutral-300">1,000 requests/month</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Pro Tier</div>
                                <div className="text-neutral-300">50,000 requests/month</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Enterprise</div>
                                <div className="text-green-400">Custom (millions)</div>
                            </div>
                        </div>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Example:</strong> Free user hits 1,000/1,000 requests on Jan 25 → Blocked until Feb 1.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Error response:</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                        <pre className="text-neutral-300 text-sm">
                            {`403 Forbidden
{
  "error": "Monthly quota exceeded",
  "code": "QUOTA_EXCEEDED",
  "tier": "free",
  "used": 1000,
  "limit": 1000,
  "resetAt": "2024-02-01T00:00:00Z",
  "resetIn": 518400,
  "upgrade": {
    "url": "/dashboard/billing/upgrade",
    "nextTier": "pro",
    "nextLimit": 50000
  }
}`}
                        </pre>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Chaos Protection — Ban escalation for persistent abuse
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">What it does:</strong> Tracks violations (rate limit hits, invalid requests) and automatically escalates bans for repeat offenders.
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <div className="text-neutral-400">10 violations in 60 seconds</div>
                                <div className="text-yellow-400">→ 5-minute ban</div>
                            </div>
                            <div className="flex justify-between border-t border-neutral-700 pt-3">
                                <div className="text-neutral-400">Get banned again (2nd offense)</div>
                                <div className="text-orange-400">→ 1-day ban</div>
                            </div>
                            <div className="flex justify-between border-t border-neutral-700 pt-3">
                                <div className="text-neutral-400">Get banned again (3rd offense)</div>
                                <div className="text-red-400">→ 7-day ban</div>
                            </div>
                            <div className="flex justify-between border-t border-neutral-700 pt-3">
                                <div className="text-neutral-400">Get banned again (4th offense)</div>
                                <div className="text-red-500 font-bold">→ PERMANENT BAN</div>
                            </div>
                        </div>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Why this matters:</strong> Makes persistent attacks EXPENSIVE. Bots can't just retry forever—each violation makes the next ban exponentially longer.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Permanent bans:</strong> Stored in database, enforced across all API endpoints, requires manual review to lift.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Layer 3: Database quota (20-50ms) — Monthly totals
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">What it does:</strong> Supabase query, checks total requests this billing cycle.
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <div className="text-neutral-500 mb-2">Free Tier</div>
                                <div className="text-neutral-300">1,000 requests/month</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Pro Tier</div>
                                <div className="text-neutral-300">50,000 requests/month</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Enterprise</div>
                                <div className="text-neutral-300">Custom (millions)</div>
                            </div>
                        </div>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Example:</strong> Free user hits 1,000/1,000 requests on Jan 25 → Blocked until Feb 1.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Error response:</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                        <pre className="text-neutral-300 text-sm">
                            {`403 Forbidden
{
  "error": "Monthly quota exceeded",
  "code": "QUOTA_EXCEEDED",
  "tier": "free",
  "used": 1000,
  "limit": 1000,
  "billingCycle": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-02-01T00:00:00Z",
    "resetIn": 518400
  },
  "hint": "Upgrade to Pro for 50,000 requests/month or wait for reset",
  "upgrade": {
    "url": "/dashboard/billing/upgrade"
  }
}`}
                        </pre>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        How requests are counted
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">1 API call = 1 request</strong>, regardless of operation:
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <div className="text-neutral-400">Generate signed URL</div>
                            <div className="text-neutral-300">1 request</div>
                        </div>
                        <div className="flex justify-between text-sm border-t border-neutral-700 pt-3">
                            <div className="text-neutral-400">Upload completion hook</div>
                            <div className="text-neutral-300">1 request</div>
                        </div>
                        <div className="flex justify-between text-sm border-t border-neutral-700 pt-3">
                            <div className="text-neutral-400">Delete file</div>
                            <div className="text-neutral-300">1 request</div>
                        </div>
                        <div className="flex justify-between text-sm border-t border-neutral-700 pt-3">
                            <div className="text-neutral-400">List files</div>
                            <div className="text-neutral-300">1 request</div>
                        </div>
                        <div className="flex justify-between text-sm border-t border-neutral-700 pt-3">
                            <div className="text-neutral-400">Batch upload (100 files)</div>
                            <div className="text-green-400 font-bold">1 request ⭐</div>
                        </div>
                        <div className="flex justify-between text-sm border-t border-neutral-700 pt-3">
                            <div className="text-neutral-400">Batch delete (50 files)</div>
                            <div className="text-green-400 font-bold">1 request ⭐</div>
                        </div>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Important:</strong> Batch operations count as <em>one</em> request, regardless of file count.
                        This is intentional—it encourages efficient API usage.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Limits on batch size:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>Free: 10 files per batch</li>
                        <li>Pro: 100 files per batch</li>
                        <li>Enterprise: 10,000 files per batch</li>
                    </ul>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        What happens when you hit a limit
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-yellow-900/10 border border-yellow-500/20 p-4 rounded-lg">
                            <div className="text-yellow-400 font-bold mb-2">⚠️ At 50% usage:</div>
                            <div className="text-neutral-300 text-sm">
                                Email warning: "You've used 500/1,000 requests this month"<br />
                                Dashboard banner: Shows usage with upgrade prompt
                            </div>
                        </div>

                        <div className="bg-orange-900/10 border border-orange-500/20 p-4 rounded-lg">
                            <div className="text-orange-400 font-bold mb-2">⚠️ At 80% usage:</div>
                            <div className="text-neutral-300 text-sm">
                                Urgent email: "You're about to hit your limit"<br />
                                Dashboard: Red banner with countdown
                            </div>
                        </div>

                        <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-lg">
                            <div className="text-red-400 font-bold mb-2">❌ At 100% usage:</div>
                            <div className="text-neutral-300 text-sm">
                                API returns 403 Forbidden or 429 Too Many Requests<br />
                                Response includes upgrade link and reset time<br />
                                <strong>No surprise charges</strong> — just blocked until upgrade or reset
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Abuse detection and prevention
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Beyond rate limits, we track <strong className="text-white">abuse events</strong>:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>Rate limit exceeded (any layer)</li>
                        <li>Invalid credentials submitted repeatedly</li>
                        <li>Disposable email detected</li>
                        <li>Quota exceeded</li>
                        <li>Verification spam (clicking "verify" 100× in 1 minute)</li>
                        <li>Domain creation spam</li>
                    </ul>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">Automatic actions:</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <div className="text-neutral-400">10 abuse events</div>
                                <div className="text-yellow-400">Account flagged (manual review)</div>
                            </div>
                            <div className="flex justify-between border-t border-neutral-700 pt-3">
                                <div className="text-neutral-400">50 abuse events</div>
                                <div className="text-orange-400">Account suspended (automatic)</div>
                            </div>
                            <div className="flex justify-between border-t border-neutral-700 pt-3">
                                <div className="text-neutral-400">100+ abuse events</div>
                                <div className="text-red-400">IP banned (escalated to Cloudflare)</div>
                            </div>
                        </div>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">False positives:</strong> If you think you were suspended incorrectly, email support@obitox.com with:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>Your API key (first 8 characters, e.g., ox_196ae...)</li>
                        <li>What you were trying to do</li>
                        <li>Any error messages/request IDs you received</li>
                    </ul>
                    <p className="leading-7 text-neutral-300">
                        We'll review logs and unban if it was a mistake. Most bans are correct (sorry, bots).
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        How to avoid hitting limits
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <div className="text-white font-bold mb-2">1. Use batch operations</div>
                            <div className="text-neutral-300 text-sm">
                                Uploading 100 files? Use batch signed URLs (1 request) instead of 100 separate calls.
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-2">2. Cache signed URLs</div>
                            <div className="text-neutral-300 text-sm">
                                Signed URLs are valid for 1 hour by default. Generate once, use multiple times.
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-2">3. Implement client-side retry logic</div>
                            <div className="text-neutral-300 text-sm">
                                If you get 429, wait for <code className="text-neutral-400">resetIn</code> seconds before retrying.
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg mt-2">
                                <pre className="text-neutral-300 text-xs">
                                    {`if (response.status === 429) {
  const data = await response.json();
  await sleep(data.resetIn * 1000);
  return retry();
}`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-2">4. Monitor your usage</div>
                            <div className="text-neutral-300 text-sm">
                                Dashboard shows current usage vs limits. Set up alerts at 80% to avoid surprises.
                            </div>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-2">5. Upgrade proactively</div>
                            <div className="text-neutral-300 text-sm">
                                Don't wait until you're blocked. If you're consistently hitting 90%+ usage, upgrade before it becomes a problem.
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Cloudflare layer (Layer 0)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Before requests even hit our API, Cloudflare provides:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">DDoS protection</strong> — Blocks 182 billion threats/day globally</li>
                        <li><strong className="text-white">Bot detection</strong> — Challenge Score / Turnstile</li>
                        <li><strong className="text-white">IP reputation</strong> — Known bad IPs blocked automatically</li>
                        <li><strong className="text-white">L7 rate limiting</strong> — 1,000 requests/min per IP</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        This catches ~90% of attacks before they reach our code.
                        If you're a legitimate user, you'll never notice it. If you're a bot, you'll never get through.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Response headers (for monitoring)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Every successful request includes rate limit headers:
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-4">
                        <pre className="text-neutral-300 text-sm">
                            {`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1704675600
X-RateLimit-Tier: pro`}
                        </pre>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Use these to monitor usage in your application:
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                        <pre className="text-neutral-300 text-sm">
                            {`const response = await fetch(...);
const remaining = parseInt(response.headers.get('X-RateLimit-Remaining'));

if (remaining < 100) {
  console.warn('Running low on requests:', remaining);
  // Maybe slow down, notify admins, etc.
}`}
                        </pre>
                    </div>
                </section>
            </div>

            {/* Minimalist Footer Navigation */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/handbook/security/request-signing"
                        className="group block p-6 text-left rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Request signing
                        </div>
                    </Link>
                    <Link
                        href="/handbook/security/key-revocation-and-rotation"
                        className="group block p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Key revocation & rotation
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}