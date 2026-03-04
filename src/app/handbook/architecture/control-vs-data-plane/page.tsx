import Link from "next/link";

export default function ControlVsDataPlanePage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    Control vs Data Plane
                </h1>
                
                <section className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Why we split them
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        If you've used AWS, you've heard "control plane vs data plane" thrown around. Most explanations are garbage. Here's the real reason we split them:
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Your 10MB file upload shouldn't block someone else's 5ms API key check.</strong>
                    </p>
                    <p className="leading-7 text-neutral-300">
                        That's it. That's the whole philosophy.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Control Plane: The fast stuff
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Runs on: <strong className="text-white">Cloudflare Workers</strong> (275+ edge locations)<br />
                        Response time: <strong className="text-white">5-50ms</strong> (P95)<br />
                        Handles:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4 mt-4">
                        <li><strong className="text-white">API key validation</strong> — Check Redis, verify signature</li>
                        <li><strong className="text-white">Rate limiting</strong> — Memory guard → Redis check → DB fallback</li>
                        <li><strong className="text-white">Quota enforcement</strong> — Check Redis cache of usage</li>
                        <li><strong className="text-white">Signed URL generation</strong> — Pure crypto (AWS SDK v3), no network calls</li>
                        <li><strong className="text-white">Request routing</strong> — Which provider? Which bucket?</li>
                        <li><strong className="text-white">Analytics metadata</strong> — Queue background jobs, don't wait</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        What's NOT here: <strong className="text-white">Files. Never files.</strong>
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Data Plane: The heavy stuff
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Runs on: <strong className="text-white">Your storage provider</strong> (R2, Vercel Blob, Supabase, Uploadcare)<br />
                        Response time: <strong className="text-white">Depends on file size and provider</strong><br />
                        Handles:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4 mt-4">
                        <li><strong className="text-white">Actual file uploads</strong> — Your browser → Storage (direct)</li>
                        <li><strong className="text-white">File downloads</strong> — Storage → Your users (direct)</li>
                        <li><strong className="text-white">File storage</strong> — Provider's infrastructure, not ours</li>
                        <li><strong className="text-white">Bandwidth costs</strong> — You pay your provider, not us</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        What's NOT here: <strong className="text-white">Our API. We're not in the file path.</strong>
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Example: Upload a 5MB image
                    </h2>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg space-y-6">
                        <div>
                            <div className="text-green-400 font-mono text-sm mb-2">Step 1: Control Plane (15ms)</div>
                            <pre className="text-neutral-300 text-sm overflow-x-auto">
{`POST /api/upload/r2/signed-url
{
  "filename": "photo.jpg",
  "contentType": "image/jpeg",
  "r2AccessKey": "...",
  "r2SecretKey": "...",
  "r2Bucket": "my-photos"
}

→ Validate API key (10ms)
→ Check rate limit (2ms)
→ Generate signed URL (5ms, pure crypto)
→ Return response:
{
  "uploadUrl": "https://r2.../photo.jpg?signature=...",
  "publicUrl": "https://pub-xxx.r2.dev/photo.jpg"
}`}
                            </pre>
                        </div>

                        <div className="border-t border-neutral-800 pt-6">
                            <div className="text-blue-400 font-mono text-sm mb-2">Step 2: Data Plane (2-5 seconds, depending on connection)</div>
                            <pre className="text-neutral-300 text-sm overflow-x-auto">
{`// In your browser/app:
await fetch(uploadUrl, {
  method: 'PUT',
  body: file, // 5MB image
  headers: { 'Content-Type': 'image/jpeg' }
});

→ File goes directly to R2
→ We're not involved
→ No bandwidth cost to us
→ Your R2 bill: ~$0.00007 (5MB * $0.015/GB)`}
                            </pre>
                        </div>

                        <div className="border-t border-neutral-800 pt-6">
                            <div className="text-purple-400 font-mono text-sm mb-2">Step 3: Control Plane again (5ms, optional)</div>
                            <pre className="text-neutral-300 text-sm overflow-x-auto">
{`POST /api/upload/complete
{
  "uploadId": "photo.jpg",
  "provider": "r2"
}

→ Log analytics (queued, non-blocking)
→ Update usage counter
→ Return 200 OK`}
                            </pre>
                        </div>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">Total time in our API:</strong> 20ms (15ms + 5ms)<br />
                        <strong className="text-white">Total time uploading:</strong> 2-5 seconds (depends on your internet, not us)<br />
                        <strong className="text-white">Bandwidth we paid for:</strong> 0 bytes
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Why this matters for performance
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Traditional architecture (bad):</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                        <pre className="text-neutral-300 text-sm">
{`Your browser → Upload API → Storage
              ↑
              Bottleneck: Server bandwidth, CPU, memory
              
- 10 users uploading 10MB files = 100MB through your server
- Server maxes out at 100Mbps = uploads slow down
- CPU busy processing uploads = API requests slow down
- One slow upload blocks other requests`}
                        </pre>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        <strong className="text-white">Our architecture (good):</strong>
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg mt-2">
                        <pre className="text-neutral-300 text-sm">
{`Your browser → Storage (direct)
Your browser → Our API (for permissions only)
              ↑
              No bottleneck: We never see files
              
- 10 users uploading 10MB files = 0MB through our servers
- Our API: 10 requests × 15ms = 150ms total
- No CPU load from files
- Fast requests stay fast`}
                        </pre>
                    </div>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Why this matters for cost
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Let's say you have 1,000 users uploading 100MB/month each = 100GB total traffic.
                    </p>

                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg mt-4 space-y-4">
                        <div>
                            <div className="text-red-400 font-bold mb-2">Traditional service (proxying files):</div>
                            <div className="text-neutral-300 text-sm space-y-1">
                                <div>Inbound traffic: 100GB × $0.01/GB = $1.00</div>
                                <div>Outbound traffic: 100GB × $0.09/GB = $9.00</div>
                                <div>Storage (if they host): 100GB × $0.02/GB = $2.00</div>
                                <div>CPU/processing: $5.00</div>
                                <div className="border-t border-neutral-700 pt-2 mt-2">
                                    <strong>Total cost: $17/month</strong>
                                </div>
                                <div className="text-red-400 mt-2">
                                    To be profitable at $24/mo price: IMPOSSIBLE<br />
                                    Actual price needed: $99/month minimum (hello, Cloudinary)
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-neutral-700 pt-4">
                            <div className="text-green-400 font-bold mb-2">ObitoX (signed URLs only):</div>
                            <div className="text-neutral-300 text-sm space-y-1">
                                <div>Traffic through us: 0GB</div>
                                <div>API requests: 1,000 users × 100 uploads = 100k requests</div>
                                <div>Cloudflare cost: $0 (1M free requests/month)</div>
                                <div>Redis cost: $0 (free tier)</div>
                                <div>Supabase cost: $0 (free tier)</div>
                                <div className="border-t border-neutral-700 pt-2 mt-2">
                                    <strong>Total cost: $0/month</strong>
                                </div>
                                <div className="text-green-400 mt-2">
                                    Revenue at $24/mo × 1,000 users: $24,000/month<br />
                                    Profit margin: <strong>100%</strong> 🔥
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="leading-7 text-neutral-300 mt-6">
                        Your users' cost (they pay R2 directly):<br />
                        100GB storage: 100 × $0.015 = <strong className="text-white">$1.50/month</strong><br />
                        100GB bandwidth: 100 × $0.00 = <strong className="text-white">$0/month</strong> (R2 has no egress fees)
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Combined cost: <strong className="text-white">$24 (us) + $1.50 (R2) = $25.50/month</strong><br />
                        vs Cloudinary: <strong className="text-white">$99/month minimum</strong>
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">You save $73.50/month by bringing your own storage.</strong>
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        The tradeoff (honesty required)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Pro:</strong> Insanely cheap, insanely fast, no vendor lock-in<br />
                        <strong className="text-white">Con:</strong> More setup (you manage storage credentials)
                    </p>

                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">What this means:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>You create an R2/Vercel/Supabase account</li>
                        <li>You get API keys from them</li>
                        <li>You pass those keys to us in API requests</li>
                        <li>We generate signed URLs using your keys</li>
                        <li>You rotate keys, manage buckets, handle billing with them</li>
                    </ul>

                    <p className="leading-7 text-neutral-300 mt-4">
                        If you want <strong className="text-white">"just upload files, we handle everything"</strong>, use Cloudinary ($99/mo).<br />
                        If you want <strong className="text-white">"I'll manage storage, you handle the API layer"</strong>, use us ($9/mo).
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        When the data plane is slow, it's not our fault
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Real scenario: User uploads 50MB file, takes 10 seconds, complains "your API is slow."
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Truth:</strong> Our API took 15ms to generate the signed URL. 
                        The 10 seconds was their internet uploading to R2. We're not in that path.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        We can't make R2 faster. We can't make their internet faster. We can only make <strong className="text-white">our part</strong> fast.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        This is the control plane / data plane split in action. We optimize what we control. We don't pretend to control what we don't.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        How to think about it
                    </h2>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
                        <div className="space-y-4 text-neutral-300">
                            <div>
                                <strong className="text-white">Control Plane:</strong> The thin, fast, cheap layer<br />
                                <span className="text-sm text-neutral-400">
                                    Permissions, security, routing, metadata<br />
                                    Cost: Nearly $0<br />
                                    Speed: 5-50ms
                                </span>
                            </div>
                            <div className="border-t border-neutral-700 pt-4">
                                <strong className="text-white">Data Plane:</strong> The thick, heavy, expensive layer<br />
                                <span className="text-sm text-neutral-400">
                                    Actual files, bandwidth, storage<br />
                                    Cost: You pay your provider<br />
                                    Speed: Depends on file size and network
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-6">
                        Traditional services combine both layers → expensive, slow, locked in<br />
                        ObitoX separates them → cheap, fast, modular
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        That's the architecture. No magic, no buzzwords, just <strong className="text-white">don't put files in the critical path</strong>.
                    </p>
                </section>
            </div>

            {/* Minimalist Footer Navigation */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/handbook/architecture/system-overview"
                        className="group block p-6 text-left rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            System overview
                        </div>
                    </Link>
                    <Link
                        href="/handbook/architecture/security-model"
                        className="group block p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Security model
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}