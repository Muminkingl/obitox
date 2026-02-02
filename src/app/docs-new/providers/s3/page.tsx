'use client';

import { useState } from 'react';
import { DocsPage, DocsDescription, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { CodeBlock, Callout } from '@/components/fumadocs/components';
import { Database, Zap, Globe, Shield, Lock, DollarSign, Server, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const tocItems = [
    { title: 'Quick Start', url: '#quick-start', depth: 2 },
    { title: 'Upload Features', url: '#upload-features', depth: 2 },
    { title: 'Delete Files', url: '#delete-files', depth: 2 },
    { title: 'Download & Signed URLs', url: '#download-signed-urls', depth: 2 },
    { title: 'Advanced Features', url: '#advanced-features', depth: 2 },
    { title: 'AWS Regions', url: '#aws-regions', depth: 2 },
    { title: 'S3-Compatible Storage', url: '#s3-compatible', depth: 2 },
];

// Framework definitions for code examples
const frameworks = [
    { id: 'node', name: 'Node.js', lang: 'typescript' },
    { id: 'express', name: 'Express', lang: 'typescript' },
    { id: 'python', name: 'Python', lang: 'python' },
    { id: 'php', name: 'PHP', lang: 'php' },
    { id: 'go', name: 'Go', lang: 'go' },
    { id: 'ruby', name: 'Ruby', lang: 'ruby' },
];

// S3 code examples for each framework
const s3CodeExamples: Record<string, {
    quickStart: string;
    basicUpload: string;
    storageClass: string;
    encryptionSSES3: string;
    encryptionKMS: string;
    cloudFront: string;
    signedUrl: string;
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
        signedUrl: `signed_url = client.download_file({
    'provider': 'S3',
    'key': 'documents/report.pdf',
    's3_access_key': os.getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket': 'my-uploads',
    's3_region': 'us-east-1',
    'expires_in': 3600  # 1 hour
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
        signedUrl: `$signedUrl = $client->downloadFile([
    'provider' => 'S3',
    'key' => 'documents/report.pdf',
    's3_access_key' => getenv('AWS_ACCESS_KEY_ID'),
    's3_secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
    's3_bucket' => 'my-uploads',
    's3_region' => 'us-east-1',
    'expires_in' => 3600
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
    Provider:           "S3",
    S3AccessKey:        os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey:        os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:           "my-uploads",
    S3Region:           "us-east-1",
    S3CloudFrontDomain: "cdn.myapp.com",
})

// Returns: https://cdn.myapp.com/photo-xxxxx.jpg`,
        signedUrl: `signedUrl, err := client.DownloadFile(obitox.DownloadOptions{
    Provider:    "S3",
    Key:         "documents/report.pdf",
    S3AccessKey: os.Getenv("AWS_ACCESS_KEY_ID"),
    S3SecretKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
    S3Bucket:    "my-uploads",
    S3Region:    "us-east-1",
    ExpiresIn:   3600,
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
        signedUrl: `signed_url = client.download_file({
  provider: 'S3',
  key: 'documents/report.pdf',
  s3_access_key: ENV['AWS_ACCESS_KEY_ID'],
  s3_secret_key: ENV['AWS_SECRET_ACCESS_KEY'],
  s3_bucket: 'my-uploads',
  s3_region: 'us-east-1',
  expires_in: 3600
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

export default function S3ProviderPage() {
    const [activeFramework, setActiveFramework] = useState('node');
    const code = s3CodeExamples[activeFramework];
    const currentLang = frameworks.find(f => f.id === activeFramework)?.lang || 'typescript';

    return (
        <DocsPage toc={tocItems}>
            <DocsTitle>Amazon S3</DocsTitle>
            <DocsDescription>
                Store unlimited files with 99.9% durability. Trusted by millions of applications worldwide.
            </DocsDescription>

            <DocsBody>
                {/* Hero Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <Database className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-emerald-400">Storage Provider</span>
                            <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                MOST POPULAR
                            </span>
                        </div>
                        <p className="text-sm text-amber-400 mt-1 font-medium">
                            The industry standard for object storage
                        </p>
                    </div>
                </div>

                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    Store unlimited files with <strong className="text-white">99.9% durability</strong>.
                    Trusted by millions of applications worldwide. Available in <strong className="text-white">27 global regions</strong>.
                </p>

                {/* Quick Start Section */}
                <h2 id="quick-start" className="scroll-m-20">Quick Start</h2>

                <p>Get up and running in 3 steps:</p>

                {/* Framework Tabs */}
                <div className="border-b border-zinc-800 mb-6">
                    <div className="flex gap-1 overflow-x-auto pb-px">
                        {frameworks.map((framework) => (
                            <button
                                key={framework.id}
                                onClick={() => setActiveFramework(framework.id)}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeFramework === framework.id
                                    ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                    }`}
                            >
                                {framework.name}
                            </button>
                        ))}
                    </div>
                </div>

                <CodeBlock title={`Quick Start (${currentLang})`}>
                    {code.quickStart}
                </CodeBlock>

                <Callout type="info" title="AWS Credentials">
                    Go to <a href="https://console.aws.amazon.com/iam" target="_blank" className="text-fd-primary hover:underline">AWS IAM Console</a> and create an access key. Use an IAM user with <strong>only S3 permissions</strong>. Don't use root credentials!
                </Callout>

                {/* Upload Features Section */}
                <h2 id="upload-features" className="scroll-m-20">Upload Features</h2>

                <h3 id="basic-upload" className="scroll-m-20">Basic Upload</h3>
                <CodeBlock title={currentLang}>
                    {code.basicUpload}
                </CodeBlock>

                <h3 id="smart-cost-optimization" className="scroll-m-20">Smart Cost Optimization</h3>
                <p>Save up to 90% on storage costs with intelligent tiering:</p>
                <CodeBlock title={currentLang}>
                    {code.storageClass}
                </CodeBlock>

                <div className="my-4 rounded-lg border border-zinc-800 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-900 border-b border-zinc-800">
                            <tr>
                                <th className="text-left p-3 text-white font-semibold">Storage Class</th>
                                <th className="text-left p-3 text-white font-semibold">Cost</th>
                                <th className="text-left p-3 text-white font-semibold">Use Case</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            <tr className="hover:bg-zinc-900/50">
                                <td className="p-3"><code className="text-emerald-400">STANDARD</code></td>
                                <td className="p-3 text-zinc-400">$0.023/GB</td>
                                <td className="p-3 text-zinc-400">Frequent access</td>
                            </tr>
                            <tr className="hover:bg-zinc-900/50 bg-amber-500/5 border-l-2 border-l-amber-500">
                                <td className="p-3"><code className="text-amber-400">INTELLIGENT_TIERING</code> ⭐</td>
                                <td className="p-3 text-zinc-400">Auto-optimizes</td>
                                <td className="p-3 text-zinc-400"><strong className="text-white">Recommended</strong> - Auto-saves money</td>
                            </tr>
                            <tr className="hover:bg-zinc-900/50">
                                <td className="p-3"><code className="text-blue-400">STANDARD_IA</code></td>
                                <td className="p-3 text-zinc-400">$0.0125/GB</td>
                                <td className="p-3 text-zinc-400">Infrequent access</td>
                            </tr>
                            <tr className="hover:bg-zinc-900/50">
                                <td className="p-3"><code className="text-purple-400">GLACIER_INSTANT</code></td>
                                <td className="p-3 text-zinc-400">$0.004/GB</td>
                                <td className="p-3 text-zinc-400">Archives (instant access)</td>
                            </tr>
                            <tr className="hover:bg-zinc-900/50">
                                <td className="p-3"><code className="text-zinc-400">DEEP_ARCHIVE</code></td>
                                <td className="p-3 text-zinc-400">$0.00099/GB</td>
                                <td className="p-3 text-zinc-400">Long-term backup (12hr retrieval)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 id="enterprise-encryption" className="scroll-m-20">Enterprise Encryption</h3>
                <p>Protect sensitive data with AWS-managed or customer-managed keys:</p>

                <h4 className="text-sm font-semibold text-white mb-2">AWS-managed encryption (free)</h4>
                <CodeBlock title={currentLang}>
                    {code.encryptionSSES3}
                </CodeBlock>

                <h4 className="text-sm font-semibold text-white mb-2 mt-4">Customer-managed keys (KMS)</h4>
                <CodeBlock title={currentLang}>
                    {code.encryptionKMS}
                </CodeBlock>

                <h3 id="cloudfront-cdn" className="scroll-m-20">CloudFront CDN</h3>
                <p>Serve files from 400+ edge locations worldwide:</p>
                <CodeBlock title={currentLang}>
                    {code.cloudFront}
                </CodeBlock>

                <Callout type="tip">
                    CloudFront caches files at edge locations, reducing latency from 500ms to 50ms for global users.
                </Callout>

                {/* Delete Files Section */}
                <h2 id="delete-files" className="scroll-m-20">Delete Files</h2>

                <h3 id="delete-single" className="scroll-m-20">Delete Single File</h3>
                <CodeBlock title={currentLang}>
                    {code.deleteFile}
                </CodeBlock>

                <h3 id="batch-delete" className="scroll-m-20">Batch Delete (Up to 1000 files)</h3>
                <CodeBlock title={currentLang}>
                    {code.batchDelete}
                </CodeBlock>

                {/* Download Section */}
                <h2 id="download-signed-urls" className="scroll-m-20">Download & Signed URLs</h2>

                <h3 id="generate-signed-url" className="scroll-m-20">Generate Signed URL</h3>
                <p>Secure, time-limited download links:</p>
                <CodeBlock title={currentLang}>
                    {code.signedUrl}
                </CodeBlock>

                {/* Advanced Features */}
                <h2 id="advanced-features" className="scroll-m-20">Advanced Features</h2>

                <h3 id="list-files" className="scroll-m-20">List Files</h3>
                <p>Browse bucket contents with pagination:</p>
                <CodeBlock title={currentLang}>
                    {code.listFiles}
                </CodeBlock>

                <h3 id="get-metadata" className="scroll-m-20">Get File Metadata</h3>
                <p>Retrieve size, type, storage class without downloading:</p>
                <CodeBlock title={currentLang}>
                    {code.getMetadata}
                </CodeBlock>

                <h3 id="multipart-upload" className="scroll-m-20">Multipart Upload</h3>
                <p>For files larger than 100MB:</p>
                <CodeBlock title={currentLang}>
                    {code.multipart}
                </CodeBlock>

                <Callout type="tip">
                    Multipart uploads can be up to 10x faster for large files by uploading parts in parallel.
                </Callout>

                {/* AWS Regions */}
                <h2 id="aws-regions" className="scroll-m-20">AWS Regions</h2>
                <p>Choose the region closest to your users for lowest latency:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="space-y-3">
                        <h4 className="font-semibold text-white text-sm">🇺🇸 North America</h4>
                        <div className="space-y-1.5">
                            {['us-east-1 (Virginia)', 'us-east-2 (Ohio)', 'us-west-1 (California)', 'us-west-2 (Oregon)', 'ca-central-1 (Canada)'].map(region => (
                                <div key={region} className="text-sm text-zinc-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                    <code className="text-emerald-400 font-mono text-xs">{region}</code>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-semibold text-white text-sm">🇪🇺 Europe</h4>
                        <div className="space-y-1.5">
                            {['eu-west-1 (Ireland)', 'eu-west-2 (London)', 'eu-west-3 (Paris)', 'eu-central-1 (Frankfurt)', 'eu-north-1 (Stockholm)'].map(region => (
                                <div key={region} className="text-sm text-zinc-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                    <code className="text-emerald-400 font-mono text-xs">{region}</code>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-semibold text-white text-sm">🌏 Asia Pacific</h4>
                        <div className="space-y-1.5">
                            {['ap-south-1 (Mumbai)', 'ap-southeast-1 (Singapore)', 'ap-southeast-2 (Sydney)', 'ap-northeast-1 (Tokyo)', 'ap-northeast-2 (Seoul)'].map(region => (
                                <div key={region} className="text-sm text-zinc-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                    <code className="text-emerald-400 font-mono text-xs">{region}</code>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-semibold text-white text-sm">🌍 Other Regions</h4>
                        <div className="space-y-1.5">
                            {['me-south-1 (Bahrain)', 'sa-east-1 (São Paulo)', 'af-south-1 (Cape Town)'].map(region => (
                                <div key={region} className="text-sm text-zinc-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                    <code className="text-emerald-400 font-mono text-xs">{region}</code>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* S3-Compatible Storage */}
                <h2 id="s3-compatible" className="scroll-m-20">S3-Compatible Storage</h2>

                <Callout type="info">
                    Use the <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono text-xs">s3Endpoint</code> option to connect to ANY S3-compatible storage including MinIO, Backblaze B2, DigitalOcean Spaces, Wasabi, and more!
                </Callout>

                <h3 id="s3-compatible-overview" className="scroll-m-20">S3-Compatible Storage</h3>
                <CodeBlock title={currentLang}>
                    {code.s3Compatible}
                </CodeBlock>

                <h3 id="minio-example" className="scroll-m-20">MinIO (Self-Hosted S3)</h3>
                <CodeBlock title={currentLang}>
                    {code.minio}
                </CodeBlock>

                <h3 id="backblaze-example" className="scroll-m-20">Backblaze B2</h3>
                <CodeBlock title={currentLang}>
                    {code.backblaze}
                </CodeBlock>

                <h3 id="digitalocean-example" className="scroll-m-20">DigitalOcean Spaces</h3>
                <CodeBlock title={currentLang}>
                    {code.digitalocean}
                </CodeBlock>

                {/* Pro Tips */}
                <h2 className="scroll-m-20">Pro Tips for Production</h2>

                <div className="space-y-4 my-6">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                            <DollarSign className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-1">Use INTELLIGENT_TIERING</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">Automatically moves files to cheaper storage based on access patterns. Can save 70% on storage costs with zero effort.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                            <Zap className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-1">Enable CloudFront CDN</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">Reduces latency from 500ms to 50ms for global users. One-time setup, massive performance gain.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                            <Lock className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-1">Always encrypt sensitive data</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">Use SSE-KMS for customer data. It's compliance-ready (HIPAA, PCI-DSS) and costs pennies.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                            <Shield className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-1">Use IAM policies</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">Grant minimum required permissions. Never use root credentials in production.</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-8 border-t border-zinc-800">
                    <Link
                        href="/docs-new/installation"
                        className="group flex items-center gap-2 text-white font-medium hover:text-fd-primary transition-colors"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                        Installation
                    </Link>
                    <Link
                        href="/docs-new/providers/r2"
                        className="group flex items-center gap-2 text-white font-medium hover:text-fd-primary transition-colors"
                    >
                        Cloudflare R2
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="h-[200px]"></div>
            </DocsBody>
        </DocsPage>
    );
}
