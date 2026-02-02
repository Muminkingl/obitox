'use client';

import { useState } from 'react';
import { DocsPage, DocsDescription, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { CodeBlock, Callout } from '@/components/fumadocs/components';
import { ImageIcon, Zap, Shield, Globe, Server, ArrowRight, Upload, Download, Trash2, Crop, Sparkles, Activity, Scan, Settings } from 'lucide-react';
import Link from 'next/link';

const tocItems = [
    { title: 'Quick Start', url: '#quick-start', depth: 2 },
    { title: 'Upload Features', url: '#upload-features', depth: 2 },
    { title: 'Virus Scanning', url: '#virus-scanning', depth: 2 },
    { title: 'Transformations', url: '#transformations', depth: 2 },
    { title: 'Download & CDN', url: '#download-urls', depth: 2 },
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

// Uploadcare code examples for each framework
const uploadcareCodeExamples: Record<string, {
    quickStart: string;
    basicUpload: string;
    autoOptimization: string;
    manualOptimization: string;
    progressTracking: string;
    virusScanning: string;
    downloadUrl: string;
    deleteFile: string;
}> = {
    node: {
        quickStart: `import ObitoX from 'obitox';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,
  apiSecret: process.env.OBITOX_API_SECRET
});

const url = await client.uploadFile(file, {
  provider: 'UPLOADCARE',
  uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
  uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY,
  imageOptimization: {
    auto: true  // ✅ Auto WebP + Smart compression
  }
});

console.log('Optimized URL:', url);`,
        basicUpload: `const url = await client.uploadFile(file, {
  provider: 'UPLOADCARE',
  uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
  uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY
});

// https://ucarecdn.com/uuid/photo.jpg`,
        autoOptimization: `const url = await client.uploadFile(file, {
  provider: 'UPLOADCARE',
  uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
  uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY,
  imageOptimization: {
     auto: true  // WebP + smart quality + progressive!
  }
});`,
        manualOptimization: `const url = await client.uploadFile(file, {
  provider: 'UPLOADCARE',
  uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
  uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY,
  imageOptimization: {
    format: 'webp',
    quality: 'best',
    progressive: true,
    stripMeta: 'sensitive',
    adaptiveQuality: true  // AI-powered quality
  }
});`,
        progressTracking: `const url = await client.uploadFile(file, {
  provider: 'UPLOADCARE',
  uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
  uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY,
  
  onProgress: (progress, bytesUploaded, totalBytes) => {
    console.log(\`\${progress.toFixed(1)}% uploaded\`);
  },
  
  onCancel: () => console.log('Upload cancelled')
});`,
        virusScanning: `try {
  const url = await client.uploadFile(file, {
    provider: 'UPLOADCARE',
    uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
    uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY,
    checkVirus: true  // Auto-scan for viruses
  });
  
  console.log('✅ File is clean:', url);
} catch (error) {
  // File was infected and deleted
  console.error('🦠 Virus detected:', error.message);
}`,
        downloadUrl: `const downloadUrl = await client.downloadFile({
  provider: 'UPLOADCARE',
  fileUrl: 'https://ucarecdn.com/uuid/photo.jpg',
  uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY
});`,
        deleteFile: `await client.deleteFile({
  provider: 'UPLOADCARE',
  fileUrl: 'https://ucarecdn.com/uuid/photo.jpg',
  uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
  uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY
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
    provider: 'UPLOADCARE',
    uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
    uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY,
    imageOptimization: { auto: true }
  });
  res.json({ url });
});`,
        basicUpload: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'UPLOADCARE',
    uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
    uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY
  });
  res.json({ url });
});`,
        autoOptimization: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'UPLOADCARE',
    uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
    uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY,
    imageOptimization: { auto: true }
  });
  res.json({ url });
});`,
        manualOptimization: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'UPLOADCARE',
    uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
    uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY,
    imageOptimization: {
      format: 'webp',
      quality: 'best',
      adaptiveQuality: true
    }
  });
  res.json({ url });
});`,
        progressTracking: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'UPLOADCARE',
    uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
    uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY,
    onProgress: (progress) => console.log(\`\${progress}%\`)
  });
  res.json({ url });
});`,
        virusScanning: `app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const url = await client.uploadFile(req.file.buffer, {
      provider: 'UPLOADCARE',
      uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
      uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY,
      checkVirus: true
    });
    res.json({ url });
  } catch (error) {
    res.status(400).json({ error: 'Virus detected' });
  }
});`,
        downloadUrl: `app.get('/download/:uuid', async (req, res) => {
  const downloadUrl = await client.downloadFile({
    provider: 'UPLOADCARE',
    fileUrl: \`https://ucarecdn.com/\${req.params.uuid}/file.jpg\`,
    uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY
  });
  res.redirect(downloadUrl);
});`,
        deleteFile: `app.delete('/file/:uuid', async (req, res) => {
  await client.deleteFile({
    provider: 'UPLOADCARE',
    fileUrl: \`https://ucarecdn.com/\${req.params.uuid}/file.jpg\`,
    uploadcarePublicKey: process.env.UPLOADCARE_PUBLIC_KEY,
    uploadcareSecretKey: process.env.UPLOADCARE_SECRET_KEY
  });
  res.json({ deleted: true });
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
    'provider': 'UPLOADCARE',
    'uploadcare_public_key': os.getenv('UPLOADCARE_PUBLIC_KEY'),
    'uploadcare_secret_key': os.getenv('UPLOADCARE_SECRET_KEY'),
    'image_optimization': {
        'auto': True
    }
})

print(f'Optimized URL: {url}')`,
        basicUpload: `url = client.upload_file(file, {
    'provider': 'UPLOADCARE',
    'uploadcare_public_key': os.getenv('UPLOADCARE_PUBLIC_KEY'),
    'uploadcare_secret_key': os.getenv('UPLOADCARE_SECRET_KEY')
})`,
        autoOptimization: `url = client.upload_file(file, {
    'provider': 'UPLOADCARE',
    'uploadcare_public_key': os.getenv('UPLOADCARE_PUBLIC_KEY'),
    'uploadcare_secret_key': os.getenv('UPLOADCARE_SECRET_KEY'),
    'image_optimization': {
        'auto': True
    }
})`,
        manualOptimization: `url = client.upload_file(file, {
    'provider': 'UPLOADCARE',
    'uploadcare_public_key': os.getenv('UPLOADCARE_PUBLIC_KEY'),
    'uploadcare_secret_key': os.getenv('UPLOADCARE_SECRET_KEY'),
    'image_optimization': {
        'format': 'webp',
        'quality': 'best',
        'progressive': True,
        'adaptive_quality': True
    }
})`,
        progressTracking: `def on_progress(progress, bytes_uploaded, total_bytes):
    print(f'{progress:.1f}% uploaded')

url = client.upload_file(file, {
    'provider': 'UPLOADCARE',
    'uploadcare_public_key': os.getenv('UPLOADCARE_PUBLIC_KEY'),
    'uploadcare_secret_key': os.getenv('UPLOADCARE_SECRET_KEY'),
    'on_progress': on_progress
})`,
        virusScanning: `try:
    url = client.upload_file(file, {
        'provider': 'UPLOADCARE',
        'uploadcare_public_key': os.getenv('UPLOADCARE_PUBLIC_KEY'),
        'uploadcare_secret_key': os.getenv('UPLOADCARE_SECRET_KEY'),
        'check_virus': True
    })
    print(f'✅ File is clean: {url}')
except Exception as e:
    print(f'🦠 Virus detected: {e}')`,
        downloadUrl: `download_url = client.download_file({
    'provider': 'UPLOADCARE',
    'file_url': 'https://ucarecdn.com/uuid/photo.jpg',
    'uploadcare_public_key': os.getenv('UPLOADCARE_PUBLIC_KEY')
})`,
        deleteFile: `client.delete_file({
    'provider': 'UPLOADCARE',
    'file_url': 'https://ucarecdn.com/uuid/photo.jpg',
    'uploadcare_public_key': os.getenv('UPLOADCARE_PUBLIC_KEY'),
    'uploadcare_secret_key': os.getenv('UPLOADCARE_SECRET_KEY')
})`
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
    'provider' => 'UPLOADCARE',
    'uploadcare_public_key' => getenv('UPLOADCARE_PUBLIC_KEY'),
    'uploadcare_secret_key' => getenv('UPLOADCARE_SECRET_KEY'),
    'image_optimization' => ['auto' => true]
]);

echo "Optimized URL: " . $url;`,
        basicUpload: `$url = $client->uploadFile($file, [
    'provider' => 'UPLOADCARE',
    'uploadcare_public_key' => getenv('UPLOADCARE_PUBLIC_KEY'),
    'uploadcare_secret_key' => getenv('UPLOADCARE_SECRET_KEY')
]);`,
        autoOptimization: `$url = $client->uploadFile($file, [
    'provider' => 'UPLOADCARE',
    'uploadcare_public_key' => getenv('UPLOADCARE_PUBLIC_KEY'),
    'uploadcare_secret_key' => getenv('UPLOADCARE_SECRET_KEY'),
    'image_optimization' => ['auto' => true]
]);`,
        manualOptimization: `$url = $client->uploadFile($file, [
    'provider' => 'UPLOADCARE',
    'uploadcare_public_key' => getenv('UPLOADCARE_PUBLIC_KEY'),
    'uploadcare_secret_key' => getenv('UPLOADCARE_SECRET_KEY'),
    'image_optimization' => [
        'format' => 'webp',
        'quality' => 'best',
        'progressive' => true,
        'adaptive_quality' => true
    ]
]);`,
        progressTracking: `$url = $client->uploadFile($file, [
    'provider' => 'UPLOADCARE',
    'uploadcare_public_key' => getenv('UPLOADCARE_PUBLIC_KEY'),
    'uploadcare_secret_key' => getenv('UPLOADCARE_SECRET_KEY'),
    'on_progress' => function($progress) {
        echo number_format($progress, 1) . "% uploaded\\n";
    }
]);`,
        virusScanning: `try {
    $url = $client->uploadFile($file, [
        'provider' => 'UPLOADCARE',
        'uploadcare_public_key' => getenv('UPLOADCARE_PUBLIC_KEY'),
        'uploadcare_secret_key' => getenv('UPLOADCARE_SECRET_KEY'),
        'check_virus' => true
    ]);
    echo "✅ File is clean: " . $url;
} catch (Exception $e) {
    echo "🦠 Virus detected: " . $e->getMessage();
}`,
        downloadUrl: `$downloadUrl = $client->downloadFile([
    'provider' => 'UPLOADCARE',
    'file_url' => 'https://ucarecdn.com/uuid/photo.jpg',
    'uploadcare_public_key' => getenv('UPLOADCARE_PUBLIC_KEY')
]);`,
        deleteFile: `$client->deleteFile([
    'provider' => 'UPLOADCARE',
    'file_url' => 'https://ucarecdn.com/uuid/photo.jpg',
    'uploadcare_public_key' => getenv('UPLOADCARE_PUBLIC_KEY'),
    'uploadcare_secret_key' => getenv('UPLOADCARE_SECRET_KEY')
]);`
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
        Provider:            "UPLOADCARE",
        UploadcarePublicKey: os.Getenv("UPLOADCARE_PUBLIC_KEY"),
        UploadcareSecretKey: os.Getenv("UPLOADCARE_SECRET_KEY"),
        ImageOptimization:   obitox.ImageOptimization{Auto: true},
    })

    fmt.Println("Optimized URL:", url)
}`,
        basicUpload: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:            "UPLOADCARE",
    UploadcarePublicKey: os.Getenv("UPLOADCARE_PUBLIC_KEY"),
    UploadcareSecretKey: os.Getenv("UPLOADCARE_SECRET_KEY"),
})`,
        autoOptimization: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:            "UPLOADCARE",
    UploadcarePublicKey: os.Getenv("UPLOADCARE_PUBLIC_KEY"),
    UploadcareSecretKey: os.Getenv("UPLOADCARE_SECRET_KEY"),
    ImageOptimization:   obitox.ImageOptimization{Auto: true},
})`,
        manualOptimization: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:            "UPLOADCARE",
    UploadcarePublicKey: os.Getenv("UPLOADCARE_PUBLIC_KEY"),
    UploadcareSecretKey: os.Getenv("UPLOADCARE_SECRET_KEY"),
    ImageOptimization: obitox.ImageOptimization{
        Format:          "webp",
        Quality:         "best",
        Progressive:     true,
        AdaptiveQuality: true,
    },
})`,
        progressTracking: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:            "UPLOADCARE",
    UploadcarePublicKey: os.Getenv("UPLOADCARE_PUBLIC_KEY"),
    UploadcareSecretKey: os.Getenv("UPLOADCARE_SECRET_KEY"),
    OnProgress: func(progress float64, uploaded, total int64) {
        fmt.Printf("%.1f%% uploaded\\n", progress)
    },
})`,
        virusScanning: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:            "UPLOADCARE",
    UploadcarePublicKey: os.Getenv("UPLOADCARE_PUBLIC_KEY"),
    UploadcareSecretKey: os.Getenv("UPLOADCARE_SECRET_KEY"),
    CheckVirus:          true,
})

if err != nil {
    fmt.Println("🦠 Virus detected:", err)
} else {
    fmt.Println("✅ File is clean:", url)
}`,
        downloadUrl: `downloadUrl, err := client.DownloadFile(obitox.DownloadOptions{
    Provider:            "UPLOADCARE",
    FileUrl:             "https://ucarecdn.com/uuid/photo.jpg",
    UploadcarePublicKey: os.Getenv("UPLOADCARE_PUBLIC_KEY"),
})`,
        deleteFile: `err := client.DeleteFile(obitox.DeleteOptions{
    Provider:            "UPLOADCARE",
    FileUrl:             "https://ucarecdn.com/uuid/photo.jpg",
    UploadcarePublicKey: os.Getenv("UPLOADCARE_PUBLIC_KEY"),
    UploadcareSecretKey: os.Getenv("UPLOADCARE_SECRET_KEY"),
})`
    },
    ruby: {
        quickStart: `require 'obitox'

client = ObitoX::Client.new(
  api_key: ENV['OBITOX_API_KEY'],
  api_secret: ENV['OBITOX_API_SECRET']
)

File.open('photo.jpg', 'rb') do |file|
  url = client.upload_file(file, {
    provider: 'UPLOADCARE',
    uploadcare_public_key: ENV['UPLOADCARE_PUBLIC_KEY'],
    uploadcare_secret_key: ENV['UPLOADCARE_SECRET_KEY'],
    image_optimization: { auto: true }
  })
  puts "Optimized URL: #{url}"
end`,
        basicUpload: `url = client.upload_file(file, {
  provider: 'UPLOADCARE',
  uploadcare_public_key: ENV['UPLOADCARE_PUBLIC_KEY'],
  uploadcare_secret_key: ENV['UPLOADCARE_SECRET_KEY']
})`,
        autoOptimization: `url = client.upload_file(file, {
  provider: 'UPLOADCARE',
  uploadcare_public_key: ENV['UPLOADCARE_PUBLIC_KEY'],
  uploadcare_secret_key: ENV['UPLOADCARE_SECRET_KEY'],
  image_optimization: { auto: true }
})`,
        manualOptimization: `url = client.upload_file(file, {
  provider: 'UPLOADCARE',
  uploadcare_public_key: ENV['UPLOADCARE_PUBLIC_KEY'],
  uploadcare_secret_key: ENV['UPLOADCARE_SECRET_KEY'],
  image_optimization: {
    format: 'webp',
    quality: 'best',
    progressive: true,
    adaptive_quality: true
  }
})`,
        progressTracking: `url = client.upload_file(file, {
  provider: 'UPLOADCARE',
  uploadcare_public_key: ENV['UPLOADCARE_PUBLIC_KEY'],
  uploadcare_secret_key: ENV['UPLOADCARE_SECRET_KEY'],
  on_progress: ->(progress, uploaded, total) {
    puts "#{progress.round(1)}% uploaded"
  }
})`,
        virusScanning: `begin
  url = client.upload_file(file, {
    provider: 'UPLOADCARE',
    uploadcare_public_key: ENV['UPLOADCARE_PUBLIC_KEY'],
    uploadcare_secret_key: ENV['UPLOADCARE_SECRET_KEY'],
    check_virus: true
  })
  puts "✅ File is clean: #{url}"
rescue => e
  puts "🦠 Virus detected: #{e.message}"
end`,
        downloadUrl: `download_url = client.download_file({
  provider: 'UPLOADCARE',
  file_url: 'https://ucarecdn.com/uuid/photo.jpg',
  uploadcare_public_key: ENV['UPLOADCARE_PUBLIC_KEY']
})`,
        deleteFile: `client.delete_file({
  provider: 'UPLOADCARE',
  file_url: 'https://ucarecdn.com/uuid/photo.jpg',
  uploadcare_public_key: ENV['UPLOADCARE_PUBLIC_KEY'],
  uploadcare_secret_key: ENV['UPLOADCARE_SECRET_KEY']
})`
    }
};

// Framework Tabs Component
function FrameworkTabs({ activeFramework, onSelect }: { activeFramework: string; onSelect: (id: string) => void }) {
    return (
        <div className="border-b border-zinc-200 dark:border-zinc-800 mb-6">
            <div className="flex gap-1 overflow-x-auto pb-px">
                {frameworks.map((framework) => (
                    <button
                        key={framework.id}
                        onClick={() => onSelect(framework.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeFramework === framework.id
                            ? "text-pink-600 dark:text-pink-400 border-b-2 border-pink-600 dark:border-pink-400 bg-pink-50 dark:bg-pink-500/5"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                            }`}
                    >
                        {framework.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function UploadcareProviderPage() {
    const [activeFramework, setActiveFramework] = useState('node');

    const code = uploadcareCodeExamples[activeFramework];
    const currentLang = frameworks.find(f => f.id === activeFramework)?.lang || 'typescript';

    return (
        <DocsPage
            toc={tocItems}
            tableOfContent={{ enabled: true }}
        >
            <DocsTitle>Uploadcare</DocsTitle>
            <DocsDescription>
                Intelligent file CDN with smart image optimization and automatic virus scanning. Transform images on-the-fly without extra infrastructure.
            </DocsDescription>

            <DocsBody>
                {/* Hero Header */}
                <div className="space-y-6 mb-12">
                    <div className="relative">
                        {/* Gradient Background */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-pink-500/10 rounded-2xl blur-2xl" />

                        <div className="relative space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Storage Provider</span>
                                <span className="px-2.5 py-0.5 text-xs font-bold bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 rounded-full flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" />
                                    INTELLIGENT CDN
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute -inset-2 bg-pink-500/20 rounded-xl blur-lg" />
                                    <ImageIcon className="relative h-12 w-12 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                    <h1 className="text-5xl font-bold text-zinc-900 dark:text-white tracking-tight">
                                        Uploadcare
                                    </h1>
                                    <p className="text-sm text-pink-600 dark:text-pink-400 mt-1 font-medium">
                                        Automated image optimization & virus scanning
                                    </p>
                                </div>
                            </div>

                            <p className="text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
                                Intelligent file CDN with <strong className="text-zinc-900 dark:text-white">smart image optimization</strong> and
                                <strong className="text-zinc-900 dark:text-white"> automatic virus scanning</strong>. Transform images on-the-fly without extra infrastructure.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Visual Flow Diagram */}
                <div className="space-y-4 mb-12">
                    <h2 id="how-it-works" className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Activity className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                        How it works
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Files are uploaded to Uploadcare's intelligent CDN, automatically optimized, and scanned for threats before delivery.
                    </p>

                    {/* Enhanced Flow Diagram */}
                    <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50/80 to-zinc-100/50 dark:from-zinc-900/80 dark:to-zinc-800/50 p-6 overflow-hidden max-w-2xl mx-auto">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
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
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500 text-center mt-2">
                                        Uploads file
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="flex flex-col items-center gap-1 px-4">
                                    <ArrowRight className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
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
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500 text-center mt-2">
                                        Optimizes & Scans
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="flex flex-col items-center gap-1 px-4">
                                    <ArrowRight className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                                    <div className="text-[10px] text-pink-600 dark:text-pink-400 font-medium whitespace-nowrap">
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
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500 text-center mt-2">
                                        Served globally
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Features */}
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-700/50">
                                <FeaturePill icon={<ImageIcon />} text="Auto WebP/AVIF" />
                                <FeaturePill icon={<Shield />} text="Virus Scanning" />
                                <FeaturePill icon={<Crop />} text="On-fly Resize" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Framework Tabs */}
                <FrameworkTabs activeFramework={activeFramework} onSelect={setActiveFramework} />

                {/* Quick Start Wizard */}
                <div className="space-y-6 rounded-xl border border-pink-200 dark:border-pink-500/20 bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-500/5 p-8 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20">
                            <Zap className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div>
                            <h2 id="quick-start" className="text-2xl font-bold text-zinc-900 dark:text-white">Quick Start</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Get up and running in 3 steps</p>
                        </div>
                    </div>

                    {/* Step 1 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20">
                                <span className="text-sm font-bold text-pink-600 dark:text-pink-400">1</span>
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Get API Keys</h3>
                        </div>

                        <div className="ml-11 text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
                            <p>Go to <a href="https://uploadcare.com/dashboard/" target="_blank" className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300">Uploadcare Dashboard</a> → Settings → API Keys:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Copy <strong className="text-zinc-900 dark:text-white">Public Key</strong> (safe for client-side)</li>
                                <li>Copy <strong className="text-zinc-900 dark:text-white">Secret Key</strong> (keep private, needed for virus scanning)</li>
                            </ul>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20">
                                <span className="text-sm font-bold text-pink-600 dark:text-pink-400">2</span>
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Configure Environment</h3>
                        </div>

                        <div className="ml-11">
                            <CodeBlock
                                title=".env"
                            >{`OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx
UPLOADCARE_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxx
UPLOADCARE_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}</CodeBlock>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20">
                                <span className="text-sm font-bold text-pink-600 dark:text-pink-400">3</span>
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Upload with Optimization</h3>
                        </div>

                        <div className="ml-11">
                            <CodeBlock
                                title={currentLang}
                            >{code.quickStart}</CodeBlock>
                        </div>
                    </div>
                </div>

                {/* Operations Grid */}
                <div className="space-y-6 mb-12">
                    <h2 id="operations" className="text-2xl font-bold text-zinc-900 dark:text-white">Operations</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <OperationCard
                            icon={<Upload />}
                            title="Smart Upload"
                            description="Upload with auto-optimization"
                            href="#upload-features"
                        />
                        <OperationCard
                            icon={<Crop />}
                            title="Transformations"
                            description="Resize, crop, and filter on-the-fly"
                            href="#transformations"
                        />
                        <OperationCard
                            icon={<Shield />}
                            title="Virus Scanning"
                            description="Detect and delete infected files"
                            href="#virus-scanning"
                        />
                        <OperationCard
                            icon={<Globe />}
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
                <div className="space-y-6 mb-12">
                    <div id="upload-features" className="flex items-center gap-3">
                        <Upload className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Upload Features</h2>
                    </div>

                    {/* Basic Upload */}
                    <OperationSection id="basic-upload" title="Basic Upload" emoji="📤">
                        <CodeBlock
                            title={currentLang}
                        >{code.basicUpload}</CodeBlock>
                    </OperationSection>

                    {/* Auto Optimization */}
                    <OperationSection
                        id="image-optimization"
                        title="Auto Image Optimization"
                        emoji="✨"
                        description="Automatically convert to WebP/AVIF and optimize quality"
                    >
                        <CodeBlock
                            title={currentLang}
                        >{code.autoOptimization}</CodeBlock>
                    </OperationSection>

                    {/* Manual Optimization */}
                    <OperationSection
                        id="manual-optimization"
                        title="Manual Optimization"
                        emoji="🛠️"
                        description="Fine-tune compression and format settings"
                    >
                        <CodeBlock
                            title={currentLang}
                        >{code.manualOptimization}</CodeBlock>
                        <div className="mt-4 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                                    <tr>
                                        <th className="text-left p-3 text-zinc-900 dark:text-white font-semibold">Option</th>
                                        <th className="text-left p-3 text-zinc-900 dark:text-white font-semibold">Values</th>
                                        <th className="text-left p-3 text-zinc-900 dark:text-white font-semibold">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                        <td className="p-3"><code className="text-pink-600 dark:text-pink-400">format</code></td>
                                        <td className="p-3 text-zinc-600 dark:text-zinc-400">auto, webp, jpeg, png</td>
                                        <td className="p-3 text-zinc-600 dark:text-zinc-400">Output image format</td>
                                    </tr>
                                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                        <td className="p-3"><code className="text-pink-600 dark:text-pink-400">quality</code></td>
                                        <td className="p-3 text-zinc-600 dark:text-zinc-400">lightest to best</td>
                                        <td className="p-3 text-zinc-600 dark:text-zinc-400">Compression level</td>
                                    </tr>
                                    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                        <td className="p-3"><code className="text-pink-600 dark:text-pink-400">adaptiveQuality</code></td>
                                        <td className="p-3 text-zinc-600 dark:text-zinc-400">true/false</td>
                                        <td className="p-3 text-zinc-600 dark:text-zinc-400">AI quality optimization</td>
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
                        <CodeBlock
                            title={currentLang}
                        >{code.progressTracking}</CodeBlock>
                    </OperationSection>
                </div>

                {/* Virus Scanning */}
                <div className="space-y-6 mb-12">
                    <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                        <h2 id="virus-scanning" className="text-2xl font-bold text-zinc-900 dark:text-white">Virus Scanning</h2>
                    </div>

                    <OperationSection
                        id="scan-delete"
                        title="Scan & Delete"
                        emoji="🦠"
                        description="Automatically detect and remove infected files"
                    >
                        <CodeBlock
                            title={currentLang}
                        >{code.virusScanning}</CodeBlock>
                        <Callout type="warning" title="Security">
                            Infected files are automatically deleted from storage to protect your users.
                        </Callout>
                    </OperationSection>
                </div>

                {/* Transformations */}
                <div className="space-y-6 mb-12">
                    <div className="flex items-center gap-3">
                        <Crop className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        <h2 id="transformations" className="text-2xl font-bold text-zinc-900 dark:text-white">On-the-fly Transformations</h2>
                    </div>

                    <OperationSection
                        id="url-based-processing"
                        title="URL-Based Processing"
                        emoji="🎨"
                        description="Transform images just by changing the URL"
                    >
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Resize</h4>
                                <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-950 font-mono text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 break-all">
                                    https://ucarecdn.com/uuid/<span className="text-purple-600 dark:text-purple-400">-/resize/800x600/</span>photo.jpg
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Convert Format</h4>
                                <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-950 font-mono text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 break-all">
                                    https://ucarecdn.com/uuid/<span className="text-purple-600 dark:text-purple-400">-/format/webp/</span>photo.jpg
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Crop & Quality</h4>
                                <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-950 font-mono text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 break-all">
                                    https://ucarecdn.com/uuid/<span className="text-purple-600 dark:text-purple-400">-/crop/300x300/center/-/quality/best/</span>photo.jpg
                                </div>
                            </div>
                        </div>
                    </OperationSection>
                </div>

                {/* Download & Delete */}
                <div className="space-y-6 mb-12">
                    <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        <h2 id="download-urls" className="text-2xl font-bold text-zinc-900 dark:text-white">Download & CDN</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <OperationSection
                            id="get-cdn-url"
                            title="Get CDN URL"
                            emoji="🌍"
                            description="Publicly accessible CDN link"
                        >
                            <CodeBlock
                                title={currentLang}
                            >{code.downloadUrl}</CodeBlock>
                        </OperationSection>

                        <OperationSection
                            id="delete-files"
                            title="Delete File"
                            emoji="🗑️"
                        >
                            <CodeBlock
                                title={currentLang}
                            >{code.deleteFile}</CodeBlock>
                        </OperationSection>
                    </div>
                </div>

                {/* Pro Tips */}
                <div className="rounded-xl border border-pink-200 dark:border-pink-500/20 bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-500/5 p-8 mb-12">
                    <h3 id="pro-tips" className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        Pro Tips for Production
                    </h3>

                    <div className="space-y-4">
                        <ProTip
                            icon={<Activity />}
                            title="Use Adaptive Quality"
                            description="Enable 'adaptiveQuality: true' to let AI determine the best compression ratio for each image without visible quality loss."
                        />
                        <ProTip
                            icon={<Shield />}
                            title="Mandatory Virus Check"
                            description="For user-generated content platforms, always enable 'checkVirus: true' to prevent malware distribution."
                        />
                        <ProTip
                            icon={<Globe />}
                            title="CDN Transformations"
                            description="Apply transformations via URL params for consistent delivery without re-processing. E.g., /-/resize/200x200/-/format/webp/"
                        />
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="pt-10">
                    <div className="flex items-center justify-between pb-10">
                        <Link
                            href="/docs-new/providers/supabase"
                            className="group flex items-center gap-2 text-zinc-900 dark:text-white font-medium hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                        >
                            <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                            Supabase
                        </Link>
                        <Link
                            href="/docs-new/providers/s3"
                            className="group flex items-center gap-2 text-zinc-900 dark:text-white font-medium hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                        >
                            Amazon S3
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
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
        emerald: { bg: 'bg-emerald-100 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/20' },
        amber: { bg: 'bg-amber-100 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/30', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-500/20' },
        pink: { bg: 'bg-pink-100 dark:bg-pink-500/10', border: 'border-pink-200 dark:border-pink-500/30', text: 'text-pink-600 dark:text-pink-400', ring: 'ring-pink-500/20' },
    };

    const colors = colorClasses[color] || colorClasses.emerald;

    return (
        <div className={`relative flex flex-col items-center p-4 rounded-xl border ${colors.border} ${colors.bg} ${pulse ? 'animate-pulse' : ''}`}>
            <div className={`${colors.text}`}>{icon}</div>
            <div className="text-center mt-2">
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-500">{subtitle}</div>
            </div>
        </div>
    );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
            <span className="text-pink-600 dark:text-pink-400 [&>svg]:h-3 [&>svg]:w-3">{icon}</span>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{text}</span>
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
            className="group p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-pink-300 dark:hover:border-pink-500/30 hover:bg-pink-50/50 dark:hover:bg-pink-500/5 transition-colors"
        >
            <div className="flex items-start gap-3">
                <div className="text-zinc-500 dark:text-zinc-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors [&>svg]:h-5 [&>svg]:w-5">
                    {icon}
                </div>
                <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
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
        <div id={id} className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <span>{emoji}</span>
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{description}</p>
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
        <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800">
            <div className="text-pink-600 dark:text-pink-400 [&>svg]:h-5 [&>svg]:w-5">
                {icon}
            </div>
            <div>
                <h4 className="font-semibold text-zinc-900 dark:text-white">{title}</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{description}</p>
            </div>
        </div>
    );
}
