"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/docs/code-block";
import {
    CheckCircle, Zap, Globe, Shield, Clock, AlertCircle, ArrowRight,
    ThumbsUp, ThumbsDown, Database, Lock, DollarSign, Sparkles,
    TrendingUp, Server, HardDrive, Eye, Download, Trash2, Upload,
    FileText, Settings, Key, LockKeyhole, FolderLock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Framework definitions
const frameworks = [
    { id: 'node', name: 'Node.js', lang: 'typescript' },
    { id: 'express', name: 'Express', lang: 'typescript' },
    { id: 'python', name: 'Python', lang: 'python' },
    { id: 'php', name: 'PHP', lang: 'php' },
    { id: 'go', name: 'Go', lang: 'go' },
    { id: 'ruby', name: 'Ruby', lang: 'ruby' }
];

// Supabase code examples for each framework
const supabaseCodeExamples: Record<string, {
    quickStart: string;
    publicUpload: string;
    privateUpload: string;
    progressTracking: string;
    cancelUpload: string;
    publicAccess: string;
    privateSignedUrl: string;
    listBuckets: string;
}> = {
    node: {
        quickStart: `import ObitoX from 'obitox';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,
  apiSecret: process.env.OBITOX_API_SECRET
});

const url = await client.uploadFile(file, {
  provider: 'SUPABASE',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY,
  bucket: 'avatars'
});

console.log('Uploaded:', url);`,
        publicUpload: `const url = await client.uploadFile(file, {
  provider: 'SUPABASE',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY,
  bucket: 'avatars'  // Public bucket
});

// https://xxx.supabase.co/storage/v1/object/public/avatars/photo.jpg`,
        privateUpload: `const url = await client.uploadFile(file, {
  provider: 'SUPABASE',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY,
  bucket: 'admin',  // Private bucket
  expiresIn: 3600   // Signed URL valid for 1 hour
});

// https://xxx.supabase.co/storage/v1/object/sign/admin/document.pdf?token=...`,
        progressTracking: `const url = await client.uploadFile(file, {
  provider: 'SUPABASE',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY,
  bucket: 'avatars',
  
  onProgress: (progress, bytesUploaded, totalBytes) => {
    console.log(\`\${progress.toFixed(1)}% uploaded\`);
    // Browser: 0% → 15% → 32% → 58% → 100%
    // Node.js: 0% → 100%
  }
});`,
        cancelUpload: `const url = await client.uploadFile(file, {
  provider: 'SUPABASE',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY,
  bucket: 'avatars',
  
  onCancel: () => {
    console.log('Upload was cancelled');
  }
});

// To cancel: client.cancel();`,
        publicAccess: `const downloadUrl = await client.downloadFile({
  provider: 'SUPABASE',
  filename: 'photo.jpg',
  bucket: 'avatars'
});`,
        privateSignedUrl: `const downloadUrl = await client.downloadFile({
  provider: 'SUPABASE',
  filename: 'invoice.pdf',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY,
  bucket: 'admin',
  expiresIn: 300  // 5 minutes
});`,
        listBuckets: `const supabaseProvider = client.providers.get('SUPABASE');

const buckets = await supabaseProvider.listBuckets({
  provider: 'SUPABASE',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY
});

buckets.forEach(bucket => {
  console.log(\`\${bucket.name} - Public: \${bucket.public}\`);
});`
    },
    express: {
        quickStart: `import express from 'express';
import multer from 'multer';
import ObitoX from 'obitox';

const app = express();
const upload = multer();
const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,
  apiSecret: process.env.OBITOX_API_SECRET
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'SUPABASE',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY,
    bucket: 'avatars'
  });
  res.json({ url });
});`,
        publicUpload: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'SUPABASE',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY,
    bucket: 'avatars'
  });
  res.json({ url });
});`,
        privateUpload: `app.post('/upload-private', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'SUPABASE',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY,
    bucket: 'admin',
    expiresIn: 3600
  });
  res.json({ url });
});`,
        progressTracking: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'SUPABASE',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY,
    bucket: 'avatars',
    onProgress: (progress) => console.log(\`\${progress}%\`)
  });
  res.json({ url });
});`,
        cancelUpload: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'SUPABASE',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY,
    bucket: 'avatars',
    onCancel: () => console.log('Cancelled')
  });
  res.json({ url });
});`,
        publicAccess: `app.get('/download/:filename', async (req, res) => {
  const downloadUrl = await client.downloadFile({
    provider: 'SUPABASE',
    filename: req.params.filename,
    bucket: 'avatars'
  });
  res.redirect(downloadUrl);
});`,
        privateSignedUrl: `app.get('/download/:filename', async (req, res) => {
  const downloadUrl = await client.downloadFile({
    provider: 'SUPABASE',
    filename: req.params.filename,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY,
    bucket: 'admin',
    expiresIn: 300
  });
  res.redirect(downloadUrl);
});`,
        listBuckets: `app.get('/buckets', async (req, res) => {
  const supabaseProvider = client.providers.get('SUPABASE');
  const buckets = await supabaseProvider.listBuckets({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseToken: process.env.SUPABASE_SERVICE_ROLE_KEY
  });
  res.json(buckets);
});`
    },
    python: {
        quickStart: `from obitox import ObitoX
import os

client = ObitoX(
    api_key=os.getenv('OBITOX_API_KEY'),
    api_secret=os.getenv('OBITOX_API_SECRET')
)

url = client.upload_file(file, {
    'provider': 'SUPABASE',
    'supabase_url': os.getenv('SUPABASE_URL'),
    'supabase_token': os.getenv('SUPABASE_SERVICE_ROLE_KEY'),
    'bucket': 'avatars'
})

print(f'Uploaded: {url}')`,
        publicUpload: `url = client.upload_file(file, {
    'provider': 'SUPABASE',
    'supabase_url': os.getenv('SUPABASE_URL'),
    'supabase_token': os.getenv('SUPABASE_SERVICE_ROLE_KEY'),
    'bucket': 'avatars'
})`,
        privateUpload: `url = client.upload_file(file, {
    'provider': 'SUPABASE',
    'supabase_url': os.getenv('SUPABASE_URL'),
    'supabase_token': os.getenv('SUPABASE_SERVICE_ROLE_KEY'),
    'bucket': 'admin',
    'expires_in': 3600
})`,
        progressTracking: `def on_progress(progress, bytes_uploaded, total_bytes):
    print(f'{progress:.1f}% uploaded')

url = client.upload_file(file, {
    'provider': 'SUPABASE',
    'supabase_url': os.getenv('SUPABASE_URL'),
    'supabase_token': os.getenv('SUPABASE_SERVICE_ROLE_KEY'),
    'bucket': 'avatars',
    'on_progress': on_progress
})`,
        cancelUpload: `def on_cancel():
    print('Upload cancelled')

url = client.upload_file(file, {
    'provider': 'SUPABASE',
    'supabase_url': os.getenv('SUPABASE_URL'),
    'supabase_token': os.getenv('SUPABASE_SERVICE_ROLE_KEY'),
    'bucket': 'avatars',
    'on_cancel': on_cancel
})`,
        publicAccess: `download_url = client.download_file({
    'provider': 'SUPABASE',
    'filename': 'photo.jpg',
    'bucket': 'avatars'
})`,
        privateSignedUrl: `download_url = client.download_file({
    'provider': 'SUPABASE',
    'filename': 'invoice.pdf',
    'supabase_url': os.getenv('SUPABASE_URL'),
    'supabase_token': os.getenv('SUPABASE_SERVICE_ROLE_KEY'),
    'bucket': 'admin',
    'expires_in': 300
})`,
        listBuckets: `supabase_provider = client.providers.get('SUPABASE')

buckets = supabase_provider.list_buckets({
    'supabase_url': os.getenv('SUPABASE_URL'),
    'supabase_token': os.getenv('SUPABASE_SERVICE_ROLE_KEY')
})

for bucket in buckets:
    print(f"{bucket['name']} - Public: {bucket['public']}")`
    },
    php: {
        quickStart: `<?php
require_once 'vendor/autoload.php';

use ObitoX\\ObitoXClient;

$client = new ObitoXClient([
    'api_key' => getenv('OBITOX_API_KEY'),
    'api_secret' => getenv('OBITOX_API_SECRET')
]);

$url = $client->uploadFile($_FILES['file']['tmp_name'], [
    'provider' => 'SUPABASE',
    'supabase_url' => getenv('SUPABASE_URL'),
    'supabase_token' => getenv('SUPABASE_SERVICE_ROLE_KEY'),
    'bucket' => 'avatars'
]);

echo "Uploaded: " . $url;`,
        publicUpload: `$url = $client->uploadFile($file, [
    'provider' => 'SUPABASE',
    'supabase_url' => getenv('SUPABASE_URL'),
    'supabase_token' => getenv('SUPABASE_SERVICE_ROLE_KEY'),
    'bucket' => 'avatars'
]);`,
        privateUpload: `$url = $client->uploadFile($file, [
    'provider' => 'SUPABASE',
    'supabase_url' => getenv('SUPABASE_URL'),
    'supabase_token' => getenv('SUPABASE_SERVICE_ROLE_KEY'),
    'bucket' => 'admin',
    'expires_in' => 3600
]);`,
        progressTracking: `$url = $client->uploadFile($file, [
    'provider' => 'SUPABASE',
    'supabase_url' => getenv('SUPABASE_URL'),
    'supabase_token' => getenv('SUPABASE_SERVICE_ROLE_KEY'),
    'bucket' => 'avatars',
    'on_progress' => function($progress) {
        echo number_format($progress, 1) . "% uploaded\\n";
    }
]);`,
        cancelUpload: `$url = $client->uploadFile($file, [
    'provider' => 'SUPABASE',
    'supabase_url' => getenv('SUPABASE_URL'),
    'supabase_token' => getenv('SUPABASE_SERVICE_ROLE_KEY'),
    'bucket' => 'avatars',
    'on_cancel' => function() {
        echo "Upload cancelled\\n";
    }
]);`,
        publicAccess: `$downloadUrl = $client->downloadFile([
    'provider' => 'SUPABASE',
    'filename' => 'photo.jpg',
    'bucket' => 'avatars'
]);`,
        privateSignedUrl: `$downloadUrl = $client->downloadFile([
    'provider' => 'SUPABASE',
    'filename' => 'invoice.pdf',
    'supabase_url' => getenv('SUPABASE_URL'),
    'supabase_token' => getenv('SUPABASE_SERVICE_ROLE_KEY'),
    'bucket' => 'admin',
    'expires_in' => 300
]);`,
        listBuckets: `$supabaseProvider = $client->providers->get('SUPABASE');

$buckets = $supabaseProvider->listBuckets([
    'supabase_url' => getenv('SUPABASE_URL'),
    'supabase_token' => getenv('SUPABASE_SERVICE_ROLE_KEY')
]);

foreach ($buckets as $bucket) {
    echo $bucket->name . " - Public: " . $bucket->public . "\\n";
}`
    },
    go: {
        quickStart: `package main

import (
    "os"
    obitox "github.com/obitox/obitox-go"
)

func main() {
    client := obitox.NewClient(
        os.Getenv("OBITOX_API_KEY"),
        os.Getenv("OBITOX_API_SECRET"),
    )

    url, err := client.UploadFile(file, obitox.UploadOptions{
        Provider:       "SUPABASE",
        SupabaseUrl:    os.Getenv("SUPABASE_URL"),
        SupabaseToken:  os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
        Bucket:         "avatars",
    })

    fmt.Println("Uploaded:", url)
}`,
        publicUpload: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:       "SUPABASE",
    SupabaseUrl:    os.Getenv("SUPABASE_URL"),
    SupabaseToken:  os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
    Bucket:         "avatars",
})`,
        privateUpload: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:       "SUPABASE",
    SupabaseUrl:    os.Getenv("SUPABASE_URL"),
    SupabaseToken:  os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
    Bucket:         "admin",
    ExpiresIn:      3600,
})`,
        progressTracking: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:       "SUPABASE",
    SupabaseUrl:    os.Getenv("SUPABASE_URL"),
    SupabaseToken:  os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
    Bucket:         "avatars",
    OnProgress: func(progress float64, uploaded, total int64) {
        fmt.Printf("%.1f%% uploaded\\n", progress)
    },
})`,
        cancelUpload: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:       "SUPABASE",
    SupabaseUrl:    os.Getenv("SUPABASE_URL"),
    SupabaseToken:  os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
    Bucket:         "avatars",
    OnCancel: func() {
        fmt.Println("Upload cancelled")
    },
})`,
        publicAccess: `downloadUrl, err := client.DownloadFile(obitox.DownloadOptions{
    Provider: "SUPABASE",
    Filename: "photo.jpg",
    Bucket:   "avatars",
})`,
        privateSignedUrl: `downloadUrl, err := client.DownloadFile(obitox.DownloadOptions{
    Provider:       "SUPABASE",
    Filename:       "invoice.pdf",
    SupabaseUrl:    os.Getenv("SUPABASE_URL"),
    SupabaseToken:  os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
    Bucket:         "admin",
    ExpiresIn:      300,
})`,
        listBuckets: `supabaseProvider := client.Providers.Get("SUPABASE")

buckets, err := supabaseProvider.ListBuckets(obitox.BucketOptions{
    SupabaseUrl:   os.Getenv("SUPABASE_URL"),
    SupabaseToken: os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
})

for _, bucket := range buckets {
    fmt.Printf("%s - Public: %v\\n", bucket.Name, bucket.Public)
}`
    },
    ruby: {
        quickStart: `require 'obitox'

client = ObitoX::Client.new(
  api_key: ENV['OBITOX_API_KEY'],
  api_secret: ENV['OBITOX_API_SECRET']
)

File.open('photo.jpg', 'rb') do |file|
  url = client.upload_file(file, {
    provider: 'SUPABASE',
    supabase_url: ENV['SUPABASE_URL'],
    supabase_token: ENV['SUPABASE_SERVICE_ROLE_KEY'],
    bucket: 'avatars'
  })
  puts "Uploaded: #{url}"
end`,
        publicUpload: `url = client.upload_file(file, {
  provider: 'SUPABASE',
  supabase_url: ENV['SUPABASE_URL'],
  supabase_token: ENV['SUPABASE_SERVICE_ROLE_KEY'],
  bucket: 'avatars'
})`,
        privateUpload: `url = client.upload_file(file, {
  provider: 'SUPABASE',
  supabase_url: ENV['SUPABASE_URL'],
  supabase_token: ENV['SUPABASE_SERVICE_ROLE_KEY'],
  bucket: 'admin',
  expires_in: 3600
})`,
        progressTracking: `url = client.upload_file(file, {
  provider: 'SUPABASE',
  supabase_url: ENV['SUPABASE_URL'],
  supabase_token: ENV['SUPABASE_SERVICE_ROLE_KEY'],
  bucket: 'avatars',
  on_progress: ->(progress, uploaded, total) {
    puts "#{progress.round(1)}% uploaded"
  }
})`,
        cancelUpload: `url = client.upload_file(file, {
  provider: 'SUPABASE',
  supabase_url: ENV['SUPABASE_URL'],
  supabase_token: ENV['SUPABASE_SERVICE_ROLE_KEY'],
  bucket: 'avatars',
  on_cancel: -> { puts "Upload cancelled" }
})`,
        publicAccess: `download_url = client.download_file({
  provider: 'SUPABASE',
  filename: 'photo.jpg',
  bucket: 'avatars'
})`,
        privateSignedUrl: `download_url = client.download_file({
  provider: 'SUPABASE',
  filename: 'invoice.pdf',
  supabase_url: ENV['SUPABASE_URL'],
  supabase_token: ENV['SUPABASE_SERVICE_ROLE_KEY'],
  bucket: 'admin',
  expires_in: 300
})`,
        listBuckets: `supabase_provider = client.providers.get('SUPABASE')

buckets = supabase_provider.list_buckets({
  supabase_url: ENV['SUPABASE_URL'],
  supabase_token: ENV['SUPABASE_SERVICE_ROLE_KEY']
})

buckets.each do |bucket|
  puts "#{bucket.name} - Public: #{bucket.public}"
end`
    }
};

// Framework Tabs Component
function FrameworkTabs({ activeFramework, onSelect }: { activeFramework: string; onSelect: (id: string) => void }) {
    return (
        <div className="border-b border-slate-800 mb-6">
            <div className="flex gap-1 overflow-x-auto pb-px">
                {frameworks.map((framework) => (
                    <button
                        key={framework.id}
                        onClick={() => onSelect(framework.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeFramework === framework.id
                            ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            }`}
                    >
                        {framework.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function SupabaseProviderPage() {
    const [activeFramework, setActiveFramework] = useState('node');

    const code = supabaseCodeExamples[activeFramework];
    const currentLang = frameworks.find(f => f.id === activeFramework)?.lang || 'typescript';

    return (
        <article className="max-w-4xl space-y-12">
            {/* Hero Header */}
            <div id="hero-header" className="space-y-6">
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
                                <h1 className="text-5xl font-bold text-white tracking-tight">
                                    Supabase Storage
                                </h1>
                                <p className="text-sm text-emerald-400 mt-1 font-medium">
                                    Postgres-integrated object storage with RLS.
                                </p>
                            </div>
                        </div>

                        <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
                            S3-compatible object storage tightly integrated with your <strong className="text-white">PostgreSQL database</strong>.
                            Secure your files with <strong className="text-white">Row Level Security (RLS)</strong> policies.
                        </p>
                    </div>
                </div>
            </div>

            {/* Visual Flow Diagram */}
            <div className="space-y-4">
                <h2 id="how-it-works" className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-emerald-400" />
                    How it works
                </h2>
                <p className="text-slate-400">
                    Files are stored in buckets with permissions controlled directly by your database policies.
                </p>

                {/* Enhanced Flow Diagram */}
                <div className="relative rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 overflow-hidden max-w-2xl mx-auto">
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
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <FeaturePill icon={<Shield className="h-3 w-3" />} text="RLS Protected" />
                            <FeaturePill icon={<Database className="h-3 w-3" />} text="SQL Integrated" />
                            <FeaturePill icon={<Lock className="h-3 w-3" />} text="Signed URLs" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Framework Tabs */}
            <FrameworkTabs activeFramework={activeFramework} onSelect={setActiveFramework} />

            {/* Quick Start */}
            <div className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/50 p-8">
                <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-emerald-400" />
                    <div>
                        <h2 id="quick-start" className="text-2xl font-bold text-white">Quick Start</h2>
                        <p className="text-sm text-slate-400">Secure storage in 3 steps</p>
                    </div>
                </div>

                {/* Step 1 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-sm font-bold text-emerald-400">1</span>
                        </div>
                        <h3 id="get-project-details" className="text-lg font-semibold text-white">Get Project Details</h3>
                    </div>

                    <div className="ml-11 text-sm text-slate-400 space-y-2">
                        <p>Go to <a href="https://supabase.com/dashboard" target="_blank" className="text-emerald-400 hover:text-emerald-300">Supabase Dashboard</a> → Project Settings → API:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Copy <strong className="text-white">Project URL</strong></li>
                            <li>Copy <strong className="text-white">service_role</strong> secret (required for server-side uploads)</li>
                        </ul>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-sm font-bold text-emerald-400">2</span>
                        </div>
                        <h3 id="create-bucket-policies" className="text-lg font-semibold text-white">Create Bucket & Policies</h3>
                    </div>

                    <div className="ml-11 text-sm text-slate-400 space-y-2">
                        <p>In Storage Dashboard:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-4">
                            <li>Create a bucket (e.g. <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-xs">avatars</code>)</li>
                            <li>Make it <strong className="text-white">Public</strong> for easy read access</li>
                        </ol>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-sm font-bold text-emerald-400">3</span>
                        </div>
                        <h3 id="upload-file" className="text-lg font-semibold text-white">Upload File</h3>
                    </div>

                    <div className="ml-11">
                        <CodeBlock
                            language={currentLang}
                            code={code.quickStart}
                        />
                    </div>
                </div>
            </div>

            {/* Operations Grid */}
            <div className="space-y-6">
                <h2 id="operations" className="text-2xl font-bold text-white">Operations</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        icon={<Shield />}
                        title="RLS Policies"
                        description="Fine-grained access control"
                        href="#rls-policies"
                    />
                    <OperationCard
                        icon={<Download />}
                        title="Download"
                        description="Retrieve files securely"
                        href="#download-files"
                    />
                    <OperationCard
                        icon={<Database />}
                        title="Buckets"
                        description="Manage your storage buckets"
                        href="#bucket-management"
                    />
                </div>
            </div>

            {/* Upload Features Section */}
            <div className="space-y-6">
                <div id="upload-features" className="flex items-center gap-3">
                    <Upload className="h-6 w-6 text-emerald-400" />
                    <h2 className="text-2xl font-bold text-white">Upload Features</h2>
                </div>

                {/* Public Upload */}
                <OperationSection id="public-bucket-upload" title="Public Bucket Upload" emoji="🌍">
                    <CodeBlock
                        language={currentLang}
                        code={code.publicUpload}
                    />
                </OperationSection>

                {/* Private Upload */}
                <OperationSection
                    id="private-buckets"
                    title="Private Bucket Upload"
                    emoji="🔒"
                    description="Generates a signed URL automatically"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.privateUpload}
                    />
                </OperationSection>

                {/* Progress Tracking */}
                <OperationSection
                    id="progress-tracking"
                    title="Progress Tracking"
                    emoji="📊"
                    description="Monitor upload progress in real-time"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.progressTracking}
                    />
                </OperationSection>

                {/* Cancel Upload */}
                <OperationSection
                    id="cancel-upload"
                    title="Cancel Upload"
                    emoji="🛑"
                    description="Allow users to cancel in-progress uploads"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.cancelUpload}
                    />
                </OperationSection>
            </div>

            {/* Download & Access */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Download className="h-6 w-6 text-blue-400" />
                    <h2 id="download-files" className="text-2xl font-bold text-white">Download & Access</h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <OperationSection
                        id="public-file-access"
                        title="Public File Access"
                        emoji="📢"
                        description="Direct access for public buckets"
                    >
                        <CodeBlock
                            language={currentLang}
                            code={code.publicAccess}
                        />
                    </OperationSection>

                    <OperationSection
                        id="private-file-signed-url"
                        title="Private File (Signed URL)"
                        emoji="🔑"
                        description="Secure time-limited access"
                    >
                        <CodeBlock
                            language={currentLang}
                            code={code.privateSignedUrl}
                        />
                    </OperationSection>
                </div>
            </div>

            {/* Bucket Management */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <HardDrive className="h-6 w-6 text-purple-400" />
                    <h2 id="bucket-management" className="text-2xl font-bold text-white">Bucket Management</h2>
                </div>

                <OperationSection
                    id="list-all-buckets"
                    title="List All Buckets"
                    emoji="📋"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.listBuckets}
                    />
                </OperationSection>
            </div>

            {/* RLS Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-emerald-400" />
                    <h2 id="rls-policies" className="text-2xl font-bold text-white">Row Level Security (RLS)</h2>
                </div>

                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/20 space-y-4">
                    <div className="flex items-start gap-4">
                        <Database className="h-6 w-6 text-emerald-400 mt-1" />
                        <div>
                            <h3 className="text-lg font-semibold text-white">Fine-grained Access Control</h3>
                            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                                Supabase Storage relies on PostgreSQL RLS policies to determine who can access what.
                                Unlike other providers where you manage keys, here you manage <strong className="text-white">policies</strong>.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Public Read Access</h4>
                            <CodeBlock
                                language="sql"
                                code={`CREATE POLICY "Public Read"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');`}
                            />
                        </div>
                        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">User Owns File</h4>
                            <CodeBlock
                                language="sql"
                                code={`CREATE POLICY "User Access"
ON storage.objects FOR SELECT
USING (auth.uid() = owner);`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Pro Tips */}
            <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-8">
                <h3 id="pro-tips" className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                    Pro Tips for Production
                </h3>

                <div className="space-y-4">
                    <ProTip
                        icon={<Key />}
                        title="Service Role Key Safety"
                        description="Your service role key bypasses RLS. Never expose it in client-side code. Use it only in secure server environments."
                    />
                    <ProTip
                        icon={<FolderLock />}
                        title="Private by Default"
                        description="Buckets are private by default. You MUST create RLS policies to allow access, otherwise all requests will fail (403)."
                    />
                    <ProTip
                        icon={<Clock />}
                        title="Short-lived URLs"
                        description="For sensitive documents, generate signed URLs with short expiration times (e.g. 60 seconds) to minimize leak risks."
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="pt-10">
                <div className="flex items-center justify-between py-8 border-t border-slate-800">
                    <p className="text-slate-400 text-sm">Was this page helpful?</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 border-slate-800 bg-transparent text-slate-400 hover:text-white hover:bg-slate-800 gap-2">
                            <ThumbsUp className="h-3 w-3" /> Yes
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 border-slate-800 bg-transparent text-slate-400 hover:text-white hover:bg-slate-800 gap-2">
                            <ThumbsDown className="h-3 w-3" /> No
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between pb-10">
                    <Link
                        href="/docs/providers/uploadcare"
                        className="group flex items-center gap-2 text-white font-medium hover:text-emerald-400 transition-colors"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                        Uploadcare
                    </Link>
                </div>
            </div>
        </article>
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
        blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', ring: 'ring-blue-500/20' },
        emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
        teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', ring: 'ring-teal-500/20' },
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`relative flex flex-col items-center p-4 rounded-xl border ${colors.border} ${colors.bg} ${pulse ? 'animate-pulse' : ''}`}>
            <div className={`${colors.text}`}>{icon}</div>
            <div className="text-center mt-2">
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs text-slate-500">{subtitle}</div>
            </div>
        </div>
    );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50">
            <span className="text-emerald-400">{icon}</span>
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
            className="group p-4 rounded-lg border border-slate-800 bg-slate-900/30 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors"
        >
            <div className="flex items-start gap-3">
                <div className="text-slate-400 group-hover:text-emerald-400 transition-colors">
                    {icon}
                </div>
                <div>
                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
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
        <div id={id} className="p-6 rounded-xl border border-slate-800 bg-slate-900/20 space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span>{emoji}</span>
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-slate-400 mt-1">{description}</p>
                )}
            </div>
            {children}
        </div>
    );
}

function ProTip({ icon, title, description }: {
    icon: React.ReactNode;
    title: string;
    description: string
}) {
    return (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-950/50 border border-slate-800">
            <div className="text-emerald-400">
                {icon}
            </div>
            <div>
                <h4 className="font-semibold text-white">{title}</h4>
                <p className="text-sm text-slate-400 mt-1">{description}</p>
            </div>
        </div>
    );
}
