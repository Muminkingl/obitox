'use client';

import { useState } from 'react';
import { DocsPage, DocsDescription, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { CodeBlock, Callout } from '@/components/fumadocs/components';
import { Cloud, Zap, Globe, Shield, DollarSign, Server, ArrowRight, Upload, Download, Trash2, FileText, Settings, Key } from 'lucide-react';
import Link from 'next/link';

const tocItems = [
    { title: 'Quick Start', url: '#quick-start', depth: 2 },
    { title: 'Upload Features', url: '#upload-features', depth: 2 },
    { title: 'Delete Files', url: '#delete-files', depth: 2 },
    { title: 'Download & Signed URLs', url: '#download-signed-urls', depth: 2 },
    { title: 'Advanced Features', url: '#advanced-features', depth: 2 },
    { title: 'Pro Tips', url: '#pro-tips', depth: 2 },
];

// Framework definitions
const frameworks = [
    { id: 'node', name: 'Node.js', lang: 'typescript' },
    { id: 'express', name: 'Express', lang: 'typescript' },
    { id: 'python', name: 'Python', lang: 'python' },
    { id: 'php', name: 'PHP', lang: 'php' },
    { id: 'go', name: 'Go', lang: 'go' },
    { id: 'ruby', name: 'Ruby', lang: 'ruby' }
];

// R2 code examples for each framework
const r2CodeExamples: Record<string, {
    quickStart: string;
    basicUpload: string;
    batchUpload: string;
    customDomain: string;
    progressTracking: string;
    singleDelete: string;
    batchDelete: string;
    signedUrl: string;
    accessTokens: string;
    listFiles: string;
}> = {
    node: {
        quickStart: `import ObitoX from 'obitox';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,
  apiSecret: process.env.OBITOX_API_SECRET
});

// Upload to R2
const url = await client.uploadFile(file, {
  provider: 'R2',
  r2AccessKey: process.env.R2_ACCESS_KEY,
  r2SecretKey: process.env.R2_SECRET_KEY,
  r2AccountId: process.env.R2_ACCOUNT_ID,
  r2Bucket: 'my-uploads'
});

console.log('Uploaded:', url);
// https://pub-abc123.r2.dev/photo-xxxxx.jpg`,
        basicUpload: `const url = await client.uploadFile(file, {
  provider: 'R2',
  r2AccessKey: process.env.R2_ACCESS_KEY,
  r2SecretKey: process.env.R2_SECRET_KEY,
  r2AccountId: process.env.R2_ACCOUNT_ID,
  r2Bucket: 'my-uploads'
});

console.log('Uploaded:', url);`,
        batchUpload: `const r2Provider = client.providers.get('R2');

// Step 1: Get signed URLs for all files at once
const result = await r2Provider.batchUpload({
  files: [
    { filename: 'photo1.jpg', contentType: 'image/jpeg', fileSize: 1024000 },
    { filename: 'photo2.jpg', contentType: 'image/jpeg', fileSize: 2048000 },
    // ... up to 100 files!
  ],
  r2AccessKey: process.env.R2_ACCESS_KEY,
  r2SecretKey: process.env.R2_SECRET_KEY,
  r2AccountId: process.env.R2_ACCOUNT_ID,
  r2Bucket: 'my-uploads'
});

console.log(\`Generated \${result.total} URLs in \${result.performance.totalTime}\`);`,
        customDomain: `const url = await client.uploadFile(file, {
  provider: 'R2',
  r2AccessKey: process.env.R2_ACCESS_KEY,
  r2SecretKey: process.env.R2_SECRET_KEY,
  r2AccountId: process.env.R2_ACCOUNT_ID,
  r2Bucket: 'my-uploads',
  r2PublicUrl: 'https://cdn.myapp.com'  // Your custom domain
});

console.log(url);  // https://cdn.myapp.com/photo-xxxxx.jpg`,
        progressTracking: `const url = await client.uploadFile(file, {
  provider: 'R2',
  r2AccessKey: process.env.R2_ACCESS_KEY,
  r2SecretKey: process.env.R2_SECRET_KEY,
  r2AccountId: process.env.R2_ACCOUNT_ID,
  r2Bucket: 'my-uploads',
  
  onProgress: (progress, bytesUploaded, totalBytes) => {
    console.log(\`\${progress.toFixed(1)}% uploaded\`);
  },
  
  onCancel: () => console.log('Cancelled')
});`,
        singleDelete: `await client.deleteFile({
  provider: 'R2',
  fileUrl: 'https://pub-abc123.r2.dev/photo-xxxxx.jpg',
  r2AccessKey: process.env.R2_ACCESS_KEY,
  r2SecretKey: process.env.R2_SECRET_KEY,
  r2AccountId: process.env.R2_ACCOUNT_ID,
  r2Bucket: 'my-uploads'
});`,
        batchDelete: `const r2Provider = client.providers.get('R2');

const result = await r2Provider.batchDelete({
  fileKeys: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
  r2AccessKey: process.env.R2_ACCESS_KEY,
  r2SecretKey: process.env.R2_SECRET_KEY,
  r2AccountId: process.env.R2_ACCOUNT_ID,
  r2Bucket: 'my-uploads'
});

console.log(\`Deleted: \${result.deleted.length}\`);`,
        signedUrl: `const downloadUrl = await client.downloadFile({
  provider: 'R2',
  fileKey: 'photo-xxxxx.jpg',
  r2AccessKey: process.env.R2_ACCESS_KEY,
  r2SecretKey: process.env.R2_SECRET_KEY,
  r2AccountId: process.env.R2_ACCOUNT_ID,
  r2Bucket: 'my-uploads',
  expiresIn: 3600  // Valid for 1 hour
});

console.log(downloadUrl);`,
        accessTokens: `const r2Provider = client.providers.get('R2');

// Generate token for specific file
const token = await r2Provider.generateAccessToken({
  r2Bucket: 'private-docs',
  fileKey: 'confidential-report.pdf',
  permissions: ['read'],
  expiresIn: 3600
});

console.log('Token:', token.token);

// Revoke anytime
await r2Provider.revokeAccessToken(token.token);`,
        listFiles: `const r2Provider = client.providers.get('R2');

const result = await r2Provider.listFiles({
  r2AccessKey: process.env.R2_ACCESS_KEY,
  r2SecretKey: process.env.R2_SECRET_KEY,
  r2AccountId: process.env.R2_ACCOUNT_ID,
  r2Bucket: 'my-uploads',
  prefix: 'documents/',
  maxKeys: 100
});

console.log(\`Found \${result.count} files\`);`
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

app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'R2',
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2Bucket: 'my-uploads'
  });
  res.json({ url });
});`,
        basicUpload: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'R2',
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2Bucket: 'my-uploads'
  });
  res.json({ url });
});`,
        batchUpload: `app.post('/batch-upload', async (req, res) => {
  const r2Provider = client.providers.get('R2');
  const result = await r2Provider.batchUpload({
    files: req.body.files,
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2Bucket: 'my-uploads'
  });
  res.json(result);
});`,
        customDomain: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'R2',
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2Bucket: 'my-uploads',
    r2PublicUrl: 'https://cdn.myapp.com'
  });
  res.json({ url });
});`,
        progressTracking: `app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await client.uploadFile(req.file.buffer, {
    provider: 'R2',
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2Bucket: 'my-uploads',
    onProgress: (p) => console.log(\`\${p}%\`)
  });
  res.json({ url });
});`,
        singleDelete: `app.delete('/file/:key', async (req, res) => {
  await client.deleteFile({
    provider: 'R2',
    fileUrl: \`https://pub-abc123.r2.dev/\${req.params.key}\`,
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2Bucket: 'my-uploads'
  });
  res.json({ deleted: true });
});`,
        batchDelete: `app.delete('/files', async (req, res) => {
  const r2Provider = client.providers.get('R2');
  const result = await r2Provider.batchDelete({
    fileKeys: req.body.keys,
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2Bucket: 'my-uploads'
  });
  res.json(result);
});`,
        signedUrl: `app.get('/download/:key', async (req, res) => {
  const downloadUrl = await client.downloadFile({
    provider: 'R2',
    fileKey: req.params.key,
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2Bucket: 'my-uploads',
    expiresIn: 3600
  });
  res.redirect(downloadUrl);
});`,
        accessTokens: `app.post('/access-token', async (req, res) => {
  const r2Provider = client.providers.get('R2');
  const token = await r2Provider.generateAccessToken({
    r2Bucket: req.body.bucket,
    fileKey: req.body.fileKey,
    permissions: ['read'],
    expiresIn: 3600
  });
  res.json({ token: token.token });
});`,
        listFiles: `app.get('/files', async (req, res) => {
  const r2Provider = client.providers.get('R2');
  const result = await r2Provider.listFiles({
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2Bucket: 'my-uploads',
    prefix: req.query.prefix || '',
    maxKeys: 100
  });
  res.json(result);
});`
    },
    python: {
        quickStart: `from obitox import ObitoX
import os

client = ObitoX(
    api_key=os.getenv('OBITOX_API_KEY'),
    api_secret=os.getenv('OBITOX_API_SECRET')
)

# Upload to R2
url = client.upload_file(file, {
    'provider': 'R2',
    'r2_access_key': os.getenv('R2_ACCESS_KEY'),
    'r2_secret_key': os.getenv('R2_SECRET_KEY'),
    'r2_account_id': os.getenv('R2_ACCOUNT_ID'),
    'r2_bucket': 'my-uploads'
})

print(f'Uploaded: {url}')`,
        basicUpload: `url = client.upload_file(file, {
    'provider': 'R2',
    'r2_access_key': os.getenv('R2_ACCESS_KEY'),
    'r2_secret_key': os.getenv('R2_SECRET_KEY'),
    'r2_account_id': os.getenv('R2_ACCOUNT_ID'),
    'r2_bucket': 'my-uploads'
})`,
        batchUpload: `r2_provider = client.providers.get('R2')

result = r2_provider.batch_upload({
    'files': [
        {'filename': 'photo1.jpg', 'content_type': 'image/jpeg', 'file_size': 1024000},
        {'filename': 'photo2.jpg', 'content_type': 'image/jpeg', 'file_size': 2048000}
    ],
    'r2_access_key': os.getenv('R2_ACCESS_KEY'),
    'r2_secret_key': os.getenv('R2_SECRET_KEY'),
    'r2_account_id': os.getenv('R2_ACCOUNT_ID'),
    'r2_bucket': 'my-uploads'
})

print(f"Generated {result['total']} URLs")`,
        customDomain: `url = client.upload_file(file, {
    'provider': 'R2',
    'r2_access_key': os.getenv('R2_ACCESS_KEY'),
    'r2_secret_key': os.getenv('R2_SECRET_KEY'),
    'r2_account_id': os.getenv('R2_ACCOUNT_ID'),
    'r2_bucket': 'my-uploads',
    'r2_public_url': 'https://cdn.myapp.com'
})`,
        progressTracking: `def on_progress(progress, uploaded, total):
    print(f'{progress:.1f}% uploaded')

url = client.upload_file(file, {
    'provider': 'R2',
    'r2_access_key': os.getenv('R2_ACCESS_KEY'),
    'r2_secret_key': os.getenv('R2_SECRET_KEY'),
    'r2_account_id': os.getenv('R2_ACCOUNT_ID'),
    'r2_bucket': 'my-uploads',
    'on_progress': on_progress
})`,
        singleDelete: `client.delete_file({
    'provider': 'R2',
    'file_url': 'https://pub-abc123.r2.dev/photo-xxxxx.jpg',
    'r2_access_key': os.getenv('R2_ACCESS_KEY'),
    'r2_secret_key': os.getenv('R2_SECRET_KEY'),
    'r2_account_id': os.getenv('R2_ACCOUNT_ID'),
    'r2_bucket': 'my-uploads'
})`,
        batchDelete: `r2_provider = client.providers.get('R2')

result = r2_provider.batch_delete({
    'file_keys': ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    'r2_access_key': os.getenv('R2_ACCESS_KEY'),
    'r2_secret_key': os.getenv('R2_SECRET_KEY'),
    'r2_account_id': os.getenv('R2_ACCOUNT_ID'),
    'r2_bucket': 'my-uploads'
})

print(f"Deleted: {len(result['deleted'])}")`,
        signedUrl: `download_url = client.download_file({
    'provider': 'R2',
    'file_key': 'photo-xxxxx.jpg',
    'r2_access_key': os.getenv('R2_ACCESS_KEY'),
    'r2_secret_key': os.getenv('R2_SECRET_KEY'),
    'r2_account_id': os.getenv('R2_ACCOUNT_ID'),
    'r2_bucket': 'my-uploads',
    'expires_in': 3600
})`,
        accessTokens: `r2_provider = client.providers.get('R2')

token = r2_provider.generate_access_token({
    'r2_bucket': 'private-docs',
    'file_key': 'confidential-report.pdf',
    'permissions': ['read'],
    'expires_in': 3600
})

print(f"Token: {token['token']}")

# Revoke anytime
r2_provider.revoke_access_token(token['token'])`,
        listFiles: `r2_provider = client.providers.get('R2')

result = r2_provider.list_files({
    'r2_access_key': os.getenv('R2_ACCESS_KEY'),
    'r2_secret_key': os.getenv('R2_SECRET_KEY'),
    'r2_account_id': os.getenv('R2_ACCOUNT_ID'),
    'r2_bucket': 'my-uploads',
    'prefix': 'documents/',
    'max_keys': 100
})

print(f"Found {result['count']} files")`
    },
    php: {
        quickStart: `<?php
require_once 'vendor/autoload.php';

use ObitoX\\ObitoXClient;

$client = new ObitoXClient([
    'api_key' => getenv('OBITOX_API_KEY'),
    'api_secret' => getenv('OBITOX_API_SECRET')
]);

$url = $client->uploadFile($_FILES['file']['tmp_name'], [
    'provider' => 'R2',
    'r2_access_key' => getenv('R2_ACCESS_KEY'),
    'r2_secret_key' => getenv('R2_SECRET_KEY'),
    'r2_account_id' => getenv('R2_ACCOUNT_ID'),
    'r2_bucket' => 'my-uploads'
]);

echo "Uploaded: " . $url;`,
        basicUpload: `$url = $client->uploadFile($file, [
    'provider' => 'R2',
    'r2_access_key' => getenv('R2_ACCESS_KEY'),
    'r2_secret_key' => getenv('R2_SECRET_KEY'),
    'r2_account_id' => getenv('R2_ACCOUNT_ID'),
    'r2_bucket' => 'my-uploads'
]);`,
        batchUpload: `$r2Provider = $client->providers->get('R2');

$result = $r2Provider->batchUpload([
    'files' => [
        ['filename' => 'photo1.jpg', 'content_type' => 'image/jpeg', 'file_size' => 1024000],
        ['filename' => 'photo2.jpg', 'content_type' => 'image/jpeg', 'file_size' => 2048000]
    ],
    'r2_access_key' => getenv('R2_ACCESS_KEY'),
    'r2_secret_key' => getenv('R2_SECRET_KEY'),
    'r2_account_id' => getenv('R2_ACCOUNT_ID'),
    'r2_bucket' => 'my-uploads'
]);

echo "Generated " . $result['total'] . " URLs";`,
        customDomain: `$url = $client->uploadFile($file, [
    'provider' => 'R2',
    'r2_access_key' => getenv('R2_ACCESS_KEY'),
    'r2_secret_key' => getenv('R2_SECRET_KEY'),
    'r2_account_id' => getenv('R2_ACCOUNT_ID'),
    'r2_bucket' => 'my-uploads',
    'r2_public_url' => 'https://cdn.myapp.com'
]);`,
        progressTracking: `$url = $client->uploadFile($file, [
    'provider' => 'R2',
    'r2_access_key' => getenv('R2_ACCESS_KEY'),
    'r2_secret_key' => getenv('R2_SECRET_KEY'),
    'r2_account_id' => getenv('R2_ACCOUNT_ID'),
    'r2_bucket' => 'my-uploads',
    'on_progress' => function($progress) {
        echo number_format($progress, 1) . "% uploaded\\n";
    }
]);`,
        singleDelete: `$client->deleteFile([
    'provider' => 'R2',
    'file_url' => 'https://pub-abc123.r2.dev/photo-xxxxx.jpg',
    'r2_access_key' => getenv('R2_ACCESS_KEY'),
    'r2_secret_key' => getenv('R2_SECRET_KEY'),
    'r2_account_id' => getenv('R2_ACCOUNT_ID'),
    'r2_bucket' => 'my-uploads'
]);`,
        batchDelete: `$r2Provider = $client->providers->get('R2');

$result = $r2Provider->batchDelete([
    'file_keys' => ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    'r2_access_key' => getenv('R2_ACCESS_KEY'),
    'r2_secret_key' => getenv('R2_SECRET_KEY'),
    'r2_account_id' => getenv('R2_ACCOUNT_ID'),
    'r2_bucket' => 'my-uploads'
]);

echo "Deleted: " . count($result['deleted']);`,
        signedUrl: `$downloadUrl = $client->downloadFile([
    'provider' => 'R2',
    'file_key' => 'photo-xxxxx.jpg',
    'r2_access_key' => getenv('R2_ACCESS_KEY'),
    'r2_secret_key' => getenv('R2_SECRET_KEY'),
    'r2_account_id' => getenv('R2_ACCOUNT_ID'),
    'r2_bucket' => 'my-uploads',
    'expires_in' => 3600
]);`,
        accessTokens: `$r2Provider = $client->providers->get('R2');

$token = $r2Provider->generateAccessToken([
    'r2_bucket' => 'private-docs',
    'file_key' => 'confidential-report.pdf',
    'permissions' => ['read'],
    'expires_in' => 3600
]);

echo "Token: " . $token['token'];

// Revoke anytime
$r2Provider->revokeAccessToken($token['token']);`,
        listFiles: `$r2Provider = $client->providers->get('R2');

$result = $r2Provider->listFiles([
    'r2_access_key' => getenv('R2_ACCESS_KEY'),
    'r2_secret_key' => getenv('R2_SECRET_KEY'),
    'r2_account_id' => getenv('R2_ACCOUNT_ID'),
    'r2_bucket' => 'my-uploads',
    'prefix' => 'documents/',
    'max_keys' => 100
]);

echo "Found " . $result['count'] . " files";`
    },
    go: {
        quickStart: `package main

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

    url, err := client.UploadFile(file, obitox.UploadOptions{
        Provider:    "R2",
        R2AccessKey: os.Getenv("R2_ACCESS_KEY"),
        R2SecretKey: os.Getenv("R2_SECRET_KEY"),
        R2AccountId: os.Getenv("R2_ACCOUNT_ID"),
        R2Bucket:    "my-uploads",
    })

    fmt.Println("Uploaded:", url)
}`,
        basicUpload: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:    "R2",
    R2AccessKey: os.Getenv("R2_ACCESS_KEY"),
    R2SecretKey: os.Getenv("R2_SECRET_KEY"),
    R2AccountId: os.Getenv("R2_ACCOUNT_ID"),
    R2Bucket:    "my-uploads",
})`,
        batchUpload: `r2Provider := client.Providers.Get("R2")

result, err := r2Provider.BatchUpload(obitox.BatchUploadOptions{
    Files: []obitox.FileInfo{
        {Filename: "photo1.jpg", ContentType: "image/jpeg", FileSize: 1024000},
        {Filename: "photo2.jpg", ContentType: "image/jpeg", FileSize: 2048000},
    },
    R2AccessKey: os.Getenv("R2_ACCESS_KEY"),
    R2SecretKey: os.Getenv("R2_SECRET_KEY"),
    R2AccountId: os.Getenv("R2_ACCOUNT_ID"),
    R2Bucket:    "my-uploads",
})

fmt.Printf("Generated %d URLs\\n", result.Total)`,
        customDomain: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:    "R2",
    R2AccessKey: os.Getenv("R2_ACCESS_KEY"),
    R2SecretKey: os.Getenv("R2_SECRET_KEY"),
    R2AccountId: os.Getenv("R2_ACCOUNT_ID"),
    R2Bucket:    "my-uploads",
    R2PublicUrl: "https://cdn.myapp.com",
})`,
        progressTracking: `url, err := client.UploadFile(file, obitox.UploadOptions{
    Provider:    "R2",
    R2AccessKey: os.Getenv("R2_ACCESS_KEY"),
    R2SecretKey: os.Getenv("R2_SECRET_KEY"),
    R2AccountId: os.Getenv("R2_ACCOUNT_ID"),
    R2Bucket:    "my-uploads",
    OnProgress: func(progress float64, uploaded, total int64) {
        fmt.Printf("%.1f%% uploaded\\n", progress)
    },
})`,
        singleDelete: `err := client.DeleteFile(obitox.DeleteOptions{
    Provider:    "R2",
    FileUrl:     "https://pub-abc123.r2.dev/photo-xxxxx.jpg",
    R2AccessKey: os.Getenv("R2_ACCESS_KEY"),
    R2SecretKey: os.Getenv("R2_SECRET_KEY"),
    R2AccountId: os.Getenv("R2_ACCOUNT_ID"),
    R2Bucket:    "my-uploads",
})`,
        batchDelete: `r2Provider := client.Providers.Get("R2")

result, err := r2Provider.BatchDelete(obitox.BatchDeleteOptions{
    FileKeys:    []string{"photo1.jpg", "photo2.jpg", "photo3.jpg"},
    R2AccessKey: os.Getenv("R2_ACCESS_KEY"),
    R2SecretKey: os.Getenv("R2_SECRET_KEY"),
    R2AccountId: os.Getenv("R2_ACCOUNT_ID"),
    R2Bucket:    "my-uploads",
})

fmt.Printf("Deleted: %d\\n", len(result.Deleted))`,
        signedUrl: `downloadUrl, err := client.DownloadFile(obitox.DownloadOptions{
    Provider:    "R2",
    FileKey:     "photo-xxxxx.jpg",
    R2AccessKey: os.Getenv("R2_ACCESS_KEY"),
    R2SecretKey: os.Getenv("R2_SECRET_KEY"),
    R2AccountId: os.Getenv("R2_ACCOUNT_ID"),
    R2Bucket:    "my-uploads",
    ExpiresIn:   3600,
})`,
        accessTokens: `r2Provider := client.Providers.Get("R2")

token, err := r2Provider.GenerateAccessToken(obitox.AccessTokenOptions{
    R2Bucket:    "private-docs",
    FileKey:     "confidential-report.pdf",
    Permissions: []string{"read"},
    ExpiresIn:   3600,
})

fmt.Println("Token:", token.Token)

// Revoke anytime
r2Provider.RevokeAccessToken(token.Token)`,
        listFiles: `r2Provider := client.Providers.Get("R2")

result, err := r2Provider.ListFiles(obitox.ListFilesOptions{
    R2AccessKey: os.Getenv("R2_ACCESS_KEY"),
    R2SecretKey: os.Getenv("R2_SECRET_KEY"),
    R2AccountId: os.Getenv("R2_ACCOUNT_ID"),
    R2Bucket:    "my-uploads",
    Prefix:      "documents/",
    MaxKeys:     100,
})

fmt.Printf("Found %d files\\n", result.Count)`
    },
    ruby: {
        quickStart: `require 'obitox'

client = ObitoX::Client.new(
  api_key: ENV['OBITOX_API_KEY'],
  api_secret: ENV['OBITOX_API_SECRET']
)

File.open('photo.jpg', 'rb') do |file|
  url = client.upload_file(file, {
    provider: 'R2',
    r2_access_key: ENV['R2_ACCESS_KEY'],
    r2_secret_key: ENV['R2_SECRET_KEY'],
    r2_account_id: ENV['R2_ACCOUNT_ID'],
    r2_bucket: 'my-uploads'
  })
  puts "Uploaded: #{url}"
end`,
        basicUpload: `url = client.upload_file(file, {
  provider: 'R2',
  r2_access_key: ENV['R2_ACCESS_KEY'],
  r2_secret_key: ENV['R2_SECRET_KEY'],
  r2_account_id: ENV['R2_ACCOUNT_ID'],
  r2_bucket: 'my-uploads'
})`,
        batchUpload: `r2_provider = client.providers.get('R2')

result = r2_provider.batch_upload({
  files: [
    { filename: 'photo1.jpg', content_type: 'image/jpeg', file_size: 1024000 },
    { filename: 'photo2.jpg', content_type: 'image/jpeg', file_size: 2048000 }
  ],
  r2_access_key: ENV['R2_ACCESS_KEY'],
  r2_secret_key: ENV['R2_SECRET_KEY'],
  r2_account_id: ENV['R2_ACCOUNT_ID'],
  r2_bucket: 'my-uploads'
})

puts "Generated #{result[:total]} URLs"`,
        customDomain: `url = client.upload_file(file, {
  provider: 'R2',
  r2_access_key: ENV['R2_ACCESS_KEY'],
  r2_secret_key: ENV['R2_SECRET_KEY'],
  r2_account_id: ENV['R2_ACCOUNT_ID'],
  r2_bucket: 'my-uploads',
  r2_public_url: 'https://cdn.myapp.com'
})`,
        progressTracking: `url = client.upload_file(file, {
  provider: 'R2',
  r2_access_key: ENV['R2_ACCESS_KEY'],
  r2_secret_key: ENV['R2_SECRET_KEY'],
  r2_account_id: ENV['R2_ACCOUNT_ID'],
  r2_bucket: 'my-uploads',
  on_progress: ->(progress, uploaded, total) {
    puts "#{progress.round(1)}% uploaded"
  }
})`,
        singleDelete: `client.delete_file({
  provider: 'R2',
  file_url: 'https://pub-abc123.r2.dev/photo-xxxxx.jpg',
  r2_access_key: ENV['R2_ACCESS_KEY'],
  r2_secret_key: ENV['R2_SECRET_KEY'],
  r2_account_id: ENV['R2_ACCOUNT_ID'],
  r2_bucket: 'my-uploads'
})`,
        batchDelete: `r2_provider = client.providers.get('R2')

result = r2_provider.batch_delete({
  file_keys: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
  r2_access_key: ENV['R2_ACCESS_KEY'],
  r2_secret_key: ENV['R2_SECRET_KEY'],
  r2_account_id: ENV['R2_ACCOUNT_ID'],
  r2_bucket: 'my-uploads'
})

puts "Deleted: #{result[:deleted].length}"`,
        signedUrl: `download_url = client.download_file({
  provider: 'R2',
  file_key: 'photo-xxxxx.jpg',
  r2_access_key: ENV['R2_ACCESS_KEY'],
  r2_secret_key: ENV['R2_SECRET_KEY'],
  r2_account_id: ENV['R2_ACCOUNT_ID'],
  r2_bucket: 'my-uploads',
  expires_in: 3600
})`,
        accessTokens: `r2_provider = client.providers.get('R2')

token = r2_provider.generate_access_token({
  r2_bucket: 'private-docs',
  file_key: 'confidential-report.pdf',
  permissions: ['read'],
  expires_in: 3600
})

puts "Token: #{token[:token]}"

# Revoke anytime
r2_provider.revoke_access_token(token[:token])`,
        listFiles: `r2_provider = client.providers.get('R2')

result = r2_provider.list_files({
  r2_access_key: ENV['R2_ACCESS_KEY'],
  r2_secret_key: ENV['R2_SECRET_KEY'],
  r2_account_id: ENV['R2_ACCOUNT_ID'],
  r2_bucket: 'my-uploads',
  prefix: 'documents/',
  max_keys: 100
})

puts "Found #{result[:count]} files"`
    }
};

export default function R2ProviderPage() {
    const [activeFramework, setActiveFramework] = useState('node');
    const code = r2CodeExamples[activeFramework];
    const currentLang = frameworks.find(f => f.id === activeFramework)?.lang || 'typescript';

    return (
        <DocsPage toc={tocItems}>
            <DocsTitle>Cloudflare R2</DocsTitle>
            <DocsDescription>
                S3 compatible object storage that eliminates egress bandwidth fees.
            </DocsDescription>

            <DocsBody>
                {/* Hero Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <Cloud className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-emerald-400">Storage Provider</span>
                            <span className="px-2 py-0.5 text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                HIGH PERFORMANCE
                            </span>
                        </div>
                        <p className="text-sm text-orange-400 mt-1 font-medium">
                            Zero egress fees. S3-compatible.
                        </p>
                    </div>
                </div>

                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    S3 compatible object storage that eliminates egress bandwidth fees.
                    Perfect for high-traffic applications with <strong className="text-white">zero egress costs</strong>.
                </p>

                {/* Quick Start Section */}
                <h2 id="quick-start" className="scroll-m-20">Quick Start</h2>

                <p>Get up and running in 4 steps:</p>

                {/* Framework Tabs */}
                <div className="border-b border-zinc-800 mb-6">
                    <div className="flex gap-1 overflow-x-auto pb-px">
                        {frameworks.map((framework) => (
                            <button
                                key={framework.id}
                                onClick={() => setActiveFramework(framework.id)}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeFramework === framework.id
                                    ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-400/5'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                    }`}
                            >
                                {framework.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 1-3: Setup instructions */}
                <h3 id="create-r2-bucket" className="scroll-m-20">1. Create R2 Bucket</h3>
                <p>Go to <a href="https://dash.cloudflare.com/" target="_blank" className="text-orange-400 hover:underline">Cloudflare Dashboard</a> → R2:</p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-400 ml-4 mb-4">
                    <li>Click <strong className="text-white">"Create Bucket"</strong></li>
                    <li>Enter a unique name (e.g., <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono text-xs">my-uploads</code>)</li>
                    <li>Copy your <strong className="text-white">Account ID</strong> from the R2 overview page</li>
                </ol>

                <h3 id="create-api-tokens" className="scroll-m-20">2. Create API Tokens</h3>
                <p>In R2 Dashboard → <strong className="text-white">Manage R2 API Tokens</strong>:</p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-400 ml-4 mb-4">
                    <li>Click <strong className="text-white">"Create API Token"</strong></li>
                    <li>Select <strong className="text-white">"Admin Read & Write"</strong> permissions</li>
                    <li>Copy the <strong className="text-white">Access Key ID</strong> and <strong className="text-white">Secret Access Key</strong></li>
                </ol>

                <h3 id="configure-environment" className="scroll-m-20">3. Configure Environment</h3>
                <CodeBlock title=".env">
                    {`OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx
R2_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
R2_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
                </CodeBlock>

                <h3 id="upload-your-first-file" className="scroll-m-20">4. Upload your first file</h3>
                <CodeBlock title={`Quick Start (${currentLang})`}>
                    {code.quickStart}
                </CodeBlock>

                <Callout type="info" title="Zero Egress Fees">
                    Unlike S3, R2 charges <strong>zero egress fees</strong>. Download as much as you want without worrying about bandwidth costs!
                </Callout>

                {/* Upload Features Section */}
                <h2 id="upload-features" className="scroll-m-20">Upload Features</h2>

                <h3 id="basic-upload" className="scroll-m-20">Basic Upload</h3>
                <CodeBlock title={currentLang}>
                    {code.basicUpload}
                </CodeBlock>

                <h3 id="batch-upload" className="scroll-m-20">Batch Upload</h3>
                <p>Get signed URLs for up to 100 files in ONE API call:</p>
                <CodeBlock title={currentLang}>
                    {code.batchUpload}
                </CodeBlock>

                <h3 id="custom-domain" className="scroll-m-20">Custom Domain</h3>
                <p>Serve files from your own domain:</p>
                <CodeBlock title={currentLang}>
                    {code.customDomain}
                </CodeBlock>

                <h3 id="progress-tracking" className="scroll-m-20">Progress Tracking</h3>
                <p>Monitor upload progress in real-time:</p>
                <CodeBlock title={currentLang}>
                    {code.progressTracking}
                </CodeBlock>

                <Callout type="info">
                    In Node.js, progress jumps from 0% to 100% due to stream handling. In browsers, you get granular progress updates.
                </Callout>

                {/* Delete Files Section */}
                <h2 id="delete-files" className="scroll-m-20">Delete Files</h2>

                <h3 id="single-delete" className="scroll-m-20">Single Delete</h3>
                <CodeBlock title={currentLang}>
                    {code.singleDelete}
                </CodeBlock>

                <h3 id="batch-delete" className="scroll-m-20">Batch Delete (Up to 1000 files)</h3>
                <p>Delete hundreds of files in a single API call:</p>
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

                <h3 id="access-tokens" className="scroll-m-20">JWT Access Tokens</h3>
                <p>Enterprise-grade security with scoped permissions:</p>
                <CodeBlock title={currentLang}>
                    {code.accessTokens}
                </CodeBlock>

                <h3 id="list-files" className="scroll-m-20">List Files</h3>
                <p>Browse bucket contents with pagination:</p>
                <CodeBlock title={currentLang}>
                    {code.listFiles}
                </CodeBlock>

                {/* Pro Tips */}
                <h2 id="pro-tips" className="scroll-m-20">Pro Tips for Production</h2>

                <div className="space-y-4 my-6">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                            <DollarSign className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-1">Leverage Zero Egress Fees</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">R2 is perfect for high-bandwidth applications like video hosting or frequent downloads. You only pay for storage and operations.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                            <Zap className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-1">Use Batch Operations</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">Uploading 100 files? Use batchUpload to generate all signed URLs in a single request (5ms/file).</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                            <Shield className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-1">Secure with JWTs</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">Don't expose long-lived credentials. Use generateAccessToken for temporary, fine-grained access to specific files.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                            <Globe className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-1">Custom Domain</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">Connect a custom domain to your R2 bucket in Cloudflare dashboard for professional URLs (e.g. cdn.myapp.com).</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-8 border-t border-zinc-800">
                    <Link
                        href="/docs-new/providers/s3"
                        className="group flex items-center gap-2 text-white font-medium hover:text-fd-primary transition-colors"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                        Amazon S3
                    </Link>
                    <Link
                        href="/docs-new/providers/uploadcare"
                        className="group flex items-center gap-2 text-white font-medium hover:text-fd-primary transition-colors"
                    >
                        Uploadcare
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="h-[200px]"></div>
            </DocsBody>
        </DocsPage>
    );
}
