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

export type SupabaseExamples = {
    setup: string;
    basicUpload: string;
    progressTracking: string;
    privateUpload: string;
    magicBytes: string;
    deleteFile: string;
    download: string;
    listBuckets: string;
    webhookAuto: string;
    webhookManual: string;
    cancellation: string;
};

export const supabaseCodeExamples: Record<string, SupabaseExamples> = {
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

const supabase = client.supabase({
  url: process.env.REACT_APP_SUPABASE_URL!,
  token: process.env.REACT_APP_SUPABASE_KEY!,
  bucket: 'avatars'
});

export default function FileUploader() {
  const [url, setUrl] = useState('');
  // See examples below for usage
}`,
        basicUpload: `const [uploading, setUploading] = useState(false);

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  const fileUrl = await supabase.upload(file, {
    filename: file.name
  });
  setUrl(fileUrl);
  setUploading(false);
};

return <input type="file" onChange={handleUpload} disabled={uploading} />;`,
        progressTracking: `const [progress, setProgress] = useState(0);

const fileUrl = await supabase.upload(file, {
  filename: file.name,
  onProgress: (percent) => setProgress(percent)
});

// <progress value={progress} max={100} />`,
        privateUpload: `// Initialize private client
const privateClient = client.supabase({
  url: process.env.REACT_APP_SUPABASE_URL!,
  token: process.env.REACT_APP_SUPABASE_KEY!,
  bucket: 'private-docs'
});

const signedUrl = await privateClient.upload(file, {
  filename: 'contract.pdf'
});
// Returns signed URL`,
        magicBytes: `const url = await supabase.upload(file, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
        deleteFile: `await supabase.delete({
  fileUrl: 'https://...supabase.co/storage/v1/object/public/avatars/photo.jpg'
});
setUrl('');`,
        download: `const { downloadUrl } = await supabase.download({
  filename: 'photo.jpg',
  expiresIn: 3600 // 1 hour signed URL
});
window.open(downloadUrl);`,
        listBuckets: `const buckets = await supabase.listBuckets();
console.log(buckets);`,
        webhookAuto: `const url = await supabase.upload(file, {
  filename: 'report.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto',
    metadata: { userId: 'user_456' }
  }
});`,
        webhookManual: `const url = await supabase.upload(file, {
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

const uploadPromise = supabase.upload(file, {
  filename: 'large.jpg',
  onProgress: (p) => {
    if (p > 50) controller.abort();
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

export const supabase = client.supabase({
  url: process.env.SUPABASE_URL!,
  token: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  bucket: 'avatars'
});`,
        basicUpload: `// app/api/upload/route.ts
import { supabase } from '@/lib/obitox';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const fileUrl = await supabase.upload(file, {
    filename: file.name
  });

  return NextResponse.json({ url: fileUrl });
}`,
        progressTracking: `// Client-side progress via XHR or fetch stream
const fileUrl = await supabase.upload(file, {
  filename: file.name,
  onProgress: (percent) => console.log(\`\${percent}%\`)
});`,
        privateUpload: `// Server action or API route
const privateBucket = client.supabase({
  url: process.env.SUPABASE_URL!,
  token: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  bucket: 'private-docs'
});

const signedUrl = await privateBucket.upload(file, {
  filename: 'contract.pdf'
});`,
        magicBytes: `const url = await supabase.upload(file, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
        deleteFile: `await supabase.delete({
  fileUrl: 'https://...supabase.co/storage/v1/object/public/avatars/photo.jpg'
});`,
        download: `const { downloadUrl } = await supabase.download({
  filename: 'photo.jpg',
  expiresIn: 60 // 1 minute
});`,
        listBuckets: `const buckets = await supabase.listBuckets();
return NextResponse.json(buckets);`,
        webhookAuto: `const url = await supabase.upload(file, {
  filename: 'report.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto',
    metadata: { userId: '123' }
  }
});`,
        webhookManual: `const url = await supabase.upload(file, {
  filename: 'invoice.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    secret: 's_123',
    trigger: 'manual',
    autoConfirm: false,
    metadata: { userId: '123' }
  }
});`,
        cancellation: `const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

try {
  await supabase.upload(file, {
    filename: 'large.jpg',
    signal: controller.signal
  });
} catch (err) {
  return NextResponse.json({ error: 'Cancelled' }, { status: 499 });
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

const supabase = client.supabase({
  url: import.meta.env.VITE_SUPABASE_URL,
  token: import.meta.env.VITE_SUPABASE_KEY,
  bucket: 'avatars'
});

const fileUrl = ref('');
</script>`,
        basicUpload: `async function handleUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  fileUrl.value = await supabase.upload(file, {
    filename: file.name
  });
}`,
        progressTracking: `const progress = ref(0);

fileUrl.value = await supabase.upload(file, {
  filename: file.name,
  onProgress: (p) => { progress.value = p; }
});`,
        privateUpload: `// Initialize private client
const privateClient = client.supabase({
  bucket: 'private-docs',
  // ... other config
});

const signedUrl = await privateClient.upload(file, {
  filename: 'contract.pdf'
});`,
        magicBytes: `const url = await supabase.upload(file, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
        deleteFile: `await supabase.delete({
  fileUrl: fileUrl.value
});
fileUrl.value = '';`,
        download: `const { downloadUrl } = await supabase.download({
  filename: 'photo.jpg',
  expiresIn: 3600
});`,
        listBuckets: `const buckets = await supabase.listBuckets();`,
        webhookAuto: `const url = await supabase.upload(file, {
  filename: 'report.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto'
  }
});`,
        webhookManual: `const url = await supabase.upload(file, {
  filename: 'invoice.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'manual',
    autoConfirm: false
  }
});`,
        cancellation: `const controller = new AbortController();
onUnmounted(() => controller.abort());

try {
  await supabase.upload(file, {
    filename: 'large.jpg',
    onProgress: (p) => { if(p>50) controller.abort(); }
  });
} catch (e) {
  console.log('Cancelled');
}`
    },

    svelte: {
        setup: `<script lang="ts">
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: import.meta.env.VITE_OBITOX_API_KEY,
  apiSecret: import.meta.env.VITE_OBITOX_API_SECRET
});

const supabase = client.supabase({
  url: import.meta.env.VITE_SUPABASE_URL,
  token: import.meta.env.VITE_SUPABASE_KEY,
  bucket: 'avatars'
});

let fileUrl = $state('');
</script>`,
        basicUpload: `async function handleUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  fileUrl = await supabase.upload(file, {
    filename: file.name
  });
}`,
        progressTracking: `let progress = $state(0);

fileUrl = await supabase.upload(file, {
  filename: file.name,
  onProgress: (p) => { progress = p; }
});`,
        privateUpload: `const privateClient = client.supabase({
  bucket: 'private-docs',
  // ...
});

const signedUrl = await privateClient.upload(file, {
  filename: 'contract.pdf'
});`,
        magicBytes: `const url = await supabase.upload(file, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
        deleteFile: `await supabase.delete({
  fileUrl: fileUrl
});
fileUrl = '';`,
        download: `const { downloadUrl } = await supabase.download({
  filename: 'photo.jpg'
});`,
        listBuckets: `const buckets = await supabase.listBuckets();`,
        webhookAuto: `const url = await supabase.upload(file, {
  filename: 'report.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto'
  }
});`,
        webhookManual: `const url = await supabase.upload(file, {
  filename: 'invoice.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'manual',
    autoConfirm: false
  }
});`,
        cancellation: `import { onDestroy } from 'svelte';
const controller = new AbortController();
onDestroy(() => controller.abort());

await supabase.upload(file, { filename: 'large.jpg' });`
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

  private supabase = this.client.supabase({
    url: environment.SUPABASE_URL,
    token: environment.SUPABASE_KEY,
    bucket: 'avatars'
  });
}`,
        basicUpload: `async upload(file: File): Promise<string> {
  return this.supabase.upload(file, {
    filename: file.name
  });
}`,
        progressTracking: `async uploadWithProgress(
  file: File,
  onProgress: (p: number) => void
): Promise<string> {
  return this.supabase.upload(file, {
    filename: file.name,
    onProgress: onProgress
  });
}`,
        privateUpload: `async uploadPrivate(file: File): Promise<string> {
  const privateBucket = this.client.supabase({
    bucket: 'private-docs',
    // ...
  });
  return privateBucket.upload(file, { filename: 'doc.pdf' });
}`,
        magicBytes: `async uploadValidated(file: File): Promise<string> {
  return this.supabase.upload(file, {
    filename: file.name,
    validation: 'images'
  });
}`,
        deleteFile: `async delete(url: string): Promise<void> {
  await this.supabase.delete({ fileUrl: url });
}`,
        download: `async getUrl(filename: string): Promise<string> {
  const { downloadUrl } = await this.supabase.download({
    filename,
    expiresIn: 3600
  });
  return downloadUrl;
}`,
        listBuckets: `async getBuckets(): Promise<any[]> {
  return this.supabase.listBuckets();
}`,
        webhookAuto: `async uploadHook(file: File): Promise<string> {
  return this.supabase.upload(file, {
    filename: file.name,
    webhook: {
      url: 'https://myapp.com/webhooks/upload',
      trigger: 'auto'
    }
  });
}`,
        webhookManual: `async uploadManual(file: File): Promise<string> {
  return this.supabase.upload(file, {
    filename: file.name,
    webhook: {
      url: 'https://myapp.com/webhooks/upload',
      trigger: 'manual'
    }
  });
}`,
        cancellation: `private controller = new AbortController();

cancel() {
  this.controller.abort();
}

async upload(file: File) {
  return this.supabase.upload(file, {
    filename: file.name,
    signal: this.controller.signal // if supported
  });
}`
    },

    nuxt: {
        setup: `// server/utils/obitox.ts
import ObitoX from '@obitox/upload';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY!,
  apiSecret: process.env.OBITOX_API_SECRET!
});

export const supabase = client.supabase({
  url: process.env.SUPABASE_URL!,
  token: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  bucket: 'avatars'
});`,
        basicUpload: `// server/api/upload.post.ts
import { supabase } from '../utils/obitox';

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);
  const file = files?.[0];

  const fileUrl = await supabase.upload(file!.data, {
    filename: file!.filename || 'upload'
  });

  return { url: fileUrl };
});`,
        progressTracking: `// Progress is handled client-side or via stream
const fileUrl = await supabase.upload(file!.data, {
  filename: file!.filename,
  onProgress: (p) => console.log(p)
});`,
        privateUpload: `const privateBucket = client.supabase({ bucket: 'private' });
const signedUrl = await privateBucket.upload(file!.data, {
  filename: 'doc.pdf'
});`,
        magicBytes: `const url = await supabase.upload(file!.data, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
        deleteFile: `await supabase.delete({
  fileUrl: 'https://...'
});`,
        download: `const { downloadUrl } = await supabase.download({
  filename: 'photo.jpg'
});`,
        listBuckets: `const buckets = await supabase.listBuckets();`,
        webhookAuto: `const url = await supabase.upload(file!.data, {
  filename: 'report.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto'
  }
});`,
        webhookManual: `const url = await supabase.upload(file!.data, {
  filename: 'invoice.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'manual'
  }
});`,
        cancellation: `const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

try {
  await supabase.upload(file!.data, { filename: 'large.jpg' });
} catch (e) {
  throw createError({ statusCode: 499, message: 'Cancelled' });
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

const supabase = client.supabase({
  url: 'https://your-project.supabase.co',
  token: process.env.SUPABASE_SERVICE_ROLE_KEY,
  bucket: 'avatars'
});`,
        basicUpload: `const fileUrl = await supabase.upload(file, {
  filename: 'photo.jpg'
});

console.log(fileUrl); // https://...supabase.co/storage/v1/object/public/avatars/photo.jpg`,
        progressTracking: `const fileUrl = await supabase.upload(file, {
  filename: 'video.mp4',
  onProgress: (percent, uploaded, total) => {
    console.log(\`\${percent}% — \${uploaded}/\${total} bytes\`);
  }
});`,
        privateUpload: `const supabasePrivate = client.supabase({
  url: process.env.SUPABASE_URL,
  token: process.env.SUPABASE_KEY,
  bucket: 'private-docs'
});

const signedUrl = await supabasePrivate.upload(file, {
  filename: 'contract.pdf'
});
// Returns signed URL`,
        magicBytes: `const url = await supabase.upload(file, {
  filename: 'photo.jpg',
  validation: 'images'
});`,
        deleteFile: `await supabase.delete({
  fileUrl: 'https://...supabase.co/storage/v1/object/public/avatars/photo.jpg'
});`,
        download: `// Get signed URL for download
const { downloadUrl } = await supabase.download({
  filename: 'photo.jpg',
  expiresIn: 3600 // 1 hour
});
console.log(downloadUrl);`,
        listBuckets: `const buckets = await supabase.listBuckets();
buckets.forEach(b => console.log(b.name));`,
        webhookAuto: `const url = await supabase.upload(file, {
  filename: 'report.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'auto'
  }
});`,
        webhookManual: `const url = await supabase.upload(file, {
  filename: 'invoice.jpg',
  webhook: {
    url: 'https://myapp.com/webhooks/upload',
    trigger: 'manual',
    autoConfirm: false
  }
});
// Call confirm endpoint later`,
        cancellation: `const abortController = new AbortController();

try {
  const uploadPromise = supabase.upload(largeFile, {
    filename: 'large.jpg',
    onProgress: (p) => {
      if (p > 50) abortController.abort();
    }
  });
  await uploadPromise;
} catch (error) {
  console.log('Upload cancelled');
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

const supabase = client.supabase({
  url: process.env.SUPABASE_URL,
  token: process.env.SUPABASE_KEY,
  bucket: 'avatars'
});`,
        basicUpload: `app.post('/upload', upload.single('file'), async (req, res) => {
  const fileUrl = await supabase.upload(req.file.buffer, {
    filename: req.file.originalname
  });
  res.json({ url: fileUrl });
});`,
        progressTracking: `app.post('/upload', upload.single('file'), async (req, res) => {
  const fileUrl = await supabase.upload(req.file.buffer, {
    filename: req.file.originalname,
    onProgress: (percent) => console.log(\`\${percent}%\`)
  });
  res.json({ url: fileUrl });
});`,
        privateUpload: `app.post('/upload-private', upload.single('file'), async (req, res) => {
  const privateBucket = client.supabase({
    bucket: 'private-docs',
    // ...
  });
  const url = await privateBucket.upload(req.file.buffer, {
    filename: 'contract.pdf'
  });
  res.json({ signedUrl: url });
});`,
        magicBytes: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await supabase.upload(req.file.buffer, {
    filename: req.file.originalname,
    validation: 'images'
  });
  res.json({ url });
});`,
        deleteFile: `app.delete('/file', async (req, res) => {
  await supabase.delete({ fileUrl: req.body.url });
  res.json({ deleted: true });
});`,
        download: `app.get('/download/:filename', async (req, res) => {
  const { downloadUrl } = await supabase.download({
    filename: req.params.filename,
    expiresIn: 60
  });
  res.redirect(downloadUrl);
});`,
        listBuckets: `app.get('/buckets', async (req, res) => {
  const buckets = await supabase.listBuckets();
  res.json(buckets);
});`,
        webhookAuto: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await supabase.upload(req.file.buffer, {
    filename: req.file.originalname,
    webhook: {
      url: 'https://myapp.com/webhooks/upload',
      trigger: 'auto'
    }
  });
  res.json({ url });
});`,
        webhookManual: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await supabase.upload(req.file.buffer, {
    filename: req.file.originalname,
    webhook: {
      url: 'https://myapp.com/webhooks/upload',
      trigger: 'manual'
    }
  });
  res.json({ url });
});`,
        cancellation: `app.post('/upload', upload.single('file'), async (req, res) => {
  const controller = new AbortController();
  req.on('close', () => controller.abort());
  // ... upload logic
});`
    },

    python: {
        setup: `from obitox import ObitoX
import os

client = ObitoX(
    api_key=os.getenv('OBITOX_API_KEY'),
    api_secret=os.getenv('OBITOX_API_SECRET')
)

supabase = client.supabase({
    'url': os.getenv('SUPABASE_URL'),
    'token': os.getenv('SUPABASE_KEY'),
    'bucket': 'avatars'
})`,
        basicUpload: `file_url = supabase.upload(file, {
    'filename': 'photo.jpg'
})
print(file_url)`,
        progressTracking: `def on_progress(p, u, t):
    print(f'{p}%')

url = supabase.upload(file, {
    'filename': 'video.mp4',
    'on_progress': on_progress
})`,
        privateUpload: `private_bucket = client.supabase({
    'bucket': 'private-docs',
    # ...
})

signed_url = private_bucket.upload(file, {
    'filename': 'contract.pdf'
})`,
        magicBytes: `url = supabase.upload(file, {
    'filename': 'photo.jpg',
    'validation': 'images'
})`,
        deleteFile: `supabase.delete({
    'file_url': 'https://.../photo.jpg'
})`,
        download: `result = supabase.download({
    'filename': 'photo.jpg',
    'expires_in': 3600
})
print(result['download_url'])`,
        listBuckets: `buckets = supabase.list_buckets()
for b in buckets:
    print(b['name'])`,
        webhookAuto: `url = supabase.upload(file, {
    'filename': 'report.jpg',
    'webhook': {
        'url': 'https://myapp.com/webhooks/upload',
        'trigger': 'auto'
    }
})`,
        webhookManual: `url = supabase.upload(file, {
    'filename': 'invoice.jpg',
    'webhook': {
        'url': 'https://myapp.com/webhooks/upload',
        'trigger': 'manual'
    }
})`,
        cancellation: `# Python cancellation via threading/async
import threading
cancel_event = threading.Event()
# ... pass event to upload`
    },

    django: {
        setup: `# settings.py
OBITOX_CONFIG = {
    'api_key': os.getenv('OBITOX_API_KEY'),
    'api_secret': os.getenv('OBITOX_API_SECRET')
}

SUPABASE_CONFIG = {
    'url': os.getenv('SUPABASE_URL'),
    'token': os.getenv('SUPABASE_KEY'),
    'bucket': 'avatars'
}

# services/obitox.py
from django.conf import settings
from obitox import ObitoX

_client = ObitoX(**settings.OBITOX_CONFIG)
supabase_service = _client.supabase(settings.SUPABASE_CONFIG)`,
        basicUpload: `# views.py
from django.http import JsonResponse
from .services.obitox import supabase_service

def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        
        url = supabase_service.upload(uploaded_file.read(), {
            'filename': uploaded_file.name,
            'content_type': uploaded_file.content_type
        })
        
        return JsonResponse({'url': url})
    return JsonResponse({'error': 'No file'}, status=400)`,
        progressTracking: `def upload_with_progress(file_obj):
    def progress_callback(percent, uploaded, total):
        print(f"Uploaded: {percent}%")

    url = supabase_service.upload(file_obj.read(), {
        'filename': file_obj.name,
        'on_progress': progress_callback
    })
    return url`,
        privateUpload: `private_bucket = _client.supabase({
    'url': settings.SUPABASE_URL,
    'token': settings.SUPABASE_KEY,
    'bucket': 'private-docs'
})

url = private_bucket.upload(file_obj.read(), {
    'filename': 'contract.pdf'
})`,
        magicBytes: `url = supabase_service.upload(file_obj.read(), {
    'filename': 'profile.jpg',
    'validation': 'images'
})`,
        deleteFile: `supabase_service.delete({
    'file_url': 'https://...supabase.co/storage/v1/object/public/avatars/old.jpg'
})`,
        download: `signed_data = supabase_service.download({
    'filename': 'private-image.jpg',
    'expires_in': 3600
})
download_url = signed_data['download_url']`,
        listBuckets: `buckets = supabase_service.list_buckets()
for bucket in buckets:
    print(bucket['name'])`,
        webhookAuto: `url = supabase_service.upload(content, {
    'filename': 'report.jpg',
    'webhook': {
        'url': 'https://api.myapp.com/hooks/upload',
        'trigger': 'auto',
        'metadata': {'user_id': 123}
    }
})`,
        webhookManual: `url = supabase_service.upload(content, {
    'filename': 'invoice.pdf',
    'webhook': {
        'url': 'https://api.myapp.com/hooks/upload',
        'trigger': 'manual',
        'auto_confirm': False
    }
})`,
        cancellation: `# In a background task (e.g., Celery)
# You would typically rely on task revocation
pass`
    },

    fastapi: {
        setup: `from fastapi import FastAPI, UploadFile, Depends
from obitox import ObitoX
import os
from functools import lru_cache

app = FastAPI()

@lru_cache()
def get_supabase_service():
    client = ObitoX(
        api_key=os.getenv("OBITOX_API_KEY"),
        api_secret=os.getenv("OBITOX_API_SECRET")
    )
    return client.supabase({
        'url': os.getenv("SUPABASE_URL"),
        'token': os.getenv("SUPABASE_KEY"),
        'bucket': "avatars"
    })`,
        basicUpload: `@app.post("/upload")
async def upload_file(file: UploadFile, supabase=Depends(get_supabase_service)):
    content = await file.read()
    
    url = supabase.upload(content, {
        'filename': file.filename,
        'content_type': file.content_type
    })
    
    return {"url": url}`,
        progressTracking: `async def progress_handler(percent, uploaded, total):
    print(f"Progress: {percent}%")

@app.post("/upload-progress")
async def upload_with_progress(file: UploadFile, supabase=Depends(get_supabase_service)):
    content = await file.read()
    url = supabase.upload(content, {
        'filename': file.filename,
        'on_progress': progress_handler
    })
    return {"url": url}`,
        privateUpload: `@app.post("/private-upload")
async def private_upload(file: UploadFile):
    # Initialize separate client or override bucket
    private_client = ObitoX(...).supabase({
        'bucket': 'private-docs',
        # ... env vars
    })
    content = await file.read()
    url = private_client.upload(content, {'filename': 'secure.pdf'})
    return {"signed_url": url}`,
        magicBytes: `url = supabase.upload(content, {
    'filename': 'avatar.png',
    'validation': 'images'
})`,
        deleteFile: `supabase.delete({
    'file_url': 'https://.../old-image.png'
})`,
        download: `@app.get("/download/{filename}")
async def get_download_link(filename: str, supabase=Depends(get_supabase_service)):
    result = supabase.download({
        'filename': filename,
        'expires_in': 3600
    })
    return {"download_url": result['download_url']}`,
        listBuckets: `buckets = supabase.list_buckets()
return buckets`,
        webhookAuto: `url = supabase.upload(content, {
    'filename': 'report.pdf',
    'webhook': {
        'url': 'https://api.example.com/hooks',
        'trigger': 'auto'
    }
})`,
        webhookManual: `url = supabase.upload(content, {
    'filename': 'invoice.pdf',
    'webhook': {
        'url': 'https://api.example.com/hooks',
        'trigger': 'manual',
        'secret': 'wh_secret_key'
    }
})`,
        cancellation: `import asyncio
# Fastapi cancellation typically happens if client disconnects
# Use request.is_disconnected() check loop for long processing`
    },

    php: {
        setup: `<?php
use ObitoX\\ObitoXClient;

$client = new ObitoXClient([
    'api_key' => getenv('OBITOX_API_KEY'),
    'api_secret' => getenv('OBITOX_API_SECRET')
]);

$supabase = $client->supabase([
    'url' => getenv('SUPABASE_URL'),
    'token' => getenv('SUPABASE_KEY'),
    'bucket' => 'avatars'
]);`,
        basicUpload: `$url = $supabase->upload($file, [
    'filename' => 'photo.jpg'
]);`,
        progressTracking: `$url = $supabase->upload($file, [
    'filename' => 'video.mp4',
    'on_progress' => function($p) { echo $p; }
]);`,
        privateUpload: `$private = $client->supabase(['bucket' => 'private']);
$url = $private->upload($file, ['filename' => 'doc.pdf']);`,
        magicBytes: `$url = $supabase->upload($file, [
    'filename' => 'photo.jpg',
    'validation' => 'images'
]);`,
        deleteFile: `$supabase->delete(['file_url' => $url]);`,
        download: `$res = $supabase->download([
    'filename' => 'photo.jpg',
    'expires_in' => 3600
]);
echo $res['download_url'];`,
        listBuckets: `$buckets = $supabase->listBuckets();`,
        webhookAuto: `$url = $supabase->upload($file, [
    'filename' => 'report.jpg',
    'webhook' => ['url' => '...', 'trigger' => 'auto']
]);`,
        webhookManual: `$url = $supabase->upload($file, [
    'filename' => 'invoice.jpg',
    'webhook' => ['url' => '...', 'trigger' => 'manual']
]);`,
        cancellation: `// PHP timeout handling`
    },

    laravel: {
        setup: `// config/services.php
'obitox' => [
    'key' => env('OBITOX_API_KEY'),
    'secret' => env('OBITOX_API_SECRET'),
],
'supabase' => [
    'url' => env('SUPABASE_URL'),
    'key' => env('SUPABASE_KEY'),
    'bucket' => env('SUPABASE_BUCKET', 'avatars'),
],

// app/Providers/AppServiceProvider.php
public function register()
{
    $this->app->singleton('supabase.storage', function ($app) {
        $client = new \\ObitoX\\ObitoXClient([
            'api_key' => config('services.obitox.key'),
            'api_secret' => config('services.obitox.secret'),
        ]);

        return $client->supabase([
            'url' => config('services.supabase.url'),
            'token' => config('services.supabase.key'),
            'bucket' => config('services.supabase.bucket'),
        ]);
    });
}`,
        basicUpload: `public function upload(Request $request) {
    if (!$request->hasFile('file')) {
        return response()->json(['error' => 'No file'], 400);
    }

    $file = $request->file('file');
    $supabase = app('supabase.storage');

    $url = $supabase->upload($file->get(), [
        'filename' => $file->getClientOriginalName(),
        'content_type' => $file->getMimeType()
    ]);

    return response()->json(['url' => $url]);
}`,
        progressTracking: `$url = $supabase->upload($fileContent, [
    'filename' => 'large-video.mp4',
    'on_progress' => function($percent, $uploaded, $total) {
        // Log progress or update cache/db
        Log::info("Upload Progress: {$percent}%");
    }
]);`,
        privateUpload: `// Create a temporary client for private bucket
$private = $client->supabase([
    'bucket' => 'private-docs',
    'url' => config('services.supabase.url'),
    'token' => config('services.supabase.key')
]);

$signedUrl = $private->upload($fileContent, [
    'filename' => 'confidential.pdf'
]);`,
        magicBytes: `$url = $supabase->upload($fileContent, [
    'filename' => 'profile-pic.png',
    'validation' => 'images' // Restricts to valid image headers
]);`,
        deleteFile: `$supabase->delete([
    'file_url' => 'https://...supabase.co/.../old-file.jpg'
]);`,
        download: `$result = $supabase->download([
    'filename' => 'private-report.pdf',
    'expires_in' => 3600 // 1 hour
]);
return redirect($result['download_url']);`,
        listBuckets: `$buckets = $supabase->listBuckets();
foreach ($buckets as $bucket) {
    Log::info("Bucket: " . $bucket['name']);
}`,
        webhookAuto: `$url = $supabase->upload($content, [
    'filename' => 'report.csv',
    'webhook' => [
        'url' => route('webhooks.upload'),
        'trigger' => 'auto',
        'metadata' => ['batch_id' => 99]
    ]
]);`,
        webhookManual: `$url = $supabase->upload($content, [
    'filename' => 'invoice.pdf',
    'webhook' => [
        'url' => route('webhooks.upload'),
        'trigger' => 'manual',
        'secret' => config('services.webhook.secret')
    ]
]);`,
        cancellation: `// PHP scripts are synchronous, but you can set timeouts
try {
    $url = $supabase->upload($content, ['timeout' => 10]);
} catch (\\Exception $e) {
    return response()->json(['error' => 'Upload timed out'], 504);
}`
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

    supabase := client.Supabase(obitox.SupabaseConfig{
        Url:    os.Getenv("SUPABASE_URL"),
        Token:  os.Getenv("SUPABASE_KEY"),
        Bucket: "avatars",
    })
    
    // Use supabase instance...
}`,
        basicUpload: `file, _ := os.Open("photo.jpg")
defer file.Close()

url, err := supabase.Upload(file, obitox.UploadOptions{
    Filename:    "photo.jpg",
    ContentType: "image/jpeg",
})

if err != nil {
    log.Fatal(err)
}
fmt.Println("Uploaded:", url)`,
        progressTracking: `url, err := supabase.Upload(file, obitox.UploadOptions{
    Filename: "video.mp4",
    OnProgress: func(percent float64, uploaded, total int64) {
        fmt.Printf("Progress: %.1f%%\n", percent)
    },
})`,
        privateUpload: `// Create separate client instance or just re-init bucket
private := client.Supabase(obitox.SupabaseConfig{
    Url:    os.Getenv("SUPABASE_URL"),
    Token:  os.Getenv("SUPABASE_KEY"),
    Bucket: "private-docs",
})

url, err := private.Upload(file, obitox.UploadOptions{
    Filename: "contract.pdf",
})`,
        magicBytes: `url, err := supabase.Upload(file, obitox.UploadOptions{
    Filename:   "avatar.png",
    Validation: "images", // SDK checks magic bytes
})`,
        deleteFile: `err := supabase.Delete(obitox.DeleteOptions{
    FileUrl: "https://...supabase.co/.../old-image.jpg",
})`,
        download: `result, err := supabase.Download(obitox.DownloadOptions{
    Filename:  "secure-report.pdf",
    ExpiresIn: 3600, // 1 hour
})
if err == nil {
    fmt.Println("Signed URL:", result.DownloadUrl)
}`,
        listBuckets: `buckets, err := supabase.ListBuckets()
for _, b := range buckets {
    fmt.Println(b.Name)
}`,
        webhookAuto: `url, err := supabase.Upload(file, obitox.UploadOptions{
    Filename: "report.csv",
    Webhook: &obitox.WebhookConfig{
        Url:     "https://api.myapp.com/hooks/upload",
        Trigger: "auto",
    },
})`,
        webhookManual: `url, err := supabase.Upload(file, obitox.UploadOptions{
    Filename: "invoice.pdf",
    Webhook: &obitox.WebhookConfig{
        Url:     "https://api.myapp.com/hooks/upload",
        Trigger: "manual",
        Secret:  "wh_secret_123",
    },
})`,
        cancellation: `ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()

url, err := supabase.UploadWithContext(ctx, file, obitox.UploadOptions{
    Filename: "large-file.zip",
})
if err != nil {
    fmt.Println("Upload failed or timed out:", err)
}`
    }
};
