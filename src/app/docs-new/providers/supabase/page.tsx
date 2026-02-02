'use client';

import { useState } from 'react';
import { DocsPage, DocsDescription, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { CodeBlock, Callout } from '@/components/fumadocs/components';
import { Database, Zap, Shield, Lock, Server, ArrowRight, Upload, Download, HardDrive, Key, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

const tocItems = [
    { title: 'Quick Start', url: '#quick-start', depth: 2 },
    { title: 'Upload Features', url: '#upload-features', depth: 2 },
    { title: 'Download & Access', url: '#download-files', depth: 2 },
    { title: 'Bucket Management', url: '#bucket-management', depth: 2 },
    { title: 'RLS Policies', url: '#rls-policies', depth: 2 },
    { title: 'Pro Tips', url: '#pro-tips', depth: 2 },
];

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

export default function SupabaseProviderPage() {
    const [activeFramework, setActiveFramework] = useState('node');
    const code = supabaseCodeExamples[activeFramework];
    const currentLang = frameworks.find(f => f.id === activeFramework)?.lang || 'typescript';

    return (
        <DocsPage toc={tocItems}>
            <DocsTitle>Supabase Storage</DocsTitle>
            <DocsDescription>
                Postgres-integrated object storage with Row Level Security (RLS) policies.
            </DocsDescription>

            <DocsBody>
                {/* Hero Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Database className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-emerald-400">Storage Provider</span>
                            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                SQL INTEGRATED
                            </span>
                        </div>
                        <p className="text-sm text-emerald-400 mt-1 font-medium">
                            Postgres-integrated object storage with RLS.
                        </p>
                    </div>
                </div>

                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    S3-compatible object storage tightly integrated with your <strong className="text-white">PostgreSQL database</strong>.
                    Secure your files with <strong className="text-white">Row Level Security (RLS)</strong> policies.
                </p>

                {/* Quick Start Section */}
                <h2 id="quick-start" className="scroll-m-20">Quick Start</h2>

                <p>Secure storage in 3 steps:</p>

                {/* Framework Tabs */}
                <div className="border-b border-zinc-800 mb-6">
                    <div className="flex gap-1 overflow-x-auto pb-px">
                        {frameworks.map((framework) => (
                            <button
                                key={framework.id}
                                onClick={() => setActiveFramework(framework.id)}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeFramework === framework.id
                                    ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                    }`}
                            >
                                {framework.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 1 */}
                <h3 id="get-project-details" className="scroll-m-20">1. Get Project Details</h3>
                <p>Go to <a href="https://supabase.com/dashboard" target="_blank" className="text-emerald-400 hover:underline">Supabase Dashboard</a> → Project Settings → API:</p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400 ml-4 mb-4">
                    <li>Copy <strong className="text-white">Project URL</strong></li>
                    <li>Copy <strong className="text-white">service_role</strong> secret (required for server-side uploads)</li>
                </ul>

                {/* Step 2 */}
                <h3 id="create-bucket-policies" className="scroll-m-20">2. Create Bucket & Policies</h3>
                <p>In Storage Dashboard:</p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-400 ml-4 mb-4">
                    <li>Create a bucket (e.g. <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono text-xs">avatars</code>)</li>
                    <li>Make it <strong className="text-white">Public</strong> for easy read access</li>
                </ol>

                {/* Step 3 */}
                <h3 id="upload-file" className="scroll-m-20">3. Upload File</h3>
                <CodeBlock title={`Quick Start (${currentLang})`}>
                    {code.quickStart}
                </CodeBlock>

                <Callout type="warning" title="Service Role Key Safety">
                    Your service role key bypasses RLS. Never expose it in client-side code. Use it only in secure server environments.
                </Callout>

                {/* Upload Features Section */}
                <h2 id="upload-features" className="scroll-m-20">Upload Features</h2>

                <h3 id="public-bucket-upload" className="scroll-m-20">Public Bucket Upload</h3>
                <CodeBlock title={currentLang}>
                    {code.publicUpload}
                </CodeBlock>

                <h3 id="private-buckets" className="scroll-m-20">Private Bucket Upload</h3>
                <p>Generates a signed URL automatically:</p>
                <CodeBlock title={currentLang}>
                    {code.privateUpload}
                </CodeBlock>

                <h3 id="progress-tracking" className="scroll-m-20">Progress Tracking</h3>
                <p>Monitor upload progress in real-time:</p>
                <CodeBlock title={currentLang}>
                    {code.progressTracking}
                </CodeBlock>

                <h3 id="cancel-upload" className="scroll-m-20">Cancel Upload</h3>
                <p>Allow users to cancel in-progress uploads:</p>
                <CodeBlock title={currentLang}>
                    {code.cancelUpload}
                </CodeBlock>

                {/* Download & Access */}
                <h2 id="download-files" className="scroll-m-20">Download & Access</h2>

                <h3 id="public-file-access" className="scroll-m-20">Public File Access</h3>
                <p>Direct access for public buckets:</p>
                <CodeBlock title={currentLang}>
                    {code.publicAccess}
                </CodeBlock>

                <h3 id="private-file-signed-url" className="scroll-m-20">Private File (Signed URL)</h3>
                <p>Secure time-limited access:</p>
                <CodeBlock title={currentLang}>
                    {code.privateSignedUrl}
                </CodeBlock>

                {/* Bucket Management */}
                <h2 id="bucket-management" className="scroll-m-20">Bucket Management</h2>

                <h3 id="list-all-buckets" className="scroll-m-20">List All Buckets</h3>
                <CodeBlock title={currentLang}>
                    {code.listBuckets}
                </CodeBlock>

                {/* RLS Section */}
                <h2 id="rls-policies" className="scroll-m-20">Row Level Security (RLS)</h2>

                <div className="flex items-start gap-4 mb-6">
                    <Database className="h-6 w-6 text-emerald-400 mt-1" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">Fine-grained Access Control</h3>
                        <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                            Supabase Storage relies on PostgreSQL RLS policies to determine who can access what.
                            Unlike other providers where you manage keys, here you manage <strong className="text-white">policies</strong>.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Public Read Access</h4>
                        <CodeBlock title="SQL">
                            {`CREATE POLICY "Public Read"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');`}
                        </CodeBlock>
                    </div>
                    <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">User Owns File</h4>
                        <CodeBlock title="SQL">
                            {`CREATE POLICY "User Access"
ON storage.objects FOR SELECT
USING (auth.uid() = owner);`}
                        </CodeBlock>
                    </div>
                </div>

                {/* Pro Tips */}
                <h2 id="pro-tips" className="scroll-m-20">Pro Tips for Production</h2>

                <div className="space-y-4 my-6">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                            <Key className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-1">Service Role Key Safety</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">Your service role key bypasses RLS. Never expose it in client-side code. Use it only in secure server environments.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                            <Lock className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-1">Private by Default</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">Buckets are private by default. You MUST create RLS policies to allow access, otherwise all requests will fail (403).</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                            <Clock className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-1">Short-lived URLs</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">For sensitive documents, generate signed URLs with short expiration times (e.g. 60 seconds) to minimize leak risks.</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-8 border-t border-zinc-800">
                    <Link
                        href="/docs-new/providers/r2"
                        className="group flex items-center gap-2 text-white font-medium hover:text-fd-primary transition-colors"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                        Cloudflare R2
                    </Link>
                    <Link
                        href="/docs-new/providers/uploadcare"
                        className="group flex items-center gap-2 text-white font-medium hover:text-fd-primary transition-colors"
                    >
                        Uploadcare
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="h-[200px]"></div>
            </DocsBody>
        </DocsPage>
    );
}
