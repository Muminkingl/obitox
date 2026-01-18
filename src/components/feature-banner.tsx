import { Cpu, Lock, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'

export default function FeatureBanner() {
    return (
        <section id="features" className="scroll-mt-20 overflow-hidden pt-16 pb-0 md:pt-32 md:pb-10">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-semibold lg:text-5xl tracking-tight">
                        Built for Developers Who Ship Fast
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                        Stop wrestling with provider SDKs. One unified API to upload files
                        to R2, Vercel Blob, Supabase, or Uploadcare. Switch providers
                        without touching your code. That's the power of ObitoX.
                    </p>
                </div>
                <div className="mask-b-from-75% mask-l-from-75% mask-b-to-95% mask-l-to-95% relative -mx-4 pr-3 pt-3 md:-mx-12">
                    <div className="perspective-midrange">
                        <div className="rotate-x-6 -skew-2">
                            <div className="aspect-88/36 relative">
                                <Image
                                    src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop"
                                    className="absolute inset-0 z-10 rounded-2xl border border-border/50 shadow-2xl opacity-80"
                                    alt="Universal upload infrastructure"
                                    width={2797}
                                    height={1137}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4 text-primary" />
                            <h3 className="text-sm font-medium">Sub-50ms API</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Multi-layer caching delivers signed URLs faster than
                            you can blink. No bottlenecks.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4 text-primary" />
                            <h3 className="text-sm font-medium">Zero Lock-In</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Change providers by updating one variable. Your code
                            stays untouched. Forever.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Lock className="size-4 text-primary" />
                            <h3 className="text-sm font-medium">Enterprise Security</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            <strong className="text-foreground">FILES NEVER TOUCH OUR SERVERS.</strong><br />
                            Rate limiting, abuse detection, and JWT tokens built-in.
                            Your files stay in your cloud - we just orchestrate access.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-primary" />
                            <h3 className="text-sm font-medium">Edge Native</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Runs on Cloudflare Workers, Vercel Edge, AWS Lambda.
                            Deploy anywhere serverless exists.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}