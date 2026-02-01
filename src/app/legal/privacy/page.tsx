import { Metadata } from "next";
import Link from "next/link";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { Eye, Database, Shield, UserCheck, Globe, Clock, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy - ObitoX",
    description: "Learn how ObitoX collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
    return (
        <main className="relative min-h-screen bg-background">
            <HeroHeader />

            <div className="pt-24 pb-16">
                <div className="mx-auto max-w-4xl px-6">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20">
                                <Eye className="h-6 w-6 text-violet-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
                                <p className="text-sm text-muted-foreground mt-1">Last updated: January 2026</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Your privacy is important to us. This policy explains how ObitoX collects,
                            uses, and protects your information.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-8">
                        <PolicySection
                            icon={<Database className="h-5 w-5 text-violet-400" />}
                            title="Information We Collect"
                        >
                            <p className="mb-4">We collect information you provide directly:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Account information (email, name)</li>
                                <li>API usage data and request logs</li>
                                <li>Payment information (processed by Wayl)</li>
                                <li>Support communications</li>
                            </ul>
                            <p className="mt-4">We automatically collect:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>IP addresses and device information</li>
                                <li>Usage patterns and API call metadata</li>
                                <li>Error logs for debugging</li>
                            </ul>
                        </PolicySection>

                        <PolicySection
                            icon={<UserCheck className="h-5 w-5 text-violet-400" />}
                            title="How We Use Your Information"
                        >
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Provide and improve our services</li>
                                <li>Process payments and manage subscriptions</li>
                                <li>Send service updates and security alerts</li>
                                <li>Prevent abuse and enforce rate limits</li>
                                <li>Respond to support requests</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </PolicySection>

                        <PolicySection
                            icon={<Shield className="h-5 w-5 text-violet-400" />}
                            title="Data Protection"
                        >
                            <p className="mb-4">We implement industry-standard security measures:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>End-to-end encryption for data in transit (TLS 1.3)</li>
                                <li>Encrypted storage for sensitive data at rest</li>
                                <li>Regular security audits and penetration testing</li>
                                <li>Access controls and audit logging</li>
                                <li>HMAC-SHA256 request signing for API security</li>
                            </ul>
                        </PolicySection>

                        <PolicySection
                            icon={<Globe className="h-5 w-5 text-violet-400" />}
                            title="Data Sharing"
                        >
                            <p className="mb-4">We do not sell your personal information. We may share data with:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li><strong>Service providers</strong> — Payment processors, cloud hosting</li>
                                <li><strong>Legal authorities</strong> — When required by law</li>
                                <li><strong>Business transfers</strong> — In case of merger or acquisition</li>
                            </ul>
                        </PolicySection>

                        <PolicySection
                            icon={<Clock className="h-5 w-5 text-violet-400" />}
                            title="Data Retention"
                        >
                            <p>
                                We retain your data for as long as your account is active or as needed to provide services.
                                API logs are retained for 90 days. Upon account deletion, personal data is removed within 30 days,
                                except where retention is required by law.
                            </p>
                        </PolicySection>

                        <PolicySection
                            icon={<UserCheck className="h-5 w-5 text-violet-400" />}
                            title="Your Rights"
                        >
                            <p className="mb-4">You have the right to:</p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Access your personal data</li>
                                <li>Correct inaccurate information</li>
                                <li>Delete your account and data</li>
                                <li>Export your data</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </PolicySection>

                        <PolicySection
                            icon={<Mail className="h-5 w-5 text-violet-400" />}
                            title="Contact Us"
                        >
                            <p>
                                If you have questions about this privacy policy or wish to exercise your rights,
                                contact us at{" "}
                                <a href="mailto:privacy@obitox.com" className="text-violet-400 hover:underline">
                                    privacy@obitox.com
                                </a>
                            </p>
                        </PolicySection>
                    </div>
                </div>
            </div>

            <FooterSection />
        </main>
    );
}

function PolicySection({ icon, title, children }: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="p-6 rounded-xl border border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                {icon}
                {title}
            </h2>
            <div className="text-muted-foreground text-sm leading-relaxed">
                {children}
            </div>
        </div>
    );
}
