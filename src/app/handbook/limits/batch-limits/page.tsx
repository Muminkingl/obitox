import Link from "next/link";

export default function BatchLimitsPage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    Batch Limits
                </h1>
                <section className="space-y-6">
                    <p className="leading-7 text-neutral-300">
                        Our batch operations allow you to process multiple files in a single request. However, to prevent abuse, we cap the number of items per batch.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        <strong className="text-white">Free:</strong> 10 files/batch<br />
                        <strong className="text-white">Pro:</strong> 100 files/batch
                    </p>
                </section>
            </div>

            {/* Minimalist Footer Navigation */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/handbook/limits/usage-limits"
                        className="group block p-6 text-left rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Usage limits
                        </div>
                    </Link>
                    <Link
                        href="/handbook/limits/fair-use"
                        className="group block p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Fair use
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
