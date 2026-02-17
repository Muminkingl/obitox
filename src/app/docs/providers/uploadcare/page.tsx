'use client';

import { DocsPage, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { CodeBlock } from '@/components/docs/code-block';
import Link from 'next/link';
import {
  Zap, Globe, Shield, ArrowRight,
  Sparkles, TrendingUp, Server, Download, Trash2, Upload,
  Settings, Image as ImageIcon, Crop, Activity, Scan, Webhook
} from 'lucide-react';
import { useState } from 'react';

import { FrameworkTabs } from '@/components/docs/framework-tabs';
import { frameworks, uploadcareCodeExamples } from './code-examples';

const tocItems = [
  { title: 'How it works', url: '#how-it-works', depth: 2 },
  { title: 'Operations', url: '#operations', depth: 2 },
  { title: 'Upload Features', url: '#upload-features', depth: 2 },
  { title: 'Magic Bytes Validation', url: '#magic-bytes-validation', depth: 2 },
  { title: 'Virus Scanning', url: '#virus-scanning', depth: 2 },
  { title: 'On-the-fly Transformations', url: '#transformations', depth: 2 },
  { title: 'Download & CDN', url: '#download-urls', depth: 2 },
  { title: 'Webhooks', url: '#webhooks', depth: 2 },
  { title: 'Upload Cancellation', url: '#upload-cancellation', depth: 2 },
];

export default function UploadcareProviderPage() {
  const [activeFramework, setActiveFramework] = useState('node');

  const code = uploadcareCodeExamples[activeFramework];
  const currentLang = frameworks.find(f => f.id === activeFramework)?.lang || 'typescript';

  return (
    <DocsPage toc={tocItems}>
      <DocsBody>
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
          {/* Hero Header */}
          <div id="hero-header" className="space-y-6 pt-8">
            <div className="relative">
              {/* Gradient Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-pink-500/10 rounded-2xl blur-2xl" />

              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-emerald-400">Storage Provider</span>
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    INTELLIGENT CDN
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-pink-500/20 rounded-xl blur-lg" />
                    <ImageIcon className="relative h-12 w-12 text-pink-400" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold tracking-tight text-fd-foreground">
                      Uploadcare
                    </h1>
                    <p className="text-sm text-pink-400 mt-1 font-medium">
                      Automated image optimization & virus scanning
                    </p>
                  </div>
                </div>

                <p className="text-xl text-fd-muted-foreground leading-relaxed max-w-3xl">
                  Intelligent file CDN with <strong className="text-fd-foreground">smart image optimization</strong> and
                  <strong className="text-fd-foreground"> automatic virus scanning</strong>. Transform images on-the-fly without extra infrastructure.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Flow Diagram */}
          <div className="space-y-4">
            <h2 id="how-it-works" className="text-2xl font-bold text-fd-foreground flex items-center gap-2">
              <Activity className="h-6 w-6 text-pink-400" />
              How it works
            </h2>
            <p className="text-fd-muted-foreground">
              Files are uploaded to Uploadcare's intelligent CDN, automatically optimized, and scanned for threats before delivery.
            </p>

            {/* Enhanced Flow Diagram */}
            <div className="relative rounded-xl border border-fd-border bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 overflow-hidden max-w-2xl mx-auto">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent" />

              {/* Flow */}
              <div className="relative space-y-6">
                {/* Top Row */}
                <div className="flex items-center justify-between gap-2">
                  {/* Your App */}
                  <div className="flex-1">
                    <FlowNode
                      title="Your App"
                      subtitle="myapp.com"
                      icon={<Server className="h-6 w-6" />}
                      color="emerald"
                    />
                    <div className="text-xs text-slate-500 text-center mt-2">
                      Uploads file
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center gap-1 px-4">
                    <ArrowRight className="h-6 w-6 text-emerald-400" />
                    <div className="text-[10px] text-emerald-400 font-medium whitespace-nowrap">
                      Process
                    </div>
                  </div>

                  {/* ObitoX */}
                  <div className="flex-1">
                    <FlowNode
                      title="ObitoX"
                      subtitle="Intelligence"
                      icon={<Zap className="h-6 w-6" />}
                      color="amber"
                      pulse
                    />
                    <div className="text-xs text-slate-500 text-center mt-2">
                      Optimizes & Scans
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center gap-1 px-4">
                    <ArrowRight className="h-6 w-6 text-pink-400" />
                    <div className="text-[10px] text-pink-400 font-medium whitespace-nowrap">
                      Deliver
                    </div>
                  </div>

                  {/* Uploadcare */}
                  <div className="flex-1">
                    <FlowNode
                      title="CDN"
                      subtitle="Global Edge"
                      icon={<Globe className="h-6 w-6" />}
                      color="pink"
                    />
                    <div className="text-xs text-slate-500 text-center mt-2">
                      Served globally
                    </div>
                  </div>
                </div>

                {/* Bottom Features */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
                  <FeaturePill icon={<ImageIcon />} text="Auto WebP/AVIF" />
                  <FeaturePill icon={<Shield />} text="Virus Scanning" />
                  <FeaturePill icon={<Crop />} text="On-fly Resize" />
                </div>
              </div>
            </div>
          </div>

          {/* Framework Tabs */}
          <FrameworkTabs activeFramework={activeFramework} onSelect={setActiveFramework} frameworks={frameworks} color="pink" />

          {/* Setup */}
          <OperationSection id="setup" title="Setup" emoji="⚙️" description="Initialize the ObitoX client with your Uploadcare credentials">
            <CodeBlock language={currentLang} code={code.setup} />
          </OperationSection>

          {/* Operations Grid */}
          <div className="space-y-6">
            <h2 id="operations" className="text-2xl font-bold text-fd-foreground">Operations</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <OperationCard
                icon={<Upload />}
                title="Smart Upload"
                description="Upload with auto-optimization"
                href="#upload-features"
              />
              <OperationCard
                icon={<Crop />}
                title="Transform"
                description="Resize, crop, filter on-the-fly"
                href="#transformations"
              />
              <OperationCard
                icon={<Shield />}
                title="Virus Scan"
                description="Server-side malware check"
                href="#virus-scanning"
              />
              <OperationCard
                icon={<Scan />}
                title="Magic Bytes"
                description="Validate content type (Client-side)"
                href="#magic-bytes-validation"
              />
              <OperationCard
                icon={<Webhook />}
                title="Webhooks"
                description="Upload completion events"
                href="#webhooks"
              />
              <OperationCard
                icon={<Download />}
                title="Fast CDN"
                description="Global delivery network"
                href="#download-urls"
              />
              <OperationCard
                icon={<Trash2 />}
                title="Delete Files"
                description="Remove files from storage"
                href="#delete-files"
              />
              <OperationCard
                icon={<Settings />}
                title="Optimization"
                description="Advanced compression settings"
                href="#image-optimization"
              />
            </div>
          </div>

          {/* Upload Features Section */}
          <div className="space-y-6">
            <div id="upload-features" className="flex items-center gap-3">
              <Upload className="h-6 w-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-fd-foreground">Upload Features</h2>
            </div>

            {/* Basic Upload */}
            <OperationSection id="basic-upload" title="Basic Upload" emoji="📤">
              <CodeBlock language={currentLang} code={code.basicUpload} />
            </OperationSection>

            {/* Auto Optimization */}
            <OperationSection
              id="image-optimization"
              title="Auto Image Optimization"
              emoji="✨"
              description="Automatically convert to WebP/AVIF and optimize quality"
            >
              <CodeBlock language={currentLang} code={code.autoOptimization} />
            </OperationSection>

            {/* Manual Optimization */}
            <OperationSection
              id="manual-optimization"
              title="Manual Optimization"
              emoji="🛠️"
              description="Fine-tune compression and format settings"
            >
              <CodeBlock language={currentLang} code={code.manualOptimization} />
              <div className="mt-4 rounded-lg border border-fd-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-fd-muted/50 border-b border-fd-border">
                    <tr>
                      <th className="text-left p-3 text-fd-foreground font-semibold">Option</th>
                      <th className="text-left p-3 text-fd-foreground font-semibold">Values</th>
                      <th className="text-left p-3 text-fd-foreground font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-fd-border">
                    <tr className="hover:bg-fd-muted/30">
                      <td className="p-3"><code className="text-pink-400">format</code></td>
                      <td className="p-3 text-fd-muted-foreground">auto, webp, jpeg, png</td>
                      <td className="p-3 text-fd-muted-foreground">Output image format</td>
                    </tr>
                    <tr className="hover:bg-fd-muted/30">
                      <td className="p-3"><code className="text-pink-400">quality</code></td>
                      <td className="p-3 text-fd-muted-foreground">lightest to best</td>
                      <td className="p-3 text-fd-muted-foreground">Compression level</td>
                    </tr>
                    <tr className="hover:bg-fd-muted/30">
                      <td className="p-3"><code className="text-pink-400">adaptiveQuality</code></td>
                      <td className="p-3 text-fd-muted-foreground">true/false</td>
                      <td className="p-3 text-fd-muted-foreground">AI quality optimization</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </OperationSection>

            {/* Progress Tracking */}
            <OperationSection
              id="progress-tracking"
              title="Progress Tracking"
              emoji="📊"
              description="Monitor upload progress in real-time"
            >
              <CodeBlock language={currentLang} code={code.progressTracking} />
            </OperationSection>

            {/* Magic Bytes Validation */}
            <OperationSection
              id="magic-bytes-validation"
              title="Magic Bytes Validation"
              emoji="🕵️"
              description="Validate file content matches extension"
            >
              <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-start gap-2">
                  <Scan className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-fd-muted-foreground">
                    <strong className="text-emerald-400">Client-Side Feature:</strong> This is an ObitoX SDK feature that runs in the browser/client to validate files <em>before</em> upload.
                  </div>
                </div>
              </div>
              <CodeBlock language={currentLang} code={code.magicBytes} />
              <p className="text-sm text-fd-muted-foreground mt-2">
                Validation presets: <code className="text-pink-400">'images'</code> | <code className="text-pink-400">'documents'</code>
              </p>
            </OperationSection>
          </div>

          {/* Virus Scanning */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-red-400" />
              <h2 id="virus-scanning" className="text-2xl font-bold text-fd-foreground">Virus Scanning</h2>
            </div>

            <OperationSection
              id="scan-delete"
              title="Scan & Delete"
              emoji="🦠"
              description="Automatically detect and remove infected files"
            >
              <CodeBlock language={currentLang} code={code.virusScanning} />
              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-fd-muted-foreground">
                    <strong className="text-red-400">Server-Side Feature:</strong> This is a server-side feature powered by Uploadcare. Infected files are automatically deleted from storage to protect your users.
                  </div>
                </div>
              </div>
            </OperationSection>
          </div>

          {/* Transformations */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Crop className="h-6 w-6 text-purple-400" />
              <h2 id="transformations" className="text-2xl font-bold text-fd-foreground">On-the-fly Transformations</h2>
            </div>

            <OperationSection
              id="url-based-processing"
              title="URL-Based Processing"
              emoji="🎨"
              description="Transform images just by changing the URL"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-fd-foreground mb-2">Resize</h4>
                  <div className="p-3 rounded-lg bg-fd-secondary font-mono text-sm text-fd-muted-foreground border border-fd-border break-all">
                    https://ucarecdn.com/uuid/<span className="text-pink-400">-/resize/800x600/</span>photo.jpg
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-fd-foreground mb-2">Convert Format</h4>
                  <div className="p-3 rounded-lg bg-fd-secondary font-mono text-sm text-fd-muted-foreground border border-fd-border break-all">
                    https://ucarecdn.com/uuid/<span className="text-pink-400">-/format/webp/</span>photo.jpg
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-fd-foreground mb-2">Crop & Quality</h4>
                  <div className="p-3 rounded-lg bg-fd-secondary font-mono text-sm text-fd-muted-foreground border border-fd-border break-all">
                    https://ucarecdn.com/uuid/<span className="text-pink-400">-/crop/300x300/center/-/quality/best/</span>photo.jpg
                  </div>
                </div>
              </div>
            </OperationSection>
          </div>


          {/* Download & Delete */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-blue-400" />
              <h2 id="download-urls" className="text-2xl font-bold text-fd-foreground">Download & CDN</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <OperationSection
                id="get-cdn-url"
                title="Get CDN URL"
                emoji="🌍"
                description="Publicly accessible CDN link"
              >
                <CodeBlock language={currentLang} code={code.download} />
              </OperationSection>

              <OperationSection
                id="delete-files"
                title="Delete File"
                emoji="🗑️"
              >
                <CodeBlock language={currentLang} code={code.deleteFile} />
              </OperationSection>
            </div>
          </div>

          {/* Webhooks */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-emerald-400" />
              <h2 id="webhooks" className="text-2xl font-bold text-fd-foreground">Webhooks</h2>
            </div>
            <p className="text-fd-muted-foreground">Notification system for upload completion.</p>

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

          {/* Upload Cancellation */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Trash2 className="h-6 w-6 text-red-400" />
              <h2 id="upload-cancellation" className="text-2xl font-bold text-fd-foreground">Upload Cancellation</h2>
            </div>
            <OperationSection
              id="cancellation"
              title="Best-Effort Cancellation"
              emoji="🛑"
              description="Cancel uploads in progress"
            >
              <p className="text-sm text-fd-muted-foreground mb-4">
                Cancellation is best-effort — small files on fast connections may complete before the abort takes effect.
              </p>
              <CodeBlock language={currentLang} code={code.cancellation} />
            </OperationSection>
          </div>

          {/* That's it! */}
          <div className="rounded-xl border border-fd-border bg-gradient-to-br from-pink-500/5 via-transparent to-emerald-500/5 p-12 text-center">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              That's it!
            </h3>
            <p className="text-lg text-fd-foreground font-medium mb-4">
              No more manual handling.
            </p>
            <p className="text-fd-muted-foreground max-w-lg mx-auto leading-relaxed">
              Viruses are scanned, images are optimized, and content is distributed globally—automatically.
              <br />
              Focus on building your app, we handle the rest.
            </p>
          </div>


        </div>
      </DocsBody>
    </DocsPage>
  );
}

// ===== COMPONENTS =====



function FlowNode({ title, subtitle, icon, color, pulse }: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  pulse?: boolean;
}) {
  const colorClasses: Record<string, { bg: string; border: string; text: string; ring: string }> = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', ring: 'ring-amber-500/20' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', ring: 'ring-pink-500/20' },
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
      <span className="text-pink-400 [&>svg]:h-3 [&>svg]:w-3">{icon}</span>
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
      className="group p-4 rounded-lg border border-fd-border bg-fd-card hover:border-pink-500/30 hover:bg-pink-500/5 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="text-fd-muted-foreground group-hover:text-pink-400 transition-colors [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-fd-foreground group-hover:text-pink-400 transition-colors">
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