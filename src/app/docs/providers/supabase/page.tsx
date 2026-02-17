'use client';

import { DocsPage, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { CodeBlock } from '@/components/docs/code-block';
import Link from 'next/link';
import {
  Zap, Globe, Shield, ArrowRight,
  Sparkles, TrendingUp, Server, Download, Trash2, Upload,
  Settings, Database, Lock, LockKeyhole, Search, Activity,
  Scan, Webhook
} from 'lucide-react';
import { useState } from 'react';

import { frameworks, supabaseCodeExamples } from './code-examples';

const tocItems = [
  { title: 'How it works', url: '#how-it-works', depth: 2 },
  { title: 'Operations', url: '#operations', depth: 2 },
  { title: 'Upload Features', url: '#upload-features', depth: 2 },
  { title: 'Delete', url: '#delete', depth: 2 },
  { title: 'Download URL', url: '#download-url', depth: 2 },
  { title: 'List Buckets', url: '#list-buckets', depth: 2 },
  { title: 'Webhooks', url: '#webhooks', depth: 2 },
  { title: 'Upload Cancellation', url: '#upload-cancellation', depth: 2 },
];

export default function SupabaseProviderPage() {
  const [activeFramework, setActiveFramework] = useState('node');

  const code = supabaseCodeExamples[activeFramework];
  const currentLang = frameworks.find(f => f.id === activeFramework)?.lang || 'typescript';

  return (
    <DocsPage toc={tocItems}>
      <DocsBody>
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
          {/* Hero Header */}
          <div id="hero-header" className="space-y-6 pt-8">
            <div className="relative">
              {/* Gradient Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-2xl blur-2xl" />

              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-emerald-400">Storage Provider</span>
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    SQL INTEGRATED
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-emerald-500/20 rounded-xl blur-lg" />
                    <Database className="relative h-12 w-12 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold text-fd-foreground tracking-tight">
                      Supabase Storage
                    </h1>
                    <p className="text-sm text-emerald-400 mt-1 font-medium">
                      Postgres-integrated object storage with RLS
                    </p>
                  </div>
                </div>

                <p className="text-xl text-fd-muted-foreground leading-relaxed max-w-3xl">
                  S3-compatible object storage tightly integrated with your <strong className="text-fd-foreground">PostgreSQL database</strong>.
                  Secure your files with <strong className="text-fd-foreground">Row Level Security (RLS)</strong> policies.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Flow Diagram */}
          <div className="space-y-4">
            <h2 id="how-it-works" className="text-2xl font-bold text-fd-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              How it works
            </h2>
            <p className="text-fd-muted-foreground">
              Files are stored in buckets with permissions controlled directly by your database policies.
            </p>

            {/* Enhanced Flow Diagram */}
            <div className="relative rounded-xl border border-fd-border bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 overflow-hidden max-w-2xl mx-auto">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />

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
                      Authenticated Request
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center gap-1 px-4">
                    <ArrowRight className="h-6 w-6 text-blue-400" />
                    <div className="text-[10px] text-blue-400 font-medium whitespace-nowrap">
                      Upload with Token
                    </div>
                  </div>

                  {/* ObitoX */}
                  <div className="flex-1">
                    <FlowNode
                      title="ObitoX"
                      subtitle="SDK"
                      icon={<Zap className="h-6 w-6" />}
                      color="emerald"
                      pulse
                    />
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center gap-1 px-4">
                    <ArrowRight className="h-6 w-6 text-emerald-400" />
                    <div className="text-[10px] text-emerald-400 font-medium whitespace-nowrap">
                      Secure Upload
                    </div>
                  </div>

                  {/* Supabase */}
                  <div className="flex-1">
                    <FlowNode
                      title="Supabase"
                      subtitle="Storage"
                      icon={<Database className="h-6 w-6" />}
                      color="teal"
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-700/50">
                  <FeaturePill icon={<Shield className="h-3 w-3" />} text="RLS Protected" />
                  <FeaturePill icon={<Database className="h-3 w-3" />} text="SQL Integrated" />
                  <FeaturePill icon={<Lock className="h-3 w-3" />} text="Signed URLs" />
                </div>
              </div>
            </div>
          </div>

          {/* Framework Tabs */}
          <FrameworkTabs activeFramework={activeFramework} onSelect={setActiveFramework} />

          {/* Setup */}
          <OperationSection id="setup" title="Setup" emoji="⚙️" description="Initialize the ObitoX client with your Supabase credentials">
            <CodeBlock language={currentLang} code={code.setup} />
          </OperationSection>

          {/* Operations Grid */}
          <div className="space-y-6">
            <h2 id="operations" className="text-2xl font-bold text-fd-foreground">Operations</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <OperationCard
                icon={<Upload />}
                title="Upload Files"
                description="Direct upload to buckets"
                href="#upload-features"
              />
              <OperationCard
                icon={<LockKeyhole />}
                title="Private Buckets"
                description="Secure uploads with RLS"
                href="#private-buckets"
              />
              <OperationCard
                icon={<Scan />}
                title="Magic Bytes"
                description="Validate file content"
                href="#with-file-validation"
              />
              <OperationCard
                icon={<Download />}
                title="Download"
                description="Signed download URLs"
                href="#download-url"
              />
              <OperationCard
                icon={<Database />}
                title="List Buckets"
                description="Manage storage buckets"
                href="#list-buckets"
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
                description="Remove from storage"
                href="#delete"
              />
              <OperationCard
                icon={<Settings />}
                title="Cancellation"
                description="Abort in-progress uploads"
                href="#upload-cancellation"
              />
            </div>
          </div>

          {/* Upload Features Section */}
          <div className="space-y-6">
            <div id="upload-features" className="flex items-center gap-3">
              <Upload className="h-6 w-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-fd-foreground">Upload Features</h2>
            </div>

            {/* Public Upload */}
            <OperationSection id="public-bucket-upload" title="Public Bucket Upload" emoji="📤">
              <CodeBlock language={currentLang} code={code.basicUpload} />
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

            {/* Private Upload */}
            <OperationSection
              id="private-buckets"
              title="Upload to Private Bucket"
              emoji="🔒"
              description="Generates a signed URL automatically"
            >
              <CodeBlock language={currentLang} code={code.privateUpload} />
            </OperationSection>

            {/* File Validation */}
            <OperationSection
              id="with-file-validation"
              title="With File Validation"
              emoji="✅"
              description="Server-side validation with Magic Bytes"
            >
              <CodeBlock language={currentLang} code={code.magicBytes} />
              <p className="text-sm text-fd-muted-foreground mt-2">
                Validation presets: <code className="text-emerald-400">'images'</code> | <code className="text-emerald-400">'documents'</code>
              </p>
            </OperationSection>
          </div>

          {/* Delete */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Trash2 className="h-6 w-6 text-red-400" />
              <h2 id="delete" className="text-2xl font-bold text-fd-foreground">Delete</h2>
            </div>
            <OperationSection id="delete-file" title="Delete File" emoji="🗑️">
              <CodeBlock language={currentLang} code={code.deleteFile} />
            </OperationSection>
          </div>

          {/* Download & URL */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Download className="h-6 w-6 text-blue-400" />
              <h2 id="download-url" className="text-2xl font-bold text-fd-foreground">Download URL</h2>
            </div>
            <p className="text-fd-muted-foreground">Generate signed download URLs for files (useful for private buckets).</p>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200">
              <strong>Note:</strong> <code className="text-white">filename</code> is the uploaded file's key from the URL, not the original name you passed to upload(). Extract it from the upload result.
            </div>

            <OperationSection id="generate-download-url" title="Generate Signed URL" emoji="🔗">
              <CodeBlock language={currentLang} code={code.download} />
            </OperationSection>
          </div>

          {/* List Buckets */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-purple-400" />
              <h2 id="list-buckets" className="text-2xl font-bold text-fd-foreground">List Buckets</h2>
            </div>
            <OperationSection id="list-all-buckets" title="List All Buckets" emoji="📋">
              <CodeBlock language={currentLang} code={code.listBuckets} />
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

          {/* Cancellation */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Trash2 className="h-6 w-6 text-red-400" />
              <h2 id="upload-cancellation" className="text-2xl font-bold text-fd-foreground">Upload Cancellation</h2>
            </div>
            <OperationSection id="cancel-feature" title="Cancel Upload" emoji="🛑">
              <CodeBlock language={currentLang} code={code.cancellation} />
            </OperationSection>
          </div>

          {/* That's it! */}
          <div className="rounded-xl border border-fd-border bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 p-12 text-center">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
              That's it!
            </h3>
            <p className="text-lg text-fd-foreground font-medium mb-4">
              SQL-integrated storage, one unified API.
            </p>
            <p className="text-fd-muted-foreground max-w-lg mx-auto leading-relaxed">
              Upload securely, manage buckets, and leverage Postgres RLS—automatically.
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
              ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5"
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
    teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', ring: 'ring-teal-500/20' },
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
      <span className="text-emerald-400 [&>svg]:h-3 [&>svg]:w-3">{icon}</span>
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
      className="group p-4 rounded-lg border border-fd-border bg-fd-card hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="text-fd-muted-foreground group-hover:text-emerald-400 transition-colors [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-fd-foreground group-hover:text-emerald-400 transition-colors">
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
