import Link from "next/link";

export default function FailureModesPage() {
    return (
        <div className="space-y-12 max-w-3xl pt-8">
            <div>
                <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl font-serif mb-8 text-neutral-100">
                    Failure Modes
                </h1>
                <section className="space-y-6">
                    <p className="leading-7 text-neutral-300">
                        We design for failure. We assume that components will break, networks will fail, and dependencies will go down.
                    </p>
                    <p className="leading-7 text-neutral-300">
                        Our systems are built to isolate faults so that a failure in one component doesn't cascade to the entire platform.
                    </p>
                </section>
            </div>

            {/* Minimalist Footer Navigation */}
            <div className="mt-24 pt-12 border-t border-neutral-800/50">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/handbook/security/key-revocation-and-rotation"
                        className="group block p-6 text-left rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Key revocation & rotation
                        </div>
                    </Link>
                    <Link
                        href="/handbook/reliability/degraded-behavior"
                        className="group block p-6 text-right rounded-xl border border-neutral-800 transition-all hover:bg-neutral-900/50 hover:border-neutral-700"
                    >
                        <div className="text-xs font-medium text-neutral-500 mb-1 group-hover:text-neutral-400">
                            Next <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-lg font-semibold text-white group-hover:text-neutral-200">
                            Degraded behavior
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
