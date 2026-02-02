import { DocsPage, DocsDescription, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { CodeBlock, Callout } from '@/components/fumadocs/components';
import Link from 'next/link';

const tocItems = [
    {
        title: 'Project Setup',
        url: '#project-setup',
        depth: 2,
    },
    {
        title: 'Basic Upload',
        url: '#basic-upload',
        depth: 2,
    },
    {
        title: 'Download Files',
        url: '#download-files',
        depth: 2,
    },
    {
        title: 'List Files',
        url: '#list-files',
        depth: 2,
    },
    {
        title: 'Delete Files',
        url: '#delete-files',
        depth: 2,
    },
    {
        title: 'Error Handling',
        url: '#error-handling',
        depth: 2,
    },
    {
        title: 'Next Steps',
        url: '#next-steps',
        depth: 2,
    },
];

export default function QuickStartPage() {
    return (
        <DocsPage toc={tocItems}>
            <DocsTitle>Quick Start</DocsTitle>
            <DocsDescription>
                Build your first application with ObitoX in 5 minutes
            </DocsDescription>

            <DocsBody>
                <p>
                    This guide will walk you through creating a simple file upload application using the ObitoX SDK.
                    By the end, you'll understand the core concepts and be ready to build more complex features.
                </p>

                <Callout type="info" title="Prerequisites">
                    This guide assumes you've completed the <Link href="/docs-new/installation" className="text-fd-primary hover:underline">installation</Link> and have your API credentials ready.
                </Callout>

                <Steps>
                    <Step>
                        <h3 id="project-setup" className="scroll-m-20">Project Setup</h3>
                        <p>
                            Create a new Next.js project (or use your existing one):
                        </p>
                        <CodeBlock title="Terminal">
                            {`npx create-next-app@latest my-obitox-app
cd my-obitox-app
npm install @obitox/sdk`}
                        </CodeBlock>
                    </Step>

                    <Step>
                        <h3 id="basic-upload" className="scroll-m-20">Basic Upload</h3>
                        <p>
                            Let's create a simple file upload component. Create a new file <code>app/upload/page.tsx</code>:
                        </p>
                        <CodeBlock title="app/upload/page.tsx">
                            {`'use client';

import { useState } from 'react';
import { ObitoX } from '@obitox/sdk';

const obitox = new ObitoX({
  apiKey: process.env.NEXT_PUBLIC_OBITOX_API_KEY!,
  apiSecret: process.env.NEXT_PUBLIC_OBITOX_API_SECRET!,
});

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      const uploadResult = await obitox.upload(file);
      setResult(uploadResult);
      console.log('Upload successful:', uploadResult);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Upload File</h1>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
        className="px-4 py-2 bg-emerald-600 text-white rounded"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}`}
                        </CodeBlock>
                    </Step>

                    <Step>
                        <h3 id="download-files" className="scroll-m-20">Download Files</h3>
                        <p>
                            Once you've uploaded a file, you can download it using its file ID:
                        </p>
                        <CodeBlock title="download.ts">
                            {`async function downloadFile(fileId: string) {
  try {
    const blob = await obitox.download(fileId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'downloaded-file';
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
}`}
                        </CodeBlock>
                    </Step>

                    <Step>
                        <h3 id="list-files" className="scroll-m-20">List Files</h3>
                        <p>
                            Retrieve a list of all files in your storage:
                        </p>
                        <CodeBlock title="list.ts">
                            {`async function listFiles() {
  try {
    const files = await obitox.list({
      limit: 100,
      offset: 0
    });
    console.log('Files:', files);
    return files;
  } catch (error) {
    console.error('List failed:', error);
  }
}`}
                        </CodeBlock>
                    </Step>

                    <Step>
                        <h3 id="delete-files" className="scroll-m-20">Delete Files</h3>
                        <p>
                            Remove files from storage when they're no longer needed:
                        </p>
                        <CodeBlock title="delete.ts">
                            {`async function deleteFile(fileId: string) {
  try {
    await obitox.delete(fileId);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Delete failed:', error);
  }
}`}
                        </CodeBlock>
                    </Step>

                    <Step>
                        <h3 id="error-handling" className="scroll-m-20">Error Handling</h3>
                        <p>
                            Always wrap your SDK calls in try-catch blocks and handle errors appropriately:
                        </p>
                        <CodeBlock title="error-handling.ts">
                            {`try {
  const result = await obitox.upload(file);
  // Handle success
} catch (error) {
  if (error.code === 'QUOTA_EXCEEDED') {
    // Handle quota error
    console.error('Monthly quota exceeded');
  } else if (error.code === 'RATE_LIMIT') {
    // Handle rate limit
    console.error('Too many requests');
  } else {
    // Handle other errors
    console.error('Upload failed:', error.message);
  }
}`}
                        </CodeBlock>
                    </Step>
                </Steps>

                <Callout type="tip" title="You're Ready!">
                    You now have a working file upload application. Explore our advanced guides to learn about image transformations, CDN integration, and more.
                </Callout>

                <h2 id="next-steps" className="scroll-m-20">Next Steps</h2>
                <p>
                    Continue learning with these advanced topics:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><Link href="/docs-new/providers/s3" className="text-fd-primary hover:underline">S3 Provider Configuration</Link> - Advanced S3 settings and optimization</li>
                    <li><Link href="/docs-new/transformations" className="text-fd-primary hover:underline">Image Transformations</Link> - Resize, crop, and optimize images</li>
                    <li><Link href="/docs-new/cdn" className="text-fd-primary hover:underline">CDN Integration</Link> - Deliver files faster with CDN</li>
                    <li><Link href="/docs-new/security" className="text-fd-primary hover:underline">Security Best Practices</Link> - Secure your API keys and uploads</li>
                </ul>

                <div className="h-[200px]"></div>
            </DocsBody>
        </DocsPage>
    );
}
