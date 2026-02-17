'use client';

import { DocsPage, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { CodeBlock } from '@/components/docs/code-block';
import {
    Zap, Globe, Shield, ArrowRight,
    Sparkles, Server, Download, Trash2, Upload,
    Settings, Cloud, Lock, Key, LayoutGrid, Timer, FileCheck, Activity, Database,
    Scan, Webhook, FileText
} from 'lucide-react';
import { useState } from 'react';
import { FrameworkTabs } from '@/components/docs/framework-tabs';
import { frameworks, s3CodeExamples } from './code-examples';



const tocItems = [
    { title: 'How it works', url: '#how-it-works', depth: 2 },
    { title: 'Operations', url: '#operations', depth: 2 },
    { title: 'Setup Options', url: '#setup', depth: 2 },
    { title: 'Upload Features', url: '#upload-features', depth: 2 },
    { title: 'Smart Expiry', url: '#smart-expiry', depth: 2 },
    { title: 'Magic Bytes Validation', url: '#magic-bytes-validation', depth: 2 },
    { title: 'Multipart Upload', url: '#multipart-upload', depth: 2 },
    { title: 'Batch Operations', url: '#batch-upload', depth: 2 },
    { title: 'Download URL', url: '#download-url', depth: 2 },
    { title: 'Management', url: '#list-files', depth: 2 },
    { title: 'Auto CORS', url: '#auto-cors', depth: 2 },
    { title: 'File Metadata', url: '#file-metadata', depth: 2 },
    { title: 'Webhooks', url: '#webhooks', depth: 2 },
];

export default function S3ProviderPage() {
    const [activeFramework, setActiveFramework] = useState('node');

    const code = s3CodeExamples[activeFramework];
    const currentLang = frameworks.find(f => f.id === activeFramework)?.lang || 'typescript';

    return (
        <DocsPage toc={tocItems}>
            <DocsBody>
                <div className="max-w-4xl mx-auto space-y-12 pb-20">
                    {/* Hero Header */}
                    <div id="hero-header" className="space-y-6 pt-8">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 rounded-2xl blur-2xl" />
                            <div className="relative space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-blue-400">Storage Provider</span>
                                    <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full flex items-center gap-1">
                                        <Database className="h-3 w-3" />
                                        ENTERPRISE STANDARD
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-blue-500/20 rounded-xl blur-lg" />
                                        <Cloud className="relative h-12 w-12 text-blue-400" />
                                    </div>
                                    <div>
                                        <h1 className="text-5xl font-bold text-fd-foreground tracking-tight">S3</h1>
                                        <p className="text-sm text-blue-400 mt-1 font-medium">Industry standard object storage.</p>
                                    </div>
                                </div>
                                <p className="text-xl text-fd-muted-foreground leading-relaxed max-w-3xl">
                                    Works with <strong className="text-fd-foreground">AWS S3</strong> and any <strong className="text-fd-foreground">S3-compatible storage</strong> (MinIO, DigitalOcean Spaces, Wasabi, etc).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Visual Flow Diagram */}
                    <div className="space-y-4">
                        <h2 id="how-it-works" className="text-2xl font-bold text-fd-foreground flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-blue-400" />
                            How it works
                        </h2>
                        <p className="text-fd-muted-foreground">
                            Unified API for all S3 providers. Switch providers just by changing credentials.
                        </p>
                        <div className="relative rounded-xl border border-fd-border bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 overflow-hidden max-w-2xl mx-auto">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                            <div className="relative space-y-6">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1">
                                        <FlowNode title="Your App" subtitle="Client" icon={<Server className="h-6 w-6" />} color="emerald" />
                                        <div className="text-xs text-slate-500 text-center mt-2">Standard API</div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 px-4">
                                        <ArrowRight className="h-6 w-6 text-emerald-400" />
                                        <div className="text-[10px] text-emerald-400 font-medium whitespace-nowrap">One Format</div>
                                    </div>
                                    <div className="flex-1">
                                        <FlowNode title="ObitoX" subtitle="Universal SDK" icon={<Zap className="h-6 w-6" />} color="blue" pulse />
                                    </div>
                                    <div className="flex flex-col items-center gap-1 px-4">
                                        <ArrowRight className="h-6 w-6 text-blue-400" />
                                        <div className="text-[10px] text-blue-400 font-medium whitespace-nowrap">Routes To</div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 flex items-center gap-2">
                                            <Cloud className="h-3 w-3 text-white" />
                                            <span className="text-[10px] text-white">AWS S3</span>
                                        </div>
                                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 flex items-center gap-2 opacity-60">
                                            <Database className="h-3 w-3 text-white" />
                                            <span className="text-[10px] text-white">Any S3 Compatible</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-700/50">
                                    <FeaturePill icon={<Settings className="h-3 w-3" />} text="Flexible Config" />
                                    <FeaturePill icon={<Shield className="h-3 w-3" />} text="Secure Defaults" />
                                    <FeaturePill icon={<Globe className="h-3 w-3" />} text="Multi-Cloud" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Framework Tabs */}
                    <FrameworkTabs activeFramework={activeFramework} onSelect={setActiveFramework} frameworks={frameworks} color="blue" />

                    {/* Setup */}
                    <OperationSection id="setup-main" title="Setup" emoji="⚙️" description="Initialize the ObitoX client with your S3 credentials">
                        <CodeBlock language={currentLang} code={code.setup} />
                    </OperationSection>

                    {/* Operations Grid */}
                    <div className="space-y-6">
                        <h2 id="operations" className="text-2xl font-bold text-fd-foreground">Operations</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <OperationCard icon={<Upload />} title="Upload Files" description="Generic S3 upload" href="#upload-features" />
                            <OperationCard icon={<LayoutGrid />} title="Multipart" description="Large file support" href="#multipart-upload" />
                            <OperationCard icon={<Scan />} title="Magic Bytes" description="Validate file content" href="#magic-bytes-validation" />
                            <OperationCard icon={<Settings />} title="S3 Compatible" description="MinIO, DO Spaces" href="#custom-endpoint" />
                            <OperationCard icon={<Download />} title="Download" description="Signed download URLs" href="#download-url" />
                            <OperationCard icon={<LayoutGrid />} title="Batch Upload" description="Multiple files" href="#batch-upload" />
                            <OperationCard icon={<Webhook />} title="Webhooks" description="Upload events" href="#webhooks" />
                            <OperationCard icon={<Trash2 />} title="Delete Files" description="Single & batch delete" href="#list-files" />
                        </div>
                    </div>

                    {/* Setup Options Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Settings className="h-6 w-6 text-slate-400" />
                            <h2 id="setup" className="text-2xl font-bold text-fd-foreground">Setup Options</h2>
                        </div>
                        <OperationSection id="custom-endpoint" title="Custom Endpoint (S3 Compatible)" emoji="🔌">
                            <p className="text-sm text-fd-muted-foreground mb-4">Works with MinIO, DigitalOcean Spaces, or any generic S3 API.</p>
                            <CodeBlock language={currentLang} code={code.customEndpoint} />
                        </OperationSection>
                        <OperationSection id="direct-api" title="Direct API" emoji="⚡">
                            <p className="text-sm text-fd-muted-foreground mb-4">Alternative setup: pass credentials per-call (Direct API)</p>
                            <CodeBlock language={currentLang} code={code.directApi} />
                        </OperationSection>
                    </div>

                    {/* Upload Features Section */}
                    <div className="space-y-6">
                        <div id="upload-features" className="flex items-center gap-3">
                            <Upload className="h-6 w-6 text-blue-400" />
                            <h2 className="text-2xl font-bold text-fd-foreground">Upload Features</h2>
                        </div>
                        <OperationSection id="basic-upload" title="Basic Upload" emoji="📤">
                            <CodeBlock language={currentLang} code={code.basicUpload} />
                            <p className="text-sm text-fd-muted-foreground mt-4">
                                <strong className="text-blue-400">Note:</strong> Smart Expiry/Network-Aware uploads are enabled by default for browser uploads. See <a href="#smart-expiry" className="text-fd-foreground hover:underline">Smart Expiry</a> below.
                            </p>
                        </OperationSection>
                        <OperationSection id="progress-tracking" title="Progress Tracking" emoji="📊" description="Monitor upload progress">
                            <CodeBlock language={currentLang} code={code.progressTracking} />
                        </OperationSection>
                        <OperationSection id="signed-expiry" title="Signed URL Expiry" emoji="⏳" description="Set custom expiry for returned URLs">
                            <CodeBlock language={currentLang} code={code.signedExpiry} />
                        </OperationSection>
                        <OperationSection id="smart-expiry" title="Smart Expiry (Network-Aware)" emoji="📡" description="SDK automatically detects network conditions in the browser to set optimal URL expiry.">
                            <div className="mb-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                                <div className="flex items-start gap-2">
                                    <Activity className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-fd-muted-foreground">
                                        <strong className="text-blue-400">Automatic:</strong> In the browser, the SDK automatically uses <code>navigator.connection</code> to optimize timeouts.
                                    </div>
                                </div>
                            </div>
                            <CodeBlock language={currentLang} code={code.smartExpiry} />
                        </OperationSection>
                        <OperationSection id="magic-bytes-validation" title="Magic Bytes Validation" emoji="🕵️" description="Validate file content matches extension">
                            <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                                <div className="flex items-start gap-2">
                                    <Scan className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-fd-muted-foreground">
                                        <strong className="text-emerald-400">Client-Side Feature:</strong> This is an ObitoX SDK feature that validates files <em>before</em> upload using magic byte inspection.
                                    </div>
                                </div>
                            </div>
                            <CodeBlock language={currentLang} code={code.magicBytes} />
                            <p className="text-sm text-fd-muted-foreground mt-2">
                                Validation presets: <code className="text-blue-400">'images'</code> | <code className="text-blue-400">'documents'</code>
                            </p>
                        </OperationSection>
                    </div>

                    {/* Multipart Upload */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <LayoutGrid className="h-6 w-6 text-purple-400" />
                            <h2 id="multipart-upload" className="text-2xl font-bold text-fd-foreground">Multipart Upload</h2>
                        </div>
                        <OperationSection id="multipart-op" title="Automatic Multipart" emoji="📦">
                            <p className="text-sm text-fd-muted-foreground mb-4">Large files (&gt;100MB by default) are automatically split and uploaded in parts.</p>
                            <CodeBlock language={currentLang} code={code.multipart} />
                        </OperationSection>
                    </div>

                    {/* Batch Upload */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <LayoutGrid className="h-6 w-6 text-purple-400" />
                            <h2 id="batch-upload" className="text-2xl font-bold text-fd-foreground">Batch Upload</h2>
                        </div>
                        <OperationSection id="batch-upload-op" title="Batch Upload" emoji="📚">
                            <p className="text-sm text-fd-muted-foreground mb-4">Generate presigned URLs for multiple files in one API call.</p>
                            <CodeBlock language={currentLang} code={code.batchUpload} />
                        </OperationSection>
                    </div>

                    {/* Download & URL */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Download className="h-6 w-6 text-blue-400" />
                            <h2 id="download-url" className="text-2xl font-bold text-fd-foreground">Download URL</h2>
                        </div>
                        <OperationSection id="generate-download-url" title="Signed Download URLs" emoji="🔗">
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
                        </div>
                    </div>

                    {/* Auto CORS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Globe className="h-6 w-6 text-blue-400" />
                            <h2 id="auto-cors" className="text-2xl font-bold text-fd-foreground">Auto CORS Configuration</h2>
                        </div>
                        <OperationSection id="cors-op" title="Configure CORS" emoji="🌐" description="Set CORS rules on your S3 bucket">
                            <CodeBlock language={currentLang} code={code.cors} />
                        </OperationSection>
                    </div>

                    {/* File Metadata */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <FileText className="h-6 w-6 text-purple-400" />
                            <h2 id="file-metadata" className="text-2xl font-bold text-fd-foreground">File Metadata</h2>
                        </div>
                        <OperationSection id="metadata-op" title="Get File Metadata" emoji="📄" description="Get file metadata without downloading">
                            <CodeBlock language={currentLang} code={code.metadata} />
                        </OperationSection>
                    </div>

                    {/* Webhooks */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Activity className="h-6 w-6 text-emerald-400" />
                            <h2 id="webhooks" className="text-2xl font-bold text-fd-foreground">Webhooks</h2>
                        </div>
                        <p className="text-fd-muted-foreground">Notification system for upload completion.</p>
                        <OperationSection id="auto-trigger" title="Auto Trigger" emoji="⚡" description="Server confirms automatically">
                            <CodeBlock language={currentLang} code={code.webhookAuto} />
                        </OperationSection>
                        <OperationSection id="manual-trigger" title="Manual Trigger" emoji="👆" description="You confirm when ready">
                            <CodeBlock language={currentLang} code={code.webhookManual} />
                        </OperationSection>
                        <OperationSection id="webhook-signature" title="Signature Verification" emoji="🔐" description="Verify webhook authenticity on your server">
                            <CodeBlock language={currentLang} code={code.webhookSignature} />
                        </OperationSection>
                    </div>

                    {/* That's it! */}
                    <div className="rounded-xl border border-fd-border bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 p-12 text-center">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                            That's it!
                        </h3>
                        <p className="text-lg text-fd-foreground font-medium mb-4">
                            Any S3 provider, one unified SDK.
                        </p>
                        <p className="text-fd-muted-foreground max-w-lg mx-auto leading-relaxed">
                            Upload securely, handle large files automatically, and switch providers instantly.
                            <br />
                            ObitoX handles the complexity for you.
                        </p>
                    </div>
                </div>
            </DocsBody>
        </DocsPage >
    );
}

// ===== COMPONENTS =====



function FlowNode({ title, subtitle, icon, color, pulse }: {
    title: string; subtitle: string; icon: React.ReactNode; color: string; pulse?: boolean;
}) {
    const colorClasses: Record<string, { bg: string; border: string; text: string; ring: string }> = {
        emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
        blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', ring: 'ring-blue-500/20' },
        orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', ring: 'ring-orange-500/20' },
    };
    const colors = colorClasses[color] || colorClasses.blue;
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
            <span className="text-blue-400 [&>svg]:h-3 [&>svg]:w-3">{icon}</span>
            <span className="text-xs font-medium text-slate-300">{text}</span>
        </div>
    );
}

function OperationCard({ icon, title, description, href }: {
    icon: React.ReactNode; title: string; description: string; href: string;
}) {
    return (
        <a href={href} className="group p-4 rounded-lg border border-fd-border bg-fd-card hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors">
            <div className="flex items-start gap-3">
                <div className="text-fd-muted-foreground group-hover:text-blue-400 transition-colors [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
                <div>
                    <h3 className="font-semibold text-fd-foreground group-hover:text-blue-400 transition-colors">{title}</h3>
                    <p className="text-sm text-fd-muted-foreground mt-1">{description}</p>
                </div>
            </div>
        </a>
    );
}

function OperationSection({ id, title, emoji, description, children }: {
    id?: string; title: string; emoji: string; description?: string; children: React.ReactNode;
}) {
    return (
        <div id={id} className="p-6 rounded-xl border border-fd-border bg-fd-card/50 space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-fd-foreground flex items-center gap-2">
                    <span>{emoji}</span>
                    {title}
                </h3>
                {description && <p className="text-sm text-fd-muted-foreground mt-1">{description}</p>}
            </div>
            {children}
        </div>
    );
}
