import { Metadata } from "next";
import Link from "next/link";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { Cookie, Settings, Shield, BarChart3, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Cookie Policy - ObitoX",
    description: "Learn how ObitoX uses cookies and similar technologies.",
};

export default function CookiesPage() {
    return (
        <main className="relative min-h-screen bg-background">
            <HeroHeader />

            <div className="pt-24 pb-16">
                <div className="mx-auto max-w-4xl px-6">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20">
                                <Cookie className="h-6 w-6 text-violet-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-foreground">Cookie Policy</h1>
                                <p className="text-sm text-muted-foreground mt-1">Last updated: January 2026</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            This policy explains how ObitoX uses cookies and similar technologies
                            to recognize you when you visit our website.
                        </p>
                    </div>

                    {/* What Are Cookies */}
                    <div className="mb-8 p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Cookie className="h-5 w-5 text-violet-400" />
                            What Are Cookies?
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Cookies are small text files stored on your device when you visit a website.
                            They help websites remember your preferences, keep you logged in, and understand
                            how you use the site. We use both session cookies (deleted when you close your browser)
                            and persistent cookies (remain until expiration or deletion).
                        </p>
                    </div>

                    {/* Cookie Types */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>
                        <div className="space-y-4">
                            <CookieType
                                icon={<Shield className="h-5 w-5" />}
                                title="Essential Cookies"
                                required
                                description="Required for the website to function. These enable core features like authentication, security, and session management."
                                examples={["Session ID", "CSRF token", "Authentication state"]}
                            />
                            <CookieType
                                icon={<Settings className="h-5 w-5" />}
                                title="Functional Cookies"
                                description="Remember your preferences and settings to provide a personalized experience."
                                examples={["Theme preference (dark/light)", "Language settings", "Dashboard layout"]}
                            />
                            <CookieType
                                icon={<BarChart3 className="h-5 w-5" />}
                                title="Analytics Cookies"
                                description="Help us understand how visitors interact with our website so we can improve it."
                                examples={["Page views", "Feature usage", "Error tracking"]}
                            />
                        </div>
                    </div>

                    {/* Third Party */}
                    <div className="mb-8 p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Third-Party Services</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            We use the following third-party services that may set cookies:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                <strong>Supabase</strong> — Authentication and database
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                <strong>Wayl</strong> — Payment processing
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                <strong>Vercel Analytics</strong> — Website analytics
                            </li>
                        </ul>
                    </div>

                    {/* Managing Cookies */}
                    <div className="mb-8 p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                            Managing Your Cookie Preferences
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            You can control cookies through your browser settings:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                                <span><strong>Block all cookies</strong> — May prevent the website from functioning properly</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                                <span><strong>Block third-party cookies</strong> — Analytics and some features may not work</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                                <span><strong>Clear cookies periodically</strong> — You'll need to log in again</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Questions?</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            If you have questions about our use of cookies, contact us at{" "}
                            <a href="mailto:privacy@obitox.com" className="text-violet-400 hover:underline">
                                privacy@obitox.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <FooterSection />
        </main>
    );
}

function CookieType({ icon, title, description, examples, required }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    examples: string[];
    required?: boolean;
}) {
    return (
        <div className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
                <div className="text-violet-400">{icon}</div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                {required && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Required
                    </span>
                )}
            </div>
            <p className="text-muted-foreground text-sm mb-3">{description}</p>
            <div className="flex flex-wrap gap-2">
                {examples.map((example, i) => (
                    <span
                        key={i}
                        className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                    >
                        {example}
                    </span>
                ))}
            </div>
        </div>
    );
}
