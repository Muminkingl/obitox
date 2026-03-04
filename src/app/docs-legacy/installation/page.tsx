"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/docs/code-block";

// Framework content definitions
const frameworks = [
    { id: "node", name: "Node.js", available: true },
    { id: "next", name: "Next.js", available: true },
    { id: "express", name: "Express", available: true },
    { id: "python", name: "Python", available: true },
    { id: "php", name: "PHP", available: true },
    { id: "laravel", name: "Laravel", available: true },
    { id: "go", name: "Go", available: true },
    { id: "ruby", name: "Ruby", available: true },
];

const frameworkContent: Record<string, {
    title: string;
    description: string;
    installCommands: { manager: string; command: string }[];
    initCode: string;
    envCode: string;
    verifyCode: string;
}> = {
    node: {
        title: "Node.js",
        description: "Get the ObitoX Node.js SDK",
        installCommands: [
            { manager: "npm", command: "npm install obitox" },
            { manager: "yarn", command: "yarn add obitox" },
            { manager: "pnpm", command: "pnpm add obitox" },
            { manager: "bun", command: "bun add obitox" },
        ],
        initCode: `import ObitoX from 'obitox';
        
const secureClient = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,     // ox_xxx...
  apiSecret: process.env.OBITOX_API_SECRET // sk_xxx...
});`,
        envCode: `# ObitoX API Credentials
OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx
`,
        verifyCode: `import ObitoX from 'obitox';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY
});

// Test your setup
async function verify() {
  const result = await client.upload(
    new File(['Hello ObitoX!'], 'test.txt')
  );
  console.log('Upload successful:', result.url);
}

verify();`,
    },
    next: {
        title: "Next.js",
        description: "Get the ObitoX SDK for Next.js",
        installCommands: [
            { manager: "npm", command: "npm install obitox" },
            { manager: "yarn", command: "yarn add obitox" },
            { manager: "pnpm", command: "pnpm add obitox" },
            { manager: "bun", command: "bun add obitox" },
        ],
        initCode: `// lib/obitox.ts
import ObitoX from 'obitox';

// Server-side client (use in API routes, Server Components)
export const obitox = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY!,
  apiSecret: process.env.OBITOX_API_SECRET!
});`,
        envCode: `# .env.local
OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx

# Provider credentials
UPLOADCARE_PUBLIC_KEY=your-public-key
UPLOADCARE_SECRET_KEY=your-secret-key`,
        verifyCode: `// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { obitox } from '@/lib/obitox';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  const result = await obitox.upload(file);
  
  return NextResponse.json({ url: result.url });
}`,
    },
    express: {
        title: "Express",
        description: "Get the ObitoX SDK for Express.js",
        installCommands: [
            { manager: "npm", command: "npm install obitox multer" },
            { manager: "yarn", command: "yarn add obitox multer" },
            { manager: "pnpm", command: "pnpm add obitox multer" },
        ],
        initCode: `// server.js
import express from 'express';
import multer from 'multer';
import ObitoX from 'obitox';

const app = express();
const upload = multer();

const obitox = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,
  apiSecret: process.env.OBITOX_API_SECRET
});`,
        envCode: `# .env
OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx
PORT=3000`,
        verifyCode: `// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const result = await obitox.uploadFile(file.buffer, {
      provider: 'UPLOADCARE',
      filename: file.originalname,
      contentType: file.mimetype
    });
    
    res.json({ url: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log('Server running on port', process.env.PORT);
});`,
    },
    python: {
        title: "Python",
        description: "Get the ObitoX SDK for Python",
        installCommands: [
            { manager: "pip", command: "pip install obitox" },
            { manager: "poetry", command: "poetry add obitox" },
            { manager: "pipenv", command: "pipenv install obitox" },
        ],
        initCode: `# obitox_client.py
from obitox import ObitoX
import os

client = ObitoX(
    api_key=os.getenv('OBITOX_API_KEY'),
    api_secret=os.getenv('OBITOX_API_SECRET')
)`,
        envCode: `# .env
OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx

# Provider credentials
UPLOADCARE_PUBLIC_KEY=your-public-key
UPLOADCARE_SECRET_KEY=your-secret-key`,
        verifyCode: `# upload_example.py
from obitox import ObitoX
import os

client = ObitoX(
    api_key=os.getenv('OBITOX_API_KEY'),
    api_secret=os.getenv('OBITOX_API_SECRET')
)

# Upload a file
with open('image.jpg', 'rb') as f:
    result = client.upload_file(
        file=f,
        provider='UPLOADCARE',
        uploadcare_public_key=os.getenv('UPLOADCARE_PUBLIC_KEY')
    )
    
print(f'Uploaded: {result.url}')`,
    },
    php: {
        title: "PHP",
        description: "Get the ObitoX SDK for PHP",
        installCommands: [
            { manager: "composer", command: "composer require obitox/obitox-php" },
        ],
        initCode: `<?php
// obitox.php
require_once 'vendor/autoload.php';

use ObitoX\\ObitoXClient;

$client = new ObitoXClient([
    'api_key' => getenv('OBITOX_API_KEY'),
    'api_secret' => getenv('OBITOX_API_SECRET')
]);`,
        envCode: `# .env
OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx

# Provider credentials
UPLOADCARE_PUBLIC_KEY=your-public-key
UPLOADCARE_SECRET_KEY=your-secret-key`,
        verifyCode: `<?php
// upload.php
require_once 'obitox.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    
    $result = $client->uploadFile([
        'file' => $file['tmp_name'],
        'filename' => $file['name'],
        'provider' => 'UPLOADCARE',
        'uploadcare_public_key' => getenv('UPLOADCARE_PUBLIC_KEY')
    ]);
    
    echo json_encode(['url' => $result->url]);
}`,
    },
    laravel: {
        title: "Laravel",
        description: "Get the ObitoX SDK for Laravel",
        installCommands: [
            { manager: "composer", command: "composer require obitox/laravel-obitox" },
        ],
        initCode: `// config/obitox.php (auto-published)
return [
    'api_key' => env('OBITOX_API_KEY'),
    'api_secret' => env('OBITOX_API_SECRET'),
];`,
        envCode: `# .env
OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx

# Provider credentials
UPLOADCARE_PUBLIC_KEY=your-public-key
UPLOADCARE_SECRET_KEY=your-secret-key`,
        verifyCode: `<?php
// app/Http/Controllers/UploadController.php
namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use ObitoX\\Facades\\ObitoX;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['file' => 'required|file|max:10240']);
        
        $result = ObitoX::uploadFile(
            $request->file('file'),
            [
                'provider' => 'UPLOADCARE',
                'uploadcare_public_key' => config('services.uploadcare.public_key')
            ]
        );
        
        return response()->json(['url' => $result->url]);
    }
}`,
    },
    go: {
        title: "Go",
        description: "Get the ObitoX SDK for Go",
        installCommands: [
            { manager: "go", command: "go get github.com/obitox/obitox-go" },
        ],
        initCode: `// main.go
package main

import (
    "os"
    obitox "github.com/obitox/obitox-go"
)

func main() {
    client := obitox.NewClient(
        os.Getenv("OBITOX_API_KEY"),
        os.Getenv("OBITOX_API_SECRET"),
    )
}`,
        envCode: `# .env
OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx

# Provider credentials
UPLOADCARE_PUBLIC_KEY=your-public-key
UPLOADCARE_SECRET_KEY=your-secret-key`,
        verifyCode: `// Upload handler
func uploadHandler(w http.ResponseWriter, r *http.Request) {
    file, header, err := r.FormFile("file")
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    defer file.Close()

    result, err := client.UploadFile(file, obitox.UploadOptions{
        Provider: "UPLOADCARE",
        Filename: header.Filename,
        UploadcarePublicKey: os.Getenv("UPLOADCARE_PUBLIC_KEY"),
    })
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(map[string]string{"url": result.URL})
}`,
    },
    ruby: {
        title: "Ruby",
        description: "Get the ObitoX SDK for Ruby",
        installCommands: [
            { manager: "gem", command: "gem install obitox" },
            { manager: "bundler", command: "bundle add obitox" },
        ],
        initCode: `# obitox.rb
require 'obitox'

client = ObitoX::Client.new(
  api_key: ENV['OBITOX_API_KEY'],
  api_secret: ENV['OBITOX_API_SECRET']
)`,
        envCode: `# .env
OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx

# Provider credentials
UPLOADCARE_PUBLIC_KEY=your-public-key
UPLOADCARE_SECRET_KEY=your-secret-key`,
        verifyCode: `# upload_controller.rb (Rails example)
class UploadsController < ApplicationController
  def create
    file = params[:file]
    
    result = client.upload_file(
      file: file.tempfile,
      filename: file.original_filename,
      provider: 'UPLOADCARE',
      uploadcare_public_key: ENV['UPLOADCARE_PUBLIC_KEY']
    )
    
    render json: { url: result.url }
  rescue ObitoX::Error => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end`,
    },
};

function InstallationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const langParam = searchParams.get("lang");
    const [activeFramework, setActiveFramework] = useState(langParam || "node");
    const [activeManager, setActiveManager] = useState("npm");

    // Update when URL changes
    useEffect(() => {
        if (langParam && frameworks.some(f => f.id === langParam)) {
            setActiveFramework(langParam);
        }
    }, [langParam]);

    const content = frameworkContent[activeFramework] || frameworkContent.node;
    const isAvailable = frameworks.find(f => f.id === activeFramework)?.available;

    const handleFrameworkChange = (frameworkId: string) => {
        setActiveFramework(frameworkId);
        router.push(`/docs/installation?lang=${frameworkId}`, { scroll: false });
    };

    return (
        <article className="max-w-4xl space-y-10">
            {/* Header */}
            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <span className="text-sm font-medium text-emerald-400">Getting Started</span>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Installation</h1>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8 border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-xl text-slate-400 font-light">
                    Get started with the ObitoX SDK in minutes
                </p>
            </div>

            {/* Framework Tabs */}
            <div className="border-b border-slate-800">
                <div className="flex gap-1 overflow-x-auto pb-px">
                    {frameworks.map((framework) => (
                        <button
                            key={framework.id}
                            onClick={() => handleFrameworkChange(framework.id)}
                            disabled={!framework.available}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeFramework === framework.id
                                ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5"
                                : framework.available
                                    ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    : "text-slate-600 cursor-not-allowed"
                                }`}
                        >
                            {framework.name}
                            {!framework.available && <span className="ml-1 text-xs">(soon)</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {isAvailable ? (
                <div className="prose prose-invert max-w-none prose-p:text-slate-400 prose-headings:text-white prose-a:text-emerald-400 prose-strong:text-white prose-code:text-emerald-400 prose-code:bg-emerald-400/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">

                    {/* Prerequisites */}
                    <h2 id="prerequisites">Prerequisites</h2>
                    <p>Before you begin, you'll need:</p>
                    <ul className="text-slate-400">
                        <li>An ObitoX account with API credentials</li>
                        <li><Link href="https://obitox.com/dashboard/api-keys" className="text-emerald-400">Create an API key</Link> from your dashboard</li>
                    </ul>

                    {/* Install */}
                    <h2 id="install">1. Install</h2>
                    <p>{content.description}</p>

                    {/* Package Manager Tabs */}
                    <div className="not-prose my-6">
                        <CodeBlock
                            code={content.installCommands.find(c => c.manager === activeManager)?.command || ""}
                            language="bash"
                            tabs={content.installCommands.map(cmd => ({
                                name: cmd.manager,
                                isActive: activeManager === cmd.manager,
                                onClick: () => setActiveManager(cmd.manager)
                            }))}
                        />
                    </div>

                    {/* Initialize */}
                    <h2 id="initialize">2. Initialize the Client</h2>
                    <p>Create a new ObitoX client with your API credentials.</p>
                    <div className="not-prose my-6">
                        <CodeBlock code={content.initCode} language="typescript" />
                    </div>

                    {/* Environment Variables */}
                    <h2 id="env">Environment Variables</h2>
                    <p>Store your credentials securely in environment variables.</p>
                    <div className="not-prose my-6">
                        <CodeBlock code={content.envCode} language="bash" />
                    </div>

                    {/* Security Warning */}
                    <div className="not-prose my-6 p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
                        <div className="flex gap-3">
                            <div className="text-amber-400 flex-shrink-0 mt-0.5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-amber-400 font-semibold text-sm mb-1">Warning</h4>
                                <p className="text-amber-200/80 text-sm">
                                    Never expose your API secret in client-side code or public repositories.
                                </p>
                            </div>
                        </div>
                    </div>


                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-slate-400 text-lg mb-4">
                        {content?.title || activeFramework} support is coming soon!
                    </p>
                    <p className="text-slate-500">
                        In the meantime, check out the <button onClick={() => handleFrameworkChange("node")} className="text-emerald-400 hover:underline">Node.js guide</button>.
                    </p>
                </div>
            )}

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
                        href="/docs"
                        className="group flex items-center gap-2 text-white font-medium hover:text-emerald-400 transition-colors"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                        Introduction
                    </Link>
                    <Link
                        href="/docs/providers/s3"
                        className="group flex items-center gap-2 text-white font-medium hover:text-emerald-400 transition-colors"
                    >
                        Amazon S3
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </article>
    );
}



export default function InstallationPage() {
    return (
        <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
            <InstallationContent />
        </Suspense>
    );
}
