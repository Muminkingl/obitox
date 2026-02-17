import { Metadata } from "next";
import Link from "next/link";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { Shield, Lock, Key, Server, AlertTriangle, CheckCircle, Mail, Bug, FileText, Clock, Users, Globe, Zap, Database, Eye } from "lucide-react";

export const metadata: Metadata = {
    title: "Security - ObitoX",
    description: "Learn about ObitoX security practices, infrastructure protection, and responsible disclosure program.",
};

export default function SecurityPage() {
    return (
        <main className="relative min-h-screen bg-background">
            <HeroHeader />

            <div className="pt-24 pb-16">
                <div className="mx-auto max-w-4xl px-6">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20">
                                <Shield className="h-6 w-6 text-violet-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-foreground">Security</h1>
                                <p className="text-sm text-muted-foreground mt-1">Last updated: February 2026</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Security is fundamental to ObitoX. We implement multiple layers of protection
                            to keep your data and API infrastructure secure. This page details our security practices.
                        </p>
                    </div>

                    {/* Security Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                        <SecurityHighlight
                            icon={<Lock className="h-5 w-5" />}
                            title="Encrypted"
                            description="TLS 1.3 + AES-256"
                        />
                        <SecurityHighlight
                            icon={<Key className="h-5 w-5" />}
                            title="HMAC Signed"
                            description="SHA-256 auth"
                        />
                        <SecurityHighlight
                            icon={<Server className="h-5 w-5" />}
                            title="SOC 2 Ready"
                            description="Enterprise grade"
                        />
                        <SecurityHighlight
                            icon={<Eye className="h-5 w-5" />}
                            title="Audited"
                            description="Regular testing"
                        />
                    </div>

                    {/* Security Overview */}
                    <div className="mb-8 p-6 rounded-xl border border-blue-500/20 bg-blue-500/5">
                        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-400" />
                            Security Overview
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            ObitoX follows the principle of defense in depth. Every layer of our infrastructure
                            is designed with security in mind, from the application code to the physical data centers.
                            We regularly audit our systems and work with security researchers to identify and fix vulnerabilities.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        <SecuritySection
                            icon={<Lock className="h-5 w-5 text-violet-400" />}
                            title="Data Encryption"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <EncryptionCard
                                    title="In Transit"
                                    description="All data transmitted between clients and our servers is encrypted using TLS 1.3 with modern cipher suites. We support HSTS and do not allow legacy protocols."
                                    details={["TLS 1.3 minimum", "HSTS enabled", "Certificate pinning on mobile"]}
                                />
                                <EncryptionCard
                                    title="At Rest"
                                    description="Sensitive data stored in our databases is encrypted using AES-256. Encryption keys are managed through Supabase's key management service."
                                    details={["AES-256 encryption", "Key rotation", "Encrypted backups"]}
                                />
                            </div>
                        </SecuritySection>

                        <SecuritySection
                            icon={<Key className="h-5 w-5 text-violet-400" />}
                            title="API Security"
                        >
                            <div className="space-y-4">
                                <SecurityFeature
                                    title="HMAC-SHA256 Request Signing"
                                    description="All API requests are authenticated using cryptographic signatures. This prevents tampering and ensures request integrity."
                                    status="implemented"
                                />
                                <SecurityFeature
                                    title="Rate Limiting"
                                    description="Multi-layer rate limiting protects against abuse. We use memory guard (0-2ms), Redis (5-20ms), and database quotas."
                                    status="implemented"
                                />
                                <SecurityFeature
                                    title="Request Validation"
                                    description="Strict input validation and sanitization prevents injection attacks. All user input is treated as untrusted."
                                    status="implemented"
                                />
                                <SecurityFeature
                                    title="Replay Protection"
                                    description="Timestamp and nonce validation prevents replay attacks. Requests older than 5 minutes are rejected."
                                    status="implemented"
                                />
                                <SecurityFeature
                                    title="API Key Hashing"
                                    description="API keys are stored as one-way bcrypt hashes. We never store keys in plaintext."
                                    status="implemented"
                                />
                            </div>
                        </SecuritySection>

                        <SecuritySection
                            icon={<Server className="h-5 w-5 text-violet-400" />}
                            title="Infrastructure Security"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfraCard
                                    icon={<Globe className="h-5 w-5" />}
                                    title="Edge Network"
                                    description="Deployed on Vercel's global edge network with automatic DDoS protection and WAF rules."
                                />
                                <InfraCard
                                    icon={<Zap className="h-5 w-5" />}
                                    title="DDoS Protection"
                                    description="Automatic mitigation at the edge. Traffic anomalies are detected and blocked before reaching our origin."
                                />
                                <InfraCard
                                    icon={<Database className="h-5 w-5" />}
                                    title="Database Security"
                                    description="Row-level security (RLS) policies ensure data isolation. Each user can only access their own data."
                                />
                                <InfraCard
                                    icon={<Users className="h-5 w-5" />}
                                    title="Tenant Isolation"
                                    description="Strict separation between tenant data. No cross-tenant access is possible at the database level."
                                />
                            </div>
                        </SecuritySection>

                        <SecuritySection
                            icon={<AlertTriangle className="h-5 w-5 text-violet-400" />}
                            title="Abuse Prevention"
                        >
                            <p className="text-muted-foreground text-sm mb-4">
                                We employ multiple techniques to detect and prevent abuse:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <AbusePreventionCard
                                    title="Behavioral Analysis"
                                    description="AI-powered anomaly detection identifies suspicious patterns"
                                />
                                <AbusePreventionCard
                                    title="Progressive Throttling"
                                    description="Gentle slowdowns before hard blocks"
                                />
                                <AbusePreventionCard
                                    title="Audit Logging"
                                    description="Complete trail of all API activity"
                                />
                            </div>
                            <div className="mt-4 p-4 rounded-lg bg-muted/50">
                                <h4 className="font-medium text-foreground text-sm mb-2">Rate Limit Tiers</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="text-left py-2 text-muted-foreground">Tier</th>
                                                <th className="text-left py-2 text-muted-foreground">Requests/min</th>
                                                <th className="text-left py-2 text-muted-foreground">Requests/month</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-muted-foreground">
                                            <tr className="border-b border-border/50">
                                                <td className="py-2">Free</td>
                                                <td className="py-2">10</td>
                                                <td className="py-2">10,000</td>
                                            </tr>
                                            <tr className="border-b border-border/50">
                                                <td className="py-2">Pro</td>
                                                <td className="py-2">100</td>
                                                <td className="py-2">100,000</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2">Enterprise</td>
                                                <td className="py-2">1,000</td>
                                                <td className="py-2">1,000,000+</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </SecuritySection>

                        <SecuritySection
                            icon={<Clock className="h-5 w-5 text-violet-400" />}
                            title="Monitoring & Incident Response"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-medium text-foreground">24/7 Monitoring</span>
                                        <p className="text-xs text-muted-foreground">Real-time monitoring of all systems with automated alerting</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-medium text-foreground">Incident Response Team</span>
                                        <p className="text-xs text-muted-foreground">Dedicated team with defined escalation procedures</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-medium text-foreground">Post-Mortem Process</span>
                                        <p className="text-xs text-muted-foreground">Root cause analysis and preventive measures for all incidents</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="font-medium text-foreground">Regular Backups</span>
                                        <p className="text-xs text-muted-foreground">Automated daily backups with point-in-time recovery</p>
                                    </div>
                                </div>
                            </div>
                        </SecuritySection>

                        {/* Bug Bounty */}
                        <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5">
                            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Bug className="h-5 w-5 text-amber-400" />
                                Responsible Disclosure Program
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                We appreciate security researchers who help us keep ObitoX secure.
                                If you discover a security vulnerability, we ask that you report it responsibly.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <h4 className="font-medium text-foreground text-sm mb-2">What We Promise</h4>
                                    <ul className="space-y-1 text-xs text-muted-foreground">
                                        <li>Response within 48 hours</li>
                                        <li>Public recognition (if desired)</li>
                                        <li>No legal action for good-faith research</li>
                                        <li>Bounty rewards for valid findings</li>
                                    </ul>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <h4 className="font-medium text-foreground text-sm mb-2">What We Ask</h4>
                                    <ul className="space-y-1 text-xs text-muted-foreground">
                                        <li>Report via email (not public disclosure)</li>
                                        <li>Allow reasonable time to fix</li>
                                        <li>Do not access user data</li>
                                        <li>Do not test on production accounts</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-amber-400" />
                                <a href="mailto:security@obitox.dev" className="text-violet-400 hover:underline">
                                    security@obitox.dev
                                </a>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Please include: vulnerability description, reproduction steps, and potential impact.
                            </p>
                        </div>

                        {/* Compliance */}
                        <SecuritySection
                            icon={<FileText className="h-5 w-5 text-violet-400" />}
                            title="Compliance & Certifications"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ComplianceCard
                                    title="GDPR"
                                    status="Compliant"
                                    description="Full compliance with EU data protection regulations"
                                />
                                <ComplianceCard
                                    title="SOC 2 Type II"
                                    status="In Progress"
                                    description="Expected completion: Q2 2026"
                                />
                                <ComplianceCard
                                    title="CCPA"
                                    status="Compliant"
                                    description="California Consumer Privacy Act compliance"
                                />
                                <ComplianceCard
                                    title="ISO 27001"
                                    status="Planned"
                                    description="Information security management certification"
                                />
                            </div>
                        </SecuritySection>

                        {/* Security Best Practices */}
                        <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-emerald-400" />
                                Security Best Practices for Users
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                Help us keep your account secure by following these recommendations:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <BestPractice
                                    title="Use Strong Passwords"
                                    description="Minimum 12 characters with mixed case, numbers, and symbols"
                                />
                                <BestPractice
                                    title="Enable 2FA"
                                    description="Add an extra layer of security to your account"
                                />
                                <BestPractice
                                    title="Rotate API Keys"
                                    description="Regularly rotate your API keys (recommended: every 90 days)"
                                />
                                <BestPractice
                                    title="Monitor Usage"
                                    description="Check your usage dashboard regularly for anomalies"
                                />
                                <BestPractice
                                    title="Secure Key Storage"
                                    description="Never commit API keys to version control"
                                />
                                <BestPractice
                                    title="Report Issues"
                                    description="Contact us immediately if you suspect unauthorized access"
                                />
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="p-6 rounded-xl border border-border bg-card">
                            <h2 className="text-xl font-semibold text-foreground mb-4">Security Contact</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-violet-400" />
                                    <a href="mailto:security@obitox.dev" className="text-violet-400 hover:underline">
                                        security@obitox.dev
                                    </a>
                                    <span className="text-muted-foreground">- Security vulnerabilities</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-violet-400" />
                                    <a href="mailto:support@obitox.dev" className="text-violet-400 hover:underline">
                                        support@obitox.dev
                                    </a>
                                    <span className="text-muted-foreground">- General security questions</span>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Link
                                    href="/legal/privacy"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm"
                                >
                                    Privacy Policy
                                </Link>
                                <Link
                                    href="/legal/licence"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm"
                                >
                                    License
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FooterSection />
        </main>
    );
}

function SecurityHighlight({ icon, title, description }: {
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

function SecuritySection({ icon, title, children }: {
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

function EncryptionCard({ title, description, details }: {
    title: string;
    description: string;
    details: string[];
}) {
    return (
        <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium text-foreground mb-2">{title}</h4>
            <p className="text-xs text-muted-foreground mb-3">{description}</p>
            <div className="space-y-1">
                {details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                        <span className="text-muted-foreground">{detail}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SecurityFeature({ title, description, status }: {
    title: string;
    description: string;
    status: "implemented" | "planned";
}) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            {status === "implemented" ? (
                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            ) : (
                <Clock className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
                <span className="font-medium text-foreground">{title}</span>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
        </div>
    );
}

function InfraCard({ icon, title, description }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-violet-400 mb-2">{icon}</div>
            <h4 className="font-medium text-foreground text-sm">{title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
    );
}

function AbusePreventionCard({ title, description }: {
    title: string;
    description: string;
}) {
    return (
        <div className="p-3 rounded-lg bg-muted/50">
            <span className="font-medium text-foreground text-sm">{title}</span>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
    );
}

function ComplianceCard({ title, status, description }: {
    title: string;
    status: "Compliant" | "In Progress" | "Planned";
    description: string;
}) {
    const statusColors = {
        "Compliant": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        "In Progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
        "Planned": "bg-blue-500/10 text-blue-400 border-blue-500/20"
    };

    return (
        <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[status]}`}>
                    {status}
                </span>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    );
}

function BestPractice({ title, description }: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
                <span className="font-medium text-foreground text-sm">{title}</span>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
