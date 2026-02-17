// Framework definitions - 14 frameworks
export const frameworks = [
    // Frontend
    { id: 'react', name: 'React', lang: 'tsx' },
    { id: 'nextjs', name: 'Next.js', lang: 'tsx' },
    { id: 'vue', name: 'Vue.js', lang: 'typescript' },
    { id: 'svelte', name: 'Svelte', lang: 'typescript' },
    { id: 'angular', name: 'Angular', lang: 'typescript' },
    { id: 'nuxt', name: 'Nuxt.js', lang: 'typescript' },
    // Backend
    { id: 'node', name: 'Node.js', lang: 'typescript' },
    { id: 'express', name: 'Express', lang: 'typescript' },
    { id: 'python', name: 'Python', lang: 'python' },
    { id: 'django', name: 'Django', lang: 'python' },
    { id: 'fastapi', name: 'FastAPI', lang: 'python' },
    { id: 'php', name: 'PHP', lang: 'php' },
    { id: 'laravel', name: 'Laravel', lang: 'php' },
    { id: 'go', name: 'Go', lang: 'go' }
];

export type UploadcareExamples = {
    setup: string;
    basicUpload: string;
    autoOptimization: string;
    manualOptimization: string;
    progressTracking: string;
    magicBytes: string;
    virusScanning: string;
    download: string;
    deleteFile: string;
    webhookAuto: string;
    webhookManual: string;
    cancellation: string;
};

export const uploadcareCodeExamples: Record<string, UploadcareExamples> = {
    // ═══════════════════════════════════════════
    // FRONTEND FRAMEWORKS
    // ═══════════════════════════════════════════
    react: {
        setup: `import { useState } from 'react';
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: process.env.REACT_APP_OBITOX_API_KEY!,
  apiSecret: process.env.REACT_APP_OBITOX_API_SECRET!
});

const uploadcare = client.uploadcare({
  publicKey: process.env.REACT_APP_UPLOADCARE_PUBLIC_KEY!
});

export default function FileUploader() {
  const [url, setUrl] = useState('');
  // See examples below for upload usage
}`,
        basicUpload: `const [uploading, setUploading] = useState(false);

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  const fileUrl = await uploadcare.upload(file, {
    filename: file.name
  });
  setUrl(fileUrl);
  setUploading(false);
};

return <input type="file" onChange={handleUpload} disabled={uploading} />;`,
        autoOptimization: `const fileUrl = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  imageOptimization: { auto: true }
});
setUrl(fileUrl);`,
        manualOptimization: `const fileUrl = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  imageOptimization: {
    format: 'webp',
    quality: 'best',
    progressive: true,
    stripMeta: 'all',
    adaptiveQuality: true
  }
});`,
        progressTracking: `const [progress, setProgress] = useState(0);

const fileUrl = await uploadcare.upload(file, {
  filename: file.name,
  onProgress: (percent) => setProgress(percent)
});

// In JSX: <progress value={progress} max={100} />`,
        magicBytes: `const url = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
        virusScanning: `const fileUrl = await uploadcare.upload(file, {
  filename: 'document.pdf',
  checkVirus: true
});
// Infected files are automatically rejected`,
        download: `const downloadUrl = await uploadcare.download({
  fileUrl: 'https://ucarecdn.com/uuid/photo.jpg'
});`,
        deleteFile: `await uploadcare.delete({
  fileUrl: 'https://ucarecdn.com/uuid/photo.jpg'
});
setUrl(''); // Clear state`,
        webhookAuto: `const url = await uploadcare.upload(file, {
  filename: 'report.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto',
    metadata: { userId: 'user_456' }
  }
});`,
        webhookManual: `const url = await uploadcare.upload(file, {
  filename: 'invoice.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    secret: 'webhook_secret_123',
    trigger: 'manual',
    autoConfirm: false,
    metadata: { userId: 'user_123' }
  }
});
// Then call /webhooks/confirm to trigger delivery`,
        cancellation: `const controller = new AbortController();

const uploadPromise = uploadcare.upload(largeFile, {
  filename: 'large-photo.jpg',
  onProgress: (percent) => {
    setProgress(percent);
    if (percent > 50) controller.abort(); // Cancel mid-upload
  }
});

// Or cancel on unmount
useEffect(() => () => controller.abort(), []);

try {
  const url = await uploadPromise;
} catch (err) {
  if (err.name === 'AbortError') console.log('Cancelled');
}`
    },

    nextjs: {
        setup: `// app/lib/obitox.ts
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY!,
  apiSecret: process.env.OBITOX_API_SECRET!
});

export const uploadcare = client.uploadcare({
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY!,
  secretKey: process.env.UPLOADCARE_SECRET_KEY!
});`,
        basicUpload: `// app/api/upload/route.ts
import { uploadcare } from '@/lib/obitox';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const fileUrl = await uploadcare.upload(file, {
    filename: file.name
  });

  return NextResponse.json({ url: fileUrl });
}`,
        autoOptimization: `// app/api/upload/route.ts
const fileUrl = await uploadcare.upload(file, {
  filename: file.name,
  imageOptimization: { auto: true }
});
return NextResponse.json({ url: fileUrl });`,
        manualOptimization: `const fileUrl = await uploadcare.upload(file, {
  filename: file.name,
  imageOptimization: {
    format: 'webp',
    quality: 'best',
    progressive: true,
    stripMeta: 'all',
    adaptiveQuality: true
  }
});`,
        progressTracking: `// Client component
'use client';
const res = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
// Server-side progress via streaming:
const fileUrl = await uploadcare.upload(file, {
  filename: file.name,
  onProgress: (percent) => console.log(\`\${percent}%\`)
});`,
        magicBytes: `const url = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
        virusScanning: `const fileUrl = await uploadcare.upload(file, {
  filename: 'document.pdf',
  checkVirus: true
});`,
        download: `// app/api/download/route.ts
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')!;
  const downloadUrl = await uploadcare.download({ fileUrl: url });
  return NextResponse.json({ downloadUrl });
}`,
        deleteFile: `// app/api/file/route.ts
export async function DELETE(request: NextRequest) {
  const { fileUrl } = await request.json();
  await uploadcare.delete({ fileUrl });
  return NextResponse.json({ deleted: true });
}`,
        webhookAuto: `const url = await uploadcare.upload(file, {
  filename: 'report.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto',
    metadata: { userId: 'user_456' }
  }
});`,
        webhookManual: `const url = await uploadcare.upload(file, {
  filename: 'invoice.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    secret: 'webhook_secret_123',
    trigger: 'manual',
    autoConfirm: false,
    metadata: { userId: 'user_123' }
  }
});`,
        cancellation: `const controller = new AbortController();

setTimeout(() => controller.abort(), 10000);

try {
  const url = await uploadcare.upload(file, {
    filename: 'large-photo.jpg',
    signal: controller.signal
  });
  return NextResponse.json({ url });
} catch (err) {
  return NextResponse.json({ error: 'Upload cancelled' }, { status: 499 });
}`
    },

    vue: {
        setup: `<script setup lang="ts">
import { ref } from 'vue';
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: import.meta.env.VITE_OBITOX_API_KEY,
  apiSecret: import.meta.env.VITE_OBITOX_API_SECRET
});

const uploadcare = client.uploadcare({
  publicKey: import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY
});

const fileUrl = ref('');
const progress = ref(0);
</script>`,
        basicUpload: `async function handleUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  fileUrl.value = await uploadcare.upload(file, {
    filename: file.name
  });
}

// template: <input type="file" @change="handleUpload" />`,
        autoOptimization: `fileUrl.value = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  imageOptimization: { auto: true }
});`,
        manualOptimization: `fileUrl.value = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  imageOptimization: {
    format: 'webp',
    quality: 'best',
    progressive: true,
    stripMeta: 'all',
    adaptiveQuality: true
  }
});`,
        progressTracking: `fileUrl.value = await uploadcare.upload(file, {
  filename: file.name,
  onProgress: (percent) => {
    progress.value = percent;
  }
});

// template: <progress :value="progress" max="100" />`,
        magicBytes: `const url = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
        virusScanning: `fileUrl.value = await uploadcare.upload(file, {
  filename: 'document.pdf',
  checkVirus: true
});`,
        download: `const downloadUrl = await uploadcare.download({
  fileUrl: 'https://ucarecdn.com/uuid/photo.jpg'
});`,
        deleteFile: `await uploadcare.delete({
  fileUrl: fileUrl.value
});
fileUrl.value = '';`,
        webhookAuto: `const url = await uploadcare.upload(file, {
  filename: 'report.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto',
    metadata: { userId: 'user_456' }
  }
});`,
        webhookManual: `const url = await uploadcare.upload(file, {
  filename: 'invoice.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    secret: 'webhook_secret_123',
    trigger: 'manual',
    autoConfirm: false,
    metadata: { userId: 'user_123' }
  }
});`,
        cancellation: `const controller = new AbortController();

onUnmounted(() => controller.abort());

try {
  const url = await uploadcare.upload(file, {
    filename: 'large-photo.jpg',
    onProgress: (p) => { progress.value = p; }
  });
  fileUrl.value = url;
} catch (err) {
  if (err.name === 'AbortError') console.log('Cancelled');
}`
    },

    svelte: {
        setup: `<script lang="ts">
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: import.meta.env.VITE_OBITOX_API_KEY,
  apiSecret: import.meta.env.VITE_OBITOX_API_SECRET
});

const uploadcare = client.uploadcare({
  publicKey: import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY
});

let fileUrl = $state('');
let progress = $state(0);
</script>`,
        basicUpload: `async function handleUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  fileUrl = await uploadcare.upload(file, {
    filename: file.name
  });
}

// <input type="file" on:change={handleUpload} />`,
        autoOptimization: `fileUrl = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  imageOptimization: { auto: true }
});`,
        manualOptimization: `fileUrl = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  imageOptimization: {
    format: 'webp',
    quality: 'best',
    progressive: true,
    stripMeta: 'all',
    adaptiveQuality: true
  }
});`,
        progressTracking: `fileUrl = await uploadcare.upload(file, {
  filename: file.name,
  onProgress: (percent) => { progress = percent; }
});

// <progress value={progress} max={100} />`,
        magicBytes: `const url = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
        virusScanning: `fileUrl = await uploadcare.upload(file, {
  filename: 'document.pdf',
  checkVirus: true
});`,
        download: `const downloadUrl = await uploadcare.download({
  fileUrl: 'https://ucarecdn.com/uuid/photo.jpg'
});`,
        deleteFile: `await uploadcare.delete({
  fileUrl: fileUrl
});
fileUrl = '';`,
        webhookAuto: `const url = await uploadcare.upload(file, {
  filename: 'report.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto',
    metadata: { userId: 'user_456' }
  }
});`,
        webhookManual: `const url = await uploadcare.upload(file, {
  filename: 'invoice.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    secret: 'webhook_secret_123',
    trigger: 'manual',
    autoConfirm: false,
    metadata: { userId: 'user_123' }
  }
});`,
        cancellation: `import { onDestroy } from 'svelte';

const controller = new AbortController();
onDestroy(() => controller.abort());

try {
  const url = await uploadcare.upload(file, {
    filename: 'large-photo.jpg',
    onProgress: (p) => { progress = p; }
  });
  fileUrl = url;
} catch (err) {
  if (err.name === 'AbortError') console.log('Cancelled');
}`
    },

    angular: {
        setup: `// upload.service.ts
import { Injectable } from '@angular/core';
import ObitoX from '@obitox/upload';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private client = new ObitoX({
    apiKey: environment.OBITOX_API_KEY,
    apiSecret: environment.OBITOX_API_SECRET
  });

  private uploadcare = this.client.uploadcare({
    publicKey: environment.UPLOADCARE_PUBLIC_KEY
  });
}`,
        basicUpload: `// upload.service.ts
async upload(file: File): Promise<string> {
  return this.uploadcare.upload(file, {
    filename: file.name
  });
}

// component.ts
constructor(private uploadService: UploadService) {}

async onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) this.fileUrl = await this.uploadService.upload(file);
}`,
        autoOptimization: `async uploadOptimized(file: File): Promise<string> {
  return this.uploadcare.upload(file, {
    filename: file.name,
    imageOptimization: { auto: true }
  });
}`,
        manualOptimization: `async uploadCustom(file: File): Promise<string> {
  return this.uploadcare.upload(file, {
    filename: file.name,
    imageOptimization: {
      format: 'webp',
      quality: 'best',
      progressive: true,
      stripMeta: 'all',
      adaptiveQuality: true
    }
  });
}`,
        progressTracking: `// upload.service.ts
async uploadWithProgress(
  file: File,
  onProgress: (percent: number) => void
): Promise<string> {
  return this.uploadcare.upload(file, {
    filename: file.name,
    onProgress: (percent) => onProgress(percent)
  });
}

// component.ts
progress = 0;
await this.uploadService.uploadWithProgress(file, (p) => this.progress = p);`,
        magicBytes: `async uploadValidated(file: File): Promise<string> {
  return this.uploadcare.upload(file, {
    filename: file.name,
    validation: 'images'
  });
}`,
        virusScanning: `async uploadScanned(file: File): Promise<string> {
  return this.uploadcare.upload(file, {
    filename: file.name,
    checkVirus: true
  });
}`,
        download: `async getDownloadUrl(fileUrl: string): Promise<string> {
  return this.uploadcare.download({ fileUrl });
}`,
        deleteFile: `async deleteFile(fileUrl: string): Promise<void> {
  await this.uploadcare.delete({ fileUrl });
}`,
        webhookAuto: `async uploadWithWebhook(file: File): Promise<string> {
  return this.uploadcare.upload(file, {
    filename: file.name,
    webhook: {
      url: 'https://myapp.com/webhooks/upload',
      trigger: 'auto',
      metadata: { userId: 'user_456' }
    }
  });
}`,
        webhookManual: `async uploadManualWebhook(file: File): Promise<string> {
  return this.uploadcare.upload(file, {
    filename: file.name,
    webhook: {
      url: 'https://myapp.com/webhooks/upload',
      secret: 'webhook_secret_123',
      trigger: 'manual',
      autoConfirm: false,
      metadata: { userId: 'user_123' }
    }
  });
}
// Then call /webhooks/confirm to trigger delivery`,
        cancellation: `private controller = new AbortController();

ngOnDestroy() {
  this.controller.abort();
}

async uploadCancellable(file: File): Promise<string> {
  return this.uploadcare.upload(file, {
    filename: file.name,
    onProgress: (p) => this.progress = p
  });
}

cancel() {
  this.controller.abort();
}`
    },

    nuxt: {
        setup: `// server/utils/obitox.ts
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY!,
  apiSecret: process.env.OBITOX_API_SECRET!
});

export const uploadcare = client.uploadcare({
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY!,
  secretKey: process.env.UPLOADCARE_SECRET_KEY!
});`,
        basicUpload: `// server/api/upload.post.ts
import { uploadcare } from '../utils/obitox';

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);
  const file = files?.[0];

  const fileUrl = await uploadcare.upload(file!.data, {
    filename: file!.filename || 'upload'
  });

  return { url: fileUrl };
});`,
        autoOptimization: `// server/api/upload.post.ts
const fileUrl = await uploadcare.upload(file!.data, {
  filename: file!.filename || 'upload',
  imageOptimization: { auto: true }
});`,
        manualOptimization: `const fileUrl = await uploadcare.upload(file!.data, {
  filename: file!.filename || 'upload',
  imageOptimization: {
    format: 'webp',
    quality: 'best',
    progressive: true,
    stripMeta: 'all',
    adaptiveQuality: true
  }
});`,
        progressTracking: `const fileUrl = await uploadcare.upload(file!.data, {
  filename: file!.filename || 'upload',
  onProgress: (percent) => {
    console.log(\`\${percent}% uploaded\`);
  }
});`,
        magicBytes: `const url = await uploadcare.upload(file!.data, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
        virusScanning: `const fileUrl = await uploadcare.upload(file!.data, {
  filename: 'document.pdf',
  checkVirus: true
});`,
        download: `// server/api/download.get.ts
export default defineEventHandler(async (event) => {
  const { url } = getQuery(event);
  const downloadUrl = await uploadcare.download({
    fileUrl: url as string
  });
  return { downloadUrl };
});`,
        deleteFile: `// server/api/file.delete.ts
export default defineEventHandler(async (event) => {
  const { fileUrl } = await readBody(event);
  await uploadcare.delete({ fileUrl });
  return { deleted: true };
});`,
        webhookAuto: `const url = await uploadcare.upload(file!.data, {
  filename: 'report.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto',
    metadata: { userId: 'user_456' }
  }
});`,
        webhookManual: `const url = await uploadcare.upload(file!.data, {
  filename: 'invoice.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    secret: 'webhook_secret_123',
    trigger: 'manual',
    autoConfirm: false,
    metadata: { userId: 'user_123' }
  }
});`,
        cancellation: `const controller = new AbortController();
setTimeout(() => controller.abort(), 10000);

try {
  const url = await uploadcare.upload(file!.data, {
    filename: 'large-photo.jpg',
    signal: controller.signal
  });
  return { url };
} catch (err) {
  throw createError({ statusCode: 499, message: 'Upload cancelled' });
}`
    },

    // ═══════════════════════════════════════════
    // BACKEND FRAMEWORKS
    // ═══════════════════════════════════════════
    node: {
        setup: `import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,
  apiSecret: process.env.OBITOX_API_SECRET
});

const uploadcare = client.uploadcare({
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
  secretKey: process.env.UPLOADCARE_SECRET_KEY
});`,
        basicUpload: `const fileUrl = await uploadcare.upload(file, {
  filename: 'photo.jpg'
});

console.log(fileUrl); // https://ucarecdn.com/uuid/photo.jpg`,
        autoOptimization: `const fileUrl = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  imageOptimization: { auto: true }
});`,
        manualOptimization: `const fileUrl = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  imageOptimization: {
    format: 'webp',
    quality: 'best',
    progressive: true,
    stripMeta: 'all',
    adaptiveQuality: true
  }
});`,
        progressTracking: `const fileUrl = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  onProgress: (percent, uploaded, total) => {
    console.log(\`\${percent}% — \${uploaded}/\${total} bytes\`);
  }
});`,
        magicBytes: `const url = await uploadcare.upload(file, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
        virusScanning: `const fileUrl = await uploadcare.upload(file, {
  filename: 'document.pdf',
  checkVirus: true
});
// Infected files are automatically rejected`,
        download: `const downloadUrl = await uploadcare.download({
  fileUrl: 'https://ucarecdn.com/uuid/photo.jpg'
});`,
        deleteFile: `await uploadcare.delete({
  fileUrl: 'https://ucarecdn.com/uuid/photo.jpg'
});`,
        webhookAuto: `const url = await uploadcare.upload(file, {
  filename: 'report.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto',
    metadata: { userId: 'user_456' }
  }
});`,
        webhookManual: `const url = await uploadcare.upload(file, {
  filename: 'invoice.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    secret: 'webhook_secret_123',
    trigger: 'manual',
    autoConfirm: false,
    metadata: { userId: 'user_123', uploadType: 'test' }
  }
});
// Then call /webhooks/confirm to trigger delivery`,
        cancellation: `const abortController = new AbortController();

try {
  const uploadPromise = uploadcare.upload(largeFile, {
    filename: 'large-photo.jpg',
    onProgress: (progress) => {
      if (progress > 50) abortController.abort();
    }
  });
  setTimeout(() => abortController.abort(), 5000);
  const url = await uploadPromise;
} catch (error) {
  if (error.name === 'AbortError') console.log('Upload cancelled');
}`
    },

    express: {
        setup: `import express from 'express';
import multer from 'multer';
import ObitoX from '@obitox/upload';

const app = express();
const upload = multer();

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,
  apiSecret: process.env.OBITOX_API_SECRET
});

const uploadcare = client.uploadcare({
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
  secretKey: process.env.UPLOADCARE_SECRET_KEY
});`,
        basicUpload: `app.post('/upload', upload.single('file'), async (req, res) => {
  const fileUrl = await uploadcare.upload(req.file.buffer, {
    filename: req.file.originalname
  });
  res.json({ url: fileUrl });
});`,
        autoOptimization: `app.post('/upload/optimized', upload.single('file'), async (req, res) => {
  const fileUrl = await uploadcare.upload(req.file.buffer, {
    filename: req.file.originalname,
    imageOptimization: { auto: true }
  });
  res.json({ url: fileUrl });
});`,
        manualOptimization: `app.post('/upload/custom', upload.single('file'), async (req, res) => {
  const fileUrl = await uploadcare.upload(req.file.buffer, {
    filename: req.file.originalname,
    imageOptimization: {
      format: 'webp',
      quality: 'best',
      progressive: true,
      stripMeta: 'all',
      adaptiveQuality: true
    }
  });
  res.json({ url: fileUrl });
});`,
        progressTracking: `app.post('/upload', upload.single('file'), async (req, res) => {
  const fileUrl = await uploadcare.upload(req.file.buffer, {
    filename: req.file.originalname,
    onProgress: (percent) => console.log(\`\${percent}% uploaded\`)
  });
  res.json({ url: fileUrl });
});`,
        magicBytes: `app.post('/upload/validated', upload.single('file'), async (req, res) => {
  const url = await uploadcare.upload(req.file.buffer, {
    filename: req.file.originalname,
    validation: 'images'
  });
  res.json({ url });
});`,
        virusScanning: `app.post('/upload/safe', upload.single('file'), async (req, res) => {
  const fileUrl = await uploadcare.upload(req.file.buffer, {
    filename: req.file.originalname,
    checkVirus: true
  });
  res.json({ url: fileUrl });
});`,
        download: `app.get('/download', async (req, res) => {
  const downloadUrl = await uploadcare.download({
    fileUrl: req.query.url
  });
  res.redirect(downloadUrl);
});`,
        deleteFile: `app.delete('/file', async (req, res) => {
  await uploadcare.delete({ fileUrl: req.body.fileUrl });
  res.json({ deleted: true });
});`,
        webhookAuto: `app.post('/upload/webhook', upload.single('file'), async (req, res) => {
  const url = await uploadcare.upload(req.file.buffer, {
    filename: req.file.originalname,
    webhook: {
      url: 'https://myapp.com/webhooks/upload',
      trigger: 'auto',
      metadata: { userId: req.user.id }
    }
  });
  res.json({ url });
});`,
        webhookManual: `app.post('/upload/manual-hook', upload.single('file'), async (req, res) => {
  const url = await uploadcare.upload(req.file.buffer, {
    filename: req.file.originalname,
    webhook: {
      url: 'https://myapp.com/webhooks/upload',
      secret: 'webhook_secret_123',
      trigger: 'manual',
      autoConfirm: false,
      metadata: { userId: req.user.id }
    }
  });
  res.json({ url });
});`,
        cancellation: `app.post('/upload/cancellable', upload.single('file'), async (req, res) => {
  const controller = new AbortController();
  req.on('close', () => controller.abort());

  try {
    const url = await uploadcare.upload(req.file.buffer, {
      filename: req.file.originalname,
      onProgress: (p) => console.log(\`\${p}%\`)
    });
    res.json({ url });
  } catch (err) {
    res.status(499).json({ error: 'Upload cancelled' });
  }
});`
    },

    python: {
        setup: `from obitox import ObitoX
import os

client = ObitoX(
    api_key=os.getenv('OBITOX_API_KEY'),
    api_secret=os.getenv('OBITOX_API_SECRET')
)

uploadcare = client.uploadcare({
    'public_key': os.getenv('UPLOADCARE_PUBLIC_KEY'),
    'secret_key': os.getenv('UPLOADCARE_SECRET_KEY')
})`,
        basicUpload: `file_url = uploadcare.upload(file, {
    'filename': 'photo.jpg'
})

print(f'Uploaded: {file_url}')`,
        autoOptimization: `file_url = uploadcare.upload(file, {
    'filename': 'photo.jpg',
    'image_optimization': {'auto': True}
})`,
        manualOptimization: `file_url = uploadcare.upload(file, {
    'filename': 'photo.jpg',
    'image_optimization': {
        'format': 'webp',
        'quality': 'best',
        'progressive': True,
        'strip_meta': 'all',
        'adaptive_quality': True
    }
})`,
        progressTracking: `def on_progress(percent, uploaded, total):
    print(f'{percent:.1f}% — {uploaded}/{total} bytes')

file_url = uploadcare.upload(file, {
    'filename': 'photo.jpg',
    'on_progress': on_progress
})`,
        magicBytes: `url = uploadcare.upload(file, {
    'filename': 'photo.jpg',
    'validation': 'images'
})`,
        virusScanning: `file_url = uploadcare.upload(file, {
    'filename': 'document.pdf',
    'check_virus': True
})`,
        download: `download_url = uploadcare.download({
    'file_url': 'https://ucarecdn.com/uuid/photo.jpg'
})`,
        deleteFile: `uploadcare.delete({
    'file_url': 'https://ucarecdn.com/uuid/photo.jpg'
})`,
        webhookAuto: `url = uploadcare.upload(file, {
    'filename': 'report.jpg',
    'webhook': {
        'url': 'https://myapp.com/webhooks/upload',
        'trigger': 'auto',
        'metadata': {'user_id': 'user_456'}
    }
})`,
        webhookManual: `url = uploadcare.upload(file, {
    'filename': 'invoice.jpg',
    'webhook': {
        'url': 'https://myapp.com/webhooks/upload',
        'secret': 'webhook_secret_123',
        'trigger': 'manual',
        'auto_confirm': False,
        'metadata': {'user_id': 'user_123'}
    }
})
# Then call /webhooks/confirm to trigger delivery`,
        cancellation: `import threading

cancel_event = threading.Event()

def on_progress(percent, uploaded, total):
    if percent > 50:
        cancel_event.set()

try:
    url = uploadcare.upload(file, {
        'filename': 'large-photo.jpg',
        'on_progress': on_progress,
        'cancel_event': cancel_event
    })
except Exception as e:
    print(f'Upload cancelled: {e}')`
    },

    django: {
        setup: `# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from obitox import ObitoX
from django.conf import settings

client = ObitoX(
    api_key=settings.OBITOX_API_KEY,
    api_secret=settings.OBITOX_API_SECRET
)

uploadcare = client.uploadcare({
    'public_key': settings.UPLOADCARE_PUBLIC_KEY,
    'secret_key': settings.UPLOADCARE_SECRET_KEY
})`,
        basicUpload: `@csrf_exempt
def upload_file(request):
    file = request.FILES['file']
    file_url = uploadcare.upload(file.read(), {
        'filename': file.name
    })
    return JsonResponse({'url': file_url})`,
        autoOptimization: `@csrf_exempt
def upload_optimized(request):
    file = request.FILES['file']
    file_url = uploadcare.upload(file.read(), {
        'filename': file.name,
        'image_optimization': {'auto': True}
    })
    return JsonResponse({'url': file_url})`,
        manualOptimization: `file_url = uploadcare.upload(file.read(), {
    'filename': file.name,
    'image_optimization': {
        'format': 'webp',
        'quality': 'best',
        'progressive': True,
        'strip_meta': 'all',
        'adaptive_quality': True
    }
})`,
        progressTracking: `def on_progress(percent, uploaded, total):
    print(f'{percent:.1f}% uploaded')

file_url = uploadcare.upload(file.read(), {
    'filename': file.name,
    'on_progress': on_progress
})`,
        magicBytes: `url = uploadcare.upload(file.read(), {
    'filename': file.name,
    'validation': 'images'
})`,
        virusScanning: `file_url = uploadcare.upload(file.read(), {
    'filename': file.name,
    'check_virus': True
})`,
        download: `def download_file(request):
    file_url = request.GET.get('url')
    download_url = uploadcare.download({'file_url': file_url})
    return JsonResponse({'download_url': download_url})`,
        deleteFile: `@csrf_exempt
def delete_file(request):
    import json
    body = json.loads(request.body)
    uploadcare.delete({'file_url': body['file_url']})
    return JsonResponse({'deleted': True})`,
        webhookAuto: `url = uploadcare.upload(file.read(), {
    'filename': 'report.jpg',
    'webhook': {
        'url': 'https://myapp.com/webhooks/upload',
        'trigger': 'auto',
        'metadata': {'user_id': str(request.user.id)}
    }
})`,
        webhookManual: `url = uploadcare.upload(file.read(), {
    'filename': 'invoice.jpg',
    'webhook': {
        'url': 'https://myapp.com/webhooks/upload',
        'secret': 'webhook_secret_123',
        'trigger': 'manual',
        'auto_confirm': False,
        'metadata': {'user_id': str(request.user.id)}
    }
})
# Then call /webhooks/confirm to trigger delivery`,
        cancellation: `import threading

cancel_event = threading.Event()

try:
    url = uploadcare.upload(file.read(), {
        'filename': 'large-photo.jpg',
        'on_progress': lambda p, u, t: cancel_event.set() if p > 50 else None,
        'cancel_event': cancel_event
    })
    return JsonResponse({'url': url})
except Exception:
    return JsonResponse({'error': 'Upload cancelled'}, status=499)`
    },

    fastapi: {
        setup: `from fastapi import FastAPI, UploadFile
from obitox import ObitoX
import os

app = FastAPI()

client = ObitoX(
    api_key=os.getenv('OBITOX_API_KEY'),
    api_secret=os.getenv('OBITOX_API_SECRET')
)

uploadcare = client.uploadcare({
    'public_key': os.getenv('UPLOADCARE_PUBLIC_KEY'),
    'secret_key': os.getenv('UPLOADCARE_SECRET_KEY')
})`,
        basicUpload: `@app.post('/upload')
async def upload(file: UploadFile):
    content = await file.read()
    file_url = uploadcare.upload(content, {
        'filename': file.filename
    })
    return {'url': file_url}`,
        autoOptimization: `@app.post('/upload/optimized')
async def upload_optimized(file: UploadFile):
    content = await file.read()
    file_url = uploadcare.upload(content, {
        'filename': file.filename,
        'image_optimization': {'auto': True}
    })
    return {'url': file_url}`,
        manualOptimization: `file_url = uploadcare.upload(content, {
    'filename': file.filename,
    'image_optimization': {
        'format': 'webp',
        'quality': 'best',
        'progressive': True,
        'strip_meta': 'all',
        'adaptive_quality': True
    }
})`,
        progressTracking: `@app.post('/upload/progress')
async def upload_with_progress(file: UploadFile):
    content = await file.read()
    file_url = uploadcare.upload(content, {
        'filename': file.filename,
        'on_progress': lambda p, u, t: print(f'{p}%')
    })
    return {'url': file_url}`,
        magicBytes: `url = uploadcare.upload(content, {
    'filename': file.filename,
    'validation': 'images'
})`,
        virusScanning: `file_url = uploadcare.upload(content, {
    'filename': file.filename,
    'check_virus': True
})`,
        download: `@app.get('/download')
async def download(url: str):
    download_url = uploadcare.download({'file_url': url})
    return {'download_url': download_url}`,
        deleteFile: `from pydantic import BaseModel

class DeleteRequest(BaseModel):
    file_url: str

@app.delete('/file')
async def delete_file(body: DeleteRequest):
    uploadcare.delete({'file_url': body.file_url})
    return {'deleted': True}`,
        webhookAuto: `url = uploadcare.upload(content, {
    'filename': 'report.jpg',
    'webhook': {
        'url': 'https://myapp.com/webhooks/upload',
        'trigger': 'auto',
        'metadata': {'user_id': 'user_456'}
    }
})`,
        webhookManual: `url = uploadcare.upload(content, {
    'filename': 'invoice.jpg',
    'webhook': {
        'url': 'https://myapp.com/webhooks/upload',
        'secret': 'webhook_secret_123',
        'trigger': 'manual',
        'auto_confirm': False,
        'metadata': {'user_id': 'user_123'}
    }
})
# Then call /webhooks/confirm to trigger delivery`,
        cancellation: `import asyncio

@app.post('/upload/cancellable')
async def upload_cancellable(file: UploadFile):
    content = await file.read()

    async def upload_task():
        return uploadcare.upload(content, {'filename': file.filename})

    try:
        url = await asyncio.wait_for(upload_task(), timeout=30.0)
        return {'url': url}
    except asyncio.TimeoutError:
        return {'error': 'Upload timed out'}`
    },

    php: {
        setup: `<?php
require_once 'vendor/autoload.php';

use ObitoX\\ObitoXClient;

$client = new ObitoXClient([
    'api_key' => getenv('OBITOX_API_KEY'),
    'api_secret' => getenv('OBITOX_API_SECRET')
]);

$uploadcare = $client->uploadcare([
    'public_key' => getenv('UPLOADCARE_PUBLIC_KEY'),
    'secret_key' => getenv('UPLOADCARE_SECRET_KEY')
]);`,
        basicUpload: `$fileUrl = $uploadcare->upload($file, [
    'filename' => 'photo.jpg'
]);

echo "Uploaded: " . $fileUrl;`,
        autoOptimization: `$fileUrl = $uploadcare->upload($file, [
    'filename' => 'photo.jpg',
    'image_optimization' => ['auto' => true]
]);`,
        manualOptimization: `$fileUrl = $uploadcare->upload($file, [
    'filename' => 'photo.jpg',
    'image_optimization' => [
        'format' => 'webp',
        'quality' => 'best',
        'progressive' => true,
        'strip_meta' => 'all',
        'adaptive_quality' => true
    ]
]);`,
        progressTracking: `$fileUrl = $uploadcare->upload($file, [
    'filename' => 'photo.jpg',
    'on_progress' => function($percent, $uploaded, $total) {
        echo number_format($percent, 1) . "% uploaded\\n";
    }
]);`,
        magicBytes: `$url = $uploadcare->upload($file, [
    'filename' => 'photo.jpg',
    'validation' => 'images'
]);`,
        virusScanning: `$fileUrl = $uploadcare->upload($file, [
    'filename' => 'document.pdf',
    'check_virus' => true
]);`,
        download: `$downloadUrl = $uploadcare->download([
    'file_url' => 'https://ucarecdn.com/uuid/photo.jpg'
]);`,
        deleteFile: `$uploadcare->delete([
    'file_url' => 'https://ucarecdn.com/uuid/photo.jpg'
]);`,
        webhookAuto: `$url = $uploadcare->upload($file, [
    'filename' => 'report.jpg',
    'webhook' => [
        'url' => 'https://myapp.com/webhooks/upload',
        'trigger' => 'auto',
        'metadata' => ['user_id' => 'user_456']
    ]
]);`,
        webhookManual: `$url = $uploadcare->upload($file, [
    'filename' => 'invoice.jpg',
    'webhook' => [
        'url' => 'https://myapp.com/webhooks/upload',
        'secret' => 'webhook_secret_123',
        'trigger' => 'manual',
        'auto_confirm' => false,
        'metadata' => ['user_id' => 'user_123']
    ]
]);
// Then call /webhooks/confirm to trigger delivery`,
        cancellation: `try {
    $url = $uploadcare->upload($file, [
        'filename' => 'large-photo.jpg',
        'timeout' => 30
    ]);
    echo "Uploaded: " . $url;
} catch (\\Exception $e) {
    echo "Upload cancelled: " . $e->getMessage();
}`
    },

    laravel: {
        setup: `// app/Services/UploadService.php
namespace App\\Services;

use ObitoX\\ObitoXClient;

class UploadService
{
    private $uploadcare;

    public function __construct()
    {
        $client = new ObitoXClient([
            'api_key' => config('services.obitox.api_key'),
            'api_secret' => config('services.obitox.api_secret')
        ]);

        $this->uploadcare = $client->uploadcare([
            'public_key' => config('services.uploadcare.public_key'),
            'secret_key' => config('services.uploadcare.secret_key')
        ]);
    }
}`,
        basicUpload: `// app/Http/Controllers/UploadController.php
use App\\Services\\UploadService;
use Illuminate\\Http\\Request;

class UploadController extends Controller
{
    public function upload(Request $request, UploadService $service)
    {
        $file = $request->file('file');
        $url = $service->upload($file->get(), $file->getClientOriginalName());
        return response()->json(['url' => $url]);
    }
}`,
        autoOptimization: `public function uploadOptimized($content, $filename)
{
    return $this->uploadcare->upload($content, [
        'filename' => $filename,
        'image_optimization' => ['auto' => true]
    ]);
}`,
        manualOptimization: `return $this->uploadcare->upload($content, [
    'filename' => $filename,
    'image_optimization' => [
        'format' => 'webp',
        'quality' => 'best',
        'progressive' => true,
        'strip_meta' => 'all',
        'adaptive_quality' => true
    ]
]);`,
        progressTracking: `return $this->uploadcare->upload($content, [
    'filename' => $filename,
    'on_progress' => function($percent) {
        Log::info("Upload progress: {$percent}%");
    }
]);`,
        magicBytes: `return $this->uploadcare->upload($content, [
    'filename' => $filename,
    'validation' => 'images'
]);`,
        virusScanning: `return $this->uploadcare->upload($content, [
    'filename' => $filename,
    'check_virus' => true
]);`,
        download: `public function download(Request $request)
{
    $downloadUrl = $this->uploadcare->download([
        'file_url' => $request->input('url')
    ]);
    return response()->json(['download_url' => $downloadUrl]);
}`,
        deleteFile: `public function destroy(Request $request)
{
    $this->uploadcare->delete([
        'file_url' => $request->input('file_url')
    ]);
    return response()->json(['deleted' => true]);
}`,
        webhookAuto: `return $this->uploadcare->upload($content, [
    'filename' => 'report.jpg',
    'webhook' => [
        'url' => 'https://myapp.com/webhooks/upload',
        'trigger' => 'auto',
        'metadata' => ['user_id' => auth()->id()]
    ]
]);`,
        webhookManual: `return $this->uploadcare->upload($content, [
    'filename' => 'invoice.jpg',
    'webhook' => [
        'url' => 'https://myapp.com/webhooks/upload',
        'secret' => 'webhook_secret_123',
        'trigger' => 'manual',
        'auto_confirm' => false,
        'metadata' => ['user_id' => auth()->id()]
    ]
]);
// Then call /webhooks/confirm to trigger delivery`,
        cancellation: `try {
    $url = $this->uploadcare->upload($content, [
        'filename' => 'large-photo.jpg',
        'timeout' => 30
    ]);
    return response()->json(['url' => $url]);
} catch (\\Exception $e) {
    return response()->json(['error' => 'Upload cancelled'], 499);
}`
    },

    go: {
        setup: `package main

import (
    "os"
    "fmt"
    obitox "github.com/obitox/obitox-go"
)

func main() {
    client := obitox.NewClient(
        os.Getenv("OBITOX_API_KEY"),
        os.Getenv("OBITOX_API_SECRET"),
    )

    uploadcare := client.Uploadcare(obitox.UploadcareConfig{
        PublicKey: os.Getenv("UPLOADCARE_PUBLIC_KEY"),
        SecretKey: os.Getenv("UPLOADCARE_SECRET_KEY"),
    })
}`,
        basicUpload: `fileUrl, err := uploadcare.Upload(file, obitox.UploadOptions{
    Filename: "photo.jpg",
})

fmt.Println("Uploaded:", fileUrl)`,
        autoOptimization: `fileUrl, err := uploadcare.Upload(file, obitox.UploadOptions{
    Filename: "photo.jpg",
    ImageOptimization: &obitox.ImageOpt{Auto: true},
})`,
        manualOptimization: `fileUrl, err := uploadcare.Upload(file, obitox.UploadOptions{
    Filename: "photo.jpg",
    ImageOptimization: &obitox.ImageOpt{
        Format:          "webp",
        Quality:         "best",
        Progressive:     true,
        StripMeta:       "all",
        AdaptiveQuality: true,
    },
})`,
        progressTracking: `fileUrl, err := uploadcare.Upload(file, obitox.UploadOptions{
    Filename: "photo.jpg",
    OnProgress: func(percent float64, uploaded, total int64) {
        fmt.Printf("%.1f%% — %d/%d bytes\\n", percent, uploaded, total)
    },
})`,
        magicBytes: `url, err := uploadcare.Upload(file, obitox.UploadOptions{
    Filename:   "photo.jpg",
    Validation: "images",
})`,
        virusScanning: `fileUrl, err := uploadcare.Upload(file, obitox.UploadOptions{
    Filename:   "document.pdf",
    CheckVirus: true,
})`,
        download: `downloadUrl, err := uploadcare.Download(obitox.DownloadOptions{
    FileUrl: "https://ucarecdn.com/uuid/photo.jpg",
})`,
        deleteFile: `err := uploadcare.Delete(obitox.DeleteOptions{
    FileUrl: "https://ucarecdn.com/uuid/photo.jpg",
})`,
        webhookAuto: `url, err := uploadcare.Upload(file, obitox.UploadOptions{
    Filename: "report.jpg",
    Webhook: &obitox.WebhookConfig{
        Url:     "https://myapp.com/webhooks/upload",
        Trigger: "auto",
        Metadata: map[string]string{
            "userId": "user_456",
        },
    },
})`,
        webhookManual: `url, err := uploadcare.Upload(file, obitox.UploadOptions{
    Filename: "invoice.jpg",
    Webhook: &obitox.WebhookConfig{
        Url:         "https://myapp.com/webhooks/upload",
        Secret:      "webhook_secret_123",
        Trigger:     "manual",
        AutoConfirm: false,
        Metadata: map[string]string{
            "userId": "user_123",
        },
    },
})
// Then call /webhooks/confirm to trigger delivery`,
        cancellation: `ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()

url, err := uploadcare.UploadWithContext(ctx, file, obitox.UploadOptions{
    Filename: "large-photo.jpg",
    OnProgress: func(percent float64, _, _ int64) {
        fmt.Printf("%v%%\\n", percent)
        if percent > 50 {
            cancel()
        }
    },
})

if errors.Is(err, context.Canceled) {
    fmt.Println("Upload cancelled")
}`
    }
};
