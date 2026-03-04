'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DocsPage, DocsDescription, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { CodeBlock, Callout } from '@/components/fumadocs/components';
import Link from 'next/link';


const tocItems = [
    {
        title: 'Prerequisites',
        url: '#prerequisites',
        depth: 2,
    },
    {
        title: 'Install',
        url: '#install',
        depth: 2,
    },
    {
        title: 'Initialize',
        url: '#initialize',
        depth: 2,
    },
    {
        title: 'Environment Variables',
        url: '#env',
        depth: 2,
    },
];

// Framework content definitions
const frameworks = [
    { id: 'node', name: 'Node.js', available: true },
    { id: 'next', name: 'Next.js', available: true },
    { id: 'express', name: 'Express', available: true },
    { id: 'python', name: 'Python', available: true },
    { id: 'php', name: 'PHP', available: true },
    { id: 'laravel', name: 'Laravel', available: true },
    { id: 'go', name: 'Go', available: true },
    { id: 'ruby', name: 'Ruby', available: true },
];

const frameworkContent: Record<string, {
    title: string;
    description: string;
    installCommands: { manager: string; command: string }[];
    initCode: string;
    envCode: string;
}> = {
    node: {
        title: 'Node.js',
        description: 'Get the ObitoX Node.js SDK',
        installCommands: [
            { manager: 'npm', command: 'npm install obitox' },
            { manager: 'yarn', command: 'yarn add obitox' },
            { manager: 'pnpm', command: 'pnpm add obitox' },
            { manager: 'bun', command: 'bun add obitox' },
        ],
        initCode: `import ObitoX from 'obitox';
        
const secureClient = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,     // ox_xxx...
  apiSecret: process.env.OBITOX_API_SECRET // sk_xxx...
});`,
        envCode: `# ObitoX API Credentials
OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx`,
    },
    next: {
        title: 'Next.js',
        description: 'Get the ObitoX SDK for Next.js',
        installCommands: [
            { manager: 'npm', command: 'npm install obitox' },
            { manager: 'yarn', command: 'yarn add obitox' },
            { manager: 'pnpm', command: 'pnpm add obitox' },
            { manager: 'bun', command: 'bun add obitox' },
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
    },
    express: {
        title: 'Express',
        description: 'Get the ObitoX SDK for Express.js',
        installCommands: [
            { manager: 'npm', command: 'npm install obitox multer' },
            { manager: 'yarn', command: 'yarn add obitox multer' },
            { manager: 'pnpm', command: 'pnpm add obitox multer' },
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
    },
    python: {
        title: 'Python',
        description: 'Get the ObitoX SDK for Python',
        installCommands: [
            { manager: 'pip', command: 'pip install obitox' },
            { manager: 'poetry', command: 'poetry add obitox' },
            { manager: 'pipenv', command: 'pipenv install obitox' },
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
    },
    php: {
        title: 'PHP',
        description: 'Get the ObitoX SDK for PHP',
        installCommands: [
            { manager: 'composer', command: 'composer require obitox/obitox-php' },
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
    },
    laravel: {
        title: 'Laravel',
        description: 'Get the ObitoX SDK for Laravel',
        installCommands: [
            { manager: 'composer', command: 'composer require obitox/laravel-obitox' },
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
    },
    go: {
        title: 'Go',
        description: 'Get the ObitoX SDK for Go',
        installCommands: [
            { manager: 'go', command: 'go get github.com/obitox/obitox-go' },
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
    },
    ruby: {
        title: 'Ruby',
        description: 'Get the ObitoX SDK for Ruby',
        installCommands: [
            { manager: 'gem', command: 'gem install obitox' },
            { manager: 'bundler', command: 'bundle add obitox' },
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
    },
};

function InstallationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const langParam = searchParams.get('lang');
    const [activeFramework, setActiveFramework] = useState(langParam || 'node');

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
        <DocsPage toc={tocItems}>
            <DocsTitle>Installation</DocsTitle>
            <DocsDescription>
                Get started with the ObitoX SDK in minutes
            </DocsDescription>

            <DocsBody>
                {/* Framework Tabs */}
                <div className="border-b border-zinc-800 mb-6">
                    <div className="flex gap-1 overflow-x-auto pb-px">
                        {frameworks.map((framework) => (
                            <button
                                key={framework.id}
                                onClick={() => handleFrameworkChange(framework.id)}
                                disabled={!framework.available}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeFramework === framework.id
                                    ? 'text-fd-primary border-b-2 border-fd-primary bg-fd-primary/5'
                                    : framework.available
                                        ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                        : 'text-zinc-600 cursor-not-allowed'
                                    }`}
                            >
                                {framework.name}
                                {!framework.available && <span className="ml-1 text-xs">(soon)</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {isAvailable ? (
                    <Steps>
                        <Step>
                            <h3 id="prerequisites" className="scroll-m-20">Prerequisites</h3>
                            <p>Before you begin, you'll need:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>An ObitoX account with API credentials</li>
                                <li><Link href="https://obitox.com/dashboard/api-keys" className="text-fd-primary hover:underline">Create an API key</Link> from your dashboard</li>
                            </ul>
                        </Step>

                        <Step>
                            <h3 id="install" className="scroll-m-20">Install</h3>
                            <p>{content.description}</p>

                            <Tabs
                                items={content.installCommands.map(cmd => cmd.manager)}
                                groupId="package-manager"
                            >
                                {content.installCommands.map((cmd) => (
                                    <Tab key={cmd.manager} value={cmd.manager}>
                                        <CodeBlock title="Terminal">
                                            {cmd.command}
                                        </CodeBlock>
                                    </Tab>
                                ))}
                            </Tabs>
                        </Step>

                        <Step>
                            <h3 id="initialize" className="scroll-m-20">Initialize the Client</h3>
                            <p>Create a new ObitoX client with your API credentials.</p>
                            <CodeBlock title={activeFramework === 'node' || activeFramework === 'next' || activeFramework === 'express' ? 'TypeScript' : activeFramework}>
                                {content.initCode}
                            </CodeBlock>
                        </Step>

                        <Step>
                            <h3 id="env" className="scroll-m-20">Environment Variables</h3>
                            <p>Store your credentials securely in environment variables.</p>
                            <CodeBlock title=".env">
                                {content.envCode}
                            </CodeBlock>

                            <Callout type="warning" title="Security Warning">
                                Never expose your API secret in client-side code or public repositories.
                            </Callout>
                        </Step>
                    </Steps>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-zinc-400 text-lg mb-4">
                            {content?.title || activeFramework} support is coming soon!
                        </p>
                        <p className="text-zinc-500">
                            In the meantime, check out the <button onClick={() => handleFrameworkChange('node')} className="text-fd-primary hover:underline">Node.js guide</button>.
                        </p>
                    </div>
                )}



                <div className="h-[200px]"></div>
            </DocsBody>
        </DocsPage>
    );
}

export default function InstallationPage() {
    return (
        <Suspense fallback={<div className="text-zinc-400">Loading...</div>}>
            <InstallationContent />
        </Suspense>
    );
}
