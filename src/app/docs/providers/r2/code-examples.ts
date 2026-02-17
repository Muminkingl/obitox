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

export type R2Examples = {
  setup: string;
  basicUpload: string;
  progressTracking: string;
  smartExpiry: string;
  magicBytes: string;
  batchUpload: string;
  accessTokens: string;
  download: string;
  listFiles: string;
  deleteFiles: string;
  cors: string;
  verifyCors: string;
  webhookAuto: string;
  webhookManual: string;
};

export const r2CodeExamples: Record<string, R2Examples> = {
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

const r2 = client.r2({
  accessKey: process.env.REACT_APP_R2_ACCESS_KEY!,
  secretKey: process.env.REACT_APP_R2_SECRET_KEY!,
  accountId: process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID!,
  bucket: 'my-bucket'
});

export default function FileUploader() {
  const [url, setUrl] = useState('');
  // See below for methods
}`,
    basicUpload: `const [uploading, setUploading] = useState(false);

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  const fileUrl = await r2.upload(file, {
    filename: file.name
  });
  setUrl(fileUrl);
  setUploading(false);
};

return <input type="file" onChange={handleUpload} disabled={uploading} />;`,
    progressTracking: `const [progress, setProgress] = useState(0);

const fileUrl = await r2.upload(file, {
  filename: file.name,
  onProgress: (percent) => setProgress(percent)
});

// <progress value={progress} max={100} />`,
    smartExpiry: `// Automatically set expiry based on network conditions/type
const fileUrl = await r2.upload(file, {
  filename: 'large-asset.zip',
  networkInfo: {
    type: navigator.connection.effectiveType, // '4g'
    downlink: navigator.connection.downlink,   // 10
    rtt: navigator.connection.rtt              // 50
  }
});`,
    magicBytes: `const url = await r2.upload(file, {
  filename: 'photo.jpg',
  validation: 'images' // Validates content-type client-side
});`,
    batchUpload: `const handleBatch = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  const result = await r2.batchUpload({
    files: files.map(f => ({
      file: f,
      filename: f.name
    }))
  });
  console.log(\`Uploaded \${result.summary.successful} files\`);
};`,
    accessTokens: `// Generate a temporary access token for client-side use
const { token, expiresAt } = await r2.generateAccessToken({
  bucket: 'my-bucket',
  permissions: ['read', 'write'],
  expiresIn: 3600
});`,
    download: `const { downloadUrl } = await r2.getSignedDownloadUrl({
  fileKey: 'document.txt',
  expiresIn: 3600 // 1 hour
});
window.open(downloadUrl);`,
    listFiles: `const { files } = await r2.list({
  prefix: 'photos/',
  limit: 20
});
console.log(files);`,
    deleteFiles: `await r2.delete({
  fileUrl: 'https://my-bucket.../photo.jpg'
});

// Or batch delete
await r2.batchDelete({
  keys: ['file1.txt', 'file2.txt']
});`,
    cors: `// Configure CORS for your domain
await r2.configureCors({
  origins: ['https://myapp.com'],
  allowedMethods: ['GET', 'PUT', 'POST'],
  allowedHeaders: ['*'],
  maxAge: 3600
});`,
    verifyCors: `// Check if CORS is correctly configured
const result = await r2.verifyCors();
if (result.isValid) {
  console.log('CORS is good!');
} else {
  console.warn('Issues:', result.issues);
}`,
    webhookAuto: `const url = await r2.upload(file, {
  filename: 'report.pdf',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto'
  }
});`,
    webhookManual: `const url = await r2.upload(file, {
  filename: 'invoice.pdf',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'manual',
    autoConfirm: false // Confirm later via API
  }
});`
  },

  nextjs: {
    setup: `// app/lib/obitox.ts
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY!,
  apiSecret: process.env.OBITOX_API_SECRET!
});

export const r2 = client.r2({
  accessKey: process.env.R2_ACCESS_KEY!,
  secretKey: process.env.R2_SECRET_KEY!,
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
  bucket: 'my-bucket'
});`,
    basicUpload: `// app/api/upload/route.ts
import { r2 } from '@/lib/obitox';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const fileUrl = await r2.upload(file, {
    filename: file.name
  });

  return NextResponse.json({ url: fileUrl });
}`,
    progressTracking: `// Client-Side
const fileUrl = await r2.upload(file, {
  filename: file.name,
  onProgress: (p) => console.log(\`\${p}%\`)
});`,
    smartExpiry: `const url = await r2.upload(file, {
  filename: 'large.zip',
  networkInfo: { type: '4g', downlink: 10, rtt: 50 }
});`,
    magicBytes: `const url = await r2.upload(file, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
    batchUpload: `// Server Action or API
const result = await r2.batchUpload({
  files: files.map(f => ({
    buffer: f.buffer,
    filename: f.name,
    contentType: f.type
  }))
});`,
    accessTokens: `const { token } = await r2.generateAccessToken({
  bucket: 'user-uploads',
  permissions: ['write'],
  expiresIn: 900 // 15 mins
});`,
    download: `const { downloadUrl } = await r2.getSignedDownloadUrl({
  fileKey: 'private.pdf',
  expiresIn: 60
});`,
    listFiles: `const { files } = await r2.list({ prefix: 'user_123/' });
return NextResponse.json(files);`,
    deleteFiles: `await r2.delete({
  fileUrl: 'https://...'
});`,
    cors: `await r2.configureCors({
  origins: ['https://myapp.com'],
  allowedMethods: ['PUT', 'GET']
});`,
    verifyCors: `const status = await r2.verifyCors();
console.log(status.isValid);`,
    webhookAuto: `const url = await r2.upload(file, {
  webhook: {
    url: 'https://api.myapp.com/hooks',
    trigger: 'auto'
  }
});`,
    webhookManual: `const url = await r2.upload(file, {
  webhook: {
    url: 'https://api.myapp.com/hooks',
    trigger: 'manual',
    secret: 'wh_sec_...'
  }
});`
  },

  vue: {
    setup: `<script setup lang="ts">
import { ref } from 'vue';
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: import.meta.env.VITE_OBITOX_API_KEY,
  apiSecret: import.meta.env.VITE_OBITOX_API_SECRET
});

const r2 = client.r2({
  accessKey: import.meta.env.VITE_R2_ACCESS_KEY,
  secretKey: import.meta.env.VITE_R2_SECRET_KEY,
  accountId: import.meta.env.VITE_CF_ACCOUNT_ID,
  bucket: 'my-bucket'
});
</script>`,
    basicUpload: `const fileUrl = ref('');
async function upload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    fileUrl.value = await r2.upload(file, { filename: file.name });
  }
}`,
    progressTracking: `const progress = ref(0);
await r2.upload(file, {
  onProgress: (p) => progress.value = p
});`,
    smartExpiry: `await r2.upload(file, {
  networkInfo: { downlink: 10, rtt: 100 }
});`,
    magicBytes: `await r2.upload(file, { validation: 'images' });`,
    batchUpload: `const result = await r2.batchUpload({
  files: fileList.map(f => ({ file: f, filename: f.name }))
});`,
    accessTokens: `const token = await r2.generateAccessToken({
  permissions: ['read'],
  expiresIn: 3600
});`,
    download: `const { downloadUrl } = await r2.getSignedDownloadUrl({
  fileKey: 'doc.pdf'
});`,
    listFiles: `const { files } = await r2.list({});`,
    deleteFiles: `await r2.delete({ fileUrl: url });`,
    cors: `await r2.configureCors({ origins: ['*'] });`,
    verifyCors: `await r2.verifyCors();`,
    webhookAuto: `await r2.upload(file, {
  webhook: { url: '...', trigger: 'auto' }
});`,
    webhookManual: `await r2.upload(file, {
  webhook: { url: '...', trigger: 'manual' }
});`
  },

  svelte: {
    setup: `<script lang="ts">
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: import.meta.env.VITE_OBITOX_API_KEY,
  apiSecret: import.meta.env.VITE_OBITOX_API_SECRET
});

const r2 = client.r2({
  accessKey: import.meta.env.VITE_R2_ACCESS_KEY,
  secretKey: import.meta.env.VITE_R2_SECRET_KEY,
  accountId: import.meta.env.VITE_CF_ACCOUNT_ID,
  bucket: 'my-bucket'
});
</script>`,
    basicUpload: `let url = $state('');
async function handle(e) {
  const file = e.target.files[0];
  url = await r2.upload(file, { filename: file.name });
}`,
    progressTracking: `let p = $state(0);
await r2.upload(file, {
  onProgress: (percent) => p = percent
});`,
    smartExpiry: `await r2.upload(file, {
  networkInfo: { rtt: 50, downlink: 5 }
});`,
    magicBytes: `await r2.upload(file, { validation: 'docs' });`,
    batchUpload: `const res = await r2.batchUpload({
  files: files
});`,
    accessTokens: `const t = await r2.generateAccessToken({ expiresIn: 60 });`,
    download: `const { downloadUrl } = await r2.getSignedDownloadUrl({ fileKey: 'k' });`,
    listFiles: `const list = await r2.list();`,
    deleteFiles: `await r2.delete({ fileUrl: url });`,
    cors: `await r2.configureCors({ origins: ['localhost'] });`,
    verifyCors: `await r2.verifyCors();`,
    webhookAuto: `await r2.upload(f, { webhook: { url: '...', trigger: 'auto' } });`,
    webhookManual: `await r2.upload(f, { webhook: { url: '...', trigger: 'manual' } });`
  },

  angular: {
    setup: `// r2.service.ts
import { Injectable } from '@angular/core';
import ObitoX from '@obitox/upload';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class R2Service {
  private r2 = new ObitoX({
    apiKey: environment.OBITOX_API_KEY,
    apiSecret: environment.OBITOX_API_SECRET
  }).r2({
    accessKey: environment.R2_ACCESS_KEY,
    secretKey: environment.R2_SECRET_KEY,
    accountId: environment.CF_ACCOUNT_ID,
    bucket: 'my-bucket'
  });
}`,
    basicUpload: `async upload(file: File) {
  return this.r2.upload(file, { filename: file.name });
}`,
    progressTracking: `async uploadWithProgress(file: File) {
  return this.r2.upload(file, {
    onProgress: (p) => console.log(p)
  });
}`,
    smartExpiry: `async uploadSmart(file: File) {
  return this.r2.upload(file, {
    networkInfo: { downlink: 10, rtt: 50 }
  });
}`,
    magicBytes: `async uploadValidated(file: File) {
  return this.r2.upload(file, { validation: 'images' });
}`,
    batchUpload: `async uploadBatch(files: File[]) {
  return this.r2.batchUpload({
    files: files.map(f => ({ file: f, filename: f.name }))
  });
}`,
    accessTokens: `async getToken() {
  return this.r2.generateAccessToken({
    bucket: 'my-bucket',
    expiresIn: 3600
  });
}`,
    download: `async getUrl(key: string) {
  return this.r2.getSignedDownloadUrl({ fileKey: key });
}`,
    listFiles: `async list() {
  return this.r2.list({});
}`,
    deleteFiles: `async delete(url: string) {
  return this.r2.delete({ fileUrl: url });
}`,
    cors: `async setupCors() {
  return this.r2.configureCors({ origins: ['*'] });
}`,
    verifyCors: `async checkCors() {
  return this.r2.verifyCors();
}`,
    webhookAuto: `async uploadHook(file: File) {
  return this.r2.upload(file, {
    webhook: { url: '...', trigger: 'auto' }
  });
}`,
    webhookManual: `async uploadManual(file: File) {
  return this.r2.upload(file, {
    webhook: { url: '...', trigger: 'manual' }
  });
}`
  },

  nuxt: {
    setup: `// server/utils/r2.ts
import ObitoX from '@obitox/upload';

export const r2 = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,
  apiSecret: process.env.OBITOX_API_SECRET
}).r2({
  accessKey: process.env.R2_ACCESS_KEY,
  secretKey: process.env.R2_SECRET_KEY,
  accountId: process.env.CF_ACCOUNT_ID,
  bucket: 'my-bucket'
});`,
    basicUpload: `// server/api/upload.post.ts
import { r2 } from '~/server/utils/r2';

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);
  const file = files?.[0];
  const url = await r2.upload(file.data, { filename: file.filename });
  return { url };
});`,
    progressTracking: `// Client-side progress
const url = await r2.upload(file, {
  onProgress: (p) => console.log(p)
});`,
    smartExpiry: `const url = await r2.upload(file, {
  networkInfo: { type: '4g' }
});`,
    magicBytes: `const url = await r2.upload(file, {
  validation: 'images'
});`,
    batchUpload: `const res = await r2.batchUpload({ files: [...] });`,
    accessTokens: `const token = await r2.generateAccessToken({ ... });`,
    download: `const { downloadUrl } = await r2.getSignedDownloadUrl({ ... });`,
    listFiles: `const { files } = await r2.list();`,
    deleteFiles: `await r2.delete({ fileUrl: '...' });`,
    cors: `await r2.configureCors({ ... });`,
    verifyCors: `await r2.verifyCors();`,
    webhookAuto: `await r2.upload(f, { webhook: { ... } });`,
    webhookManual: `await r2.upload(f, { webhook: { ... } });`
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

const r2 = client.r2({
  accessKey: process.env.R2_ACCESS_KEY,
  secretKey: process.env.R2_SECRET_KEY,
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  bucket: 'my-bucket'
});`,
    basicUpload: `const fileUrl = await r2.upload(fileBuffer, {
  filename: 'document.pdf',
  contentType: 'application/pdf'
});
console.log(fileUrl);`,
    progressTracking: `const url = await r2.upload(stream, {
  filename: 'video.mp4',
  onProgress: (p, uploaded, total) => {
    console.log(\`\${p}% - \${uploaded}/\${total}\`);
  }
});`,
    smartExpiry: `const url = await r2.upload(file, {
  filename: 'temp.zip',
  networkInfo: { type: '3g', downlink: 1.5, rtt: 300 }
});`,
    magicBytes: `const url = await r2.upload(file, {
  filename: 'img.jpg',
  validation: 'images'
});`,
    batchUpload: `const result = await r2.batchUpload({
  files: [
    { buffer: buf1, filename: '1.jpg' },
    { buffer: buf2, filename: '2.jpg' }
  ]
});
console.log(result.summary);`,
    accessTokens: `const { token } = await r2.generateAccessToken({
  bucket: 'my-bucket',
  permissions: ['read', 'write'],
  expiresIn: 3600
});`,
    download: `const { downloadUrl } = await r2.getSignedDownloadUrl({
  fileKey: 'private.pdf',
  expiresIn: 60
});`,
    listFiles: `const { files } = await r2.list({
  prefix: 'photos/',
  limit: 100
});`,
    deleteFiles: `await r2.delete({
  fileUrl: 'https://...'
});`,
    cors: `await r2.configureCors({
  origins: ['https://example.com'],
  allowedMethods: ['GET']
});`,
    verifyCors: `const result = await r2.verifyCors();
if (result.isValid) console.log('CORS OK');`,
    webhookAuto: `const url = await r2.upload(file, {
  webhook: { url: '...', trigger: 'auto' }
});`,
    webhookManual: `const url = await r2.upload(file, {
  webhook: { url: '...', trigger: 'manual' }
});`
  },

  express: {
    setup: `import express from 'express';
import ObitoX from '@obitox/upload';

const app = express();
// ... r2 setup as in Node.js example`,
    basicUpload: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await r2.upload(req.file.buffer, {
    filename: req.file.originalname
  });
  res.json({ url });
});`,
    progressTracking: `// Progress tracking middleware or stream handling`,
    smartExpiry: `const url = await r2.upload(buf, {
  networkInfo: { downlink: 5, rtt: 100 }
});`,
    magicBytes: `const url = await r2.upload(buf, { validation: 'images' });`,
    batchUpload: `app.post('/batch', upload.array('files'), async (req, res) => {
  const result = await r2.batchUpload({
    files: req.files.map(f => ({
      buffer: f.buffer,
      filename: f.originalname
    }))
  });
  res.json(result);
});`,
    accessTokens: `app.get('/token', async (req, res) => {
  const token = await r2.generateAccessToken({
    bucket: 'my-bucket',
    expiresIn: 3600
  });
  res.json(token);
});`,
    download: `app.get('/download/:key', async (req, res) => {
  const { downloadUrl } = await r2.getSignedDownloadUrl({
    fileKey: req.params.key
  });
  res.redirect(downloadUrl);
});`,
    listFiles: `app.get('/files', async (req, res) => {
  const list = await r2.list();
  res.json(list);
});`,
    deleteFiles: `app.delete('/files', async (req, res) => {
  await r2.delete({ fileUrl: req.body.url });
  res.sendStatus(200);
});`,
    cors: `await r2.configureCors({ ... });`,
    verifyCors: `await r2.verifyCors();`,
    webhookAuto: `await r2.upload(buf, { webhook: { ... } });`,
    webhookManual: `await r2.upload(buf, { webhook: { ... } });`
  },

  python: {
    setup: `from obitox import ObitoX
import os

client = ObitoX(
    api_key=os.getenv('OBITOX_API_KEY'),
    api_secret=os.getenv('OBITOX_API_SECRET')
)

r2 = client.r2({
    'access_key': os.getenv('R2_ACCESS_KEY'),
    'secret_key': os.getenv('R2_SECRET_KEY'),
    'account_id': os.getenv('CF_ACCOUNT_ID'),
    'bucket': 'my-bucket'
})`,
    basicUpload: `file_url = r2.upload(file_bytes, {
    'filename': 'document.pdf'
})
print(file_url)`,
    progressTracking: `def on_progress(p, u, t):
    print(f"{p}%")

url = r2.upload(file, {
    'on_progress': on_progress
})`,
    smartExpiry: `url = r2.upload(file, {
    'network_info': {'type': '4g', 'downlink': 10}
})`,
    magicBytes: `url = r2.upload(file, {
    'validation': 'images'
})`,
    batchUpload: `result = r2.batch_upload({
    'files': [
        {'file': f1, 'filename': '1.jpg'},
        {'file': f2, 'filename': '2.jpg'}
    ]
})`,
    accessTokens: `token = r2.generate_access_token({
    'bucket': 'my-bucket',
    'permissions': ['read', 'write'],
    'expires_in': 3600
})`,
    download: `url = r2.get_signed_download_url({
    'file_key': 'doc.pdf',
    'expires_in': 60
})`,
    listFiles: `files = r2.list({
    'prefix': 'photos/'
})`,
    deleteFiles: `r2.delete({
    'file_url': 'https://...'
})`,
    cors: `r2.configure_cors({
    'origins': ['*'],
    'methods': ['GET']
})`,
    verifyCors: `res = r2.verify_cors()
if res['is_valid']:
    print("CORS OK")`,
    webhookAuto: `r2.upload(file, {
    'webhook': {'url': '...', 'trigger': 'auto'}
})`,
    webhookManual: `r2.upload(file, {
    'webhook': {'url': '...', 'trigger': 'manual'}
})`
  },

  django: {
    setup: `# settings.py
OBITOX_CONFIG = {
    'api_key': os.getenv('OBITOX_API_KEY'),
    'api_secret': os.getenv('OBITOX_API_SECRET')
}

R2_CONFIG = {
    'access_key': os.getenv('R2_ACCESS_KEY'),
    'secret_key': os.getenv('R2_SECRET_KEY'),
    'account_id': os.getenv('CLOUDFLARE_ACCOUNT_ID'),
    'bucket': 'my-bucket'
}

# services/obitox.py
from django.conf import settings
from obitox import ObitoX

_client = ObitoX(**settings.OBITOX_CONFIG)
r2_service = _client.r2(settings.R2_CONFIG)`,
    basicUpload: `# views.py
from django.http import JsonResponse
from .services.obitox import r2_service

def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        
        # Read file content
        content = uploaded_file.read()
        
        url = r2_service.upload(content, {
            'filename': uploaded_file.name,
            'content_type': uploaded_file.content_type
        })
        
        return JsonResponse({'url': url})
    return JsonResponse({'error': 'No file provided'}, status=400)`,
    progressTracking: `def upload_with_progress(file_obj):
    def progress_callback(percent, uploaded, total):
        print(f"Upload progress: {percent}%")

    url = r2_service.upload(file_obj.read(), {
        'filename': file_obj.name,
        'on_progress': progress_callback
    })
    return url`,
    smartExpiry: `url = r2_service.upload(file_content, {
    'filename': 'large_asset.zip',
    'network_info': {
        'type': '4g',
        'downlink': 10,  # Mbps
        'rtt': 50        # ms
    }
})`,
    magicBytes: `url = r2_service.upload(file_content, {
    'filename': 'profile.jpg',
    'validation': 'images'  # Enforces image magic bytes
})`,
    batchUpload: `files_to_upload = [
    {
        'filename': 'doc1.pdf',
        'content_type': 'application/pdf',
        'file_size': 1024,
        # In a real app, you'd pass the file buffer/stream here too
        # depending on how the SDK expects batch inputs
    },
    {
        'filename': 'img2.png',
        'content_type': 'image/png',
        'file_size': 2048
    }
]

result = r2_service.batch_upload({
    'files': files_to_upload
})
print(f"Successfully uploaded: {result['summary']['successful']}")`,
    accessTokens: `token_data = r2_service.generate_access_token({
    'bucket': 'my-bucket',
    'permissions': ['read', 'write'],
    'expires_in': 3600
})
access_token = token_data['token']`,
    download: `signed_url = r2_service.get_signed_download_url({
    'file_key': 'private/user_123/contract.pdf',
    'expires_in': 1800  # 30 minutes
})`,
    listFiles: `file_list = r2_service.list({
    'prefix': 'uploads/2024/',
    'limit': 50
})
for f in file_list['files']:
    print(f['key'])`,
    deleteFiles: `# Delete single
r2_service.delete({
    'file_url': 'https://my-bucket.../old-file.txt'
})

# Delete batch
r2_service.batch_delete({
    'keys': ['temp/file1.tmp', 'temp/file2.tmp']
})`,
    cors: `r2_service.configure_cors({
    'origins': ['https://www.myapp.com', 'http://localhost:8000'],
    'allowed_methods': ['GET', 'PUT', 'POST', 'DELETE'],
    'allowed_headers': ['*'],
    'max_age': 3600
})`,
    verifyCors: `status = r2_service.verify_cors()
if status['is_valid']:
    print("CORS is correctly configured")
else:
    print("CORS Issues:", status['issues'])`,
    webhookAuto: `url = r2_service.upload(content, {
    'filename': 'report.pdf',
    'webhook': {
        'url': 'https://api.myapp.com/webhooks/r2-events',
        'trigger': 'auto',
        'metadata': {'user_id': 123}
    }
})`,
    webhookManual: `url = r2_service.upload(content, {
    'filename': 'invoice.pdf',
    'webhook': {
        'url': 'https://api.myapp.com/webhooks/r2-events',
        'trigger': 'manual',
        'auto_confirm': False
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
def get_r2_service():
    client = ObitoX(
        api_key=os.getenv("OBITOX_API_KEY"),
        api_secret=os.getenv("OBITOX_API_SECRET")
    )
    return client.r2({
        'access_key': os.getenv("R2_ACCESS_KEY"),
        'secret_key': os.getenv("R2_SECRET_KEY"),
        'account_id': os.getenv("CLOUDFLARE_ACCOUNT_ID"),
        'bucket': os.getenv("R2_BUCKET_NAME")
    })`,
    basicUpload: `@app.post("/upload")
async def upload_file(file: UploadFile, r2=Depends(get_r2_service)):
    content = await file.read()
    
    url = r2.upload(content, {
        'filename': file.filename,
        'content_type': file.content_type
    })
    
    return {"url": url, "filename": file.filename}`,
    progressTracking: `async def progress_tracker(percent, uploaded, total):
    print(f"Progress: {percent}%")

# In your route:
url = r2.upload(content, {
    'filename': file.filename,
    'on_progress': progress_tracker
})`,
    smartExpiry: `url = r2.upload(content, {
    'filename': 'movie_720p.mp4',
    'network_info': {
        'type': 'wifi',
        'downlink': 50,
        'rtt': 20
    }
})`,
    magicBytes: `url = r2.upload(content, {
    'filename': 'avatar.png',
    'validation': 'images'
})`,
    batchUpload: `# Batch upload endpoint
@app.post("/batch-upload")
async def batch_upload(files: list[UploadFile], r2=Depends(get_r2_service)):
    batch_data = []
    for f in files:
        # Note: In production, read streams carefully for large files
        content = await f.read() 
        batch_data.append({
            'filename': f.filename,
            'content_type': f.content_type,
            'file': content 
        })
        
    result = r2.batch_upload({'files': batch_data})
    return result['summary']`,
    accessTokens: `token_info = r2.generate_access_token({
    'bucket': 'my-bucket',
    'permissions': ['read'],
    'expires_in': 900 # 15 minutes
})`,
    download: `download_link = r2.get_signed_download_url({
    'file_key': 'financial_reports/2024_Q1.pdf',
    'expires_in': 600
})`,
    listFiles: `files = r2.list({
    'prefix': 'public/',
    'limit': 20
})`,
    deleteFiles: `r2.delete({
    'file_url': 'https://bucket.r2.dev/old_image.jpg'
})`,
    cors: `r2.configure_cors({
    'origins': ['https://app.example.com'],
    'allowed_methods': ['GET', 'POST'],
    'allowed_headers': ['Authorization', 'Content-Type']
})`,
    verifyCors: `verification = r2.verify_cors()
if not verification['is_valid']:
    # Handle misconfiguration
    pass`,
    webhookAuto: `url = r2.upload(content, {
    'filename': 'scan.pdf',
    'webhook': {
        'url': 'https://api.example.com/hooks/r2',
        'trigger': 'auto'
    }
})`,
    webhookManual: `url = r2.upload(content, {
    'filename': 'scan.pdf',
    'webhook': {
        'url': 'https://api.example.com/hooks/r2',
        'trigger': 'manual',
        'secret': 'my-secret-key'
    }
})`
  },

  php: {
    setup: `<?php
use ObitoX\\ObitoXClient;

$client = new ObitoXClient([
    'api_key' => getenv('OBITOX_API_KEY'),
    'api_secret' => getenv('OBITOX_API_SECRET')
]);

$r2 = $client->r2([
    'access_key' => getenv('R2_ACCESS_KEY'),
    'secret_key' => getenv('R2_SECRET_KEY'),
    'account_id' => getenv('CF_ACCOUNT_ID'),
    'bucket' => 'my-bucket'
]);`,
    basicUpload: `$url = $r2->upload($file, [
    'filename' => 'photo.jpg'
]);`,
    progressTracking: `$url = $r2->upload($file, [
    'on_progress' => function($p) { echo $p; }
]);`,
    smartExpiry: `$url = $r2->upload($file, [
    'network_info' => ['type' => '4g']
]);`,
    magicBytes: `$url = $r2->upload($file, [
    'validation' => 'images'
]);`,
    batchUpload: `$res = $r2->batchUpload([
    'files' => [
        ['file' => $f1, 'filename' => '1.jpg'],
        ['file' => $f2, 'filename' => '2.jpg']
    ]
]);`,
    accessTokens: `$token = $r2->generateAccessToken([
    'bucket' => 'my-bucket',
    'expires_in' => 3600
]);`,
    download: `$res = $r2->getSignedDownloadUrl([
    'file_key' => 'doc.pdf'
]);`,
    listFiles: `$files = $r2->list();`,
    deleteFiles: `$r2->delete(['file_url' => $url]);`,
    cors: `$r2->configureCors(['origins' => ['*']]);`,
    verifyCors: `$r2->verifyCors();`,
    webhookAuto: `$r2->upload($f, ['webhook' => ['trigger' => 'auto']]);`,
    webhookManual: `$r2->upload($f, ['webhook' => ['trigger' => 'manual']]);`
  },

  laravel: {
    setup: `// config/services.php
'obitox' => [
    'key' => env('OBITOX_API_KEY'),
    'secret' => env('OBITOX_API_SECRET'),
],
'r2' => [
    'access_key' => env('R2_ACCESS_KEY'),
    'secret_key' => env('R2_SECRET_KEY'),
    'account_id' => env('CLOUDFLARE_ACCOUNT_ID'),
    'bucket' => env('R2_BUCKET'),
],

// app/Providers/AppServiceProvider.php
public function register()
{
    $this->app->singleton('r2', function ($app) {
        $client = new \\ObitoX\\ObitoXClient([
            'api_key' => config('services.obitox.key'),
            'api_secret' => config('services.obitox.secret'),
        ]);

        return $client->r2([
            'access_key' => config('services.r2.access_key'),
            'secret_key' => config('services.r2.secret_key'),
            'account_id' => config('services.r2.account_id'),
            'bucket' => config('services.r2.bucket'),
        ]);
    });
}`,
    basicUpload: `public function upload(Request $request) {
    if (!$request->hasFile('file')) {
        return response()->json(['error' => 'No file'], 400);
    }

    $file = $request->file('file');
    $r2 = app('r2');

    $url = $r2->upload($file->get(), [
        'filename' => $file->getClientOriginalName(),
        'content_type' => $file->getMimeType()
    ]);

    return response()->json(['url' => $url]);
}`,
    progressTracking: `$url = $r2->upload($fileContent, [
    'filename' => 'video.mp4',
    'on_progress' => function($percent, $uploaded, $total) {
        Log::info("Upload progress: {$percent}%");
    }
]);`,
    smartExpiry: `$url = $r2->upload($fileContent, [
    'filename' => 'large-backup.zip',
    'network_info' => [
        'type' => '4g',
        'downlink' => 25,
        'rtt' => 45
    ]
]);`,
    magicBytes: `$url = $r2->upload($fileContent, [
    'filename' => 'user-avatar.jpg',
    'validation' => 'images' // Ensures it's a valid image
]);`,
    batchUpload: `$files = $request->allFiles()['files'];
$batchData = array_map(function($f) {
    return [
        'file' => $f->get(),
        'filename' => $f->getClientOriginalName(),
        'content_type' => $f->getMimeType()
    ];
}, $files);

$result = $r2->batchUpload(['files' => $batchData]);
return response()->json($result['summary']);`,
    accessTokens: `$token = $r2->generateAccessToken([
    'bucket' => config('services.r2.bucket'),
    'permissions' => ['read', 'write'],
    'expires_in' => 3600 // 1 hour
]);`,
    download: `$url = $r2->getSignedDownloadUrl([
    'file_key' => 'private/contracts/2024.pdf',
    'expires_in' => 1800
]);
return redirect($url);`,
    listFiles: `$files = $r2->list([
    'prefix' => 'users/' . $user->id . '/',
    'limit' => 100
]);`,
    deleteFiles: `$r2->delete([
    'file_url' => 'https://bucket.r2.dev/old-file.jpg'
]);

// Or batch delete
$r2->batchDelete([
    'keys' => ['temp/1.tmp', 'temp/2.tmp']
]);`,
    cors: `$r2->configureCors([
    'origins' => [config('app.url'), 'https://cdn.example.com'],
    'allowed_methods' => ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
    'allowed_headers' => ['*'],
    'max_age' => 86400
]);`,
    verifyCors: `$status = $r2->verifyCors();
if (!$status['is_valid']) {
    Log::warning('R2 CORS Misconfigured', $status['issues']);
}`,
    webhookAuto: `$url = $r2->upload($content, [
    'filename' => 'export.csv',
    'webhook' => [
        'url' => route('webhooks.r2'),
        'trigger' => 'auto',
        'metadata' => ['user_id' => $user->id]
    ]
]);`,
    webhookManual: `$url = $r2->upload($content, [
    'filename' => 'invoice.pdf',
    'webhook' => [
        'url' => route('webhooks.r2'),
        'trigger' => 'manual',
        'secret' => config('services.r2.webhook_secret')
    ]
]);`
  },

  go: {
    setup: `package main

import (
    "os"
    "fmt"
    "log"
    "github.com/obitox/obitox-go"
)

func main() {
    client := obitox.NewClient(obitox.Config{
        ApiKey:    os.Getenv("OBITOX_API_KEY"),
        ApiSecret: os.Getenv("OBITOX_API_SECRET"),
    })

    r2 := client.R2(obitox.R2Config{
        AccessKey: os.Getenv("R2_ACCESS_KEY"),
        SecretKey: os.Getenv("R2_SECRET_KEY"),
        AccountId: os.Getenv("CLOUDFLARE_ACCOUNT_ID"),
        Bucket:    "my-bucket",
    })
    
    // Use r2 instance...
}`,
    basicUpload: `file, _ := os.Open("document.txt")
defer file.Close()

url, err := r2.Upload(file, obitox.UploadOptions{
    Filename:    "document.txt",
    ContentType: "text/plain",
})

if err != nil {
    log.Fatal(err)
}
fmt.Println("Uploaded:", url)`,
    progressTracking: `url, err := r2.Upload(file, obitox.UploadOptions{
    Filename: "video.mp4",
    OnProgress: func(percent float64, uploaded, total int64) {
        fmt.Printf("Progress: %.1f%% (%d/%d bytes)\n", percent, uploaded, total)
    },
})`,
    smartExpiry: `url, err := r2.Upload(file, obitox.UploadOptions{
    Filename: "large.zip",
    NetworkInfo: &obitox.NetworkInfo{
        Type:     "4g",
        Downlink: 15,
        RTT:      40,
    },
})`,
    magicBytes: `url, err := r2.Upload(file, obitox.UploadOptions{
    Filename:   "image.png",
    Validation: "images", // SDK checks magic bytes
})`,
    batchUpload: `// Prepare batch items
files := []obitox.BatchFile{
    {Filename: "1.jpg", ContentType: "image/jpeg", File: file1Stream},
    {Filename: "2.jpg", ContentType: "image/jpeg", File: file2Stream},
}

result, err := r2.BatchUpload(obitox.BatchUploadOptions{
    Files: files,
})

if err == nil {
    fmt.Printf("Successfully uploaded %d files\n", result.Summary.Successful)
}`,
    accessTokens: `token, err := r2.GenerateAccessToken(obitox.AccessTokenOptions{
    Bucket:      "my-bucket",
    Permissions: []string{"read", "write"},
    ExpiresIn:   3600, // 1 hour
})
fmt.Println("Token:", token.Token)`,
    download: `url, err := r2.GetSignedDownloadUrl(obitox.DownloadUrlOptions{
    FileKey:   "secure/contract.pdf",
    ExpiresIn: 900, // 15 minutes
})`,
    listFiles: `list, err := r2.List(obitox.ListOptions{
    Prefix: "users/123/",
    Limit:  50,
})

for _, f := range list.Files {
    fmt.Printf("%s (%d bytes)\n", f.Key, f.Size)
}`,
    deleteFiles: `// Delete single
err := r2.Delete(obitox.DeleteOptions{
    FileUrl: "https://bucket.r2.dev/old.txt",
})

// Delete batch
result, err := r2.BatchDelete(obitox.BatchDeleteOptions{
    Keys: []string{"temp/1.tmp", "temp/2.tmp"},
})`,
    cors: `err := r2.ConfigureCors(obitox.CorsOptions{
    Origins:        []string{"*"},
    AllowedMethods: []string{"GET", "PUT", "POST"},
    AllowedHeaders: []string{"*"},
    MaxAge:         3600,
})`,
    verifyCors: `status, err := r2.VerifyCors()
if err == nil && status.IsValid {
    fmt.Println("CORS is healthy")
}`,
    webhookAuto: `url, err := r2.Upload(file, obitox.UploadOptions{
    Filename: "data.csv",
    Webhook: &obitox.WebhookConfig{
        Url:     "https://api.myapp.com/hooks",
        Trigger: "auto",
    },
})`,
    webhookManual: `url, err := r2.Upload(file, obitox.UploadOptions{
    Filename: "data.csv",
    Webhook: &obitox.WebhookConfig{
        Url:         "https://api.myapp.com/hooks",
        Trigger:     "manual",
        Secret:      "my-secret",
        AutoConfirm: false,
    },
})`
  }
};
