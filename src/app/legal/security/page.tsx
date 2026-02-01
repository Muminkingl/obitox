import { Metadata } from "next";
import Link from "next/link";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { Shield, Lock, Key, Server, AlertTriangle, CheckCircle, Mail, Bug } from "lucide-react";

export const metadata: Metadata = {
    title: "Security - ObitoX",
    description: "Learn about ObitoX security practices, infrastructure protection, and responsible disclosure.",
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
                                <p className="text-sm text-muted-foreground mt-1">Last updated: January 2026</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Security is fundamental to ObitoX. We implement multiple layers of protection
                            to keep your data and API infrastructure secure.
                        </p>
                    </div>

                    {/* Security Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        <SecurityHighlight
                            icon={<Lock className="h-5 w-5" />}
                            title="Encrypted"
                            description="TLS 1.3 in transit, AES-256 at rest"
                        />
                        <SecurityHighlight
                            icon={<Key className="h-5 w-5" />}
                            title="HMAC Signed"
                            description="SHA-256 request authentication"
                        />
                        <SecurityHighlight
                            icon={<Server className="h-5 w-5" />}
                            title="SOC 2 Ready"
                            description="Enterprise-grade infrastructure"
                        />
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                        <SecuritySection
                            icon={<Lock className="h-5 w-5 text-violet-400" />}
                            title="Data Encryption"
                        >
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>In Transit</strong> — All connections use TLS 1.3 with modern cipher suites</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>At Rest</strong> — Sensitive data encrypted with AES-256</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>API Keys</strong> — Stored as one-way hashes, never in plaintext</span>
                                </li>
                            </ul>
                        </SecuritySection>

                        <SecuritySection
                            icon={<Key className="h-5 w-5 text-violet-400" />}
                            title="API Security"
                        >
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>HMAC-SHA256 Signing</strong> — All requests authenticated with cryptographic signatures</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>Rate Limiting</strong> — Multi-layer protection against abuse</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>Request Validation</strong> — Strict input validation and sanitization</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>Replay Protection</strong> — Timestamp and nonce validation</span>
                                </li>
                            </ul>
                        </SecuritySection>

                        <SecuritySection
                            icon={<Server className="h-5 w-5 text-violet-400" />}
                            title="Infrastructure"
                        >
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>Edge Network</strong> — Deployed on Cloudflare's global edge network</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>DDoS Protection</strong> — Automatic mitigation at the edge</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>Isolated Environments</strong> — Strict separation between tenants</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>Regular Backups</strong> — Automated with point-in-time recovery</span>
                                </li>
                            </ul>
                        </SecuritySection>

                        <SecuritySection
                            icon={<AlertTriangle className="h-5 w-5 text-violet-400" />}
                            title="Abuse Prevention"
                        >
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>Behavioral Analysis</strong> — AI-powered anomaly detection</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>Progressive Throttling</strong> — Gentle slowdowns before hard blocks</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>Audit Logging</strong> — Complete trail of all API activity</span>
                                </li>
                            </ul>
                        </SecuritySection>

                        {/* Bug Bounty */}
                        <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5">
                            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Bug className="h-5 w-5 text-amber-400" />
                                Responsible Disclosure
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                We appreciate security researchers who help us keep ObitoX secure.
                                If you discover a vulnerability, please report it responsibly.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-amber-400" />
                                    <a href="mailto:security@obitox.com" className="text-violet-400 hover:underline">
                                        security@obitox.com
                                    </a>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Please include detailed reproduction steps. We aim to respond within 48 hours.
                                </p>
                            </div>
                        </div>

                        {/* Compliance */}
                        <SecuritySection
                            icon={<Shield className="h-5 w-5 text-violet-400" />}
                            title="Compliance"
                        >
                            <p className="mb-3">
                                ObitoX is designed with compliance in mind:
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>GDPR Ready</strong> — Data protection and privacy controls</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span><strong>SOC 2 Type II</strong> — In progress</span>
                                </li>
                            </ul>
                        </SecuritySection>
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
