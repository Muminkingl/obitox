import { Metadata } from "next";
import Link from "next/link";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { Eye, Database, Shield, UserCheck, Globe, Clock, Mail, Lock, Server, FileText, AlertCircle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy - ObitoX",
    description: "Learn how ObitoX collects, uses, and protects your personal information. GDPR compliant data handling.",
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
                                <p className="text-sm text-muted-foreground mt-1">Last updated: February 2026</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Your privacy is important to us. This policy explains how ObitoX collects,
                            uses, and protects your information in compliance with applicable data protection laws.
                        </p>
                    </div>

                    {/* Quick Facts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        <QuickFact
                            icon={<Lock className="h-5 w-5" />}
                            title="Encrypted"
                            description="All data encrypted at rest and in transit"
                        />
                        <QuickFact
                            icon={<Server className="h-5 w-5" />}
                            title="Secure Storage"
                            description="Hosted on Supabase with SOC 2 compliance"
                        />
                        <QuickFact
                            icon={<Globe className="h-5 w-5" />}
                            title="GDPR Compliant"
                            description="Full data subject rights supported"
                        />
                    </div>

                    {/* Data Controller */}
                    <div className="mb-8 p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-violet-400" />
                            Data Controller
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            ObitoX is the data controller for personal information collected through this website
                            and API services. For data protection inquiries, contact our Data Protection Officer at:
                        </p>
                        <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm">
                            <p className="font-medium text-foreground">ObitoX</p>
                            <p className="text-muted-foreground">Email: support@obitox.dev</p>
                            <p className="text-muted-foreground">Response time: Within 48 hours</p>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        <PolicySection
                            icon={<Database className="h-5 w-5 text-violet-400" />}
                            title="Information We Collect"
                        >
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-foreground mb-2">Information you provide directly:</h4>
                                    <ul className="space-y-2 text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2" />
                                            <span><strong>Account information</strong> - Email address, name, profile details</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2" />
                                            <span><strong>API usage data</strong> - Request logs, error reports, usage patterns</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2" />
                                            <span><strong>Payment information</strong> - Processed securely by Wayl (we don't store card details)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2" />
                                            <span><strong>Support communications</strong> - Tickets, emails, chat transcripts</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground mb-2">Information collected automatically:</h4>
                                    <ul className="space-y-2 text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2" />
                                            <span><strong>Device information</strong> - IP address, browser type, operating system</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2" />
                                            <span><strong>Usage analytics</strong> - Pages visited, features used, session duration</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2" />
                                            <span><strong>Error logs</strong> - For debugging and service improvement</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </PolicySection>

                        <PolicySection
                            icon={<UserCheck className="h-5 w-5 text-violet-400" />}
                            title="How We Use Your Information"
                        >
                            <p className="text-muted-foreground mb-4">We process your data for the following purposes:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <UseCase title="Service Delivery" description="Provide API access, authentication, and support" />
                                <UseCase title="Billing" description="Process payments and manage subscriptions" />
                                <UseCase title="Security" description="Prevent abuse, enforce rate limits, detect fraud" />
                                <UseCase title="Improvement" description="Analyze usage patterns to improve our services" />
                                <UseCase title="Communication" description="Send service updates, security alerts, and responses to inquiries" />
                                <UseCase title="Compliance" description="Meet legal obligations and respond to lawful requests" />
                            </div>
                        </PolicySection>

                        <PolicySection
                            icon={<Shield className="h-5 w-5 text-violet-400" />}
                            title="Data Protection Measures"
                        >
                            <p className="text-muted-foreground mb-4">We implement industry-standard security measures:</p>
                            <div className="space-y-3">
                                <SecurityMeasure
                                    title="Encryption in Transit"
                                    description="All data transmitted using TLS 1.3 with modern cipher suites"
                                />
                                <SecurityMeasure
                                    title="Encryption at Rest"
                                    description="Sensitive data encrypted with AES-256 on Supabase infrastructure"
                                />
                                <SecurityMeasure
                                    title="Access Controls"
                                    description="Role-based access, multi-factor authentication, audit logging"
                                />
                                <SecurityMeasure
                                    title="API Security"
                                    description="HMAC-SHA256 request signing, rate limiting, replay protection"
                                />
                                <SecurityMeasure
                                    title="Regular Audits"
                                    description="Security assessments and penetration testing"
                                />
                            </div>
                        </PolicySection>

                        <PolicySection
                            icon={<Globe className="h-5 w-5 text-violet-400" />}
                            title="Data Sharing & Third Parties"
                        >
                            <p className="text-muted-foreground mb-4">
                                We do not sell your personal information. We may share data with:
                            </p>
                            <div className="space-y-3">
                                <ThirdPartySharing
                                    name="Supabase"
                                    purpose="Database and authentication hosting"
                                    location="USA (SOC 2 Type II certified)"
                                />
                                <ThirdPartySharing
                                    name="Wayl"
                                    purpose="Payment processing"
                                    location="Iraq"
                                />
                                <ThirdPartySharing
                                    name="Vercel"
                                    purpose="Application hosting and edge network"
                                    location="USA (SOC 2 compliant)"
                                />
                            </div>
                            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <p className="text-sm text-muted-foreground">
                                    <AlertCircle className="h-4 w-4 inline mr-1 text-amber-400" />
                                    We may also share data with legal authorities when required by law or to protect our rights.
                                </p>
                            </div>
                        </PolicySection>

                        <PolicySection
                            icon={<Clock className="h-5 w-5 text-violet-400" />}
                            title="Data Retention"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-2 font-medium text-foreground">Data Type</th>
                                            <th className="text-left py-2 font-medium text-foreground">Retention Period</th>
                                            <th className="text-left py-2 font-medium text-foreground">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-muted-foreground">
                                        <tr className="border-b border-border/50">
                                            <td className="py-3">Account data</td>
                                            <td className="py-3">Duration of account + 30 days</td>
                                            <td className="py-3">Service provision</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-3">API request logs</td>
                                            <td className="py-3">90 days</td>
                                            <td className="py-3">Debugging, security</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-3">Billing records</td>
                                            <td className="py-3">7 years</td>
                                            <td className="py-3">Legal requirements</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-3">Audit logs</td>
                                            <td className="py-3">1 year</td>
                                            <td className="py-3">Security, compliance</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3">Analytics data</td>
                                            <td className="py-3">26 months</td>
                                            <td className="py-3">Service improvement</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </PolicySection>

                        <PolicySection
                            icon={<UserCheck className="h-5 w-5 text-violet-400" />}
                            title="Your Rights (GDPR & CCPA)"
                        >
                            <p className="text-muted-foreground mb-4">
                                Depending on your location, you have the following rights:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <RightCard
                                    title="Access"
                                    description="Request a copy of your personal data"
                                />
                                <RightCard
                                    title="Rectification"
                                    description="Correct inaccurate or incomplete data"
                                />
                                <RightCard
                                    title="Erasure"
                                    description="Request deletion of your data ('right to be forgotten')"
                                />
                                <RightCard
                                    title="Portability"
                                    description="Receive your data in a machine-readable format"
                                />
                                <RightCard
                                    title="Restriction"
                                    description="Limit how we process your data"
                                />
                                <RightCard
                                    title="Objection"
                                    description="Object to certain processing activities"
                                />
                            </div>
                            <p className="text-muted-foreground text-sm mt-4">
                                To exercise these rights, contact us at{" "}
                                <a href="mailto:support@obitox.dev" className="text-violet-400 hover:underline">
                                    support@obitox.dev
                                </a>
                                . We will respond within 30 days.
                            </p>
                        </PolicySection>

                        <PolicySection
                            icon={<Globe className="h-5 w-5 text-violet-400" />}
                            title="International Data Transfers"
                        >
                            <p className="text-muted-foreground leading-relaxed">
                                Your data may be transferred to and processed in countries other than your own,
                                including the United States. We ensure appropriate safeguards are in place,
                                including Standard Contractual Clauses (SCCs) where required. By using our services,
                                you consent to such transfers.
                            </p>
                        </PolicySection>

                        {/* Contact */}
                        <div className="p-6 rounded-xl border border-violet-500/20 bg-violet-500/5">
                            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Mail className="h-5 w-5 text-violet-400" />
                                Contact Us
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                For privacy-related inquiries or to exercise your rights:
                            </p>
                            <div className="space-y-2 text-sm">
                                <p className="text-muted-foreground">
                                    <strong className="text-foreground">Privacy Officer:</strong>{" "}
                                    <a href="mailto:support@obitox.dev" className="text-violet-400 hover:underline">
                                        support@obitox.dev
                                    </a>
                                </p>
                                <p className="text-muted-foreground">
                                    <strong className="text-foreground">Data Protection Officer:</strong>{" "}
                                    <a href="mailto:support@obitox.dev" className="text-violet-400 hover:underline">
                                        support@obitox.dev
                                    </a>
                                </p>
                                <p className="text-muted-foreground">
                                    <strong className="text-foreground">Response time:</strong> Within 48 hours (inquiries), 30 days (rights requests)
                                </p>
                            </div>
                        </div>

                        {/* Updates Notice */}
                        <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                            <p>
                                We may update this privacy policy from time to time. Significant changes will be
                                notified via email or through our website. Continued use of our services after
                                changes constitutes acceptance of the updated policy.
                            </p>
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

function UseCase({ title, description }: {
    title: string;
    description: string;
}) {
    return (
        <div className="p-3 rounded-lg bg-muted/50">
            <span className="font-medium text-foreground">{title}</span>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
    );
}

function SecurityMeasure({ title, description }: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
                <span className="font-medium text-foreground">{title}</span>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

function ThirdPartySharing({ name, purpose, location }: {
    name: string;
    purpose: string;
    location: string;
}) {
    return (
        <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{name}</span>
                <span className="text-xs text-muted-foreground">{location}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{purpose}</p>
        </div>
    );
}

function RightCard({ title, description }: {
    title: string;
    description: string;
}) {
    return (
        <div className="p-3 rounded-lg border border-border bg-muted/30">
            <span className="font-medium text-foreground">{title}</span>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
    );
}
