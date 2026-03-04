import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WhyWeExistPage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    Why we exist
                </h1>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Because we got tired of wiring the same shit together
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Every project needs file uploads. Every single one. And every time, you're stuck choosing between:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li>AWS S3 (docs from 2012, SDK weighs 50MB)</li>
                        <li>Cloudinary ($99/month to start, opinionated as hell)</li>
                        <li>Vercel Blob (great DX, terrible pricing past 100GB)</li>
                        <li>Rolling your own (security nightmare, 3 weeks of work)</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        None of them talk to each other. None of them give you signed URLs without jumping through hoops. 
                        And <strong className="text-white">none of them were built for the reality that you might switch providers next month</strong> when pricing changes or a new one launches.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        We built the abstraction layer that should've existed
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        One API. Four providers (R2, Vercel Blob, Supabase Storage, Uploadcare). More coming.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        You bring your own storage credentials. We handle:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 leading-7 ml-4">
                        <li><strong className="text-white">Signed URLs</strong> — No files through our servers (5-15ms response time)</li>
                        <li><strong className="text-white">Rate limiting</strong> — Multi-layer (memory → Redis → DB) to survive DDoS</li>
                        <li><strong className="text-white">Abuse prevention</strong> — Email verification, disposable domain blocking, quota enforcement</li>
                        <li><strong className="text-white">Batch operations</strong> — Upload 100 files with 1 API call</li>
                        <li><strong className="text-white">JWT tokens</strong> — Tokenized file access without exposing storage URLs</li>
                    </ul>
                    <p className="leading-7 text-neutral-300 mt-4">
                        This isn't a demo. The rate limiter has 9 security layers. The domain verification system has abuse event logging. 
                        The architecture can handle <strong className="text-white">10,000 concurrent requests on Cloudflare's free tier</strong> because we're not proxying your files.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        Why not just use Cloudinary?
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        Cloudinary charges $99/month minimum. That's 11× our Pro plan ($9/month).
                    </p>
                    <p className="leading-7 text-neutral-300">
                        More importantly: <strong className="text-white">they're a storage provider</strong>. If you outgrow them or they raise prices, 
                        you're locked in. Your URLs break. Your app breaks. You rewrite everything.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        ObitoX doesn't store your files. You own them. You can switch from R2 to Vercel Blob by changing 3 lines of code. 
                        No migration. No downtime. No vendor lock-in.
                    </p>
                </section>

                <section className="space-y-6 mt-12">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                        The actual technical bet
                    </h2>
                    <p className="leading-7 text-neutral-300">
                        We're betting that <strong className="text-white">signed URLs + cryptography</strong> beat proxying data through servers.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        R2 signed URL generation: 5-15ms (pure crypto, no network call)<br />
                        Vercel Blob API call: 220ms (external API, HTTP round-trip)<br />
                        Traditional upload proxy: 800ms+ (bandwidth cost, server CPU)
                    </p>
                    <p className="leading-7 text-neutral-300">
                        We're not "disrupting" anything. We're just writing less code and not charging you for bandwidth we never touched.
                    </p>
                </section>
            </div>

            {/* Minimalist Footer Navigation */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <Link
                    href="/handbook/company/what-we-believe"
                    className="group block w-full p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                >
                    <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                        Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                    </div>
                    <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                        What we believe
                    </div>
                </Link>
            </div>
        </div>
    );
}