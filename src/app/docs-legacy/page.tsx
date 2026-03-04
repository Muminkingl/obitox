// app/docs/page.tsx
import Link from "next/link";
import { ArrowRight, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocsIntroductionPage() {
    return (
        <article className="max-w-4xl space-y-12">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Sparkles className="h-3 w-3 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">Documentation</span>
                </div>

                <h1 className="text-5xl font-bold text-white tracking-tight">
                    Welcome to ObitoX
                </h1>

                <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                    Upload files to <strong className="text-white">any cloud provider</strong> with one simple API.
                    No more wrestling with SDKs or managing credentials.
                </p>
            </div>



            {/* Choose Your Framework */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <h2 id="frameworks" className="text-2xl font-bold text-white scroll-mt-24">Choose your framework</h2>
                    <p className="text-slate-400">
                        Pick your stack and get started in 2 minutes
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <QuickstartCard title="Node.js" href="/docs/installation?lang=node" />
                    <QuickstartCard title="Next.js" href="/docs/installation?lang=next" />
                    <QuickstartCard title="Express" href="/docs/installation?lang=express" />
                    <QuickstartCard title="Python" href="/docs/installation?lang=python" />
                    <QuickstartCard title="PHP" href="/docs/installation?lang=php" />
                    <QuickstartCard title="Laravel" href="/docs/installation?lang=laravel" />
                    <QuickstartCard title="Go" href="/docs/installation?lang=go" />
                    <QuickstartCard title="Ruby" href="/docs/installation?lang=ruby" />
                </div>

                <Link
                    href="/docs/installation"
                    className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium group"
                >
                    View all frameworks
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {/* What's Next */}
            <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-8">
                <h3 id="next-steps" className="text-lg font-semibold text-white mb-4 scroll-mt-24">Ready to start?</h3>

                <div className="space-y-3">
                    <NextStepLink
                        number="1"
                        title="Get your API key"
                        description="Sign up and grab your key from the dashboard"
                        href="/dashboard"
                    />
                    <NextStepLink
                        number="2"
                        title="Follow the quickstart"
                        description="Copy-paste code and upload your first file"
                        href="/docs/quick-start"
                    />
                    <NextStepLink
                        number="3"
                        title="Choose a provider"
                        description="Pick S3, R2, or any supported storage"
                        href="/docs/providers"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="pt-8">
                <div className="flex items-center justify-between py-6 border-t border-slate-800">
                    <p className="text-slate-500 text-sm">Was this helpful?</p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-white gap-2">
                            <ThumbsUp className="h-3 w-3" /> Yes
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-white gap-2">
                            <ThumbsDown className="h-3 w-3" /> No
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Link
                        href="/docs/installation"
                        className="group flex items-center gap-2 text-white font-medium hover:text-emerald-400 transition-colors"
                    >
                        Next: Installation
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </article>
    );
}



function QuickstartCard({ title, href }: { title: string; href: string }) {
    return (
        <Link
            href={href}
            className="flex items-center justify-center p-4 rounded-lg border border-slate-800 bg-slate-900/30 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all group"
        >
            <span className="font-medium text-slate-300 group-hover:text-white transition-colors">
                {title}
            </span>
        </Link>
    );
}

function NextStepLink({ number, title, description, href }: { number: string; title: string; description: string; href: string }) {
    return (
        <Link
            href={href}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-800/50 transition-colors group"
        >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-400">{number}</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                    {title}
                </div>
                <div className="text-sm text-slate-400 mt-0.5">
                    {description}
                </div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-emerald-400 transition-all group-hover:translate-x-1 flex-shrink-0" />
        </Link>
    );
}