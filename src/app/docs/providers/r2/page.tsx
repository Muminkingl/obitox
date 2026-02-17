'use client';

import { DocsPage, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { CodeBlock } from '@/components/docs/code-block';
import {
    Zap, Globe, Shield, ArrowRight,
    Sparkles, TrendingUp, Server, Download, Trash2, Upload,
    Settings, Cloud, Lock, Key, LayoutGrid, Timer, FileCheck, Activity,
    Scan, Webhook
} from 'lucide-react';
import { useState } from 'react';
import { frameworks, r2CodeExamples } from './code-examples';

const tocItems = [
    { title: 'How it works', url: '#how-it-works', depth: 2 },
    { title: 'Operations', url: '#operations', depth: 2 },
    { title: 'Upload Features', url: '#upload-features', depth: 2 },
    { title: 'Batch Operations', url: '#batch-upload', depth: 2 },
    { title: 'Download & CDN', url: '#download-url', depth: 2 },
    { title: 'Access Control', url: '#access-tokens', depth: 2 },
    { title: 'Management', url: '#list-files', depth: 2 },
    { title: 'Auto CORS', url: '#cors-op', depth: 2 },
    { title: 'Verify CORS', url: '#verify-cors', depth: 2 },
    { title: 'Webhooks', url: '#webhooks', depth: 2 },
];

export default function R2ProviderPage() {
    const [activeFramework, setActiveFramework] = useState('node');

    const code = r2CodeExamples[activeFramework];
    const currentLang = frameworks.find(f => f.id === activeFramework)?.lang || 'typescript';

    return (
        <DocsPage toc={tocItems}>
            <DocsBody>
                <div className="max-w-4xl mx-auto space-y-12 pb-20">
                    {/* Hero Header */}
                    <div id="hero-header" className="space-y-6 pt-8">
                        <div className="relative">
                            {/* Gradient Background */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 rounded-2xl blur-2xl" />

                            <div className="relative space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-emerald-400">Storage Provider</span>
                                    <span className="px-2.5 py-0.5 text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full flex items-center gap-1">
                                        <Zap className="h-3 w-3" />
                                        HIGH PERFORMANCE
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-orange-500/20 rounded-xl blur-lg" />
                                        <Cloud className="relative h-12 w-12 text-orange-400" />
                                    </div>
                                    <div>
                                        <h1 className="text-5xl font-bold text-fd-foreground tracking-tight">
                                            Cloudflare R2
                                        </h1>
                                        <p className="text-sm text-orange-400 mt-1 font-medium">
                                            Zero egress fees. S3-compatible.
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xl text-fd-muted-foreground leading-relaxed max-w-3xl">
                                    S3-compatible object storage that eliminates egress bandwidth fees.
                                    Perfect for <strong className="text-fd-foreground">high-traffic applications</strong> and <strong className="text-fd-foreground">content delivery</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Visual Flow Diagram */}
                    <div className="space-y-4">
                        <h2 id="how-it-works" className="text-2xl font-bold text-fd-foreground flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-orange-400" />
                            How it works
                        </h2>
                        <p className="text-fd-muted-foreground">
                            Requests are routed through ObitoX directly to your R2 bucket, leveraging Cloudflare's global network.
                        </p>

                        {/* Enhanced Flow Diagram */}
                        <div className="relative rounded-xl border border-fd-border bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 overflow-hidden max-w-2xl mx-auto">
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />

                            {/* Flow */}
                            <div className="relative space-y-6">
                                {/* Top Row */}
                                <div className="flex items-center justify-between gap-2">
                                    {/* Your App */}
                                    <div className="flex-1">
                                        <FlowNode
                                            title="Your App"
                                            subtitle="Client"
                                            icon={<Server className="h-6 w-6" />}
                                            color="blue"
                                        />
                                        <div className="text-xs text-slate-500 text-center mt-2">
                                            Uploads File
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex flex-col items-center gap-1 px-4">
                                        <ArrowRight className="h-6 w-6 text-blue-400" />
                                        <div className="text-[10px] text-blue-400 font-medium whitespace-nowrap">
                                            Authentication
                                        </div>
                                    </div>

                                    {/* ObitoX */}
                                    <div className="flex-1">
                                        <FlowNode
                                            title="ObitoX"
                                            subtitle="Gateway"
                                            icon={<Zap className="h-6 w-6" />}
                                            color="emerald"
                                            pulse
                                        />
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex flex-col items-center gap-1 px-4">
                                        <ArrowRight className="h-6 w-6 text-orange-400" />
                                        <div className="text-[10px] text-orange-400 font-medium whitespace-nowrap">
                                            Stores Object
                                        </div>
                                    </div>

                                    {/* R2 */}
                                    <div className="flex-1">
                                        <FlowNode
                                            title="R2"
                                            subtitle="Global Store"
                                            icon={<Cloud className="h-6 w-6" />}
                                            color="orange"
                                        />
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-700/50">
                                    <FeaturePill icon={<Globe className="h-3 w-3" />} text="Global CDN" />
                                    <FeaturePill icon={<Settings className="h-3 w-3" />} text="S3 Compatible" />
                                    <FeaturePill icon={<Lock className="h-3 w-3" />} text="Zero Egress" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Framework Tabs */}
                    <FrameworkTabs activeFramework={activeFramework} onSelect={setActiveFramework} />

                    {/* Setup */}
                    <OperationSection id="setup" title="Setup" emoji="⚙️" description="Initialize the ObitoX client with your R2 credentials">
                        <CodeBlock language={currentLang} code={code.setup} />
                    </OperationSection>

                    {/* Operations Grid */}
                    <div className="space-y-6">
                        <h2 id="operations" className="text-2xl font-bold text-fd-foreground">Operations</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <OperationCard
                                icon={<Upload />}
                                title="Upload Files"
                                description="Fast global uploads"
                                href="#upload-features"
                            />
                            <OperationCard
                                icon={<Scan />}
                                title="Magic Bytes"
                                description="Validate file content"
                                href="#with-file-validation"
                            />
                            <OperationCard
                                icon={<LayoutGrid />}
                                title="Batch Upload"
                                description="Upload multiple files"
                                href="#batch-upload"
                            />
                            <OperationCard
                                icon={<Key />}
                                title="Access Tokens"
                                description="Scoped JWT access"
                                href="#access-tokens"
                            />
                            <OperationCard
                                icon={<Download />}
                                title="Download"
                                description="Signed download URLs"
                                href="#download-url"
                            />
                            <OperationCard
                                icon={<Timer />}
                                title="Smart Expiry"
                                description="Network-aware URLs"
                                href="#with-smart-expiry"
                            />
                            <OperationCard
                                icon={<Webhook />}
                                title="Webhooks"
                                description="Upload events"
                                href="#webhooks"
                            />
                            <OperationCard
                                icon={<Trash2 />}
                                title="Delete Files"
                                description="Single & batch delete"
                                href="#list-files"
                            />
                        </div>
                    </div>

                    {/* Upload Features Section */}
                    <div className="space-y-6">
                        <div id="upload-features" className="flex items-center gap-3">
                            <Upload className="h-6 w-6 text-orange-400" />
                            <h2 className="text-2xl font-bold text-fd-foreground">Upload Features</h2>
                        </div>

                        {/* Basic Upload */}
                        <OperationSection id="basic-upload" title="Basic Upload" emoji="📤">
                            <CodeBlock language={currentLang} code={code.basicUpload} />
                        </OperationSection>

                        {/* Progress Tracking */}
                        <OperationSection
                            id="with-progress-tracking"
                            title="Progress Tracking"
                            emoji="📊"
                            description="Real-time upload progress"
                        >
                            <CodeBlock language={currentLang} code={code.progressTracking} />
                        </OperationSection>

                        {/* Smart Expiry */}
                        <OperationSection
                            id="with-smart-expiry"
                            title="Smart Expiry"
                            emoji="⚡"
                            description="Network-aware signed URL expiration"
                        >
                            <p className="text-sm text-fd-muted-foreground mb-4">
                                Automatically adjusts signed URL expiry based on connection speed to ensure uploads complete even on slow networks.
                            </p>
                            <CodeBlock language={currentLang} code={code.smartExpiry} />
                        </OperationSection>

                        {/* File Validation */}
                        <OperationSection
                            id="with-file-validation"
                            title="File Validation"
                            emoji="✅"
                            description="Magic-byte based validation"
                        >
                            <CodeBlock language={currentLang} code={code.magicBytes} />
                            <p className="text-sm text-fd-muted-foreground mt-2">
                                Validation presets: <code className="text-orange-400">'images'</code> | <code className="text-orange-400">'documents'</code>
                            </p>
                        </OperationSection>
                    </div>

                    {/* Batch Upload */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <LayoutGrid className="h-6 w-6 text-purple-400" />
                            <h2 id="batch-upload" className="text-2xl font-bold text-fd-foreground">Batch Upload</h2>
                        </div>
                        <OperationSection id="batch-upload-op" title="Batch Upload" emoji="📦">
                            <p className="text-sm text-fd-muted-foreground mb-4">Generate presigned URLs for multiple files in one API call.</p>
                            <CodeBlock language={currentLang} code={code.batchUpload} />
                        </OperationSection>
                    </div>


                    {/* Access Tokens */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Key className="h-6 w-6 text-yellow-400" />
                            <h2 id="access-tokens" className="text-2xl font-bold text-fd-foreground">Access Tokens (JWT)</h2>
                        </div>
                        <OperationSection id="generate-token" title="Generate Scoped Token" emoji="🔑">
                            <CodeBlock language={currentLang} code={code.accessTokens} />
                        </OperationSection>
                    </div>

                    {/* Download & URL */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Download className="h-6 w-6 text-blue-400" />
                            <h2 id="download-url" className="text-2xl font-bold text-fd-foreground">Download URL</h2>
                        </div>

                        <OperationSection id="generate-download-url" title="Signed Download URLs" emoji="🔗">
                            <p className="text-sm text-fd-muted-foreground mb-4">Generate signed URLs with custom expiration times.</p>
                            <CodeBlock language={currentLang} code={code.download} />
                        </OperationSection>
                    </div>

                    {/* Management */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Settings className="h-6 w-6 text-slate-400" />
                            <h2 id="list-files" className="text-2xl font-bold text-fd-foreground">Management</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <OperationSection id="list-op" title="List Files" emoji="📋">
                                <CodeBlock language={currentLang} code={code.listFiles} />
                            </OperationSection>

                            <OperationSection id="delete-op" title="Delete Files" emoji="🗑️">
                                <CodeBlock language={currentLang} code={code.deleteFiles} />
                            </OperationSection>

                            <OperationSection id="cors-op" title="Auto CORS Configuration" emoji="🌐">
                                <CodeBlock language={currentLang} code={code.cors} />
                            </OperationSection>
                        </div>
                    </div>

                    {/* Verify CORS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Shield className="h-6 w-6 text-green-400" />
                            <h2 id="verify-cors" className="text-2xl font-bold text-fd-foreground">Verify CORS</h2>
                        </div>
                        <OperationSection id="verify-cors-op" title="Check CORS Configuration" emoji="✅" description="Verify CORS is properly configured on your R2 bucket">
                            <CodeBlock language={currentLang} code={code.verifyCors} />
                        </OperationSection>
                    </div>

                    {/* Webhooks */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Activity className="h-6 w-6 text-emerald-400" />
                            <h2 id="webhooks" className="text-2xl font-bold text-fd-foreground">Webhooks</h2>
                        </div>
                        <p className="text-fd-muted-foreground">Get notified when uploads complete.</p>

                        <OperationSection
                            id="auto-trigger"
                            title="Auto Trigger"
                            emoji="⚡"
                            description="Server confirms automatically"
                        >
                            <CodeBlock language={currentLang} code={code.webhookAuto} />
                        </OperationSection>

                        <OperationSection
                            id="manual-trigger"
                            title="Manual Trigger"
                            emoji="👆"
                            description="You confirm when ready"
                        >
                            <CodeBlock language={currentLang} code={code.webhookManual} />
                        </OperationSection>
                    </div>

                    {/* That's it! */}
                    <div className="rounded-xl border border-fd-border bg-gradient-to-br from-orange-500/5 via-transparent to-emerald-500/5 p-12 text-center">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                            That's it!
                        </h3>
                        <p className="text-lg text-fd-foreground font-medium mb-4">
                            Zero egress, maximum performance.
                        </p>
                        <p className="text-fd-muted-foreground max-w-lg mx-auto leading-relaxed">
                            Upload, serve, and manage files on Cloudflare's global network—automatically.
                            <br />
                            ObitoX handles the complexity for you.
                        </p>
                    </div>

                </div>
            </DocsBody>
        </DocsPage>
    );
}

// ===== COMPONENTS =====

function FrameworkTabs({ activeFramework, onSelect }: { activeFramework: string; onSelect: (id: string) => void }) {
    return (
        <div className="border-b border-fd-border mb-2">
            <div className="flex gap-1 overflow-x-auto pb-px">
                {frameworks.map((framework) => (
                    <button
                        key={framework.id}
                        onClick={() => onSelect(framework.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeFramework === framework.id
                            ? "text-orange-400 border-b-2 border-orange-400 bg-orange-400/5"
                            : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted/50"
                            }`}
                    >
                        {framework.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

function FlowNode({ title, subtitle, icon, color, pulse }: {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    pulse?: boolean;
}) {
    const colorClasses: Record<string, { bg: string; border: string; text: string; ring: string }> = {
        emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
        blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', ring: 'ring-blue-500/20' },
        orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', ring: 'ring-orange-500/20' },
    };

    const colors = colorClasses[color] || colorClasses.emerald;

    return (
        <div className={`relative flex flex-col items-center p-4 rounded-xl border ${colors.border} ${colors.bg} ${pulse ? 'animate-pulse' : ''}`}>
            <div className={`${colors.text}`}>{icon}</div>
            <div className="text-center mt-2">
                <div className="text-sm font-semibold text-fd-foreground">{title}</div>
                <div className="text-xs text-slate-500">{subtitle}</div>
            </div>
        </div>
    );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50">
            <span className="text-orange-400 [&>svg]:h-3 [&>svg]:w-3">{icon}</span>
            <span className="text-xs font-medium text-slate-300">{text}</span>
        </div>
    );
}

function OperationCard({ icon, title, description, href }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
}) {
    return (
        <a
            href={href}
            className="group p-4 rounded-lg border border-fd-border bg-fd-card hover:border-orange-500/30 hover:bg-orange-500/5 transition-colors"
        >
            <div className="flex items-start gap-3">
                <div className="text-fd-muted-foreground group-hover:text-orange-400 transition-colors [&>svg]:h-5 [&>svg]:w-5">
                    {icon}
                </div>
                <div>
                    <h3 className="font-semibold text-fd-foreground group-hover:text-orange-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-fd-muted-foreground mt-1">
                        {description}
                    </p>
                </div>
            </div>
        </a>
    );
}

function OperationSection({ id, title, emoji, description, children }: {
    id?: string;
    title: string;
    emoji: string;
    description?: string;
    children: React.ReactNode
}) {
    return (
        <div id={id} className="p-6 rounded-xl border border-fd-border bg-fd-card/50 space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-fd-foreground flex items-center gap-2">
                    <span>{emoji}</span>
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-fd-muted-foreground mt-1">{description}</p>
                )}
            </div>
            {children}
        </div>
    );
}
