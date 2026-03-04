"use client";

import { useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { Building2, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function EnterprisePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true);
        // FormSubmit handles the actual submission
    };

    return (
        <main className="relative min-h-screen bg-background">
            <HeroHeader />

            <div className="pt-24 pb-16">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        {/* Left Side - Messaging */}
                        <div className="space-y-8 lg:sticky lg:top-32">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-full w-fit">
                                <Building2 className="size-4 text-violet-500" />
                                <span className="text-sm font-medium text-violet-400">
                                    Enterprise
                                </span>
                            </div>

                            {/* Main Headline */}
                            <div className="space-y-6">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight text-foreground leading-[1.1]">
                                    The upload partner<br />
                                    <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">you can rely on</span>
                                </h1>
                                <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                                    It doesn't matter if you handle millions or hundreds of thousands
                                    of uploads. You need assurance that your files will arrive on
                                    time, your data is secured, and you have experts in your corner.
                                </p>
                            </div>

                            {/* Features */}
                            <div className="space-y-4 pt-4">
                                <Feature text="Custom API limits tailored to your scale" />
                                <Feature text="Dedicated support with 4-hour response SLA" />
                                <Feature text="Private Slack channel with our engineering team" />
                                <Feature text="Custom legal agreements (DPA, BAA)" />
                                <Feature text="Migration & onboarding assistance" />
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="lg:pt-8">
                            <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
                                {submitted ? (
                                    <div className="text-center py-12 space-y-4">
                                        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                            <CheckCircle2 className="size-8 text-emerald-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground">Thank you!</h3>
                                        <p className="text-muted-foreground text-sm">
                                            We've received your message and will get back to you within 24 hours.
                                        </p>
                                        <Link
                                            href="/"
                                            className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 mt-4"
                                        >
                                            Back to home <ArrowRight className="size-3" />
                                        </Link>
                                    </div>
                                ) : (
                                    <form
                                        action="https://formsubmit.co/elytraxenon@gmail.com"
                                        method="POST"
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        {/* FormSubmit Configuration */}
                                        <input type="hidden" name="_subject" value="New Enterprise Inquiry - ObitoX" />
                                        <input type="hidden" name="_captcha" value="false" />
                                        <input type="hidden" name="_template" value="table" />
                                        <input type="hidden" name="_next" value={typeof window !== 'undefined' ? `${window.location.origin}/enterprise/done` : '/enterprise/done'} />

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-amber-500/80">
                                                Your email address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                placeholder="Enter your email"
                                                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                            />
                                        </div>

                                        {/* Company/Website */}
                                        <div className="space-y-2">
                                            <label htmlFor="website" className="text-sm font-medium text-amber-500/80">
                                                Your website
                                            </label>
                                            <input
                                                type="url"
                                                id="website"
                                                name="website"
                                                placeholder="Enter your website URL"
                                                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                            />
                                        </div>

                                        {/* Volume */}
                                        <div className="space-y-2">
                                            <label htmlFor="volume" className="text-sm font-medium text-amber-500/80">
                                                How many uploads do you expect per month?
                                            </label>
                                            <input
                                                type="text"
                                                id="volume"
                                                name="volume"
                                                placeholder="Enter your volume"
                                                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                            />
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-amber-500/80">
                                                Anything else you'd like to mention?
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={4}
                                                placeholder="I'd like to know how ObitoX can help me with..."
                                                className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none"
                                            />
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                                        >
                                            {isSubmitting ? "Submitting..." : "Submit"}
                                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FooterSection />
        </main>
    );
}

function Feature({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="size-1.5 rounded-full bg-violet-500" />
            <span className="text-sm text-muted-foreground">{text}</span>
        </div>
    );
}
