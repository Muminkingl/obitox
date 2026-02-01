import { Metadata } from "next";
import Link from "next/link";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { CheckCircle2, Home, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Thank You - ObitoX Enterprise",
    description: "Your enterprise inquiry has been submitted successfully.",
};

export default function EnterpriseDonePage() {
    return (
        <main className="relative min-h-screen bg-background">
            <HeroHeader />

            <div className="pt-24 pb-16">
                <div className="mx-auto max-w-2xl px-6">
                    {/* Success Result Card */}
                    <div className="text-center py-16 space-y-8">
                        {/* Success Icon */}
                        <div className="mx-auto w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle2 className="size-12 text-emerald-500" />
                        </div>

                        {/* Title */}
                        <div className="space-y-3">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                Successfully Submitted!
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-md mx-auto">
                                Your enterprise inquiry has been received. Our team will review your request and get back to you within 24-48 hours.
                            </p>
                        </div>

                        {/* Info Card */}
                        <div className="p-6 rounded-xl border border-border bg-card/50 text-left space-y-4 max-w-md mx-auto">
                            <h3 className="font-semibold text-foreground">What happens next?</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <div className="size-5 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-violet-500">1</span>
                                    </div>
                                    <span>Our enterprise team reviews your requirements</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="size-5 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-violet-500">2</span>
                                    </div>
                                    <span>We'll reach out to you</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="size-5 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-violet-500">3</span>
                                    </div>
                                    <span>Custom proposal tailored to your needs</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors shadow-lg shadow-violet-500/20"
                            >
                                <Home className="size-4" />
                                Back to Home
                            </Link>
                            <Link
                                href="/docs"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold transition-colors"
                            >
                                Explore Docs
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <FooterSection />
        </main>
    );
}
