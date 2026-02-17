"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/docs/code-block";
import {
    CheckCircle, Zap, Globe, Shield, Clock, AlertCircle, ArrowRight,
    ThumbsUp, ThumbsDown, Database, Lock, DollarSign, Sparkles,
    TrendingUp, Server, HardDrive, Eye, Download, Trash2, Upload,
    FileText, Settings, Cloud, Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
                            ? "text-orange-400 border-b-2 border-orange-400 bg-orange-400/5"
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

export default function R2ProviderPage() {
    const [activeFramework, setActiveFramework] = useState('node');

    const code = r2CodeExamples[activeFramework];
    const currentLang = frameworks.find(f => f.id === activeFramework)?.lang || 'typescript';

    return (
        <article className="max-w-4xl space-y-12">
            {/* Hero Header */}
            <div id="hero-header" className="space-y-6">
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 rounded-2xl blur-2xl" />
                    <div className="relative space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-emerald-400">Storage Provider</span>
                            <span className="px-2.5 py-0.5 text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                HIGH PERFORMANCE
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-orange-500/20 rounded-xl blur-lg" />
                                <Cloud className="relative h-12 w-12 text-orange-400" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-bold text-white tracking-tight">Cloudflare R2</h1>
                                <p className="text-sm text-orange-400 mt-1 font-medium">Zero egress fees. S3-compatible.</p>
                            </div>
                        </div>
                        <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
                            S3 compatible object storage that eliminates egress bandwidth fees.
                        </p>
                    </div>
                </div>
            </div>

            {/* Visual Flow Diagram */}
            <div className="space-y-4">
                <h2 id="how-it-works" className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-orange-400" />
                    How it works
                </h2>
                <p className="text-slate-400">
                    Direct uploads to Cloudflare's global edge network. Zero egress fees make it ideal for high-traffic applications.
                </p>

                <div className="relative rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 overflow-hidden max-w-2xl mx-auto">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />

                    <div className="relative space-y-6">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex-1">
                                <FlowNode title="Your App" subtitle="myapp.com" icon={<Server className="h-6 w-6" />} color="emerald" />
                                <div className="text-xs text-slate-500 text-center mt-2">User requests signed URL</div>
                            </div>
                            <div className="flex flex-col items-center gap-1 px-4">
                                <ArrowRight className="h-6 w-6 text-emerald-400" />
                                <div className="text-[10px] text-emerald-400 font-medium whitespace-nowrap">Get upload URL</div>
                            </div>
                            <div className="flex-1">
                                <FlowNode title="ObitoX" subtitle="SDK Processing" icon={<Zap className="h-6 w-6" />} color="amber" pulse />
                                <div className="text-xs text-slate-500 text-center mt-2">Generates signed URL</div>
                            </div>
                            <div className="flex flex-col items-center gap-1 px-4">
                                <ArrowRight className="h-6 w-6 text-orange-400" />
                                <div className="text-[10px] text-orange-400 font-medium whitespace-nowrap">Direct Upload</div>
                            </div>
                            <div className="flex-1">
                                <FlowNode title="Cloudflare R2" subtitle="Global Edge" icon={<Cloud className="h-6 w-6" />} color="orange" />
                                <div className="text-xs text-slate-500 text-center mt-2">Stores at edge</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
                            <FeaturePill icon={<DollarSign />} text="ZERO egress fees" />
                            <FeaturePill icon={<Globe />} text="Global Edge Network" />
                            <FeaturePill icon={<Zap />} text="<50ms uploads" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Framework Tabs */}
            <FrameworkTabs activeFramework={activeFramework} onSelect={setActiveFramework} />

            {/* Quick Start Wizard */}
            <div className="space-y-6 rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent p-8">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20">
                        <Zap className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                        <h2 id="quick-start" className="text-2xl font-bold text-white">Quick Start</h2>
                        <p className="text-sm text-slate-400">Get up and running in 4 steps</p>
                    </div>
                </div>

                {/* Step 1-3: Setup instructions */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20">
                            <span className="text-sm font-bold text-orange-400">1</span>
                        </div>
                        <h3 id="create-r2-bucket" className="text-lg font-semibold text-white">Create R2 Bucket</h3>
                    </div>
                    <div className="ml-11 text-sm text-slate-400 space-y-2">
                        <p>Go to <a href="https://dash.cloudflare.com/" target="_blank" className="text-orange-400 hover:text-orange-300">Cloudflare Dashboard</a> → R2:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-4">
                            <li>Click <strong className="text-white">"Create Bucket"</strong></li>
                            <li>Enter a unique name (e.g., <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-xs">my-uploads</code>)</li>
                            <li>Copy your <strong className="text-white">Account ID</strong> from the R2 overview page</li>
                        </ol>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20">
                            <span className="text-sm font-bold text-orange-400">2</span>
                        </div>
                        <h3 id="create-api-tokens" className="text-lg font-semibold text-white">Create API Tokens</h3>
                    </div>
                    <div className="ml-11 text-sm text-slate-400 space-y-2">
                        <p>In R2 Dashboard → <strong className="text-white">Manage R2 API Tokens</strong>:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-4">
                            <li>Click <strong className="text-white">"Create API Token"</strong></li>
                            <li>Select <strong className="text-white">"Admin Read & Write"</strong> permissions</li>
                            <li>Copy the <strong className="text-white">Access Key ID</strong> and <strong className="text-white">Secret Access Key</strong></li>
                        </ol>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20">
                            <span className="text-sm font-bold text-orange-400">3</span>
                        </div>
                        <h3 id="configure-environment" className="text-lg font-semibold text-white">Configure Environment</h3>
                    </div>
                    <div className="ml-11">
                        <CodeBlock
                            language="bash"
                            code={`OBITOX_API_KEY=ox_xxxxxxxxxxxxxxxxxxxx
OBITOX_API_SECRET=sk_xxxxxxxxxxxxxxxxxxxx
R2_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
R2_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20">
                            <span className="text-sm font-bold text-orange-400">4</span>
                        </div>
                        <h3 id="upload-your-first-file" className="text-lg font-semibold text-white">Upload your first file</h3>
                    </div>
                    <div className="ml-11">
                        <CodeBlock language={currentLang} code={code.quickStart} />
                    </div>
                </div>
            </div>

            {/* Operations Grid */}
            <div className="space-y-6">
                <h2 id="operations" className="text-2xl font-bold text-white">Operations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <OperationCard icon={<Upload />} title="Upload Files" description="Basic and Batch upload (100 files)" href="#upload-features" />
                    <OperationCard icon={<Download />} title="Download Files" description="Zero egress fees on downloads" href="#download-signed-urls" />
                    <OperationCard icon={<Trash2 />} title="Delete Files" description="Single or batch delete (1000 files)" href="#delete-files" />
                    <OperationCard icon={<FileText />} title="List Files" description="Browse bucket contents, pagination" href="#list-files" />
                    <OperationCard icon={<Key />} title="Access Tokens" description="Generate JWT tokens for secure access" href="#access-tokens" />
                </div>
            </div>

            {/* Upload Features Section */}
            <div className="space-y-6">
                <div id="upload-features" className="flex items-center gap-3">
                    <Upload className="h-6 w-6 text-emerald-400" />
                    <h2 className="text-2xl font-bold text-white">Upload Features</h2>
                </div>

                <OperationSection id="basic-upload" title="Basic Upload" emoji="📤">
                    <CodeBlock language={currentLang} code={code.basicUpload} />
                </OperationSection>

                <OperationSection id="batch-upload" title="Batch Upload" emoji="🚀" description="Get signed URLs for up to 100 files in ONE API call">
                    <CodeBlock language={currentLang} code={code.batchUpload} />
                </OperationSection>

                <OperationSection id="custom-domain" title="Custom Domain" emoji="🌐" description="Serve files from your own domain">
                    <CodeBlock language={currentLang} code={code.customDomain} />
                </OperationSection>

                <OperationSection id="progress-tracking" title="Progress Tracking" emoji="📊" description="Monitor upload progress in real-time">
                    <CodeBlock language={currentLang} code={code.progressTracking} />
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

                <OperationSection id="single-delete" title="Single Delete" emoji="🗑️">
                    <CodeBlock language={currentLang} code={code.singleDelete} />
                </OperationSection>

                <OperationSection id="batch-delete" title="Batch Delete (Up to 1000 files)" emoji="💥" description="Delete hundreds of files in a single API call">
                    <CodeBlock language={currentLang} code={code.batchDelete} />
                </OperationSection>
            </div>

            {/* Download Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Download className="h-6 w-6 text-blue-400" />
                    <h2 id="download-signed-urls" className="text-2xl font-bold text-white">Download & Signed URLs</h2>
                </div>

                <OperationSection id="generate-signed-url" title="Generate Signed URL" emoji="🔐" description="Secure, time-limited download links">
                    <CodeBlock language={currentLang} code={code.signedUrl} />
                </OperationSection>
            </div>

            {/* Advanced Features */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-purple-400" />
                    <h2 id="advanced-features" className="text-2xl font-bold text-white">Advanced Features</h2>
                </div>

                <OperationSection id="access-tokens" title="JWT Access Tokens" emoji="🛡️" description="Enterprise-grade security with scoped permissions">
                    <CodeBlock language={currentLang} code={code.accessTokens} />
                </OperationSection>

                <OperationSection id="list-files" title="List Files" emoji="📋" description="Browse bucket contents with pagination">
                    <CodeBlock language={currentLang} code={code.listFiles} />
                </OperationSection>
            </div>

            {/* Pro Tips */}
            <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-8">
                <h3 id="pro-tips" className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                    Pro Tips for Production
                </h3>
                <div className="space-y-4">
                    <ProTip icon={<DollarSign />} title="Leverage Zero Egress Fees" description="R2 is perfect for high-bandwidth applications like video hosting or frequent downloads. You only pay for storage and operations." />
                    <ProTip icon={<Zap />} title="Use Batch Operations" description="Uploading 100 files? Use batchUpload to generate all signed URLs in a single request (5ms/file)." />
                    <ProTip icon={<Shield />} title="Secure with JWTs" description="Don't expose long-lived credentials. Use generateAccessToken for temporary, fine-grained access to specific files." />
                    <ProTip icon={<Globe />} title="Custom Domain" description="Connect a custom domain to your R2 bucket in Cloudflare dashboard for professional URLs (e.g. cdn.myapp.com)." />
                </div>
            </div>

            {/* Footer */}
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
                    <Link href="/docs/providers/s3" className="group flex items-center gap-2 text-white font-medium hover:text-emerald-400 transition-colors">
                        <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                        Amazon S3
                    </Link>
                    <Link href="/docs/providers/uploadcare" className="group flex items-center gap-2 text-white font-medium hover:text-emerald-400 transition-colors">
                        Uploadcare
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
    const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
        emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
        amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
        orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
    };

    const colors = colorClasses[color] || colorClasses.emerald;

    return (
        <div className={`relative flex flex-col items-center p-4 rounded-xl border ${colors.border} ${colors.bg} ${pulse ? 'animate-pulse' : ''}`}>
            <div className={`${colors.text}`}>{icon}</div>
            <div className="text-center mt-2">
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs text-slate-500">{subtitle}</div>
            </div>
        </div>
    );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50">
            <span className="text-orange-400 [&>svg]:h-3 [&>svg]:w-3">{icon}</span>
            <span className="text-xs font-medium text-slate-300">{text}</span>
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
        <a href={href} className="group p-4 rounded-lg border border-slate-800 bg-slate-900/30 hover:border-orange-500/30 hover:bg-orange-500/5 transition-colors">
            <div className="flex items-start gap-3">
                <div className="text-slate-400 group-hover:text-orange-400 transition-colors [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
                <div>
                    <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">{title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{description}</p>
                </div>
            </div>
        </a>
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
        <div id={id} className="p-6 rounded-xl border border-slate-800 bg-slate-900/20 space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span>{emoji}</span>
                    {title}
                </h3>
                {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
            </div>
            {children}
        </div>
    );
}

function ProTip({ icon, title, description }: {
    icon: React.ReactNode;
    title: string;
    description: string
}) {
    return (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-950/50 border border-slate-800">
            <div className="text-emerald-400 [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
            <div>
                <h4 className="font-semibold text-white">{title}</h4>
                <p className="text-sm text-slate-400 mt-1">{description}</p>
            </div>
        </div>
    );
}
