import Link from "next/link";

export default function SystemOverviewPage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    System Overview
                </h1>
                
                <section className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        What we actually built
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        ObitoX is an API that generates signed URLs. That's it. That's the core product.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        Everything else—rate limiting, analytics, batch operations, JWT tokens—exists to make that core operation 
                        <strong className="text-white"> fast, secure, and not exploitable</strong>.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        The actual architecture (no diagrams needed)
                    </h2>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg space-y-4 font-mono text-sm">
                        <div className="text-neutral-400">// Request Flow:</div>
                        <div className="text-neutral-300">
                            1. Your app calls: <span className="text-green-400">POST /api/upload/r2/signed-url</span>
                        </div>
                        <div className="text-neutral-300 ml-4">
                            ├─ Cloudflare: DDoS protection (0-10ms)
                        </div>
                        <div className="text-neutral-300 ml-4">
                            ├─ Workers: API key validation (10-30ms)
                        </div>
                        <div className="text-neutral-300 ml-4">
                            ├─ Memory: Rate limit check (2ms)
                        </div>
                        <div className="text-neutral-300 ml-4">
                            ├─ Redis: Quota check (15ms)
                        </div>
                        <div className="text-neutral-300 ml-4">
                            ├─ Crypto: Generate signed URL (5-10ms)
                        </div>
                        <div className="text-neutral-300 ml-4">
                            └─ Return: <span className="text-blue-400">{'{ uploadUrl, publicUrl }'}</span>
                        </div>
                        <div className="text-neutral-300 mt-4">
                            2. Your browser uploads directly to R2/Vercel/Supabase
                        </div>
                        <div className="text-neutral-300 ml-4">
                            └─ <span className="text-red-400">We never see the file</span>
                        </div>
                        <div className="text-neutral-300 mt-4">
                            3. You call: <span className="text-green-400">POST /api/upload/complete</span>
                        </div>
                        <div className="text-neutral-300 ml-4">
                            └─ We log it for analytics (non-blocking)
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Where it runs
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Backend:</strong> Cloudflare Workers (275+ edge locations globally)<br />
                        <strong className="text-white">Database:</strong> Supabase (PostgreSQL with PostgREST)<br />
                        <strong className="text-white">Cache:</strong> Redis via Upstash (global replication)<br />
                        <strong className="text-white">Files:</strong> Your R2/Vercel/Supabase account (we don't store anything)
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        We're not "serverless" because it sounds cool. We're serverless because:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>No servers to maintain = no 3am outages</li>
                        <li>Cloudflare handles scaling = we don't</li>
                        <li>Pay per request = $0 until we actually have users</li>
                        <li>275 edge locations = low latency worldwide (not just US East)</li>
                    </ul>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        What happens when you make a request
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Example: Generate R2 signed URL for uploading <code className="text-green-400">photo.jpg</code>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg space-y-3 mt-4">
                        <div className="text-neutral-400 text-sm font-mono">// Your request:</div>
                        <pre className="text-neutral-300 text-sm overflow-x-auto">
{`POST https://api.obitox.com/v1/upload/r2/signed-url
Headers:
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json
Body:
  {
    "filename": "photo.jpg",
    "contentType": "image/jpeg",
    "r2AccessKey": "your_r2_key",
    "r2SecretKey": "your_r2_secret",
    "r2AccountId": "your_account_id",
    "r2Bucket": "my-uploads"
  }`}
                        </pre>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">What we do (5-15ms total):</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-3 text-neutral-300 leading-7 ml-4 mt-4">
                        <li>
                            <strong className="text-white">Validate API key</strong> (check Redis cache, 10ms)<br />
                            <span className="text-sm text-neutral-400">If invalid → 401 Unauthorized</span>
                        </li>
                        <li>
                            <strong className="text-white">Check rate limits</strong> (memory guard: 2ms, Redis: 15ms)<br />
                            <span className="text-sm text-neutral-400">If exceeded → 429 Too Many Requests</span>
                        </li>
                        <li>
                            <strong className="text-white">Check quota</strong> (Redis cache, 15ms)<br />
                            <span className="text-sm text-neutral-400">If over limit → 403 Quota Exceeded</span>
                        </li>
                        <li>
                            <strong className="text-white">Generate unique filename</strong> (crypto.randomBytes, 1ms)<br />
                            <span className="text-sm text-neutral-400">Example: upl1704672000_a3f2b9.jpg</span>
                        </li>
                        <li>
                            <strong className="text-white">Create R2 signed URL</strong> (AWS SDK v3, pure crypto, 5-10ms)<br />
                            <span className="text-sm text-neutral-400">No network call to Cloudflare—just cryptographic signing</span>
                        </li>
                        <li>
                            <strong className="text-white">Return response</strong> (0ms)<br />
                            <span className="text-sm text-neutral-400">uploadUrl (for uploading), publicUrl (for accessing later)</span>
                        </li>
                        <li>
                            <strong className="text-white">Background: Log analytics</strong> (non-blocking, doesn't affect response time)<br />
                            <span className="text-sm text-neutral-400">Queued in Bull/Redis for async processing</span>
                        </li>
                    </ol>

                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg space-y-3 mt-6">
                        <div className="text-neutral-400 text-sm font-mono">// Our response (15ms later):</div>
                        <pre className="text-neutral-300 text-sm overflow-x-auto">
{`{
  "success": true,
  "uploadUrl": "https://account.r2.cloudflarestorage.com/...",
  "publicUrl": "https://pub-account.r2.dev/upl1704672000_a3f2b9.jpg",
  "uploadId": "upl1704672000_a3f2b9",
  "expiresIn": 3600,
  "provider": "r2"
}`}
                        </pre>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">What you do next:</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg space-y-3 mt-4">
                        <pre className="text-neutral-300 text-sm overflow-x-auto">
{`// In your browser/app:
const response = await fetch(data.uploadUrl, {
  method: 'PUT',
  body: fileBlob,
  headers: { 'Content-Type': 'image/jpeg' }
});

// File goes directly to R2
// We never see it, never pay for bandwidth
// You pay R2's rates (~$0.015/GB)`}
                        </pre>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Why this is fast
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">1. No network calls to storage providers</strong><br />
                        We use cryptographic signing (AWS SDK v3). Generating an R2 signed URL doesn't require asking R2 for permission—we have your credentials, 
                        we sign the URL, done. <strong className="text-white">5-10ms of pure math</strong>, no HTTP requests.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Compare: Vercel Blob requires an API call to their servers (220ms). We're <strong className="text-white">40× faster</strong> for R2.
                    </p>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">2. Multi-layer caching</strong><br />
                        API keys: Cached in Redis (5 min TTL)<br />
                        Rate limits: Cached in memory first (instant), then Redis (15ms)<br />
                        Quotas: Cached in Redis (5 min TTL)<br />
                        Bucket lists: Cached in Redis (15 min TTL)
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Cold cache (first request): 400-600ms<br />
                        Warm cache (subsequent): 20-50ms<br />
                        <strong className="text-white">Hit rate: 95%+</strong> (most requests are cached)
                    </p>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">3. Edge deployment</strong><br />
                        Cloudflare Workers run in 275+ cities worldwide. Request from Tokyo? Your request hits a Tokyo edge server, not a US East data center.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Typical latency by region:<br />
                        US/Canada: 10-30ms<br />
                        Europe: 15-40ms<br />
                        Asia: 20-60ms<br />
                        Middle East: 30-80ms (we tested this on Iraq home WiFi—real numbers)
                    </p>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">4. Files never touch our servers</strong><br />
                        Traditional services: Your file → Their server → Storage (2× bandwidth cost, 2× latency)<br />
                        ObitoX: Your file → Storage (direct, 1× bandwidth, 0 latency from us)
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        This is why we can charge $9/month while Cloudinary charges $99/month. <strong className="text-white">We're not paying for your bandwidth.</strong>
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Why this is secure
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">1. Your credentials never leave your requests</strong><br />
                        We don't store your R2/Vercel/Supabase credentials in a database. You pass them in each request body. 
                        We use them to generate URLs, then discard them. No credential leaks possible from our side.
                    </p>

                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">2. Signed URLs expire</strong><br />
                        Default: 1 hour (configurable 1 min - 7 days)<br />
                        After expiry, the URL is useless. Can't be replayed, can't be shared long-term.
                    </p>

                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">3. Rate limiting at every layer</strong><br />
                        Memory guard: 10 requests/min (blocks 90% of abuse instantly)<br />
                        Redis: 50-200 requests/hour (depending on tier)<br />
                        Database: Track daily/monthly totals, suspend accounts over quota
                    </p>

                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">4. Email verification required</strong><br />
                        Before you can create domains or hit advanced features, we verify your email. 
                        Blocks disposable emails, tracks abuse patterns, forces real identity.
                    </p>

                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">5. Abuse event logging</strong><br />
                        Every suspicious action is logged: rate limit hits, invalid credentials, quota exceeded, failed verifications. 
                        After 10 abuse events, we flag the account. After 50, we suspend it.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        What we don't do (important)
                    </h2>
                    <ul className="list-disc list-inside space-y-3 text-neutral-300 leading-7 ml-4">
                        <li>
                            <strong className="text-white">We don't store files</strong><br />
                            <span className="text-sm text-neutral-400">
                                Your files live in your R2/Vercel/Supabase account. We never see them, never cache them, never proxy them.
                            </span>
                        </li>
                        <li>
                            <strong className="text-white">We don't process images</strong><br />
                            <span className="text-sm text-neutral-400">
                                Need thumbnails? Use R2's Image Resizing or Cloudflare Images. We're not Cloudinary—we don't compete with them, we complement them.
                            </span>
                        </li>
                        <li>
                            <strong className="text-white">We don't store your storage credentials</strong><br />
                            <span className="text-sm text-neutral-400">
                                You pass R2/Vercel keys in each request. More setup for you, but zero risk of our database being hacked and leaking your keys.
                            </span>
                        </li>
                        <li>
                            <strong className="text-white">We don't guarantee 100% uptime</strong><br />
                            <span className="text-sm text-neutral-400">
                                We aim for 99.9% (8.7 hours downtime/year). If Cloudflare goes down, we go down. If Supabase goes down, some features degrade. 
                                Enterprise tier gets 99.95% SLA with dedicated support.
                            </span>
                        </li>
                        <li>
                            <strong className="text-white">We don't do magic</strong><br />
                            <span className="text-sm text-neutral-400">
                                If R2 is slow, our signed URLs will be fast, but your uploads will still be slow. We can't fix your storage provider's performance—we just make the control layer fast.
                            </span>
                        </li>
                    </ul>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        The actual stack (no buzzwords)
                    </h2>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-neutral-500 mb-2">Runtime</div>
                                <div className="text-neutral-300">Cloudflare Workers (V8 isolates)</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Language</div>
                                <div className="text-neutral-300">JavaScript/Node.js</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Database</div>
                                <div className="text-neutral-300">Supabase (PostgreSQL 15)</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Cache</div>
                                <div className="text-neutral-300">Redis (Upstash)</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Queue</div>
                                <div className="text-neutral-300">Bull (Redis-backed)</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Auth</div>
                                <div className="text-neutral-300">Supabase Auth + JWT</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Security</div>
                                <div className="text-neutral-300">Arcjet + Cloudflare</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-2">Monitoring</div>
                                <div className="text-neutral-300">Custom (Supabase logs)</div>
                            </div>
                        </div>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Infrastructure cost at 0 users: <strong className="text-white">$0/month</strong><br />
                        Infrastructure cost at 100 users: <strong className="text-white">$0/month</strong> (still free tier)<br />
                        Infrastructure cost at 500 users: <strong className="text-white">~$80/month</strong> (paid tiers)<br />
                        Infrastructure cost at 5,000 users: <strong className="text-white">~$500/month</strong>
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Revenue at 500 users: $7,000/month<br />
                        Profit margin: <strong className="text-white">98.9%</strong>
                    </p>
                </section>
            </div>

            {/* Minimalist Footer Navigation */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/handbook/company/how-dogfooding-shapes-our-product"
                        className="group block p-6 text-left rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            How dogfooding shapes our product
                        </div>
                    </Link>
                    <Link
                        href="/handbook/architecture/control-vs-data-plane"
                        className="group block p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Control vs data plane
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}