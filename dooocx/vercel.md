# Vercel Blob Storage

> Upload files to Vercel Blob with automatic global CDN distribution

## Overview

Vercel Blob is a simple, scalable object storage solution with automatic edge caching. Files uploaded to Vercel Blob are instantly available worldwide through Vercel's global CDN.


---

## Getting Started

### Prerequisites

1. **Vercel Blob Token** - Get from [Vercel Dashboard](https://vercel.com/dashboard/stores)
   - Format: `vercel_blob_rw_xxxxx...`
   - Requires read/write permissions




## Upload Features

### Basic Upload

```ts theme={"theme":{"light":"github-light","dark":"vesper"}}
import ObitoX from 'obitox';

const client = new ObitoX({
  apiKey: process.env.OBITOX_API_KEY,
  apiSecret: process.env.OBITOX_API_SECRET
});

// Upload file
const url = await client.uploadFile(file, {
  provider: 'VERCEL',
  vercelToken: process.env.VERCEL_BLOB_TOKEN
});

console.log('Uploaded:', url);
// Output: https://xxx.public.blob.vercel-storage.com/photo.jpg

// done thats it seriously!
```


> **Note:** Vercel Blob uploads **do not support progress tracking** because files upload directly to Vercel (bypassing ObitoX), and the `@vercel/blob` SDK doesn't expose progress events. Use a simple loading spinner instead of a progress bar.


## Delete Files

### Basic Delete

```ts theme={"theme":{"light":"github-light","dark":"vesper"}}
await client.deleteFile({
  provider: 'VERCEL',
  fileUrl: 'https://xxx.public.blob.vercel-storage.com/photo.jpg',
  vercelToken: process.env.VERCEL_BLOB_TOKEN
});

// done!
```


### Batch Delete Pattern

Delete multiple files sequentially:

```ts theme={"theme":{"light":"github-light","dark":"vesper"}}
const urls = [
  'https://xxx.public.blob.vercel-storage.com/photo1.jpg',
  'https://xxx.public.blob.vercel-storage.com/photo2.jpg',
  'https://xxx.public.blob.vercel-storage.com/photo3.jpg'
];

for (const url of urls) {
  try {
    await client.deleteFile({
      provider: 'VERCEL',
      fileUrl: url,
      vercelToken: process.env.VERCEL_BLOB_TOKEN
    });
    console.log(`✅ Deleted: ${url}`);
  } catch (error) {
    console.error(`❌ Failed: ${url}`, error.message);
  }
}
```

---

## Download & CDN Access

### Direct URL Access

Vercel Blob files are **public by default** - no signed URLs needed:

```ts theme={"theme":{"light":"github-light","dark":"vesper"}}
const downloadUrl = await client.downloadFile({
  provider: 'VERCEL',
  fileUrl: 'https://xxx.public.blob.vercel-storage.com/photo.jpg',
  vercelToken: process.env.VERCEL_BLOB_TOKEN
});

// downloadUrl === fileUrl (same URL)
console.log(downloadUrl);
```

### Browser Download

```ts theme={"theme":{"light":"github-light","dark":"vesper"}}
// Direct download in browser
window.open(fileUrl, '_blank');

// Or programmatic download
const response = await fetch(fileUrl);
const blob = await response.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'photo.jpg';
a.click();
```

### Server-Side Download

```ts theme={"theme":{"light":"github-light","dark":"vesper"}}
import fs from 'fs';

const response = await fetch(fileUrl);
const buffer = await response.arrayBuffer();
fs.writeFileSync('downloaded.jpg', Buffer.from(buffer));
```


---