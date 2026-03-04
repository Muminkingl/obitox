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

export type S3Examples = {
  setup: string;
  customEndpoint: string;
  directApi: string;
  basicUpload: string;
  progressTracking: string;
  signedExpiry: string;
  magicBytes: string;
  multipart: string;
  batchUpload: string;
  download: string;
  listFiles: string;
  deleteFiles: string;
  cors: string;
  metadata: string;
  webhookAuto: string;
  webhookManual: string;
  webhookSignature: string;
  smartExpiry: string;
};

export const s3CodeExamples: Record<string, S3Examples> = {
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

const s3 = client.s3({
  accessKey: process.env.REACT_APP_S3_ACCESS_KEY!,
  secretKey: process.env.REACT_APP_S3_SECRET_KEY!,
  bucket: 'my-bucket',
  region: 'us-east-1'
});

export default function FileUploader() {
  const [url, setUrl] = useState('');
  // See examples below
}`,
    customEndpoint: `const s3 = client.s3({
  accessKey: 'minioadmin',
  secretKey: 'minioadmin123',
  bucket: 'local-bucket',
  endpoint: 'http://localhost:9000',
  region: 'us-east-1'
});`,
    directApi: `const handleUpload = async (file: File) => {
  const url = await client.uploadFile(file, {
    provider: 'S3',
    s3AccessKey: 'key',
    s3SecretKey: 'secret',
    s3Bucket: 'bucket',
    s3Region: 'us-east-1'
  });
  setUrl(url);
};`,
    basicUpload: `const url = await s3.upload(file, {
  filename: 'document.txt'
});`,
    progressTracking: `const url = await s3.upload(file, {
  filename: 'video.mp4',
  onProgress: (percent) => console.log(\`\${percent}%\`)
});`,
    signedExpiry: `const url = await s3.upload(file, {
  filename: 'protected.txt',
  expiresIn: 3600 // 1 hour
});`,
    magicBytes: `const url = await s3.upload(file, {
  filename: 'profile.jpg',
  validation: 'images'
});`,
    multipart: `const url = await s3.upload(largeFile, {
  filename: 'large-video.mp4',
  onProgress: (p) => setProgress(p)
});`,
    batchUpload: `const result = await s3.batchUpload({
  files: [
    { filename: 'file1.txt', contentType: 'text/plain', fileSize: 1024 },
    { filename: 'file2.jpg', contentType: 'image/jpeg', fileSize: 50000 }
  ]
});`,
    download: `const url = await s3.getSignedDownloadUrl({
  fileKey: 'document.txt',
  expiresIn: 3600
});`,
    listFiles: `const result = await s3.list({ maxKeys: 20 });
console.log(result.files);`,
    deleteFiles: `await s3.delete({ fileKey: 'document.txt' });`,
    cors: `// CORS configuration is typically done backend-side or via AWS Console`,
    metadata: `const meta = await s3.getMetadata({ key: 'doc.txt' });`,
    webhookAuto: `const url = await s3.upload(file, {
  filename: 'report.pdf',
  webhook: {
    url: 'https://api.myapp.com/hooks',
    trigger: 'auto'
  }
});`,
    webhookManual: `const url = await s3.upload(file, {
  filename: 'invoice.pdf',
  webhook: {
    url: 'https://api.myapp.com/hooks',
    trigger: 'manual',
    secret: 'my-secret'
  }
});`,
    webhookSignature: `// Webhook verification happens on the backend`,
    smartExpiry: `// 1. Auto-Detect (Default in Browser)
// SDK automatically uses navigator.connection
const url = await s3.upload(file, {
  filename: 'video.mp4'
});

// 2. Manual Override (Server-side or custom)
const url = await s3.upload(file, {
  filename: 'video.mp4',
  networkInfo: {
    type: '4g',
    downlink: 10,  // Mbps
    rtt: 50        // ms
  }
});`
  },

  nextjs: {
    setup: `// lib/s3.ts
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY!,
  apiSecret: process.env.OBITOX_API_SECRET!
});

export const s3 = client.s3({
  accessKey: process.env.S3_ACCESS_KEY!,
  secretKey: process.env.S3_SECRET_KEY!,
  bucket: process.env.S3_BUCKET!,
  region: process.env.S3_REGION!
});`,
    customEndpoint: `// Support for MinIO/DigitalOcean
export const s3 = client.s3({
  // ... credentials
  endpoint: process.env.S3_ENDPOINT // e.g., https://nyc3.digitaloceanspaces.com
});`,
    directApi: `// app/api/upload/route.ts
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  const url = await client.uploadFile(file, {
    provider: 'S3',
    s3AccessKey: process.env.S3_ACCESS_KEY,
    s3SecretKey: process.env.S3_SECRET_KEY,
    s3Bucket: process.env.S3_BUCKET,
    s3Region: process.env.S3_REGION
  });
  
  return NextResponse.json({ url });
}`,
    basicUpload: `// app/api/upload/route.ts
const url = await s3.upload(file, {
  filename: file.name
});`,
    progressTracking: `// Client Component
'use client';
const upload = async () => {
  const url = await s3.upload(file, {
    filename: file.name,
    onProgress: (p) => setProgress(p)
  });
};`,
    signedExpiry: `const url = await s3.upload(file, {
  filename: 'secure-doc.pdf',
  expiresIn: 300 // 5 minutes
});`,
    magicBytes: `const url = await s3.upload(file, {
  filename: 'avatar.png',
  validation: 'images'
});`,
    multipart: `// Handles large files automatically
const url = await s3.upload(largeFile, {
  filename: 'video.4k.mp4'
});`,
    batchUpload: `const result = await s3.batchUpload({
  files: fileList.map(f => ({
    filename: f.name,
    contentType: f.type,
    fileSize: f.size
  }))
});`,
    download: `// app/api/download/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  
  const url = await s3.getSignedDownloadUrl({
    fileKey: key!,
    expiresIn: 3600
  });
  
  return NextResponse.redirect(url);
}`,
    listFiles: `const { files } = await s3.list({
  prefix: 'user_123/',
  maxKeys: 50
});`,
    deleteFiles: `await s3.delete({ fileKey: 'old-report.pdf' });`,
    cors: `await s3.configureCors({
  origins: ['https://myapp.com'],
  allowedMethods: ['GET', 'POST', 'PUT']
});`,
    metadata: `const meta = await s3.getMetadata({ key: 'file.txt' });`,
    webhookAuto: `const url = await s3.upload(file, {
  filename: 'data.csv',
  webhook: {
    url: 'https://api.myapp.com/webhooks',
    trigger: 'auto'
  }
});`,
    webhookManual: `const url = await s3.upload(file, {
  filename: 'data.csv',
  webhook: {
    url: 'https://api.myapp.com/webhooks',
    trigger: 'manual'
  }
});`,
    webhookSignature: `// app/api/webhooks/route.ts
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.json();
  const signature = req.headers.get('x-signature');
  
  const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET!);
  hmac.update(JSON.stringify(body));
  const expected = \`sha256=\${hmac.digest('hex')}\`;
  
  if (signature !== expected) {
    return NextResponse.json({ error: 'Invalid' }, { status: 401 });
  }
  // Process...
}`,
    smartExpiry: `// 1. Auto-Detect (Default in Browser)
// SDK automatically uses navigator.connection
const url = await s3.upload(file, {
  filename: 'video.mp4'
});

// 2. Manual Override (Server-side or custom)
const url = await s3.upload(file, {
  filename: 'video.mp4',
  networkInfo: {
    type: '4g',
    downlink: 10,  // Mbps
    rtt: 50        // ms
  }
});`
  },

  vue: {
    setup: `<script setup lang="ts">
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: import.meta.env.VITE_OBITOX_API_KEY,
  apiSecret: import.meta.env.VITE_OBITOX_API_SECRET
});

const s3 = client.s3({
  accessKey: import.meta.env.VITE_S3_ACCESS_KEY,
  secretKey: import.meta.env.VITE_S3_SECRET_KEY,
  bucket: 'my-bucket',
  region: 'us-east-1'
});
</script>`,
    customEndpoint: `const s3 = client.s3({
  // ...
  endpoint: 'https://minio.local'
});`,
    directApi: `const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: 'key',
  s3SecretKey: 'secret',
  s3Bucket: 'bucket',
  s3Region: 'region'
});`,
    basicUpload: `const url = await s3.upload(file, {
  filename: 'image.png'
});`,
    progressTracking: `const url = await s3.upload(file, {
  filename: 'video.mp4',
  onProgress: (p) => { progress.value = p; }
});`,
    signedExpiry: `const url = await s3.upload(file, {
  filename: 'temp.txt',
  expiresIn: 600
});`,
    magicBytes: `const url = await s3.upload(file, {
  filename: 'pic.jpg',
  validation: 'images'
});`,
    multipart: `const url = await s3.upload(largeFile, {
  filename: 'dataset.zip'
});`,
    batchUpload: `const result = await s3.batchUpload({
  files: files.value.map(f => ({
    filename: f.name,
    contentType: f.type,
    fileSize: f.size
  }))
});`,
    download: `const url = await s3.getSignedDownloadUrl({
  fileKey: 'report.pdf',
  expiresIn: 3600
});`,
    listFiles: `const res = await s3.list({ maxKeys: 10 });
files.value = res.files;`,
    deleteFiles: `await s3.delete({ fileKey: 'old.txt' });`,
    cors: `// Backend task`,
    metadata: `const meta = await s3.getMetadata({ key: 'file.txt' });`,
    webhookAuto: `const url = await s3.upload(file, {
  filename: 'doc.pdf',
  webhook: {
    url: 'https://api.site.com/hook',
    trigger: 'auto'
  }
});`,
    webhookManual: `const url = await s3.upload(file, {
  filename: 'doc.pdf',
  webhook: {
    url: 'https://api.site.com/hook',
    trigger: 'manual',
    secret: 'xyz'
  }
});`,
    webhookSignature: `// Backend verification`,
    smartExpiry: `// 1. Auto-Detect (Default in Browser)
const url = await s3.upload(file, {
  filename: 'video.mp4'
});

// 2. Manual Override
const url = await s3.upload(file, {
  filename: 'video.mp4',
  networkInfo: {
    type: '4g',
    downlink: 10,
    rtt: 50
  }
});`
  },

  svelte: {
    setup: `<script lang="ts">
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: import.meta.env.VITE_OBITOX_KEY,
  apiSecret: import.meta.env.VITE_OBITOX_SECRET
});

const s3 = client.s3({
  accessKey: import.meta.env.VITE_S3_KEY,
  secretKey: import.meta.env.VITE_S3_SECRET,
  bucket: 'my-bucket',
  region: 'us-east-1'
});
</script>`,
    customEndpoint: `const s3 = client.s3({
  // ...
  endpoint: 'http://localhost:9000'
});`,
    directApi: `const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: '...',
  s3SecretKey: '...',
  s3Bucket: '...',
  s3Region: '...'
});`,
    basicUpload: `const url = await s3.upload(file, {
  filename: 'note.txt'
});`,
    progressTracking: `const url = await s3.upload(file, {
  filename: 'movie.mkv',
  onProgress: (p) => { progress = p; }
});`,
    signedExpiry: `const url = await s3.upload(file, {
  filename: 'secret.txt',
  expiresIn: 60
});`,
    magicBytes: `const url = await s3.upload(file, {
  filename: 'avatar.png',
  validation: 'images'
});`,
    multipart: `const url = await s3.upload(largeFile, {
  filename: 'backup.tar.gz'
});`,
    batchUpload: `const result = await s3.batchUpload({
  files: files.map(f => ({
    filename: f.name,
    contentType: f.type,
    fileSize: f.size
  }))
});`,
    download: `const url = await s3.getSignedDownloadUrl({
  fileKey: 'note.txt',
  expiresIn: 3600
});`,
    listFiles: `const res = await s3.list();
fileList = res.files;`,
    deleteFiles: `await s3.delete({ fileKey: 'note.txt' });`,
    cors: `// Backend`,
    metadata: `const meta = await s3.getMetadata({ key: 'file.txt' });`,
    webhookAuto: `const url = await s3.upload(file, {
  filename: 'data.xlsx',
  webhook: {
    url: 'https://hooks.site/s3',
    trigger: 'auto'
  }
});`,
    webhookManual: `// Manual trigger setup`,
    webhookSignature: `// Backend verification`,
    smartExpiry: `// 1. Auto-Detect (Default in Browser)
const url = await s3.upload(file, {
  filename: 'video.mp4'
});

// 2. Manual Override
const url = await s3.upload(file, {
  filename: 'video.mp4',
  networkInfo: {
    type: '4g',
    downlink: 10,
    rtt: 50
  }
});`
  },

  angular: {
    setup: `import { Injectable } from '@angular/core';
import ObitoX from '@obitox/upload';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class S3Service {
  private client = new ObitoX({
    apiKey: environment.obitoxKey,
    apiSecret: environment.obitoxSecret
  });

  public s3 = this.client.s3({
    accessKey: environment.s3Key,
    secretKey: environment.s3Secret,
    bucket: environment.s3Bucket,
    region: environment.s3Region
  });
}`,
    customEndpoint: `this.client.s3({
  endpoint: 'https://objects.dreamhost.com',
  // ...
});`,
    directApi: `async uploadDirect(file: File) {
  return this.client.uploadFile(file, {
    provider: 'S3',
    s3AccessKey: '...',
    s3SecretKey: '...',
    s3Bucket: '...',
    s3Region: '...'
  });
}`,
    basicUpload: `async upload(file: File) {
  return this.s3.upload(file, {
    filename: file.name
  });
}`,
    progressTracking: `async uploadWithProgress(file: File) {
  return this.s3.upload(file, {
    filename: file.name,
    onProgress: (p) => this.progress.next(p)
  });
}`,
    signedExpiry: `async uploadTemp(file: File) {
  return this.s3.upload(file, {
    filename: file.name,
    expiresIn: 3600
  });
}`,
    magicBytes: `async uploadImage(file: File) {
  return this.s3.upload(file, {
    filename: file.name,
    validation: 'images'
  });
}`,
    multipart: `// Handled internally`,
    batchUpload: `async uploadBatch(files: File[]) {
  return this.s3.batchUpload({
    files: files.map(f => ({
      filename: f.name,
      contentType: f.type,
      fileSize: f.size
    }))
  });
}`,
    download: `async getLink(key: string) {
  return this.s3.getSignedDownloadUrl({
    fileKey: key
  });
}`,
    listFiles: `async list() {
  return this.s3.list({ maxKeys: 100 });
}`,
    deleteFiles: `async delete(key: string) {
  return this.s3.delete({ fileKey: key });
}`,
    cors: `// Backend`,
    metadata: `// ...`,
    webhookAuto: `// ...`,
    webhookManual: `// ...`,
    webhookSignature: `// ...`,
    smartExpiry: `// 1. Auto-Detect
const url = await this.s3.upload(file, {
  filename: 'video.mp4'
});

// 2. Manual Override
const url = await this.s3.upload(file, {
  filename: 'video.mp4',
  networkInfo: {
    type: '4g',
    downlink: 10,
    rtt: 50
  }
});`
  },

  nuxt: {
    setup: `// server/utils/s3.ts
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY!,
  apiSecret: process.env.OBITOX_API_SECRET!
});

export const s3 = client.s3({
  accessKey: process.env.S3_ACCESS_KEY!,
  secretKey: process.env.S3_SECRET_KEY!,
  bucket: process.env.S3_BUCKET!,
  region: process.env.S3_REGION!
});`,
    customEndpoint: `// server/utils/s3.ts
export const minio = client.s3({
  endpoint: process.env.MINIO_ENDPOINT,
  // ...
});`,
    directApi: `// server/api/upload.post.ts
export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);
  const file = files?.[0];
  
  const url = await client.uploadFile(file!.data, {
    provider: 'S3',
    s3AccessKey: process.env.S3_KEY,
    // ...
  });
  return { url };
});`,
    basicUpload: `// server/api/upload.post.ts
const url = await s3.upload(file!.data, {
  filename: file!.filename
});`,
    progressTracking: `// Progress typically handled client-side or via stream`,
    signedExpiry: `const url = await s3.upload(file!.data, {
  filename: 'secret.txt',
  expiresIn: 60
});`,
    magicBytes: `const url = await s3.upload(file!.data, {
  filename: 'pic.jpg',
  validation: 'images'
});`,
    multipart: `// Handled internally`,
    batchUpload: `// ...`,
    download: `// server/api/download.get.ts
export default defineEventHandler(async (event) => {
  const { key } = getQuery(event);
  const url = await s3.getSignedDownloadUrl({
    fileKey: key as string
  });
  return { url };
});`,
    listFiles: `// ...`,
    deleteFiles: `await s3.delete({ fileKey: 'old.txt' });`,
    cors: `// ...`,
    metadata: `// ...`,
    webhookAuto: `// ...`,
    webhookManual: `// ...`,
    webhookSignature: `// ...`,
    smartExpiry: `// 1. Auto-Detect (Default in Browser)
const url = await s3.upload(file!.data, {
  filename: 'video.mp4'
});

// 2. Manual Override
const url = await s3.upload(file!.data, {
  filename: 'video.mp4',
  networkInfo: {
    type: '4g',
    downlink: 10,
    rtt: 50
  }
});`
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

const s3 = client.s3({
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  bucket: 'my-bucket',
  region: 'us-east-1'
});`,
    customEndpoint: `const s3 = client.s3({
  accessKey: 'minioadmin',
  secretKey: 'minioadmin123',
  bucket: 'local-bucket',
  endpoint: 'http://localhost:9000',
  region: 'us-east-1'
});`,
    directApi: `const fileUrl = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: 'key',
  s3SecretKey: 'secret',
  s3Bucket: 'bucket',
  s3Region: 'us-east-1'
});`,
    basicUpload: `const url = await s3.upload(file, {
  filename: 'document.txt'
});`,
    progressTracking: `const url = await s3.upload(file, {
  filename: 'video.mp4',
  onProgress: (percent, uploaded, total) => {
    console.log(\`\${percent}% — \${uploaded}/\${total} bytes\`);
  }
});`,
    signedExpiry: `const url = await s3.upload(file, {
  filename: 'doc.txt',
  expiresIn: 3600
});`,
    magicBytes: `const url = await s3.upload(file, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
    multipart: `// Automatic for large files
const url = await s3.upload(largeFile, {
  filename: 'archive.zip',
  onProgress: (p) => console.log(p)
});`,
    batchUpload: `const result = await s3.batchUpload({
  files: [
    { filename: 'a.txt', contentType: 'text/plain', fileSize: 100 },
    { filename: 'b.jpg', contentType: 'image/jpeg', fileSize: 500 }
  ]
});
console.log(result.summary);`,
    download: `const url = await s3.getSignedDownloadUrl({
  fileKey: 'doc.txt',
  expiresIn: 3600
});`,
    listFiles: `const res = await s3.list({ maxKeys: 100 });
res.files.forEach(f => console.log(f.key));`,
    deleteFiles: `await s3.delete({ fileKey: 'doc.txt' });`,
    cors: `await s3.configureCors({
  origins: ['https://example.com'],
  allowedMethods: ['GET', 'POST']
});`,
    metadata: `const meta = await s3.getMetadata({ key: 'doc.txt' });`,
    webhookAuto: `const url = await s3.upload(file, {
  filename: 'report.pdf',
  webhook: {
    url: 'https://api.myapp.com/hooks',
    trigger: 'auto'
  }
});`,
    webhookManual: `const url = await s3.upload(file, {
  filename: 'invoice.pdf',
  webhook: {
    url: 'https://api.myapp.com/hooks',
    trigger: 'manual',
    secret: 'secret-key'
  }
});`,
    webhookSignature: `import crypto from 'crypto';

function verify(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return signature === \`sha256=\${hmac.digest('hex')}\`;
}`,
    smartExpiry: `// 1. Auto-Detect (Default in Browser)
// SDK automatically uses navigator.connection
const url = await s3.upload(file, {
  filename: 'video.mp4'
});

// 2. Manual Override (Server-side or custom)
const url = await s3.upload(file, {
  filename: 'video.mp4',
  networkInfo: {
    type: '4g',
    downlink: 10,  // Mbps
    rtt: 50        // ms
  }
});`
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

const s3 = client.s3({
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  bucket: 'my-bucket',
  region: 'us-east-1'
});`,
    customEndpoint: `const s3 = client.s3({
  endpoint: 'http://localhost:9000',
  // ... credentials
});`,
    directApi: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'S3',
    s3AccessKey: 'key',
    // ...
  });
  res.json({ url });
});`,
    basicUpload: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await s3.upload(req.file.buffer, {
    filename: req.file.originalname
  });
  res.json({ url });
});`,
    progressTracking: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await s3.upload(req.file.buffer, {
    filename: req.file.originalname,
    onProgress: (p) => console.log(\`Progress: \${p}%\`)
  });
  res.json({ url });
});`,
    signedExpiry: `app.post('/upload/temp', upload.single('file'), async (req, res) => {
  const url = await s3.upload(req.file.buffer, {
    filename: req.file.originalname,
    expiresIn: 300
  });
  res.json({ url });
});`,
    magicBytes: `app.post('/upload/image', upload.single('file'), async (req, res) => {
  const url = await s3.upload(req.file.buffer, {
    filename: req.file.originalname,
    validation: 'images'
  });
  res.json({ url });
});`,
    multipart: `// Handled automatically`,
    batchUpload: `app.post('/batch', upload.array('files'), async (req, res) => {
  const result = await s3.batchUpload({
    files: req.files.map(f => ({
      filename: f.originalname,
      contentType: f.mimetype,
      fileSize: f.size
    }))
  });
  res.json(result);
});`,
    download: `app.get('/download/:key', async (req, res) => {
  const url = await s3.getSignedDownloadUrl({
    fileKey: req.params.key,
    expiresIn: 3600
  });
  res.redirect(url);
});`,
    listFiles: `app.get('/files', async (req, res) => {
  const result = await s3.list({ maxKeys: 20 });
  res.json(result.files);
});`,
    deleteFiles: `app.delete('/files/:key', async (req, res) => {
  await s3.delete({ fileKey: req.params.key });
  res.sendStatus(204);
});`,
    cors: `app.post('/admin/cors', async (req, res) => {
  await s3.configureCors({
    origins: ['*'],
    allowedMethods: ['GET']
  });
  res.sendStatus(200);
});`,
    metadata: `app.get('/meta/:key', async (req, res) => {
  const meta = await s3.getMetadata({ key: req.params.key });
  res.json(meta);
});`,
    webhookAuto: `// ... Same as Node example`,
    webhookManual: `// ... Same as Node example`,
    webhookSignature: `// ... Same as Node example`,
    smartExpiry: `// 1. Auto-Detect (Default in Browser)
// SDK automatically uses navigator.connection
const url = await s3.upload(file, {
  filename: 'video.mp4'
});

// 2. Manual Override (Server-side or custom)
const url = await s3.upload(file, {
  filename: 'video.mp4',
  networkInfo: {
    type: '4g',
    downlink: 10,  // Mbps
    rtt: 50        // ms
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

s3 = client.s3({
    'access_key': os.getenv('S3_ACCESS_KEY'),
    'secret_key': os.getenv('S3_SECRET_KEY'),
    'bucket': 'my-bucket',
    'region': 'us-east-1'
})`,
    customEndpoint: `s3 = client.s3({
    'access_key': 'minioadmin',
    'secret_key': 'minioadmin123',
    'bucket': 'local',
    'endpoint': 'http://localhost:9000',
    'region': 'us-east-1'
})`,
    directApi: `url = client.upload_file(file, {
    'provider': 'S3',
    's3_access_key': 'key',
    's3_secret_key': 'secret',
    's3_bucket': 'bucket',
    's3_region': 'region'
})`,
    basicUpload: `url = s3.upload(file, {
    'filename': 'document.txt'
})`,
    progressTracking: `def on_progress(p, uploaded, total):
    print(f'{p}%')

url = s3.upload(file, {
    'filename': 'video.mp4',
    'on_progress': on_progress
})`,
    signedExpiry: `url = s3.upload(file, {
    'filename': 'doc.txt',
    'expires_in': 3600
})`,
    magicBytes: `url = s3.upload(file, {
    'filename': 'pic.jpg',
    'validation': 'images'
})`,
    multipart: `url = s3.upload(large_file, {
    'filename': 'archive.zip'
})`,
    batchUpload: `result = s3.batch_upload({
    'files': [
        {'filename': 'a.txt', 'content_type': 'text/plain', 'file_size': 100},
        {'filename': 'b.jpg', 'content_type': 'image/jpeg', 'file_size': 500}
    ]
})`,
    download: `url = s3.get_signed_download_url({
    'file_key': 'doc.txt',
    'expires_in': 3600
})`,
    listFiles: `res = s3.list({'max_keys': 10})
for f in res['files']:
    print(f['key'])`,
    deleteFiles: `s3.delete({'file_key': 'doc.txt'})`,
    cors: `s3.configure_cors({
    'origins': ['*'],
    'allowed_methods': ['GET']
})`,
    metadata: `meta = s3.get_metadata({'key': 'doc.txt'})`,
    webhookAuto: `url = s3.upload(file, {
    'filename': 'report.pdf',
    'webhook': {
        'url': 'https://api.site.com/hook',
        'trigger': 'auto'
    }
})`,
    webhookManual: `url = s3.upload(file, {
    'filename': 'report.pdf',
    'webhook': {
        'url': 'https://api.site.com/hook',
        'trigger': 'manual',
        'secret': 'xyz'
    }
})`,
    webhookSignature: `import hmac
import hashlib
import json

def verify(payload, signature, secret):
    computed = hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    return signature == f'sha256={computed}'`,
    smartExpiry: `# 1. Auto-Detect (Not available server-side)
url = s3.upload(file, {
    'filename': 'video.mp4'
})

# 2. Manual Override
url = s3.upload(file, {
    'filename': 'video.mp4',
    'network_info': {
        'type': '4g',
        'downlink': 10,  # Mbps
        'rtt': 50        # ms
    }
})`
  },

  django: {
    setup: `# settings.py
OBITOX_CONFIG = {
    'api_key': os.getenv('OBITOX_API_KEY'),
    'api_secret': os.getenv('OBITOX_API_SECRET')
}

S3_CONFIG = {
    'access_key': os.getenv('S3_ACCESS_KEY'),
    'secret_key': os.getenv('S3_SECRET_KEY'),
    'bucket': 'my-bucket',
    'region': 'us-east-1'
}

# services/s3.py
from django.conf import settings
from obitox import ObitoX

_client = ObitoX(**settings.OBITOX_CONFIG)
s3_service = _client.s3(settings.S3_CONFIG)`,
    customEndpoint: `# Add endpoint to S3_CONFIG in settings.py`,
    directApi: `url = _client.upload_file(file, {
    'provider': 'S3',
    's3_access_key': settings.S3_ACCESS_KEY,
    # ...
})`,
    basicUpload: `# views.py
from django.http import JsonResponse
from .services.s3 import s3_service

def upload_view(request):
    if request.method == 'POST':
        file = request.FILES['file']
        url = s3_service.upload(file.read(), {
            'filename': file.name
        })
        return JsonResponse({'url': url})`,
    progressTracking: `url = s3_service.upload(file.read(), {
    'filename': file.name,
    'on_progress': lambda p, u, t: print(p)
})`,
    signedExpiry: `url = s3_service.upload(file.read(), {
    'filename': 'doc.txt',
    'expires_in': 3600
})`,
    magicBytes: `url = s3_service.upload(file.read(), {
    'filename': 'pic.jpg',
    'validation': 'images'
})`,
    multipart: `# Handled automatically`,
    batchUpload: `# ...`,
    download: `url = s3_service.get_signed_download_url({
    'file_key': request.GET.get('key'),
    'expires_in': 3600
})`,
    listFiles: `files = s3_service.list({'max_keys': 20})`,
    deleteFiles: `s3_service.delete({'file_key': 'old.txt'})`,
    cors: `# Admin view
s3_service.configure_cors({...})`,
    metadata: `meta = s3_service.get_metadata({'key': 'doc.txt'})`,
    webhookAuto: `# ...`,
    webhookManual: `# ...`,
    webhookSignature: `# ...`,
    smartExpiry: `# 1. Auto-Detect (Not available server-side)
url = s3_service.upload(file.read(), {
    'filename': 'video.mp4'
})

# 2. Manual Override
url = s3_service.upload(file.read(), {
    'filename': 'video.mp4',
    'network_info': {
        'type': '4g',
        'downlink': 10,  # Mbps
        'rtt': 50        # ms
    }
})`
  },

  fastapi: {
    setup: `from fastapi import FastAPI, UploadFile, Depends
from obitox import ObitoX
import os
from functools import lru_cache

app = FastAPI()

@lru_cache()
def get_s3_service():
    client = ObitoX(
        api_key=os.getenv("OBITOX_API_KEY"),
        api_secret=os.getenv("OBITOX_API_SECRET")
    )
    return client.s3({
        'access_key': os.getenv("S3_ACCESS_KEY"),
        'secret_key': os.getenv("S3_SECRET_KEY"),
        'bucket': "my-bucket",
        'region': "us-east-1"
    })`,
    customEndpoint: `# Configure in get_s3_service`,
    directApi: `# Use get_s3_service client instance`,
    basicUpload: `@app.post("/upload")
async def upload(file: UploadFile, s3=Depends(get_s3_service)):
    content = await file.read()
    url = s3.upload(content, {
        'filename': file.filename
    })
    return {"url": url}`,
    progressTracking: `@app.post("/upload")
async def upload(file: UploadFile, s3=Depends(get_s3_service)):
    content = await file.read()
    url = s3.upload(content, {
        'filename': file.filename,
        'on_progress': lambda p, u, t: print(p)
    })
    return {"url": url}`,
    signedExpiry: `url = s3.upload(content, {
    'filename': 'doc.txt',
    'expires_in': 300
})`,
    magicBytes: `url = s3.upload(content, {
    'filename': 'pic.jpg',
    'validation': 'images'
})`,
    multipart: `# Handled automatically`,
    batchUpload: `# ...`,
    download: `@app.get("/download/{key}")
async def download(key: str, s3=Depends(get_s3_service)):
    url = s3.get_signed_download_url({
        'file_key': key,
        'expires_in': 3600
    })
    return {"url": url}`,
    listFiles: `res = s3.list({'max_keys': 20})`,
    deleteFiles: `s3.delete({'file_key': 'doc.txt'})`,
    cors: `s3.configure_cors({...})`,
    metadata: `meta = s3.get_metadata({'key': 'doc.txt'})`,
    webhookAuto: `url = s3.upload(content, {
    'filename': 'report.pdf',
    'webhook': {'url': '...', 'trigger': 'auto'}
})`,
    webhookManual: `# ...`,
    webhookSignature: `# ...`,
    smartExpiry: `# 1. Auto-Detect (Not available server-side)
url = s3.upload(content, {
    'filename': 'video.mp4'
})

# 2. Manual Override
url = s3.upload(content, {
    'filename': 'video.mp4',
    'network_info': {
        'type': '4g',
        'downlink': 10,  # Mbps
        'rtt': 50        # ms
    }
})`
  },

  php: {
    setup: `<?php
require_once 'vendor/autoload.php';
use ObitoX\\ObitoXClient;

$client = new ObitoXClient([
    'api_key' => getenv('OBITOX_API_KEY'),
    'api_secret' => getenv('OBITOX_API_SECRET')
]);

$s3 = $client->s3([
    'access_key' => getenv('S3_ACCESS_KEY'),
    'secret_key' => getenv('S3_SECRET_KEY'),
    'bucket' => 'my-bucket',
    'region' => 'us-east-1'
]);`,
    customEndpoint: `$s3 = $client->s3([
    // ...
    'endpoint' => 'http://localhost:9000'
]);`,
    directApi: `$url = $client->uploadFile($file, [
    'provider' => 'S3',
    's3_access_key' => 'key',
    // ...
]);`,
    basicUpload: `$url = $s3->upload($file, [
    'filename' => 'doc.txt'
]);`,
    progressTracking: `$url = $s3->upload($file, [
    'filename' => 'video.mp4',
    'on_progress' => function($p) { echo $p . "%"; }
]);`,
    signedExpiry: `$url = $s3->upload($file, [
    'filename' => 'doc.txt',
    'expires_in' => 3600
]);`,
    magicBytes: `$url = $s3->upload($file, [
    'filename' => 'pic.jpg',
    'validation' => 'images'
]);`,
    multipart: `$url = $s3->upload($largeFile, [
    'filename' => 'archive.zip'
]);`,
    batchUpload: `$res = $s3->batchUpload([
    'files' => [
        ['filename' => 'a.txt', 'content_type' => 'text/plain', 'file_size' => 100],
        ['filename' => 'b.jpg', 'content_type' => 'image/jpeg', 'file_size' => 500]
    ]
]);`,
    download: `$url = $s3->getSignedDownloadUrl([
    'file_key' => 'doc.txt',
    'expires_in' => 3600
]);`,
    listFiles: `$res = $s3->list(['max_keys' => 20]);
foreach ($res['files'] as $f) { echo $f['key']; }`,
    deleteFiles: `$s3->delete(['file_key' => 'doc.txt']);`,
    cors: `$s3->configureCors([
    'origins' => ['*'],
    'allowed_methods' => ['GET']
]);`,
    metadata: `$meta = $s3->getMetadata(['key' => 'doc.txt']);`,
    webhookAuto: `$url = $s3->upload($file, [
    'filename' => 'report.pdf',
    'webhook' => [
        'url' => 'https://api.site.com',
        'trigger' => 'auto'
    ]
]);`,
    webhookManual: `// ...`,
    webhookSignature: `// ...`,
    smartExpiry: `// 1. Auto-Detect (Not available server-side)
$url = $s3->upload($file, [
    'filename' => 'video.mp4'
]);

// 2. Manual Override
$url = $s3->upload($file, [
    'filename' => 'video.mp4',
    'network_info' => [
        'type' => '4g',
        'downlink' => 10, // Mbps
        'rtt' => 50       // ms
    ]
]);`
  },

  laravel: {
    setup: `// config/services.php
'obitox' => [
    'key' => env('OBITOX_API_KEY'),
    'secret' => env('OBITOX_API_SECRET'),
],
's3' => [
    'access_key' => env('S3_ACCESS_KEY'),
    'secret_key' => env('S3_SECRET_KEY'),
    'bucket' => env('S3_BUCKET'),
    'region' => env('S3_REGION', 'us-east-1'),
],

// AppServiceProvider.php
public function register() {
    $this->app->singleton('obitox.s3', function ($app) {
        $client = new \\ObitoX\\ObitoXClient([
            'api_key' => config('services.obitox.key'),
            'api_secret' => config('services.obitox.secret'),
        ]);
        return $client->s3([
            'access_key' => config('services.s3.access_key'),
            'secret_key' => config('services.s3.secret_key'),
            'bucket' => config('services.s3.bucket'),
            'region' => config('services.s3.region'),
        ]);
    });
}`,
    customEndpoint: `// Add strict configuration options in services.php`,
    directApi: `// Access via app('obitox.client')`,
    basicUpload: `public function upload(Request $request) {
    if (!$request->hasFile('file')) {
        return response()->json(['error' => 'No file'], 400);
    }
    $file = $request->file('file');
    $s3 = app('obitox.s3');
    
    $url = $s3->upload($file->get(), [
        'filename' => $file->getClientOriginalName()
    ]);
    return response()->json(['url' => $url]);
}`,
    progressTracking: `$url = $s3->upload($content, [
    'filename' => 'video.mp4',
    'on_progress' => function($p) { Log::info($p); }
]);`,
    signedExpiry: `$url = $s3->upload($content, [
    'filename' => 'doc.txt',
    'expires_in' => 3600
]);`,
    magicBytes: `$url = $s3->upload($content, [
    'filename' => 'pic.jpg',
    'validation' => 'images'
]);`,
    multipart: `// Handled automatically`,
    batchUpload: `// ...`,
    download: `$url = $s3->getSignedDownloadUrl([
    'file_key' => $request->input('key'),
    'expires_in' => 3600
]);
return redirect($url);`,
    listFiles: `$res = $s3->list(['max_keys' => 20]);
return response()->json($res['files']);`,
    deleteFiles: `$s3->delete(['file_key' => $key]);`,
    cors: `$s3->configureCors([...]);`,
    metadata: `$meta = $s3->getMetadata(['key' => $key]);`,
    webhookAuto: `// ...`,
    webhookManual: `// ...`,
    webhookSignature: `// ...`,
    smartExpiry: `// 1. Auto-Detect (Not available server-side)
$url = $s3->upload($file->get(), [
    'filename' => 'video.mp4'
]);

// 2. Manual Override
$url = $s3->upload($file->get(), [
    'filename' => 'video.mp4',
    'network_info' => [
        'type' => '4g',
        'downlink' => 10, // Mbps
        'rtt' => 50       // ms
    ]
]);`
  },

  go: {
    setup: `package main

import (
    "os"
    "fmt"
    "github.com/obitox/obitox-go"
)

func main() {
    client := obitox.NewClient(obitox.Config{
        ApiKey:    os.Getenv("OBITOX_API_KEY"),
        ApiSecret: os.Getenv("OBITOX_API_SECRET"),
    })

    s3 := client.S3(obitox.S3Config{
        AccessKey: os.Getenv("S3_ACCESS_KEY"),
        SecretKey: os.Getenv("S3_SECRET_KEY"),
        Bucket:    "my-bucket",
        Region:    "us-east-1",
    })
    
    // Use s3 instance...
}`,
    customEndpoint: `s3 := client.S3(obitox.S3Config{
    // ...
    Endpoint: "http://localhost:9000",
})`,
    directApi: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:    "S3",
    S3AccessKey: "key",
    // ...
})`,
    basicUpload: `url, err := s3.Upload(file, obitox.UploadOptions{
    Filename: "doc.txt",
})`,
    progressTracking: `url, err := s3.Upload(file, obitox.UploadOptions{
    Filename: "video.mp4",
    OnProgress: func(p float64, u, t int64) {
        fmt.Printf("%.1f%%\\n", p)
    },
})`,
    signedExpiry: `url, err := s3.Upload(file, obitox.UploadOptions{
    Filename:  "doc.txt",
    ExpiresIn: 3600,
})`,
    magicBytes: `url, err := s3.Upload(file, obitox.UploadOptions{
    Filename:   "pic.jpg",
    Validation: "images",
})`,
    multipart: `// Automatic`,
    batchUpload: `res, err := s3.BatchUpload(obitox.BatchUploadOptions{
    Files: []obitox.BatchFile{
        {Filename: "a.txt", ContentType: "text/plain", FileSize: 100},
    },
})`,
    download: `url, err := s3.GetSignedDownloadUrl(obitox.DownloadOptions{
    FileKey:   "doc.txt",
    ExpiresIn: 3600,
})`,
    listFiles: `res, err := s3.List(obitox.ListOptions{MaxKeys: 100})
for _, f := range res.Files {
    fmt.Println(f.Key)
}`,
    deleteFiles: `err := s3.Delete(obitox.DeleteOptions{FileKey: "doc.txt"})`,
    cors: `err := s3.ConfigureCors(obitox.CorsConfig{
    Origins: []string{"*"},
    AllowedMethods: []string{"GET"},
})`,
    metadata: `meta, err := s3.GetMetadata(obitox.MetadataOptions{Key: "doc.txt"})`,
    webhookAuto: `url, err := s3.Upload(file, obitox.UploadOptions{
    Filename: "report.pdf",
    Webhook: &obitox.WebhookConfig{
        Url:     "https://api.site.com",
        Trigger: "auto",
    },
})`,
    webhookManual: `// ...`,
    webhookSignature: `import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
)

func verify(payload interface{}, signature, secret string) bool {
    data, _ := json.Marshal(payload)
    mac := hmac.New(sha256.New, []byte(secret))
    mac.Write(data)
    expected := fmt.Sprintf("sha256=%s", hex.EncodeToString(mac.Sum(nil)))
    return signature == expected
}`,
    smartExpiry: `// 1. Auto-Detect (Not available server-side)
url, err := s3.Upload(file, obitox.UploadOptions{
    Filename: "video.mp4",
})

// 2. Manual Override
url, err := s3.Upload(file, obitox.UploadOptions{
    Filename: "video.mp4",
    NetworkInfo: &obitox.NetworkInfo{
        Type:     "4g",
        Downlink: 10, // Mbps
        RTT:      50, // ms
    },
})`
  }
};
