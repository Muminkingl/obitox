import Link from "next/link";

export default function DogfoodingPage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    How dogfooding shapes our product
                </h1>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        We built this because we needed it
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        ObitoX exists because we were building an app that needed file uploads. We tried Cloudinary ($99/month minimum),
                        felt insulted by the pricing. We tried AWS S3 directly, spent 2 weeks fighting IAM policies and presigned URL bugs.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        We needed something that:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>Generated signed URLs without external API calls (fast)</li>
                        <li>Worked with multiple providers (no lock-in)</li>
                        <li>Had real rate limiting (not "TODO: add later")</li>
                        <li>Cost less than $100/month (we're bootstrapped)</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        So we built it. Then we thought: <strong className="text-white">"If we need this, other developers probably do too."</strong>
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        The bugs we find are your bugs
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Real example 1:</strong> Our rate limiter was taking 707ms per request. We analyzed Redis call patterns,
                        found 4 sequential calls, and refactored into a single mega-pipeline. Now it's 186ms (74% faster).
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Real example 2:</strong> Our signature validator was making a database query on every request (213ms).
                        We cached the secret hash in the API key middleware. Now it takes 0-1ms (99.5% faster).
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Real example 3:</strong> During testing, we got mass account creation attacks (someone scripted 500 fake signups).
                        Our rate limiter broke. We rebuilt it with 6 security layers: per-tier quotas, abuse event logging.
                        Now it survives DDoS attempts.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Real example 3:</strong> Batch operations were slow because we validated each file individually.
                        We refactored to parallel validation. 100 files now validates in ~800-1000ms instead of 5 seconds.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        We don't find these problems in a test suite. We find them <strong className="text-white">when we're trying to ship our own features</strong> and the API pisses us off.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Performance numbers aren't marketing claims
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        We publish response times because <strong className="text-white">we need them to be fast for our own apps</strong>.
                        These are real numbers from our production benchmarks:
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg font-mono text-sm text-neutral-300 mt-4">
                        <div className="text-neutral-500 mb-2">// Crypto signing time (pure computation)</div>
                        <div>R2 (Cloudflare): <span className="text-green-400">4-12ms</span></div>
                        <div>S3 (AWS): <span className="text-green-400">5-15ms</span></div>
                        <div className="mt-3 text-neutral-500">// Full API response (includes auth + rate limiting)</div>
                        <div>Vercel Blob: <span className="text-yellow-400">200-300ms</span> (external API)</div>
                        <div>Supabase: <span className="text-yellow-400">375-450ms</span> (multi-layer cache)</div>
                        <div>Uploadcare: <span className="text-yellow-400">350-500ms</span> (external API)</div>
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        The difference? <strong className="text-white">Crypto signing is pure math</strong>—it happens in 5-15ms regardless of network.
                        Full API response includes authentication, rate limiting, quota checks, and your network latency.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-2">
                        If a provider is slower than expected, we <strong className="text-white">optimize aggressively</strong>.
                        
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        We pay for our own infrastructure
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        ObitoX's backend runs on Cloudflare Workers (1M requests/month free).
                        Our own dashboard makes ~50,000 requests/month to the API. We're still on the free tier.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        When we hit 1M requests, <strong className="text-white">we'll pay the $5-10/month upgrade</strong> just like you would.
                        We're not running on "internal credits" or special pricing. We pay the same rates.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        This keeps us honest. If pricing gets too expensive, we feel it before you do.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Features exist because we needed them
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Batch operations:</strong> We were uploading profile photos for 100 users in a bulk import.
                        Making 100 separate API calls was stupid. We built batching (1 API call for 100 files). Now it's a core feature.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">JWT tokens:</strong> We needed to share files with expiring links (like Dropbox).
                        Generating a new signed URL for every access was overkill. We built JWT-based tokens that work across all providers.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        We're not "imagining use cases." <strong className="text-white">We're solving our own problems and sharing the solutions.</strong>
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Error messages we write for ourselves
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Bad error message (most APIs):
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg font-mono text-sm text-red-400 mt-2">
                        {"{ \"error\": \"Invalid credentials\" }"}
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Our error message:
                    </p>
                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg font-mono text-sm text-neutral-300 mt-2">
                        {`{
  "success": false,
  "error": "Invalid R2 credentials",
  "code": "INVALID_ACCESS_KEY",
  "hint": "Check your Access Key ID in Cloudflare dashboard",
  "docs": "https://docs.obitox.com/providers/r2",
  "requestId": "r2_dl_1234567890"
}`}
                    </div>
                    <p className="leading-7 text-neutral-300 mt-4">
                        We write errors like this because <strong className="text-white">we got stuck debugging "Invalid credentials" at 2am </strong>
                        and swore we'd never inflict that on anyone else.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        The roadmap is our backlog
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        We don't have a "vision board" with moonshot features. Our roadmap is literally:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">What broke when we used it last week</strong> (highest priority)</li>
                        <li><strong className="text-white">What feature we wished existed</strong> while building something</li>
                        <li><strong className="text-white">What users requested</strong> that we also need</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Current roadmap (Jan 2025):
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>Time-limited download URLs (we need this for sharing files)</li>
                        <li>Custom domains for R2 (we want cdn.obitox.com instead of pub-xxx.r2.dev)</li>
                        <li>Webhooks (we need to know when uploads complete without polling)</li>
                    </ol>
                    <p className="leading-7 text-neutral-300 mt-4">
                        These aren't "customer requests." <strong className="text-white">These are features we're building for ourselves</strong> and will release to everyone.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Why this matters to you
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        When you report a bug, you're not talking to a support team who forwards it to engineering who adds it to a backlog that gets reviewed quarterly.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        You're talking to <strong className="text-white">the people who built the thing and use it every day</strong>.
                        If it's broken for you, it's probably broken for us too. We fix it because we need it fixed.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        This is why response times are fast, error messages are helpful, and features actually solve real problems.
                        We're not guessing what developers need. <strong className="text-white">We are developers, and we needed this.</strong>
                    </p>
                </section>
            </div>

            {/* Minimalist Footer Navigation - Split (Previous Only for now as it's the last in Company) */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Previous Link */}
                    <Link
                        href="/handbook/company/how-we-make-money"
                        className="group block p-6 text-left rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            How we make money
                        </div>
                    </Link>

                    {/* Next Link */}
                    <Link
                        href="/handbook/architecture/system-overview"
                        className="group block p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            System overview
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}    