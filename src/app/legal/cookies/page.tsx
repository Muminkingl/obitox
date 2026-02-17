import { Metadata } from "next";
import Link from "next/link";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { Cookie, Settings, Shield, BarChart3, CheckCircle, AlertCircle, Info, Clock, Building } from "lucide-react";

export const metadata: Metadata = {
    title: "Cookie Policy - ObitoX",
    description: "Learn how ObitoX uses cookies and similar technologies. Detailed information about cookie types, purposes, and management.",
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
                                <p className="text-sm text-muted-foreground mt-1">Last updated: February 2026</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            This policy explains how ObitoX uses cookies and similar technologies
                            to recognize you when you visit our website and use our services.
                        </p>
                    </div>

                    {/* Quick Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        <QuickFact
                            icon={<Shield className="h-5 w-5" />}
                            title="Essential Only"
                            description="Most cookies are required for functionality"
                        />
                        <QuickFact
                            icon={<Settings className="h-5 w-5" />}
                            title="User Control"
                            description="Manage preferences via browser settings"
                        />
                        <QuickFact
                            icon={<Clock className="h-5 w-5" />}
                            title="Auto-Expiry"
                            description="Cookies expire automatically"
                        />
                    </div>

                    {/* What Are Cookies */}
                    <div className="mb-8 p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Cookie className="h-5 w-5 text-violet-400" />
                            What Are Cookies?
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            Cookies are small text files stored on your device when you visit a website.
                            They help websites remember your preferences, keep you logged in, and understand
                            how you use the site. We use several types:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="p-3 rounded-lg bg-muted/50">
                                <span className="font-medium text-foreground">Session Cookies</span>
                                <p className="text-muted-foreground text-xs mt-1">Deleted when you close your browser</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <span className="font-medium text-foreground">Persistent Cookies</span>
                                <p className="text-muted-foreground text-xs mt-1">Remain until expiration or manual deletion</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <span className="font-medium text-foreground">First-Party Cookies</span>
                                <p className="text-muted-foreground text-xs mt-1">Set by ObitoX directly</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <span className="font-medium text-foreground">Third-Party Cookies</span>
                                <p className="text-muted-foreground text-xs mt-1">Set by our service providers</p>
                            </div>
                        </div>
                    </div>

                    {/* Cookie Types */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>
                        <div className="space-y-4">
                            <CookieType
                                icon={<Shield className="h-5 w-5" />}
                                title="Essential Cookies"
                                required
                                description="Required for the website to function. These enable core features like authentication, security, and session management. The website cannot work properly without these cookies."
                                examples={[
                                    { name: "sb-auth-token", purpose: "Supabase authentication", duration: "Session" },
                                    { name: "csrf-token", purpose: "CSRF protection", duration: "Session" },
                                    { name: "session-id", purpose: "Session management", duration: "24 hours" }
                                ]}
                            />
                            <CookieType
                                icon={<Settings className="h-5 w-5" />}
                                title="Functional Cookies"
                                description="Remember your preferences and settings to provide a personalized experience. These are optional but enhance your experience."
                                examples={[
                                    { name: "theme-preference", purpose: "Dark/light mode", duration: "1 year" },
                                    { name: "language", purpose: "Language preference", duration: "1 year" },
                                    { name: "sidebar-state", purpose: "Dashboard layout", duration: "30 days" }
                                ]}
                            />
                            <CookieType
                                icon={<BarChart3 className="h-5 w-5" />}
                                title="Analytics Cookies"
                                description="Help us understand how visitors interact with our website so we can improve it. Data is anonymized where possible."
                                examples={[
                                    { name: "_vercel_insights", purpose: "Vercel Analytics", duration: "26 months" },
                                    { name: "_ga", purpose: "Google Analytics (if enabled)", duration: "26 months" }
                                ]}
                            />
                        </div>
                    </div>

                    {/* Cookie Table */}
                    <div className="mb-8 p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Info className="h-5 w-5 text-violet-400" />
                            Detailed Cookie List
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 font-medium text-foreground">Cookie Name</th>
                                        <th className="text-left py-3 font-medium text-foreground">Purpose</th>
                                        <th className="text-left py-3 font-medium text-foreground">Duration</th>
                                        <th className="text-left py-3 font-medium text-foreground">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="text-muted-foreground">
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 font-mono text-xs">sb-auth-token</td>
                                        <td className="py-3">Authentication session</td>
                                        <td className="py-3">Session</td>
                                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-xs">Essential</span></td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 font-mono text-xs">csrf-token</td>
                                        <td className="py-3">Security token</td>
                                        <td className="py-3">Session</td>
                                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-xs">Essential</span></td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 font-mono text-xs">theme-preference</td>
                                        <td className="py-3">UI theme setting</td>
                                        <td className="py-3">1 year</td>
                                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs">Functional</span></td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 font-mono text-xs">language</td>
                                        <td className="py-3">Language preference</td>
                                        <td className="py-3">1 year</td>
                                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs">Functional</span></td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 font-mono text-xs">_vercel_insights</td>
                                        <td className="py-3">Analytics</td>
                                        <td className="py-3">26 months</td>
                                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs">Analytics</span></td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 font-mono text-xs">sidebar-state</td>
                                        <td className="py-3">Dashboard layout</td>
                                        <td className="py-3">30 days</td>
                                        <td className="py-3"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs">Functional</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Third Party */}
                    <div className="mb-8 p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Building className="h-5 w-5 text-violet-400" />
                            Third-Party Services
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            We use the following third-party services that may set cookies:
                        </p>
                        <div className="space-y-3">
                            <ThirdPartyService
                                name="Supabase"
                                purpose="Authentication and database services"
                                privacyUrl="https://supabase.com/privacy"
                                cookies={["sb-auth-token", "sb-session"]}
                            />
                            <ThirdPartyService
                                name="Wayl"
                                purpose="Payment processing"
                                privacyUrl="https://wayl.io/privacy"
                                cookies={["wayl-session", "wayl-csrf"]}
                            />
                            <ThirdPartyService
                                name="Vercel"
                                purpose="Application hosting and analytics"
                                privacyUrl="https://vercel.com/legal/privacy-policy"
                                cookies={["_vercel_insights"]}
                            />
                        </div>
                    </div>

                    {/* Managing Cookies */}
                    <div className="mb-8 p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                            Managing Your Cookie Preferences
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            You can control cookies through your browser settings. Here's how:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BrowserInstruction
                                browser="Chrome"
                                instructions="Settings > Privacy and security > Cookies and other site data"
                            />
                            <BrowserInstruction
                                browser="Firefox"
                                instructions="Settings > Privacy & Security > Cookies and Site Data"
                            />
                            <BrowserInstruction
                                browser="Safari"
                                instructions="Preferences > Privacy > Manage Website Data"
                            />
                            <BrowserInstruction
                                browser="Edge"
                                instructions="Settings > Cookies and site permissions > Cookies and site data"
                            />
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <p className="text-sm text-muted-foreground">
                                <AlertCircle className="h-4 w-4 inline mr-1 text-amber-400" />
                                <strong>Note:</strong> Blocking essential cookies will prevent the website from functioning properly.
                                You may not be able to log in or use certain features.
                            </p>
                        </div>
                    </div>

                    {/* Similar Technologies */}
                    <div className="mb-8 p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Similar Technologies</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            In addition to cookies, we may use the following technologies:
                        </p>
                        <div className="space-y-3 text-sm">
                            <div className="p-3 rounded-lg bg-muted/50">
                                <span className="font-medium text-foreground">Local Storage</span>
                                <p className="text-muted-foreground text-xs mt-1">
                                    Used to store larger amounts of data (e.g., user preferences, cached data).
                                    Unlike cookies, this data is not sent with every request.
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <span className="font-medium text-foreground">Session Storage</span>
                                <p className="text-muted-foreground text-xs mt-1">
                                    Similar to local storage but cleared when you close your browser tab.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Questions?</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            If you have questions about our use of cookies or similar technologies, contact us at{" "}
                            <a href="mailto:support@obitox.dev" className="text-violet-400 hover:underline">
                                support@obitox.dev
                            </a>
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link
                                href="/legal/privacy"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/legal/security"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm"
                            >
                                Security
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <FooterSection />
        </main>
    );
}

function QuickFact({ icon, title, description }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
            <div className="flex justify-center mb-2 text-emerald-400">{icon}</div>
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
    );
}

function CookieType({ icon, title, description, examples, required }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    examples: { name: string; purpose: string; duration: string }[];
    required?: boolean;
}) {
    return (
        <div className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
                <div className="text-violet-400">{icon}</div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                {required && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        Required
                    </span>
                )}
            </div>
            <p className="text-muted-foreground text-sm mb-4">{description}</p>
            <div className="space-y-2">
                {examples.map((example, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-muted/50">
                        <span className="font-mono text-foreground">{example.name}</span>
                        <span className="text-muted-foreground">{example.purpose}</span>
                        <span className="text-muted-foreground">{example.duration}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ThirdPartyService({ name, purpose, privacyUrl, cookies }: {
    name: string;
    purpose: string;
    privacyUrl: string;
    cookies: string[];
}) {
    return (
        <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{name}</span>
                <a
                    href={privacyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-violet-400 hover:underline"
                >
                    Privacy Policy
                </a>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{purpose}</p>
            <div className="flex flex-wrap gap-1">
                {cookies.map((cookie, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                        {cookie}
                    </span>
                ))}
            </div>
        </div>
    );
}

function BrowserInstruction({ browser, instructions }: {
    browser: string;
    instructions: string;
}) {
    return (
        <div className="p-3 rounded-lg bg-muted/50">
            <span className="font-medium text-foreground">{browser}</span>
            <p className="text-xs text-muted-foreground mt-1">{instructions}</p>
        </div>
    );
}
