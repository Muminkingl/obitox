import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function HowWeMakeMoneyPage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    How we make money
                </h1>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        By not paying for your bandwidth
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Most upload services charge a lot because they're paying for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>Storage (your files sit on their servers)</li>
                        <li>Bandwidth (every download costs them money)</li>
                        <li>CDN (global distribution isn't free)</li>
                        <li>Server CPU (proxying files takes resources)</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        We pay for <strong className="text-white">none of that</strong>. Your files go from your browser directly to your R2/Vercel/Supabase account. 
                        We generate signed URLs (pure cryptography, 5-15ms), track requests in Redis, and log analytics in Supabase.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        Cost per user: <strong className="text-white">$0</strong> until we hit ~200 users. Why? Cloudflare gives 1M free requests/month. 
                        Supabase gives 500MB DB + 2GB bandwidth free. Redis (Upstash) gives 10k commands/day free.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        At 100 Pro users ($9 each), we're making $900/month with $0 infrastructure cost. That's a <strong className="text-white">100% profit margin</strong>. 
                        Even after upgrading to paid tiers at scale, margins stay above 98%.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        By charging for convenience, not storage
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        You're not paying us to host files. You're paying for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">One API</strong> that works with 4 providers (more coming)</li>
                        <li><strong className="text-white">Security</strong> that took 4 weeks to build (rate limiting, abuse prevention, email verification)</li>
                        <li><strong className="text-white">Batch operations</strong> (100 files in 1 API call vs 100 separate requests)</li>
                        <li><strong className="text-white">JWT tokens</strong> for access control without exposing storage URLs</li>
                        <li><strong className="text-white">Analytics</strong> dashboard (who uploaded what, when, success rates)</li>
                        <li><strong className="text-white">Not having to wire this together yourself</strong> (3 weeks of work, minimum)</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Free tier: 1,000 requests/month (~300 uploads). Good for testing, not production abuse.<br />
                        Pro tier: $9/month for 50,000 requests (~15,000 uploads). Cloudinary charges $99/month and starts counting GBs.<br />
                        Enterprise: Custom pricing because you're probably hitting 10M+ requests and need dedicated support.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        The numbers (with receipts)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Scenario 1:</strong> 100 Pro users<br />
                        Revenue: $900/month<br />
                        Infrastructure: $0 (free tier)<br />
                        Profit: $900 (100% margin)
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Scenario 2:</strong> 500 users (mix of Free/Pro/Enterprise)<br />
                        Revenue: ~$7,000/month<br />
                        Infrastructure: ~$80/month (Cloudflare paid: $25, Supabase Pro: $25, Redis: $10, monitoring: $20)<br />
                        Profit: $6,920 (98.9% margin)
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Scenario 3:</strong> 5,000 users<br />
                        Revenue: ~$60,000/month<br />
                        Infrastructure: ~$500/month (still cheap at scale)<br />
                        Profit: $59,500 (99.2% margin)
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        Why can we maintain 98%+ margins? <strong className="text-white">Because we're not a CDN.</strong> 
                        We're an API that generates URLs and tracks requests. Cloudflare Workers scale incredibly cheap: $5 base + $0.50 per million extra requests.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Why so cheap compared to competitors?
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Cloudinary:</strong> $99/month minimum (11× our Pro plan)<br />
                        Why? They store your files, deliver via CDN, process images on the fly. That costs real money.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Uploadcare:</strong> $25/month for 10GB traffic<br />
                        Why? They proxy your uploads. Every byte costs them bandwidth.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">Vercel Blob:</strong> $20/month for 100GB bandwidth<br />
                        Why? Great DX, but they're a hosting company. Bandwidth is their cost center.
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        <strong className="text-white">ObitoX:</strong> $9/month for 50,000 operations<br />
                        Why? <strong className="text-white">We don't touch your files.</strong> You bring R2 ($0.015/GB), we generate URLs (5-15ms crypto operation). 
                        Your bandwidth costs are ~$5-10/month for 1TB. Our costs are API calls (nearly free at scale).
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        The catch (there's always one)
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        You manage your own storage credentials. We don't hold your R2/Vercel/Supabase API keys in a dashboard—you pass them in each request.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        This means:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">More setup</strong> (you configure providers yourself)</li>
                        <li><strong className="text-white">More responsibility</strong> (you rotate keys, manage buckets)</li>
                        <li><strong className="text-white">More control</strong> (no vendor lock-in, you own your data)</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        If you want a fully managed service where we handle storage too, use Cloudinary. If you want <strong className="text-white">control + low cost</strong>, use us.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Growing with you, not off you
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Side project uploading 50 files/month? Free tier works.<br />
                        Startup doing 10,000 uploads/month? $9/month Pro tier.<br />
                        Scale-up hitting 1M requests/month? Enterprise tier at ~$299-499/month (still cheaper than competitors).
                    </p>
                    <p className="leading-7 text-neutral-300 mt-4">
                        We don't have surprise pricing. Request limits are enforced at runtime (you get a 429 error with upgrade instructions). 
                        No overage fees. No "contact sales for a quote." Just <strong className="text-white">predictable tiers you can calculate yourself</strong>.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        If you outgrow Enterprise, we'll negotiate custom pricing based on your actual usage. But we're not hiding a 10× markup behind "talk to sales."
                    </p>
                </section>
            </div>

            {/* Minimalist Footer Navigation - Split */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Previous Link */}
                    <Link
                        href="/handbook/company/what-we-believe"
                        className="group block p-6 text-left rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            What we believe
                        </div>
                    </Link>

                    {/* Next Link */}
                    <Link
                        href="/handbook/company/how-dogfooding-shapes-our-product"
                        className="group block p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            How dogfooding shapes our product
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}