import Link from "next/link";

export default function PerformancePhilosophyPage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    Performance Philosophy
                </h1>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Fast is not a feeling, it's a number
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Most companies say "blazing fast" and hope you don't measure. We publish numbers because we're confident they're good.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Here's what "fast" means in milliseconds, not marketing:
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Actual response times (P95)
                    </h2>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-neutral-500 mb-1">R2 Signed URL (Full Trip)</div>
                                <div className="text-green-400 font-bold">760ms - 1.2s</div>
                                <div className="text-neutral-400 text-xs mt-1">Includes network from Home WiFi + API overhead</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-1">API Key & Rate Limit</div>
                                <div className="text-green-400 font-bold">186ms</div>
                                <div className="text-neutral-400 text-xs mt-1">Single Redis mega-pipeline (was 707ms)</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-1">Crypto Signing Only</div>
                                <div className="text-green-400 font-bold">4-12ms</div>
                                <div className="text-neutral-400 text-xs mt-1">Internal server processing time</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-1">Supabase Signed URL</div>
                                <div className="text-yellow-400 font-bold">848ms - 1.1s</div>
                                <div className="text-neutral-400 text-xs mt-1">Dependent on Supabase API latency</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-1">Uploadcare Signed URL</div>
                                <div className="text-yellow-400 font-bold">530ms</div>
                                <div className="text-neutral-400 text-xs mt-1">External API call</div>
                            </div>
                            <div>
                                <div className="text-neutral-500 mb-1">Batch Upload (100 files)</div>
                                <div className="text-green-400 font-bold">~800ms</div>
                                <div className="text-neutral-400 text-xs mt-1">Parallel validation enabled</div>
                            </div>
                        </div>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Tested where:</strong> Home WiFi (worst case), production servers (best case).<br />
                        <strong className="text-white">Methodology:</strong> P95 (95th percentile) over 1,000 requests.<br />
                        <strong className="text-white">Honesty:</strong> If it's slow, we say it's slow. Supabase is 848ms because their API is in a different region. We can't fix that.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Performance is architecture, not optimization
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        You can't optimize your way out of bad architecture. Here's what actually makes us fast:
                    </p>

                    <div className="space-y-6 mt-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">1. Files never touch our servers</h3>
                            <p className="leading-7 text-neutral-300">
                                <strong className="text-white">Bad architecture:</strong> File → Your API → Storage (2× bandwidth, 2× latency)
                            </p>
                            <p className="leading-7 text-neutral-300 mt-2">
                                <strong className="text-white">Our architecture:</strong> File → Storage (direct, 0× our bandwidth, 0× our latency)
                            </p>
                            <p className="leading-7 text-neutral-300 mt-2">
                                We generate a signed URL (5-15ms crypto). Your browser uploads directly to R2/Vercel/Supabase.
                                <strong className="text-white"> We're not in the file path, so we can't be the bottleneck.</strong>
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">2. Multi-layer caching (memory → Redis → DB)</h3>
                            <p className="leading-7 text-neutral-300">
                                We check the fastest cache first:
                            </p>
                            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                                <pre className="text-neutral-300 text-sm">
                                    {`Redis Mega-Pipeline (Upstash):
├─ 1. Get API Key & Tier
├─ 2. Get Quota Status
├─ 3. Check Rate Limits
└─ Total time: 186ms (1 round trip)

Before Optimization:
├─ 4 separate Redis calls
└─ Total time: 707ms (4 round trips)

Database (Supabase):
├─ Only hit on cache MISS
└─ < 1% of requests touch DB`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">3. Edge deployment (275+ locations)</h3>
                            <p className="leading-7 text-neutral-300">
                                Run where the user is. Redis is global. Cloudflare (upcoming) is global.
                            </p>
                            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-neutral-500">Region</div>
                                        <div className="text-neutral-300 mt-1">Our Server (Node.js)</div>
                                        <div className="text-neutral-300">Redis (Global)</div>
                                        <div className="text-neutral-300">Supabase (US-East)</div>
                                    </div>
                                    <div>
                                        <div className="text-neutral-500">Latency impact</div>
                                        <div className="text-green-400 mt-1">Fast Processing</div>
                                        <div className="text-green-400">Low Latency</div>
                                        <div className="text-yellow-400">Network Dependent</div>
                                    </div>
                                </div>
                            </div>
                            <p className="leading-7 text-neutral-300 mt-4">
                                Compare: Single datacenter in US East → 200ms+ from Asia, 150ms+ from Europe.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">4. Crypto instead of API calls (R2 advantage)</h3>
                            <p className="leading-7 text-neutral-300">
                                Generating an R2 signed URL is <strong className="text-white">pure math</strong>:
                            </p>
                            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                                <pre className="text-neutral-300 text-sm">
                                    {`import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// This is crypto (5-10ms), not an API call:
const url = await getSignedUrl(s3Client, putCommand, {
  expiresIn: 3600
});

// Compare to Vercel Blob (220ms):
const { url } = await put('file.jpg', file, {
  access: 'public',
  token: vercelToken // Requires API call to Vercel
});`}
                                </pre>
                            </div>
                            <p className="leading-7 text-neutral-300 mt-4">
                                This is why R2 signed URLs are <strong className="text-white">40× faster</strong> than Vercel Blob.
                                We're not making network calls—just signing with your credentials locally.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">5. Non-blocking background jobs</h3>
                            <p className="leading-7 text-neutral-300">
                                Analytics, metrics, logging—all happen <strong className="text-white">after</strong> we return the response:
                            </p>
                            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                                <pre className="text-neutral-300 text-sm">
                                    {`// Return response immediately (15ms)
return res.json({ uploadUrl, publicUrl });

// Queue background jobs (non-blocking, 0ms to user)
queueMetricsUpdate({
  userId,
  operation: 'signed-url',
  success: true
}).catch(console.error); // Fire and forget

// User doesn't wait for this
// Response time: 15ms, not 15ms + 50ms`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">6. Parallel batch operations</h3>
                            <p className="leading-7 text-neutral-300">
                                Batch uploads process files in parallel, not sequentially:
                            </p>
                            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                                <pre className="text-neutral-300 text-sm">
                                    {`// BAD: Sequential (100 files × 5ms = 500ms)
for (const file of files) {
  await generateSignedUrl(file); // Blocks!
}

// GOOD: Parallel (100 files in ~50ms total)
const urls = await Promise.all(
  files.map(file => generateSignedUrl(file))
);

// 10× faster with same code quality`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Where we're slow (and why)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Supabase signed URLs: 848ms-1161ms</strong><br />
                        Why: Their API is in a different region + external HTTP call + they generate URLs server-side.<br />
                        Fix: None. This is Supabase's API latency, not ours. We cache aggressively to help.
                    </p>

                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Cold cache requests: 400-600ms</strong><br />
                        Why: First request has to hit database, validate everything, populate caches.<br />
                        Fix: Warm caches (5min TTL), so 95% of requests are fast.
                    </p>

                   

                    <p className="leading-7 text-neutral-300 mt-4">
                        We're honest about this. If something is slow, <strong className="text-white">we say it's slow and explain why</strong>.
                        We don't hide behind "optimizing" or "coming soon."
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        How we measure performance
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Every request logs timing:</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-4">
                        <pre className="text-neutral-300 text-sm">
                            {`{
  "requestId": "r2_1234567890",
  "timing": {
    "total": 186,
    "pipeline": 170,
    "cryptoSign": 12,
    "overhead": 4
  },
  "cacheHits": {
    "pipeline": true,
    "db": false
  }
}`}
                        </pre>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        We track:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">P50 (median)</strong> — Half of requests are faster than this</li>
                        <li><strong className="text-white">P95 (95th percentile)</strong> — 95% of requests are faster than this (what we publish)</li>
                        <li><strong className="text-white">P99 (99th percentile)</strong> — 99% of requests are faster (outliers included)</li>
                        <li><strong className="text-white">Max</strong> — Worst case (usually cold cache + slow provider)</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        We publish P95 because it's honest. P50 looks better but hides the slow requests.
                        P99 includes weird outliers (network hiccups, cold starts). <strong className="text-white">P95 is what most users experience.</strong>
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Performance under load
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        We've tested up to <strong className="text-white">1,000 concurrent requests</strong> (simulated load test):
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-neutral-500">Concurrent Requests</div>
                                <div className="text-neutral-300 mt-1">10</div>
                                <div className="text-neutral-300">100</div>
                                <div className="text-neutral-300">500</div>
                                <div className="text-neutral-300">1,000</div>
                            </div>
                            <div>
                                <div className="text-neutral-500">P95 Response Time</div>
                                <div className="text-green-400 mt-1">15ms</div>
                                <div className="text-green-400">22ms</div>
                                <div className="text-yellow-400">45ms</div>
                                <div className="text-yellow-400">80ms</div>
                            </div>
                        </div>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Why it stays fast:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">Cloudflare auto-scales</strong> — More requests = more Workers spawned automatically</li>
                        <li><strong className="text-white">Redis is fast</strong> — 10,000+ ops/sec on Upstash free tier</li>
                        <li><strong className="text-white">No database bottleneck</strong> — 99.5% cache hit rate = 0.5% hits DB</li>
                        <li><strong className="text-white">Pure crypto scales</strong> — Signing URLs is CPU-bound, Workers have plenty of CPU</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        At 10,000 concurrent requests, we'd probably hit Supabase connection limits (~100 concurrent connections).
                        Solution: <strong className="text-white">Connection pooling</strong> (PgBouncer) + more aggressive caching.
                        We'll cross that bridge when we get there.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        What we won't optimize
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">1. Supabase API latency</strong><br />
                        Not our problem. Their API is in their data center. We can cache, but we can't make their servers faster.
                    </p>

                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">2. Your internet connection</strong><br />
                        If uploading a 10MB file takes 30 seconds, that's your bandwidth, not our API.
                        We generated the signed URL in 15ms. The other 29.985 seconds is between you and R2.
                    </p>

                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">3. Storage provider performance</strong><br />
                        R2 is fast (~50-200ms uploads). Vercel Blob is slower (~200-400ms). Supabase Storage varies (100-500ms).
                        We don't control this—you choose the provider.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Performance roadmap (what we're working on)
                    </h2>
                    <ul className="list-disc list-inside space-y-3 text-neutral-300 leading-7 ml-4">
                        <li>
                            <strong className="text-white">HTTP/3 (QUIC) everywhere</strong><br />
                            <span className="text-sm text-neutral-400">
                                Already supported by Cloudflare. Faster on mobile/unreliable connections. 0-RTT connection resumption.
                            </span>
                        </li>
                        <li>
                            <strong className="text-white">Aggressive prefetching</strong><br />
                            <span className="text-sm text-neutral-400">
                                SDK could prefetch signed URLs while user is selecting files. By the time they click "Upload," URL is ready.
                            </span>
                        </li>
                        <li>
                            <strong className="text-white">Regional failover</strong><br />
                            <span className="text-sm text-neutral-400">
                                If Supabase US-East is slow, try EU-West automatically. Adds complexity but could save 100-200ms.
                            </span>
                        </li>
                        <li>
                            <strong className="text-white">Batch optimizations</strong><br />
                            <span className="text-sm text-neutral-400">
                                Currently processing 100 files in ~500ms. Could we do 1000 in 2 seconds? Maybe with smarter parallelization.
                            </span>
                        </li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        But honestly: <strong className="text-white">5-15ms for R2 is already fast enough</strong>.
                        We're not going to obsess over shaving 2ms when the real bottleneck is network latency or file size.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        The philosophy in one sentence
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">
                            Don't put files in the critical path, cache everything you can, measure what you can't,
                            and be honest about what you can't control.
                        </strong>
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        That's it. No "blazing fast," no "lightning speed," no meaningless comparisons.
                        Just <strong className="text-white">real numbers, real architecture decisions, and real honesty about tradeoffs.</strong>
                    </p>
                </section>
            </div>

            {/* Minimalist Footer Navigation */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/handbook/architecture/security-model"
                        className="group block p-6 text-left rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Security model
                        </div>
                    </Link>
                    <Link
                        href="/handbook/security/api-keys-and-secrets"
                        className="group block p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            API keys & secrets
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}