// app/docs/providers/s3/page.tsx
"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/docs/code-block";
import {
    CheckCircle, Zap, Globe, Shield, Clock, AlertCircle, ArrowRight,
    ThumbsUp, ThumbsDown, Database, Lock, DollarSign, Sparkles,
    TrendingUp, Server, HardDrive, Eye, Download, Trash2, Upload,
    FileText, Settings, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Framework definitions for code examples
const frameworks = [
    { id: "node", name: "Node.js", lang: "typescript" },
    { id: "express", name: "Express", lang: "typescript" },
    { id: "python", name: "Python", lang: "python" },
    { id: "php", name: "PHP", lang: "php" },
    { id: "go", name: "Go", lang: "go" },
    { id: "ruby", name: "Ruby", lang: "ruby" },
];

// S3 code examples for each framework
const s3CodeExamples: Record<string, {
    quickStart: string;
    basicUpload: string;
    storageClass: string;
    encryptionSSES3: string;
    encryptionKMS: string;
    cloudFront: string;
    progressTracking: string;
    signedUrl: string;
    forceDownload: string;
    deleteFile: string;
    batchDelete: string;
    listFiles: string;
    getMetadata: string;
    multipart: string;
    s3Compatible: string;
    minio: string;
    backblaze: string;
    digitalocean: string;
}> = {
    node: {
        quickStart: `import ObitoX from 'obitox';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,
  apiSecret: process.env.OBITOX_API_SECRET
});

// Upload to S3 (3 lines!)
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'myapp-uploads-2026',
  s3Region: 'us-east-1'
});

console.log('✅ Uploaded:', url);
// https://myapp-uploads-2026.s3.us-east-1.amazonaws.com/photo-xxxxx.jpg`,
        basicUpload: `const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1'
});

console.log('Uploaded:', url);
// https://my-uploads.s3.us-east-1.amazonaws.com/photo-xxxxx.jpg`,
        storageClass: `const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  s3StorageClass: 'INTELLIGENT_TIERING'  // Auto-saves money! 💰
});`,
        encryptionSSES3: `const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  s3EncryptionType: 'SSE-S3'  // Default, no extra cost
});`,
        encryptionKMS: `const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  s3EncryptionType: 'SSE-KMS',
  s3KmsKeyId: 'arn:aws:kms:us-east-1:123456789:key/mrk-xxx'  // HIPAA, PCI-DSS ✓
});`,
        cloudFront: `const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  s3CloudFrontDomain: 'cdn.myapp.com'  // Your CloudFront domain
});

// Returns CDN URL for blazing fast delivery
console.log(url); // https://cdn.myapp.com/photo-xxxxx.jpg`,
        progressTracking: `const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  
  onProgress: (progress, bytesUploaded, totalBytes) => {
    console.log(\`\${progress.toFixed(1)}% uploaded\`);
    // Browser: 0% → 15% → 32% → 58% → 100%
    // Node.js: 0% → 100%
  },
  
  onCancel: () => console.log('Upload cancelled')
});`,
        signedUrl: `const signedUrl = await client.downloadFile({
  provider: 'S3',
  key: 'documents/report.pdf',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  expiresIn: 3600  // 1 hour
});

// https://my-uploads.s3...?X-Amz-Signature=xxx`,
        forceDownload: `const downloadUrl = await client.downloadFile({
  provider: 'S3',
  key: 'report.pdf',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  responseContentDisposition: 'attachment; filename="report.pdf"'
});

// Browser will download instead of opening`,
        deleteFile: `await client.deleteFile({
  provider: 'S3',
  key: 'uploads/old-file.jpg',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1'
});`,
        batchDelete: `const s3Provider = client.providers.get('S3');

await s3Provider.batchDelete({
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  keys: [
    'uploads/file1.jpg',
    'uploads/file2.jpg',
    'uploads/file3.jpg'
  ]
});`,
        listFiles: `const s3Provider = client.providers.get('S3');

const result = await s3Provider.list({
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  prefix: 'documents/',  // Optional: filter by folder
  maxKeys: 100           // Optional: limit results (default: 1000)
});

console.log(\`Found \${result.count} files\`);
result.files.forEach(file => {
  console.log(\`\${file.key} - \${file.size} bytes\`);
});`,
        getMetadata: `const s3Provider = client.providers.get('S3');

const metadata = await s3Provider.getMetadata({
  key: 'photo-xxxxx.jpg',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1'
});

console.log(\`Size: \${metadata.metadata.sizeFormatted}\`);
console.log(\`Type: \${metadata.metadata.contentType}\`);
console.log(\`Last Modified: \${metadata.metadata.lastModified}\`);
console.log(\`Storage Class: \${metadata.metadata.storageClass}\`);`,
        multipart: `const s3Provider = client.providers.get('S3');

// For files > 100MB, use multipart upload
const url = await s3Provider.multipartUpload({
  file: largeFile,
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  partSize: 10 * 1024 * 1024,  // 10MB parts
  
  onProgress: (progress, uploadedParts, totalParts) => {
    console.log(\`Part \${uploadedParts}/\${totalParts} - \${progress}%\`);
  }
});`,
        s3Compatible: `// Use ANY S3-compatible storage with s3Endpoint!
// Works with: MinIO, Backblaze B2, DigitalOcean Spaces, Wasabi, etc.

const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: 'your-access-key',
  s3SecretKey: 'your-secret-key',
  s3Bucket: 'my-bucket',
  s3Region: 'us-east-1',
  s3Endpoint: 'http://localhost:9000'  // Your MinIO/S3-compatible endpoint
});

// Works with all operations: upload, download, delete, list, metadata!`,
        minio: `// MinIO (self-hosted S3)
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: 'minioadmin',
  s3SecretKey: 'minioadmin123',
  s3Bucket: 'my-bucket',
  s3Region: 'us-east-1',
  s3Endpoint: 'http://localhost:9000'
});`,
        backblaze: `// Backblaze B2 (S3-compatible)
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.B2_KEY_ID,
  s3SecretKey: process.env.B2_APPLICATION_KEY,
  s3Bucket: 'my-bucket',
  s3Region: 'us-west-001',
  s3Endpoint: 'https://s3.us-west-001.backblazeb2.com'
});`,
        digitalocean: `// DigitalOcean Spaces
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.SPACES_KEY,
  s3SecretKey: process.env.SPACES_SECRET,
  s3Bucket: 'my-space',
  s3Region: 'nyc3',
  s3Endpoint: 'https://nyc3.digitaloceanspaces.com'
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

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'S3',
    s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
    s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: 'myapp-uploads-2026',
    s3Region: 'us-east-1',
    filename: req.file.originalname
  });

  res.json({ url });
});`,
        basicUpload: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'S3',
    s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
    s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: 'my-uploads',
    s3Region: 'us-east-1',
    filename: req.file.originalname
  });

  res.json({ url });
});`,
        storageClass: `const url = await client.uploadFile(req.file.buffer, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  s3StorageClass: 'INTELLIGENT_TIERING'  // Auto-saves money! 💰
});`,
        encryptionSSES3: `const url = await client.uploadFile(req.file.buffer, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  s3EncryptionType: 'SSE-S3'  // Default, no extra cost
});`,
        encryptionKMS: `const url = await client.uploadFile(req.file.buffer, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  s3EncryptionType: 'SSE-KMS',
  s3KmsKeyId: 'arn:aws:kms:us-east-1:123456789:key/mrk-xxx'
});`,
        cloudFront: `const url = await client.uploadFile(req.file.buffer, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  s3CloudFrontDomain: 'cdn.myapp.com'
});

// Returns CDN URL: https://cdn.myapp.com/photo-xxxxx.jpg`,
        progressTracking: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'S3',
    s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
    s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: 'my-uploads',
    s3Region: 'us-east-1',
    
    onProgress: (progress) => {
      // Send progress via SSE or WebSocket
      console.log(\`\${progress.toFixed(1)}% uploaded\`);
    }
  });
  
  res.json({ url });
});`,
        signedUrl: `app.get('/download/:key', async (req, res) => {
  const signedUrl = await client.downloadFile({
    provider: 'S3',
    key: req.params.key,
    s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
    s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: 'my-uploads',
    s3Region: 'us-east-1',
    expiresIn: 3600
  });

  res.redirect(signedUrl);
});`,
        forceDownload: `app.get('/download/:key', async (req, res) => {
  const downloadUrl = await client.downloadFile({
    provider: 'S3',
    key: req.params.key,
    s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
    s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: 'my-uploads',
    s3Region: 'us-east-1',
    responseContentDisposition: 'attachment'
  });

  res.redirect(downloadUrl);
});`,
        deleteFile: `app.delete('/file/:key', async (req, res) => {
  await client.deleteFile({
    provider: 'S3',
    key: req.params.key,
    s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
    s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: 'my-uploads',
    s3Region: 'us-east-1'
  });

  res.json({ success: true });
});`,
        batchDelete: `const s3Provider = client.providers.get('S3');

await s3Provider.batchDelete({
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  keys: req.body.keys  // Array of file keys
});`,
        listFiles: `app.get('/files', async (req, res) => {
  const s3Provider = client.providers.get('S3');

  const result = await s3Provider.list({
    s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
    s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: 'my-uploads',
    s3Region: 'us-east-1',
    prefix: req.query.folder || ''
  });

  res.json(result.files);
});`,
        getMetadata: `app.get('/file/:key/metadata', async (req, res) => {
  const s3Provider = client.providers.get('S3');

  const metadata = await s3Provider.getMetadata({
    key: req.params.key,
    s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
    s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: 'my-uploads',
    s3Region: 'us-east-1'
  });

  res.json(metadata);
});`,
        multipart: `app.post('/upload-large', upload.single('file'), async (req, res) => {
  const s3Provider = client.providers.get('S3');

  const url = await s3Provider.multipartUpload({
    file: req.file.buffer,
    s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
    s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: 'my-uploads',
    s3Region: 'us-east-1',
    partSize: 10 * 1024 * 1024  // 10MB parts
  });

  res.json({ url });
});`,
        s3Compatible: `// S3-compatible storage with Express
app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'S3',
    s3AccessKey: 'your-access-key',
    s3SecretKey: 'your-secret-key',
    s3Bucket: 'my-bucket',
    s3Region: 'us-east-1',
    s3Endpoint: 'http://localhost:9000'  // MinIO/S3-compatible
  });
  res.json({ url });
});`,
        minio: `// MinIO self-hosted
const url = await client.uploadFile(req.file.buffer, {
  provider: 'S3',
  s3AccessKey: 'minioadmin',
  s3SecretKey: 'minioadmin123',
  s3Bucket: 'my-bucket',
  s3Region: 'us-east-1',
  s3Endpoint: 'http://localhost:9000'
});`,
        backblaze: `// Backblaze B2
const url = await client.uploadFile(req.file.buffer, {
  provider: 'S3',
  s3AccessKey: process.env.B2_KEY_ID,
  s3SecretKey: process.env.B2_APPLICATION_KEY,
  s3Bucket: 'my-bucket',
  s3Region: 'us-west-001',
  s3Endpoint: 'https://s3.us-west-001.backblazeb2.com'
});`,
        digitalocean: `// DigitalOcean Spaces
const url = await client.uploadFile(req.file.buffer, {
  provider: 'S3',
  s3AccessKey: process.env.SPACES_KEY,
  s3SecretKey: process.env.SPACES_SECRET,
  s3Bucket: 'my-space',
  s3Region: 'nyc3',
  s3Endpoint: 'https://nyc3.digitaloceanspaces.com'
});`
    },
    python: {
        quickStart: `from obitox import ObitoX
import os

client = ObitoX(
    api_key=os.getenv('OBITOX_API_KEY'),
    api_secret=os.getenv('OBITOX_API_SECRET')
)

# Upload to S3
with open('photo.jpg', 'rb') as f:
    url = client.upload_file(f, {
        'provider': 'S3',
        's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
        's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
        's3_bucket': 'myapp-uploads-2026',
        's3_region': 'us-east-1'
    })

print(f'✅ Uploaded: {url}')`,
        basicUpload: `with open('photo.jpg', 'rb') as f:
    url = client.upload_file(f, {
        'provider': 'S3',
        's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
        's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
        's3_bucket': 'my-uploads',
        's3_region': 'us-east-1'
    })

print(f'Uploaded: {url}')`,
        storageClass: `url = client.upload_file(file, {
    'provider': 'S3',
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1',
    's3_storage_class': 'INTELLIGENT_TIERING'  # Auto-saves money! 💰
})`,
        encryptionSSES3: `url = client.upload_file(file, {
    'provider': 'S3',
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1',
    's3_encryption_type': 'SSE-S3'  # Default, no extra cost
})`,
        encryptionKMS: `url = client.upload_file(file, {
    'provider': 'S3',
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1',
    's3_encryption_type': 'SSE-KMS',
    's3_kms_key_id': 'arn:aws:kms:us-east-1:123456789:key/mrk-xxx'
})`,
        cloudFront: `url = client.upload_file(file, {
    'provider': 'S3',
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1',
    's3_cloudfront_domain': 'cdn.myapp.com'
})

# Returns: https://cdn.myapp.com/photo-xxxxx.jpg`,
        progressTracking: `def on_progress(progress, bytes_uploaded, total_bytes):
    print(f'{progress:.1f}% uploaded')

url = client.upload_file(file, {
    'provider': 'S3',
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1',
    'on_progress': on_progress
})`,
        signedUrl: `signed_url = client.download_file({
    'provider': 'S3',
    'key': 'documents/report.pdf',
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1',
    'expires_in': 3600  # 1 hour
})`,
        forceDownload: `download_url = client.download_file({
    'provider': 'S3',
    'key': 'report.pdf',
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1',
    'response_content_disposition': 'attachment; filename="report.pdf"'
})`,
        deleteFile: `client.delete_file({
    'provider': 'S3',
    'key': 'uploads/old-file.jpg',
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1'
})`,
        batchDelete: `s3_provider = client.providers.get('S3')

s3_provider.batch_delete({
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1',
    'keys': [
        'uploads/file1.jpg',
        'uploads/file2.jpg',
        'uploads/file3.jpg'
    ]
})`,
        listFiles: `s3_provider = client.providers.get('S3')

result = s3_provider.list({
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1',
    'prefix': 'documents/'
})

for file in result.files:
    print(f'{file.key} - {file.size} bytes')`,
        getMetadata: `s3_provider = client.providers.get('S3')

metadata = s3_provider.get_metadata({
    'key': 'photo-xxxxx.jpg',
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1'
})

print(f"Size: {metadata['size_formatted']}")
print(f"Type: {metadata['content_type']}")`,
        multipart: `s3_provider = client.providers.get('S3')

# For files > 100MB
url = s3_provider.multipart_upload({
    'file': large_file,
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1',
    'part_size': 10 * 1024 * 1024  # 10MB parts
})`,
        s3Compatible: `# S3-compatible storage
url = client.upload_file(file, {
    'provider': 'S3',
    's3_access_key': 'your-access-key',
    's3_secret_key': 'your-secret-key',
    's3_bucket': 'my-bucket',
    's3_region': 'us-east-1',
    's3_endpoint': 'http://localhost:9000'  # MinIO/S3-compatible
})`,
        minio: `# MinIO self-hosted
url = client.upload_file(file, {
    'provider': 'S3',
    's3_access_key': 'minioadmin',
    's3_secret_key': 'minioadmin123',
    's3_bucket': 'my-bucket',
    's3_region': 'us-east-1',
    's3_endpoint': 'http://localhost:9000'
})`,
        backblaze: `# Backblaze B2
url = client.upload_file(file, {
    'provider': 'S3',
    's3_access_key': os.getenv('B2_KEY_ID'),
    's3_secret_key': os.getenv('B2_APPLICATION_KEY'),
    's3_bucket': 'my-bucket',
    's3_region': 'us-west-001',
    's3_endpoint': 'https://s3.us-west-001.backblazeb2.com'
})`,
        digitalocean: `# DigitalOcean Spaces
url = client.upload_file(file, {
    'provider': 'S3',
    's3_access_key': os.getenv('SPACES_KEY'),
    's3_secret_key': os.getenv('SPACES_SECRET'),
    's3_bucket': 'my-space',
    's3_region': 'nyc3',
    's3_endpoint': 'https://nyc3.digitaloceanspaces.com'
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

// Upload to S3
$url = $client->uploadFile($_FILES['file']['tmp_name'], [
    'provider' => 'S3',
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'myapp-uploads-2026',
    's3_region' => 'us-east-1',
    'filename' => $_FILES['file']['name']
]);

echo "✅ Uploaded: " . $url;`,
        basicUpload: `$url = $client->uploadFile($file, [
    'provider' => 'S3',
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1'
]);

echo "Uploaded: " . $url;`,
        storageClass: `$url = $client->uploadFile($file, [
    'provider' => 'S3',
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1',
    's3_storage_class' => 'INTELLIGENT_TIERING'
]);`,
        encryptionSSES3: `$url = $client->uploadFile($file, [
    'provider' => 'S3',
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1',
    's3_encryption_type' => 'SSE-S3'
]);`,
        encryptionKMS: `$url = $client->uploadFile($file, [
    'provider' => 'S3',
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1',
    's3_encryption_type' => 'SSE-KMS',
    's3_kms_key_id' => 'arn:aws:kms:us-east-1:123456789:key/mrk-xxx'
]);`,
        cloudFront: `$url = $client->uploadFile($file, [
    'provider' => 'S3',
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1',
    's3_cloudfront_domain' => 'cdn.myapp.com'
]);

// Returns: https://cdn.myapp.com/photo-xxxxx.jpg`,
        progressTracking: `$url = $client->uploadFile($file, [
    'provider' => 'S3',
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1',
    'on_progress' => function($progress) {
        echo number_format($progress, 1) . "% uploaded\\n";
    }
]);`,
        signedUrl: `$signedUrl = $client->downloadFile([
    'provider' => 'S3',
    'key' => 'documents/report.pdf',
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1',
    'expires_in' => 3600
]);`,
        forceDownload: `$downloadUrl = $client->downloadFile([
    'provider' => 'S3',
    'key' => 'report.pdf',
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1',
    'response_content_disposition' => 'attachment; filename="report.pdf"'
]);`,
        deleteFile: `$client->deleteFile([
    'provider' => 'S3',
    'key' => 'uploads/old-file.jpg',
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1'
]);`,
        batchDelete: `$s3Provider = $client->providers->get('S3');

$s3Provider->batchDelete([
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1',
    'keys' => ['file1.jpg', 'file2.jpg', 'file3.jpg']
]);`,
        listFiles: `$s3Provider = $client->providers->get('S3');

$result = $s3Provider->list([
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1',
    'prefix' => 'documents/'
]);

foreach ($result->files as $file) {
    echo $file->key . " - " . $file->size . " bytes\\n";
}`,
        getMetadata: `$s3Provider = $client->providers->get('S3');

$metadata = $s3Provider->getMetadata([
    'key' => 'photo-xxxxx.jpg',
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1'
]);

echo "Size: " . $metadata->sizeFormatted;
echo "Type: " . $metadata->contentType;`,
        multipart: `$s3Provider = $client->providers->get('S3');

// For files > 100MB
$url = $s3Provider->multipartUpload([
    'file' => $largeFile,
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1',
    'part_size' => 10 * 1024 * 1024  // 10MB parts
]);`,
        s3Compatible: `// S3-compatible storage
$url = $client->uploadFile($file, [
    'provider' => 'S3',
    's3_access_key' => 'your-access-key',
    's3_secret_key' => 'your-secret-key',
    's3_bucket' => 'my-bucket',
    's3_region' => 'us-east-1',
    's3_endpoint' => 'http://localhost:9000'  // MinIO/S3-compatible
]);`,
        minio: `// MinIO self-hosted
$url = $client->uploadFile($file, [
    'provider' => 'S3',
    's3_access_key' => 'minioadmin',
    's3_secret_key' => 'minioadmin123',
    's3_bucket' => 'my-bucket',
    's3_region' => 'us-east-1',
    's3_endpoint' => 'http://localhost:9000'
]);`,
        backblaze: `// Backblaze B2
$url = $client->uploadFile($file, [
    'provider' => 'S3',
    's3_access_key' => getenv('B2_KEY_ID'),
    's3_secret_key' => getenv('B2_APPLICATION_KEY'),
    's3_bucket' => 'my-bucket',
    's3_region' => 'us-west-001',
    's3_endpoint' => 'https://s3.us-west-001.backblazeb2.com'
]);`,
        digitalocean: `// DigitalOcean Spaces
$url = $client->uploadFile($file, [
    'provider' => 'S3',
    's3_access_key' => getenv('SPACES_KEY'),
    's3_secret_key' => getenv('SPACES_SECRET'),
    's3_bucket' => 'my-space',
    's3_region' => 'nyc3',
    's3_endpoint' => 'https://nyc3.digitaloceanspaces.com'
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

    // Upload to S3
    url, err := client.UploadFile(file, obitox.UploadOptions{
        Provider:    "S3",
        S3AccessKey: os.Getenv("AWS_ACCESS_KEY_ID"),
        S3SecretKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
        S3Bucket:    "myapp-uploads-2026",
        S3Region:    "us-east-1",
    })

    fmt.Println("✅ Uploaded:", url)
}`,
        basicUpload: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:    "S3",
    S3AccessKey: os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:    "my-uploads",
    S3Region:    "us-east-1",
})

fmt.Println("Uploaded:", url)`,
        storageClass: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:       "S3",
    S3AccessKey:    os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey:    os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:       "my-uploads",
    S3Region:       "us-east-1",
    S3StorageClass: "INTELLIGENT_TIERING",
})`,
        encryptionSSES3: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:         "S3",
    S3AccessKey:      os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey:      os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:         "my-uploads",
    S3Region:         "us-east-1",
    S3EncryptionType: "SSE-S3",
})`,
        encryptionKMS: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:         "S3",
    S3AccessKey:      os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey:      os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:         "my-uploads",
    S3Region:         "us-east-1",
    S3EncryptionType: "SSE-KMS",
    S3KmsKeyId:       "arn:aws:kms:us-east-1:123456789:key/mrk-xxx",
})`,
        cloudFront: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:          "S3",
    S3AccessKey:       os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey:       os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:          "my-uploads",
    S3Region:          "us-east-1",
    S3CloudFrontDomain: "cdn.myapp.com",
})

// Returns: https://cdn.myapp.com/photo-xxxxx.jpg`,
        progressTracking: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:    "S3",
    S3AccessKey: os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:    "my-uploads",
    S3Region:    "us-east-1",
    OnProgress: func(progress float64, uploaded, total int64) {
        fmt.Printf("%.1f%% uploaded\\n", progress)
    },
})`,
        signedUrl: `signedUrl, err := client.DownloadFile(obitox.DownloadOptions{
    Provider:    "S3",
    Key:         "documents/report.pdf",
    S3AccessKey: os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:    "my-uploads",
    S3Region:    "us-east-1",
    ExpiresIn:   3600,
})`,
        forceDownload: `downloadUrl, err := client.DownloadFile(obitox.DownloadOptions{
    Provider:                   "S3",
    Key:                        "report.pdf",
    S3AccessKey:                os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey:                os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:                   "my-uploads",
    S3Region:                   "us-east-1",
    ResponseContentDisposition: "attachment",
})`,
        deleteFile: `err := client.DeleteFile(obitox.DeleteOptions{
    Provider:    "S3",
    Key:         "uploads/old-file.jpg",
    S3AccessKey: os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:    "my-uploads",
    S3Region:    "us-east-1",
})`,
        batchDelete: `s3Provider := client.Providers.Get("S3")

err := s3Provider.BatchDelete(obitox.BatchDeleteOptions{
    S3AccessKey: os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:    "my-uploads",
    S3Region:    "us-east-1",
    Keys:        []string{"file1.jpg", "file2.jpg", "file3.jpg"},
})`,
        listFiles: `s3Provider := client.Providers.Get("S3")

result, err := s3Provider.List(obitox.ListOptions{
    S3AccessKey: os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:    "my-uploads",
    S3Region:    "us-east-1",
    Prefix:      "documents/",
})

for _, file := range result.Files {
    fmt.Printf("%s - %d bytes\\n", file.Key, file.Size)
}`,
        getMetadata: `s3Provider := client.Providers.Get("S3")

metadata, err := s3Provider.GetMetadata(obitox.MetadataOptions{
    Key:         "photo-xxxxx.jpg",
    S3AccessKey: os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:    "my-uploads",
    S3Region:    "us-east-1",
})

fmt.Printf("Size: %s\\n", metadata.SizeFormatted)
fmt.Printf("Type: %s\\n", metadata.ContentType)`,
        multipart: `s3Provider := client.Providers.Get("S3")

// For files > 100MB
url, err := s3Provider.MultipartUpload(obitox.MultipartOptions{
    File:        largeFile,
    S3AccessKey: os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:    "my-uploads",
    S3Region:    "us-east-1",
    PartSize:    10 * 1024 * 1024,  // 10MB parts
})`,
        s3Compatible: `// S3-compatible storage
url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:    "S3",
    S3AccessKey: "your-access-key",
    S3SecretKey: "your-secret-key",
    S3Bucket:    "my-bucket",
    S3Region:    "us-east-1",
    S3Endpoint:  "http://localhost:9000",  // MinIO/S3-compatible
})`,
        minio: `// MinIO self-hosted
url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:    "S3",
    S3AccessKey: "minioadmin",
    S3SecretKey: "minioadmin123",
    S3Bucket:    "my-bucket",
    S3Region:    "us-east-1",
    S3Endpoint:  "http://localhost:9000",
})`,
        backblaze: `// Backblaze B2
url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:    "S3",
    S3AccessKey: os.Getenv("B2_KEY_ID"),
    S3SecretKey: os.Getenv("B2_APPLICATION_KEY"),
    S3Bucket:    "my-bucket",
    S3Region:    "us-west-001",
    S3Endpoint:  "https://s3.us-west-001.backblazeb2.com",
})`,
        digitalocean: `// DigitalOcean Spaces
url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:    "S3",
    S3AccessKey: os.Getenv("SPACES_KEY"),
    S3SecretKey: os.Getenv("SPACES_SECRET"),
    S3Bucket:    "my-space",
    S3Region:    "nyc3",
    S3Endpoint:  "https://nyc3.digitaloceanspaces.com",
})`
    },
    ruby: {
        quickStart: `require 'obitox'

client = ObitoX::Client.new(
  api_key: ENV['OBITOX_API_KEY'],
  api_secret: ENV['OBITOX_API_SECRET']
)

# Upload to S3
File.open('photo.jpg', 'rb') do |file|
  url = client.upload_file(file, {
    provider: 'S3',
    s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
    s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
    s3_bucket: 'myapp-uploads-2026',
    s3_region: 'us-east-1'
  })

  puts "✅ Uploaded: #{url}"
end`,
        basicUpload: `url = client.upload_file(file, {
  provider: 'S3',
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1'
})

puts "Uploaded: #{url}"`,
        storageClass: `url = client.upload_file(file, {
  provider: 'S3',
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1',
  s3_storage_class: 'INTELLIGENT_TIERING'  # Auto-saves money! 💰
})`,
        encryptionSSES3: `url = client.upload_file(file, {
  provider: 'S3',
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1',
  s3_encryption_type: 'SSE-S3'
})`,
        encryptionKMS: `url = client.upload_file(file, {
  provider: 'S3',
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1',
  s3_encryption_type: 'SSE-KMS',
  s3_kms_key_id: 'arn:aws:kms:us-east-1:123456789:key/mrk-xxx'
})`,
        cloudFront: `url = client.upload_file(file, {
  provider: 'S3',
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1',
  s3_cloudfront_domain: 'cdn.myapp.com'
})

# Returns: https://cdn.myapp.com/photo-xxxxx.jpg`,
        progressTracking: `url = client.upload_file(file, {
  provider: 'S3',
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1',
  on_progress: ->(progress, uploaded, total) {
    puts "#{progress.round(1)}% uploaded"
  }
})`,
        signedUrl: `signed_url = client.download_file({
  provider: 'S3',
  key: 'documents/report.pdf',
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1',
  expires_in: 3600
})`,
        forceDownload: `download_url = client.download_file({
  provider: 'S3',
  key: 'report.pdf',
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1',
  response_content_disposition: 'attachment; filename="report.pdf"'
})`,
        deleteFile: `client.delete_file({
  provider: 'S3',
  key: 'uploads/old-file.jpg',
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1'
})`,
        batchDelete: `s3_provider = client.providers.get('S3')

s3_provider.batch_delete({
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1',
  keys: ['file1.jpg', 'file2.jpg', 'file3.jpg']
})`,
        listFiles: `s3_provider = client.providers.get('S3')

result = s3_provider.list({
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1',
  prefix: 'documents/'
})

result.files.each do |file|
  puts "#{file.key} - #{file.size} bytes"
end`,
        getMetadata: `s3_provider = client.providers.get('S3')

metadata = s3_provider.get_metadata({
  key: 'photo-xxxxx.jpg',
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1'
})

puts "Size: #{metadata.size_formatted}"
puts "Type: #{metadata.content_type}"`,
        multipart: `s3_provider = client.providers.get('S3')

# For files > 100MB
url = s3_provider.multipart_upload({
  file: large_file,
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1',
  part_size: 10 * 1024 * 1024  # 10MB parts
})`,
        s3Compatible: `# S3-compatible storage
url = client.upload_file(file, {
  provider: 'S3',
  s3_access_key: 'your-access-key',
  s3_secret_key: 'your-secret-key',
  s3_bucket: 'my-bucket',
  s3_region: 'us-east-1',
  s3_endpoint: 'http://localhost:9000'  # MinIO/S3-compatible
})`,
        minio: `# MinIO self-hosted
url = client.upload_file(file, {
  provider: 'S3',
  s3_access_key: 'minioadmin',
  s3_secret_key: 'minioadmin123',
  s3_bucket: 'my-bucket',
  s3_region: 'us-east-1',
  s3_endpoint: 'http://localhost:9000'
})`,
        backblaze: `# Backblaze B2
url = client.upload_file(file, {
  provider: 'S3',
  s3_access_key: ENV['B2_KEY_ID'],
  s3_secret_key: ENV['B2_APPLICATION_KEY'],
  s3_bucket: 'my-bucket',
  s3_region: 'us-west-001',
  s3_endpoint: 'https://s3.us-west-001.backblazeb2.com'
})`,
        digitalocean: `# DigitalOcean Spaces
url = client.upload_file(file, {
  provider: 'S3',
  s3_access_key: ENV['SPACES_KEY'],
  s3_secret_key: ENV['SPACES_SECRET'],
  s3_bucket: 'my-space',
  s3_region: 'nyc3',
  s3_endpoint: 'https://nyc3.digitaloceanspaces.com'
})`
    }
};

// Framework Tabs Component
function FrameworkTabs({ activeFramework, onSelect }: { activeFramework: string; onSelect: (id: string) => void }) {
    return (
        <div className="border-b border-slate-800 mb-6">
            <div className="flex gap-1 overflow-x-auto pb-px">
                {frameworks.map((framework) => (
                    <button
                        key={framework.id}
                        onClick={() => onSelect(framework.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeFramework === framework.id
                            ? "text-amber-400 border-b-2 border-amber-400 bg-amber-400/5"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            }`}
                    >
                        {framework.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function S3ProviderPage() {
    const [activeFramework, setActiveFramework] = useState("node");
    const code = s3CodeExamples[activeFramework];
    const currentLang = frameworks.find(f => f.id === activeFramework)?.lang || "typescript";

    return (
        <article className="max-w-4xl space-y-12">
            {/* Hero Header */}
            <div id="hero-header" className="space-y-6">


                <div className="relative">
                    {/* Gradient Background */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl blur-2xl" />

                    <div className="relative space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-emerald-400">Storage Provider</span>
                            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                MOST POPULAR
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-amber-500/20 rounded-xl blur-lg" />
                                <Database className="relative h-12 w-12 text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-bold text-white tracking-tight">
                                    Amazon S3
                                </h1>
                                <p className="text-sm text-amber-400 mt-1 font-medium">
                                    The industry standard for object storage
                                </p>
                            </div>
                        </div>

                        <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
                            Store unlimited files with <strong className="text-white">99.9% durability</strong>.
                            Trusted by millions of applications worldwide. Available in <strong className="text-white">27 global regions</strong>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Visual Flow Diagram */}
            <div className="space-y-4">
                <h2 id="how-it-works" className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-amber-400" />
                    How it works
                </h2>
                <p className="text-slate-400">
                    Upload files through ObitoX's optimized pipeline. Files are stored in S3 with enterprise-grade security and reliability.
                </p>

                {/* Enhanced Flow Diagram */}
                <div className="relative rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 overflow-hidden max-w-2xl mx-auto">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />

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
                                <div className="text-xs text-slate-500 text-center mt-2">
                                    User uploads file
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex flex-col items-center gap-1 px-4">
                                <ArrowRight className="h-6 w-6 text-emerald-400" />
                                <div className="text-[10px] text-emerald-400 font-medium whitespace-nowrap">
                                    Request upload
                                </div>
                            </div>

                            {/* ObitoX */}
                            <div className="flex-1">
                                <FlowNode
                                    title="ObitoX"
                                    subtitle="SDK Processing"
                                    icon={<Zap className="h-6 w-6" />}
                                    color="amber"
                                    pulse
                                />
                                <div className="text-xs text-slate-500 text-center mt-2">
                                    Generates S3 credentials
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex flex-col items-center gap-1 px-4">
                                <ArrowRight className="h-6 w-6 text-blue-400" />
                                <div className="text-[10px] text-blue-400 font-medium whitespace-nowrap">
                                    Direct Upload
                                </div>
                            </div>

                            {/* S3 */}
                            <div className="flex-1">
                                <FlowNode
                                    title="Amazon S3"
                                    subtitle="us-east-1"
                                    icon={<Database className="h-6 w-6" />}
                                    color="blue"
                                />
                                <div className="text-xs text-slate-500 text-center mt-2">
                                    Stores with 11 9's durability
                                </div>
                            </div>
                        </div>

                        {/* Bottom Features */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
                            <FeaturePill icon={<Lock />} text="Encrypted at rest" />
                            <FeaturePill icon={<Globe />} text="Global CDN ready" />
                            <FeaturePill icon={<Shield />} text="11 9's durability" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Start Wizard */}
            <div className="space-y-6 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-8">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Zap className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                        <h2 id="quick-start" className="text-2xl font-bold text-white">Quick Start</h2>
                        <p className="text-sm text-slate-400">Get up and running in 3 steps</p>
                    </div>
                </div>

                {/* Framework Language Tabs */}
                <FrameworkTabs activeFramework={activeFramework} onSelect={setActiveFramework} />

                {/* Step 1 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20">
                            <span className="text-sm font-bold text-amber-400">1</span>
                        </div>
                        <h3 id="get-aws-credentials" className="text-lg font-semibold text-white">Get AWS credentials</h3>
                    </div>

                    <div className="ml-11 space-y-3">
                        <div className="text-sm text-slate-400 space-y-2">
                            <p>Go to <a href="https://console.aws.amazon.com/iam" target="_blank" className="text-amber-400 hover:text-amber-300">AWS IAM Console</a> and create an access key:</p>
                            <ol className="list-decimal list-inside space-y-1 text-slate-400 ml-4">
                                <li>Navigate to <strong className="text-white">IAM → Users → Your User → Security Credentials</strong></li>
                                <li>Click <strong className="text-white">"Create Access Key"</strong></li>
                                <li>Select <strong className="text-white">"Application running outside AWS"</strong></li>
                                <li>Copy your credentials:
                                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                                        <li>Access Key ID: <code className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-xs">AKIA...</code></li>
                                        <li>Secret Access Key: <code className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-xs">wJalr...</code></li>
                                    </ul>
                                </li>
                            </ol>
                        </div>

                        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                            <div className="flex items-start gap-2">
                                <Eye className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-slate-300">
                                    <strong className="text-blue-400">Security tip:</strong> Use an IAM user with <strong>only S3 permissions</strong>. Don't use root credentials!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20">
                            <span className="text-sm font-bold text-amber-400">2</span>
                        </div>
                        <h3 id="create-s3-bucket" className="text-lg font-semibold text-white">Create S3 bucket</h3>
                    </div>

                    <div className="ml-11 text-sm text-slate-400 space-y-2">
                        <p>Go to <a href="https://s3.console.aws.amazon.com/" target="_blank" className="text-amber-400 hover:text-amber-300">S3 Console</a> and create a bucket:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-4">
                            <li>Click <strong className="text-white">"Create bucket"</strong></li>
                            <li>Choose a <strong className="text-white">globally unique name</strong> (e.g., <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-xs">myapp-uploads-2026</code>)</li>
                            <li>Select your preferred region (e.g., <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-xs">us-east-1</code>)</li>
                            <li>Keep default settings and create</li>
                        </ol>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20">
                            <span className="text-sm font-bold text-amber-400">3</span>
                        </div>
                        <h3 id="upload-your-first-file" className="text-lg font-semibold text-white">Upload your first file</h3>
                    </div>

                    <div className="ml-11">
                        <CodeBlock
                            language={currentLang}
                            code={code.quickStart}
                        />
                    </div>
                </div>
            </div>

            {/* Operations Grid */}
            <div className="space-y-6">
                <h2 id="operations" className="text-2xl font-bold text-white">Operations</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <OperationCard
                        icon={<Upload />}
                        title="Upload Files"
                        description="Basic, encrypted, with storage classes"
                        href="#upload-features"
                    />
                    <OperationCard
                        icon={<Download />}
                        title="Download Files"
                        description="Signed URLs, CloudFront CDN"
                        href="#download-signed-urls"
                    />
                    <OperationCard
                        icon={<Trash2 />}
                        title="Delete Files"
                        description="Single or batch delete (1000 files)"
                        href="#delete-files"
                    />
                    <OperationCard
                        icon={<FileText />}
                        title="List Files"
                        description="Browse bucket contents, pagination"
                        href="#list-files"
                    />
                    <OperationCard
                        icon={<Eye />}
                        title="Get Metadata"
                        description="Size, type, storage class"
                        href="#get-metadata"
                    />
                    <OperationCard
                        icon={<HardDrive />}
                        title="Large Files"
                        description="Multipart upload (>100MB)"
                        href="#multipart-upload"
                    />
                </div>
            </div>

            {/* Upload Features Section */}
            <div className="space-y-6">
                <div id="upload-features" className="flex items-center gap-3">
                    <Upload className="h-6 w-6 text-emerald-400" />
                    <h2 className="text-2xl font-bold text-white">Upload Features</h2>
                </div>

                {/* Basic Upload */}
                <OperationSection id="basic-upload" title="Basic Upload" emoji="📤">
                    <CodeBlock
                        language={currentLang}
                        code={code.basicUpload}
                    />
                </OperationSection>

                {/* Storage Classes */}
                <OperationSection
                    id="smart-cost-optimization"
                    title="Smart Cost Optimization"
                    emoji="💰"
                    description="Save up to 90% on storage costs with intelligent tiering"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.storageClass}
                    />

                    <div className="mt-4 rounded-lg border border-slate-800 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-900 border-b border-slate-800">
                                <tr>
                                    <th className="text-left p-3 text-white font-semibold">Storage Class</th>
                                    <th className="text-left p-3 text-white font-semibold">Cost</th>
                                    <th className="text-left p-3 text-white font-semibold">Use Case</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                <tr className="hover:bg-slate-900/50">
                                    <td className="p-3"><code className="text-emerald-400">STANDARD</code></td>
                                    <td className="p-3 text-slate-400">$0.023/GB</td>
                                    <td className="p-3 text-slate-400">Frequent access</td>
                                </tr>
                                <tr className="hover:bg-slate-900/50 bg-amber-500/5 border-l-2 border-l-amber-500">
                                    <td className="p-3"><code className="text-amber-400">INTELLIGENT_TIERING</code> ⭐</td>
                                    <td className="p-3 text-slate-400">Auto-optimizes</td>
                                    <td className="p-3 text-slate-400"><strong className="text-white">Recommended</strong> - Auto-saves money</td>
                                </tr>
                                <tr className="hover:bg-slate-900/50">
                                    <td className="p-3"><code className="text-blue-400">STANDARD_IA</code></td>
                                    <td className="p-3 text-slate-400">$0.0125/GB</td>
                                    <td className="p-3 text-slate-400">Infrequent access</td>
                                </tr>
                                <tr className="hover:bg-slate-900/50">
                                    <td className="p-3"><code className="text-purple-400">GLACIER_INSTANT</code></td>
                                    <td className="p-3 text-slate-400">$0.004/GB</td>
                                    <td className="p-3 text-slate-400">Archives (instant access)</td>
                                </tr>
                                <tr className="hover:bg-slate-900/50">
                                    <td className="p-3"><code className="text-slate-400">DEEP_ARCHIVE</code></td>
                                    <td className="p-3 text-slate-400">$0.00099/GB</td>
                                    <td className="p-3 text-slate-400">Long-term backup (12hr retrieval)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </OperationSection>

                {/* Encryption */}
                <OperationSection
                    id="enterprise-encryption"
                    title="Enterprise Encryption"
                    emoji="🔒"
                    description="Protect sensitive data with AWS-managed or customer-managed keys"
                >
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-2">AWS-managed encryption (free)</h4>
                            <CodeBlock
                                language={currentLang}
                                code={code.encryptionSSES3}
                            />
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-white mb-2">Customer-managed keys (KMS)</h4>
                            <CodeBlock
                                language={currentLang}
                                code={code.encryptionKMS}
                            />
                        </div>
                    </div>
                </OperationSection>

                {/* CloudFront */}
                <OperationSection
                    id="cloudfront-cdn"
                    title="CloudFront CDN"
                    emoji="⚡"
                    description="Serve files from 400+ edge locations worldwide"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.cloudFront}
                    />

                    <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                        <div className="flex items-start gap-2">
                            <Zap className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-slate-300">
                                <strong className="text-emerald-400">Pro tip:</strong> CloudFront caches files at edge locations, reducing latency from 500ms to 50ms for global users.
                            </div>
                        </div>
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
                        language={currentLang}
                        code={code.progressTracking}
                    />

                    <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-slate-300">
                                <strong className="text-blue-400">Note:</strong> In Node.js, progress jumps from 0% to 100% due to stream handling. In browsers, you get granular progress updates.
                            </div>
                        </div>
                    </div>
                </OperationSection>
            </div>

            {/* Delete Files Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Trash2 className="h-6 w-6 text-red-400" />
                    <h2 id="delete-files" className="text-2xl font-bold text-white">Delete Files</h2>
                </div>

                <OperationSection
                    id="delete-single"
                    title="Delete Single File"
                    emoji="🗑️"
                    description="Remove files when no longer needed"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.deleteFile}
                    />
                </OperationSection>

                <OperationSection
                    id="batch-delete"
                    title="Batch Delete (Up to 1000 files)"
                    emoji="💥"
                    description="Delete hundreds of files in a single API call"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.batchDelete}
                    />
                </OperationSection>
            </div>

            {/* Download Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Download className="h-6 w-6 text-blue-400" />
                    <h2 id="download-signed-urls" className="text-2xl font-bold text-white">Download & Signed URLs</h2>
                </div>

                <OperationSection
                    id="generate-signed-url"
                    title="Generate Signed URL"
                    emoji="🔐"
                    description="Secure, time-limited download links"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.signedUrl}
                    />
                </OperationSection>

                <OperationSection
                    id="force-download"
                    title="Force Download"
                    emoji="⬇️"
                    description="Make browsers download instead of display"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.forceDownload}
                    />
                </OperationSection>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-purple-400" />
                    <h2 id="advanced-features" className="text-2xl font-bold text-white">Advanced Features</h2>
                </div>

                <OperationSection
                    id="list-files"
                    title="List Files"
                    emoji="📋"
                    description="Browse bucket contents with pagination"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.listFiles}
                    />
                </OperationSection>

                <OperationSection
                    id="get-metadata"
                    title="Get File Metadata"
                    emoji="📊"
                    description="Retrieve size, type, storage class without downloading"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.getMetadata}
                    />
                </OperationSection>

                <OperationSection
                    id="multipart-upload"
                    title="Multipart Upload"
                    emoji="🚀"
                    description="For files larger than 100MB"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.multipart}
                    />

                    <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                        <div className="flex items-start gap-2">
                            <Zap className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-slate-300">
                                <strong className="text-emerald-400">Performance:</strong> Multipart uploads can be up to 10x faster for large files by uploading parts in parallel.
                            </div>
                        </div>
                    </div>
                </OperationSection>
            </div>

            {/* AWS Regions */}
            <div className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/30 p-8">
                <div className="flex items-center gap-3">
                    <Globe className="h-6 w-6 text-blue-400" />
                    <div>
                        <h2 id="aws-regions" className="text-2xl font-bold text-white">AWS Regions</h2>
                        <p className="text-sm text-slate-400 mt-1">Choose the region closest to your users for lowest latency</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RegionGroup
                        title="🇺🇸 North America"
                        regions={[
                            'us-east-1 (Virginia)',
                            'us-east-2 (Ohio)',
                            'us-west-1 (California)',
                            'us-west-2 (Oregon)',
                            'ca-central-1 (Canada)'
                        ]}
                    />
                    <RegionGroup
                        title="🇪🇺 Europe"
                        regions={[
                            'eu-west-1 (Ireland)',
                            'eu-west-2 (London)',
                            'eu-west-3 (Paris)',
                            'eu-central-1 (Frankfurt)',
                            'eu-north-1 (Stockholm)',
                            'eu-south-1 (Milan)',
                            'eu-south-2 (Spain)'
                        ]}
                    />
                    <RegionGroup
                        title="🌏 Asia Pacific"
                        regions={[
                            'ap-south-1 (Mumbai)',
                            'ap-south-2 (Hyderabad)',
                            'ap-southeast-1 (Singapore)',
                            'ap-southeast-2 (Sydney)',
                            'ap-southeast-3 (Jakarta)',
                            'ap-southeast-4 (Melbourne)',
                            'ap-northeast-1 (Tokyo)',
                            'ap-northeast-2 (Seoul)',
                            'ap-northeast-3 (Osaka)',
                            'ap-east-1 (Hong Kong)'
                        ]}
                    />
                    <RegionGroup
                        title="🌍 Other Regions"
                        regions={[
                            'me-south-1 (Bahrain)',
                            'me-central-1 (UAE)',
                            'il-central-1 (Israel)',
                            'sa-east-1 (São Paulo)',
                            'af-south-1 (Cape Town)'
                        ]}
                    />
                </div>
            </div>

            {/* S3-Compatible Storage */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Server className="h-6 w-6 text-purple-400" />
                    <h2 id="s3-compatible" className="text-2xl font-bold text-white">S3-Compatible Storage</h2>
                </div>

                <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 mb-4">
                    <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-slate-300">
                            <strong className="text-purple-400">Universal Compatibility:</strong> Use the <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-xs">s3Endpoint</code> option to connect to ANY S3-compatible storage including MinIO, Backblaze B2, DigitalOcean Spaces, Wasabi, and more!
                        </div>
                    </div>
                </div>

                <OperationSection
                    id="s3-compatible-overview"
                    title="S3-Compatible Storage"
                    emoji="🔌"
                    description="Works with MinIO, Backblaze B2, DigitalOcean Spaces, Wasabi, and more"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.s3Compatible}
                    />
                </OperationSection>

                <OperationSection
                    id="minio-example"
                    title="MinIO (Self-Hosted S3)"
                    emoji="🏠"
                    description="Perfect for local development or private cloud storage"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.minio}
                    />
                </OperationSection>

                <OperationSection
                    id="backblaze-example"
                    title="Backblaze B2"
                    emoji="🅱️"
                    description="Low-cost cloud storage with S3-compatible API"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.backblaze}
                    />
                </OperationSection>

                <OperationSection
                    id="digitalocean-example"
                    title="DigitalOcean Spaces"
                    emoji="🌊"
                    description="Simple, scalable object storage with built-in CDN"
                >
                    <CodeBlock
                        language={currentLang}
                        code={code.digitalocean}
                    />
                </OperationSection>
            </div>

            {/* Pro Tips */}
            <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-8">
                <h3 id="pro-tips" className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                    Pro Tips for Production
                </h3>

                <div className="space-y-4">
                    <ProTip
                        icon={<DollarSign />}
                        title="Use INTELLIGENT_TIERING"
                        description="Automatically moves files to cheaper storage based on access patterns. Can save 70% on storage costs with zero effort."
                    />
                    <ProTip
                        icon={<Zap />}
                        title="Enable CloudFront CDN"
                        description="Reduces latency from 500ms to 50ms for global users. One-time setup, massive performance gain."
                    />
                    <ProTip
                        icon={<Lock />}
                        title="Always encrypt sensitive data"
                        description="Use SSE-KMS for customer data. It's compliance-ready (HIPAA, PCI-DSS) and costs pennies."
                    />
                    <ProTip
                        icon={<Database />}
                        title="Enable versioning"
                        description="Protects against accidental deletions. Previous versions are archived and can be restored."
                    />
                    <ProTip
                        icon={<Shield />}
                        title="Use IAM policies"
                        description="Grant minimum required permissions. Never use root credentials in production."
                    />
                </div>
            </div>

            {/* Footer - DO NOT EDIT */}
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
                        href="/docs/installation"
                        className="group flex items-center gap-2 text-white font-medium hover:text-emerald-400 transition-colors"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                        Installation
                    </Link>
                    <Link
                        href="/docs/providers/r2"
                        className="group flex items-center gap-2 text-white font-medium hover:text-emerald-400 transition-colors"
                    >
                        Cloudflare R2
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </article>
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
    const colorMap: Record<string, string> = {
        emerald: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
        amber: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
        blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400'
    };

    return (
        <div className="relative">
            {pulse && (
                <div className="absolute -inset-2 bg-amber-500/20 rounded-xl blur-md animate-pulse" />
            )}
            <div className={`relative border-2 rounded-xl p-5 bg-slate-900/80 backdrop-blur ${colorMap[color]}`}>
                <div className="flex items-center gap-3 mb-2">
                    {icon}
                    <div className="font-bold text-white">{title}</div>
                </div>
                <div className="text-xs text-slate-400 font-mono">{subtitle}</div>
            </div>
        </div>
    );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 rounded-full px-3 py-1.5 border border-slate-700/50">
            <div className="text-emerald-400">
                {icon}
            </div>
            <span>{text}</span>
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
        <Link
            href={href}
            className="flex flex-col gap-3 p-5 rounded-xl border border-slate-800 bg-slate-900/30 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all group"
        >
            <div className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors mb-1">
                    {title}
                </h3>
                <p className="text-sm text-slate-400">
                    {description}
                </p>
            </div>
        </Link>
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
        <div className="space-y-4 p-6 rounded-xl border border-slate-800 bg-slate-900/20">
            <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{emoji}</span>
                <div className="flex-1">
                    <h3 id={id} className="text-lg font-semibold text-white">{title}</h3>
                    {description && (
                        <p className="text-sm text-slate-400 mt-1">{description}</p>
                    )}
                </div>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}

function RegionGroup({ title, regions }: { title: string; regions: string[] }) {
    return (
        <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">{title}</h4>
            <div className="space-y-1.5">
                {regions.map((region) => (
                    <div key={region} className="text-sm text-slate-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        <code className="text-emerald-400 font-mono text-xs">{region}</code>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProTip({ icon, title, description }: {
    icon: React.ReactNode;
    title: string;
    description: string
}) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                <div className="text-emerald-400">
                    {icon}
                </div>
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-white text-sm mb-1">{title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}