# ObitoX S3 Provider - Complete Node.js API Reference

All available S3 features with Node.js code examples.

---

## 📤 Upload Features

### Basic Upload

```typescript
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1'
});

console.log('Uploaded:', url);
// https://my-uploads.s3.us-east-1.amazonaws.com/photo-xxxxx.jpg
```

---

### Storage Class (Cost Optimization)

```typescript
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  s3StorageClass: 'INTELLIGENT_TIERING'  // Auto-saves money! 💰
});
```

**Available storage classes:** `STANDARD`, `INTELLIGENT_TIERING`, `STANDARD_IA`, `ONEZONE_IA`, `GLACIER`, `DEEP_ARCHIVE`

---

### SSE-S3 Encryption (Default)

```typescript
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  s3EncryptionType: 'SSE-S3'  // Default, no extra cost
});
```

---

### SSE-KMS Encryption (Enterprise)

```typescript
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  s3EncryptionType: 'SSE-KMS',
  s3KmsKeyId: 'arn:aws:kms:us-east-1:123456789:key/mrk-xxx'  // HIPAA, PCI-DSS ✓
});
```

---

### CloudFront CDN Integration

```typescript
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  s3CloudFrontDomain: 'cdn.myapp.com'  // Your CloudFront domain
});

// Returns CDN URL for blazing fast delivery
console.log(url); // https://cdn.myapp.com/photo-xxxxx.jpg
```

---

### Progress Tracking

```typescript
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  
  onProgress: (progress, bytesUploaded, totalBytes) => {
    console.log(`${progress.toFixed(1)}% uploaded`);
    // Browser: 0% → 15% → 32% → 58% → 100%
    // Node.js: 0% → 100%
  },
  
  onCancel: () => console.log('Upload cancelled')
});
```

---

### Multipart Upload (Large Files)

```typescript
const s3Provider = client.providers.get('S3');

// For files > 100MB, use multipart upload
const url = await s3Provider.multipartUpload({
  file: largeFile,
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  partSize: 10 * 1024 * 1024,  // 10MB parts
  
  onProgress: (progress, uploadedParts, totalParts) => {
    console.log(`Part ${uploadedParts}/${totalParts} - ${progress}%`);
  }
});
```

---

## 📥 Download Features

### Generate Signed URL

```typescript
const signedUrl = await client.downloadFile({
  provider: 'S3',
  key: 'documents/report.pdf',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  expiresIn: 3600  // 1 hour
});

// https://my-uploads.s3...?X-Amz-Signature=xxx
```

---

### Force Download (Content-Disposition)

```typescript
const downloadUrl = await client.downloadFile({
  provider: 'S3',
  key: 'report.pdf',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  responseContentDisposition: 'attachment; filename="report.pdf"'
});

// Browser will download instead of opening
```

---

## 🗑️ Delete Features

### Delete Single File

```typescript
await client.deleteFile({
  provider: 'S3',
  key: 'uploads/old-file.jpg',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1'
});
```

---

### Batch Delete (Multiple Files)

```typescript
const s3Provider = client.providers.get('S3');

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
});
```

---

## 📋 List & Metadata Features

### List Files in Bucket

```typescript
const s3Provider = client.providers.get('S3');

const result = await s3Provider.list({
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1',
  prefix: 'documents/',  // Optional: filter by folder
  maxKeys: 100           // Optional: limit results (default: 1000)
});

console.log(`Found ${result.count} files`);
result.files.forEach(file => {
  console.log(`${file.key} - ${file.size} bytes`);
});
```

---

### Get File Metadata

```typescript
const s3Provider = client.providers.get('S3');

const metadata = await s3Provider.getMetadata({
  key: 'photo-xxxxx.jpg',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: 'my-uploads',
  s3Region: 'us-east-1'
});

console.log(`Size: ${metadata.metadata.sizeFormatted}`);
console.log(`Type: ${metadata.metadata.contentType}`);
console.log(`Last Modified: ${metadata.metadata.lastModified}`);
console.log(`Storage Class: ${metadata.metadata.storageClass}`);
```

---

## 🔌 S3-Compatible Storage

### Generic S3-Compatible Endpoint

```typescript
// Use ANY S3-compatible storage with s3Endpoint!
// Works with: MinIO, Backblaze B2, DigitalOcean Spaces, Wasabi, etc.

const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: 'your-access-key',
  s3SecretKey: 'your-secret-key',
  s3Bucket: 'my-bucket',
  s3Region: 'us-east-1',
  s3Endpoint: 'http://localhost:9000'  // Your MinIO/S3-compatible endpoint
});

// Works with all operations: upload, download, delete, list, metadata!
```

---

### MinIO (Self-Hosted)

```typescript
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: 'minioadmin',
  s3SecretKey: 'minioadmin123',
  s3Bucket: 'my-bucket',
  s3Region: 'us-east-1',
  s3Endpoint: 'http://localhost:9000'
});
```

---

### Backblaze B2

```typescript
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.B2_KEY_ID,
  s3SecretKey: process.env.B2_APPLICATION_KEY,
  s3Bucket: 'my-bucket',
  s3Region: 'us-west-001',
  s3Endpoint: 'https://s3.us-west-001.backblazeb2.com'
});
```

---

### DigitalOcean Spaces

```typescript
const url = await client.uploadFile(file, {
  provider: 'S3',
  s3AccessKey: process.env.SPACES_KEY,
  s3SecretKey: process.env.SPACES_SECRET,
  s3Bucket: 'my-space',
  s3Region: 'nyc3',
  s3Endpoint: 'https://nyc3.digitaloceanspaces.com'
});
```

---

## 📊 Feature Summary

| Feature | Method | Key Options |
|---------|--------|-------------|
| Basic Upload | `client.uploadFile()` | `s3Bucket`, `s3Region` |
| Storage Class | `client.uploadFile()` | `s3StorageClass` |
| SSE-S3 Encryption | `client.uploadFile()` | `s3EncryptionType: 'SSE-S3'` |
| SSE-KMS Encryption | `client.uploadFile()` | `s3EncryptionType: 'SSE-KMS'`, `s3KmsKeyId` |
| CloudFront CDN | `client.uploadFile()` | `s3CloudFrontDomain` |
| Progress Tracking | `client.uploadFile()` | `onProgress`, `onCancel` |
| Multipart Upload | `s3Provider.multipartUpload()` | `partSize` |
| Signed URL | `client.downloadFile()` | `expiresIn` |
| Force Download | `client.downloadFile()` | `responseContentDisposition` |
| Delete File | `client.deleteFile()` | `key` |
| Batch Delete | `s3Provider.batchDelete()` | `keys[]` |
| List Files | `s3Provider.list()` | `prefix`, `maxKeys` |
| Get Metadata | `s3Provider.getMetadata()` | `key` |
| S3-Compatible | Any method | `s3Endpoint` |
