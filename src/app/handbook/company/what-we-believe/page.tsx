import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function WhatWeBelievePage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    What we believe
                </h1>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Performance is a feature, not a footnote
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        We publish response times: 5-15ms for R2 signed URLs, 20-30ms with full caching, 400ms worst-case with all security checks.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        Most companies say "blazing fast" and hide the numbers. We say "here's the benchmark, run it yourself."
                        If something's slow, we <strong className="text-white">fix the architecture</strong>, not the marketing copy.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        Example: Our Supabase integration went from 3311ms to 848ms (74% faster) by adding multi-layer caching (memory → Redis → DB). 
                        That's documented in our GitHub with before/after metrics.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Read the code, not the promises
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Our rate limiter isn't "enterprise-grade" because we said so. It has <strong className="text-white">9 security layers</strong>: 
                        Cloudflare DDoS protection → Arcjet bot detection → API key validation → memory guards → Redis rate limits → quota enforcement → email verification → domain validation → abuse logging.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        We didn't build this to impress VCs. We built it because we got mass-account-creation attacks during testing and needed something that wouldn't fall over.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        The domain verification system logs every attempt, blocks disposable emails, enforces per-tier quotas, and runs DNS checks in a background cron job 
                        (not on-demand, so you can't spam our DNS provider with 1000 verify clicks).
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Pricing should make sense
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Free tier: 1,000 requests/month. Why? Because you can test properly with ~300 uploads, but you can't run production and abuse it.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        Pro tier: $9/month for 50,000 requests. Why not $5? Because $5 feels toy-ish. Why not $19? Because we're not paying for your bandwidth—you are.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        We charge for <strong className="text-white">operations</strong> (signed URLs, analytics, security), not storage or traffic. 
                        Cloudinary charges $99/month minimum because they host your files. We charge $9 because we don't.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        Infrastructure cost per user: $0 until ~200 users (we're on Cloudflare/Supabase/Redis free tiers). 
                        Profit margin: 98%+ even after upgrading to paid tiers. That's why we can be this cheap without going broke.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Lock-in is lazy engineering
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        If switching providers requires rewriting your app, <strong className="text-white">the abstraction failed</strong>.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        Our SDK: Same code works with R2, Vercel Blob, Supabase Storage, Uploadcare. 
                        Provider credentials are in the request body, not hardcoded. Change 3 lines to switch providers. No migration scripts. No downtime.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        This costs us revenue (you could leave easily), but it's honest. We'd rather compete on quality than handcuffs.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Open about tradeoffs
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Our batch operations count as 1 request (100 files = 1 API call). This is extremely efficient, but it means you could theoretically 
                        game the system by batching everything. We limit it: Free tier gets 10 files/batch, Pro gets 100, Enterprise gets 10,000.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        Response times: 20-30ms cached, 400-600ms on cold starts. We don't say "instant" — that's lying. 
                        We say <strong className="text-white">"faster than proxying data through servers"</strong> and show the math.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        Free tier abuse: Yes, someone could create 100 accounts and get 100,000 free requests. 
                        We detect this with email verification, IP tracking, and abuse event logging. It's not perfect, but we're not pretending it's unsolvable.
                    </p>
                </section>
            </div>

            {/* Minimalist Footer Navigation - Split */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Previous Link */}
                    <Link
                        href="/handbook/company/why-we-exist"
                        className="group block p-6 text-left rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Why we exist
                        </div>
                    </Link>

                    {/* Next Link */}
                    <Link
                        href="/handbook/company/how-we-make-money"
                        className="group block p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            How we make money
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}