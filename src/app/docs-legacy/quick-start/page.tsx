import { Copy, Rocket, FileUp, Download, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CodeBlock } from "@/components/docs/code-block";

export default function QuickStartPage() {
  return (
    <article className="max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-8">
        <span className="text-emerald-400 text-sm font-medium">Getting Started</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">Quick Start</h1>
          <p className="text-xl text-slate-400">Build your first application with ObitoX in 5 minutes.</p>
        </div>
        <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800/30 hover:bg-slate-800 text-slate-300">
          <Copy className="h-4 w-4 mr-2" />
          Copy page
        </Button>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-800 my-8" />

      {/* Content */}
      <div className="prose prose-invert max-w-none prose-p:text-slate-400 prose-headings:text-white prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-emerald-400 prose-code:bg-emerald-400/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-ul:text-slate-400 prose-li:text-slate-400">

        <p>
          This guide will walk you through creating a simple file upload application using the ObitoX SDK.
          By the end, you'll understand the core concepts and be ready to build more complex features.
        </p>

        <div className="not-prose my-6 p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
          <div className="flex gap-3">
            <div className="text-blue-400 flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-blue-400 font-semibold text-sm mb-1">Prerequisites</h4>
              <p className="text-blue-200/80 text-sm">
                This guide assumes you've completed the <Link href="/docs/installation" className="text-emerald-400 hover:underline">installation</Link> and have your API credentials ready.
              </p>
            </div>
          </div>
        </div>

        <h2 id="project-setup">Project Setup</h2>
        <p>
          Create a new Next.js project (or use your existing one):
        </p>
        <CodeBlock
          code="npx create-next-app@latest my-obitox-app\ncd my-obitox-app\nnpm install @obitox/sdk"
          language="bash"
        />

        <h2 id="basic-upload">Basic Upload</h2>
        <p>
          Let's create a simple file upload component. Create a new file <code>app/upload/page.tsx</code>:
        </p>
        <CodeBlock
          code={`'use client';\n\nimport { useState } from 'react';\nimport { ObitoX } from '@obitox/sdk';\n\nconst obitox = new ObitoX({\n  apiKey: process.env.NEXT_PUBLIC_OBITOX_API_KEY!,\n  apiSecret: process.env.NEXT_PUBLIC_OBITOX_API_SECRET!,\n});\n\nexport default function UploadPage() {\n  const [file, setFile] = useState<File | null>(null);\n  const [uploading, setUploading] = useState(false);\n  const [result, setResult] = useState<any>(null);\n\n  const handleUpload = async () => {\n    if (!file) return;\n    \n    setUploading(true);\n    try {\n      const uploadResult = await obitox.upload(file);\n      setResult(uploadResult);\n      console.log('Upload successful:', uploadResult);\n    } catch (error) {\n      console.error('Upload failed:', error);\n    } finally {\n      setUploading(false);\n    }\n  };\n\n  return (\n    <div className="p-8">\n      <h1 className="text-2xl font-bold mb-4">Upload File</h1>\n      <input \n        type="file" \n        onChange={(e) => setFile(e.target.files?.[0] || null)}\n        className="mb-4"\n      />\n      <button \n        onClick={handleUpload} \n        disabled={!file || uploading}\n        className="px-4 py-2 bg-emerald-600 text-white rounded"\n      >\n        {uploading ? 'Uploading...' : 'Upload'}\n      </button>\n      {result && (\n        <pre className="mt-4 p-4 bg-gray-100 rounded">\n          {JSON.stringify(result, null, 2)}\n        </pre>\n      )}\n    </div>\n  );\n}`}
          language="typescript"
        />

        <h2 id="download-files">Download Files</h2>
        <p>
          Once you've uploaded a file, you can download it using its file ID:
        </p>
        <CodeBlock
          code={`async function downloadFile(fileId: string) {\n  try {\n    const blob = await obitox.download(fileId);\n    const url = URL.createObjectURL(blob);\n    const a = document.createElement('a');\n    a.href = url;\n    a.download = 'downloaded-file';\n    a.click();\n    URL.revokeObjectURL(url);\n  } catch (error) {\n    console.error('Download failed:', error);\n  }\n}`}
          language="typescript"
        />

        <h2 id="list-files">List Files</h2>
        <p>
          Retrieve a list of all files in your storage:
        </p>
        <CodeBlock
          code={`async function listFiles() {\n  try {\n    const files = await obitox.list({\n      limit: 100,\n      offset: 0\n    });\n    console.log('Files:', files);\n    return files;\n  } catch (error) {\n    console.error('List failed:', error);\n  }\n}`}
          language="typescript"
        />

        <h2 id="delete-files">Delete Files</h2>
        <p>
          Remove files from storage when they're no longer needed:
        </p>
        <CodeBlock
          code={`async function deleteFile(fileId: string) {\n  try {\n    await obitox.delete(fileId);\n    console.log('File deleted successfully');\n  } catch (error) {\n    console.error('Delete failed:', error);\n  }\n}`}
          language="typescript"
        />

        <h2 id="error-handling">Error Handling</h2>
        <p>
          Always wrap your SDK calls in try-catch blocks and handle errors appropriately:
        </p>
        <CodeBlock
          code={`try {\n  const result = await obitox.upload(file);\n  // Handle success\n} catch (error) {\n  if (error.code === 'QUOTA_EXCEEDED') {\n    // Handle quota error\n    console.error('Monthly quota exceeded');\n  } else if (error.code === 'RATE_LIMIT') {\n    // Handle rate limit\n    console.error('Too many requests');\n  } else {\n    // Handle other errors\n    console.error('Upload failed:', error.message);\n  }\n}`}
          language="typescript"
        />

        <div className="not-prose my-6 p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex gap-3">
            <div className="text-emerald-400 flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-emerald-400 font-semibold text-sm mb-1">You're Ready!</h4>
              <p className="text-emerald-200/80 text-sm">
                You now have a working file upload application. Explore our advanced guides to learn about image transformations, CDN integration, and more.
              </p>
            </div>
          </div>
        </div>

        <h2 id="next-steps">Next Steps</h2>
        <p>
          Continue learning with these advanced topics:
        </p>
        <ul>
          <li><Link href="/docs/providers/s3">S3 Provider Configuration</Link> - Advanced S3 settings and optimization</li>
          <li><Link href="/docs/transformations">Image Transformations</Link> - Resize, crop, and optimize images</li>
          <li><Link href="/docs/cdn">CDN Integration</Link> - Deliver files faster with CDN</li>
          <li><Link href="/docs/security">Security Best Practices</Link> - Secure your API keys and uploads</li>
        </ul>
      </div>
    </article>
  );
}
