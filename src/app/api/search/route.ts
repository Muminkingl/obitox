import { createSearchAPI } from 'fumadocs-core/search/server';

// Using 'advanced' mode with structuredData for proper search
// This indexes all real content from docs-new pages
export const { GET } = createSearchAPI('advanced', {
    language: 'english',
    indexes: [
        // Introduction Page
        {
            id: 'introduction',
            title: 'Welcome to ObitoX',
            description: 'Upload files to any cloud provider with one simple API. No more wrestling with SDKs or managing credentials.',
            url: '/docs-new',
            structuredData: {
                headings: [
                    { id: 'welcome', content: 'What is ObitoX?' },
                    { id: 'frameworks', content: 'Choose Your Framework' },
                    { id: 'next-steps', content: 'Ready to Start?' },
                ],
                contents: [
                    {
                        heading: 'welcome',
                        content: 'ObitoX is a unified file upload API that lets you upload files to any cloud provider with a single, consistent interface. Whether you need S3, R2, Supabase, or Uploadcare, ObitoX handles the complexity so you can focus on building your application.',
                    },
                    {
                        heading: 'frameworks',
                        content: 'Pick your stack and get started in 2 minutes. ObitoX supports all major frameworks and languages including Node.js, Next.js, Express, Python, PHP, Laravel, Go, and Ruby.',
                    },
                    {
                        heading: 'next-steps',
                        content: 'Get your API key from the dashboard, follow the quickstart guide, and choose a provider like S3, R2, Supabase, or Uploadcare.',
                    },
                ],
            },
        },
        // Installation Page
        {
            id: 'installation',
            title: 'Installation',
            description: 'Get started with the ObitoX SDK in minutes. Installation guides for Node.js, Next.js, Express, Python, PHP, Laravel, Go, and Ruby.',
            url: '/docs-new/installation',
            structuredData: {
                headings: [
                    { id: 'prerequisites', content: 'Prerequisites' },
                    { id: 'install', content: 'Install' },
                    { id: 'initialize', content: 'Initialize the Client' },
                    { id: 'env', content: 'Environment Variables' },
                ],
                contents: [
                    {
                        heading: 'prerequisites',
                        content: 'Before you begin, you will need an ObitoX account with API credentials. Create an API key from your dashboard.',
                    },
                    {
                        heading: 'install',
                        content: 'Install the ObitoX SDK using your preferred package manager. Supports npm, yarn, pnpm, bun for JavaScript. pip, poetry, pipenv for Python. composer for PHP. go get for Go. gem for Ruby.',
                    },
                    {
                        heading: 'initialize',
                        content: 'Create a new ObitoX client with your API credentials. Import ObitoX and initialize with apiKey and apiSecret.',
                    },
                    {
                        heading: 'env',
                        content: 'Store your credentials securely in environment variables. OBITOX_API_KEY and OBITOX_API_SECRET. Never expose your API secret in client-side code or public repositories.',
                    },
                ],
            },
        },
        // Quick Start Page
        {
            id: 'quick-start',
            title: 'Quick Start',
            description: 'Build your first application with ObitoX in 5 minutes. Learn basic upload, download, list, and delete operations.',
            url: '/docs-new/quick-start',
            structuredData: {
                headings: [
                    { id: 'project-setup', content: 'Project Setup' },
                    { id: 'basic-upload', content: 'Basic Upload' },
                    { id: 'download-files', content: 'Download Files' },
                    { id: 'list-files', content: 'List Files' },
                    { id: 'delete-files', content: 'Delete Files' },
                    { id: 'error-handling', content: 'Error Handling' },
                    { id: 'next-steps', content: 'Next Steps' },
                ],
                contents: [
                    {
                        heading: 'project-setup',
                        content: 'Create a new Next.js project and install the ObitoX SDK. Prerequisites include completed installation and API credentials.',
                    },
                    {
                        heading: 'basic-upload',
                        content: 'Create a simple file upload component. Use useState for file and uploading states. Call obitox.upload with the file. Handle success and error cases.',
                    },
                    {
                        heading: 'download-files',
                        content: 'Download files using their file ID. Use obitox.download to get a blob. Create object URL and trigger download. Clean up with revokeObjectURL.',
                    },
                    {
                        heading: 'list-files',
                        content: 'Retrieve a list of all files in your storage. Use obitox.list with limit and offset parameters. Returns files array with metadata.',
                    },
                    {
                        heading: 'delete-files',
                        content: 'Remove files from storage when no longer needed. Use obitox.delete with fileId. Handle errors appropriately.',
                    },
                    {
                        heading: 'error-handling',
                        content: 'Always wrap SDK calls in try-catch blocks. Handle specific error codes like QUOTA_EXCEEDED and RATE_LIMIT. Provide user-friendly error messages.',
                    },
                    {
                        heading: 'next-steps',
                        content: 'Continue learning with S3 Provider Configuration, Image Transformations, CDN Integration, and Security Best Practices guides.',
                    },
                ],
            },
        },
        // S3 Provider Page
        {
            id: 's3-provider',
            title: 'Amazon S3',
            description: 'AWS S3 integration with storage classes, encryption SSE-S3 SSE-KMS, CloudFront CDN, multipart uploads, and S3-compatible storage support.',
            url: '/docs-new/providers/s3',
            structuredData: {
                headings: [
                    { id: 'quick-start', content: 'Quick Start' },
                    { id: 'upload-features', content: 'Upload Features' },
                    { id: 'delete-files', content: 'Delete Files' },
                    { id: 'download-signed-urls', content: 'Download & Signed URLs' },
                    { id: 'advanced-features', content: 'Advanced Features' },
                    { id: 'aws-regions', content: 'AWS Regions' },
                    { id: 's3-compatible', content: 'S3-Compatible Storage' },
                ],
                contents: [
                    {
                        heading: 'quick-start',
                        content: 'Upload to S3 in 3 lines of code. Configure provider as S3 with s3AccessKey, s3SecretKey, s3Bucket, and s3Region. Returns HTTPS URL.',
                    },
                    {
                        heading: 'upload-features',
                        content: 'Basic upload with automatic URL generation. Storage class support including STANDARD, INTELLIGENT_TIERING for cost savings. SSE-S3 and SSE-KMS encryption. CloudFront CDN integration for fast delivery.',
                    },
                    {
                        heading: 'delete-files',
                        content: 'Delete single files or batch delete up to 1000 files. Use client.deleteFile for single deletes. Use s3Provider.batchDelete for bulk operations.',
                    },
                    {
                        heading: 'download-signed-urls',
                        content: 'Generate secure time-limited download links with signed URLs. Set expiration with expiresIn parameter. Perfect for private files.',
                    },
                    {
                        heading: 'advanced-features',
                        content: 'List files with pagination and prefix filtering. Get file metadata including size, type, last modified, storage class. Multipart upload for files larger than 100MB with progress tracking.',
                    },
                    {
                        heading: 'aws-regions',
                        content: 'Full support for all AWS regions including us-east-1, us-west-2, eu-west-1, ap-southeast-1, and more. Configure s3Region parameter.',
                    },
                    {
                        heading: 's3-compatible',
                        content: 'Works with any S3-compatible storage using s3Endpoint parameter. Supports MinIO self-hosted, Backblaze B2, DigitalOcean Spaces, Wasabi, and more.',
                    },
                ],
            },
        },
        // R2 Provider Page
        {
            id: 'r2-provider',
            title: 'Cloudflare R2',
            description: 'S3 compatible object storage that eliminates egress bandwidth fees. Zero egress costs with high performance.',
            url: '/docs-new/providers/r2',
            structuredData: {
                headings: [
                    { id: 'quick-start', content: 'Quick Start' },
                    { id: 'upload-features', content: 'Upload Features' },
                    { id: 'delete-files', content: 'Delete Files' },
                    { id: 'download-signed-urls', content: 'Download & Signed URLs' },
                    { id: 'advanced-features', content: 'Advanced Features' },
                    { id: 'pro-tips', content: 'Pro Tips' },
                ],
                contents: [
                    {
                        heading: 'quick-start',
                        content: 'Get up and running in 4 steps. Create R2 bucket in Cloudflare Dashboard. Create API tokens with Admin Read Write permissions. Configure environment variables. Upload your first file.',
                    },
                    {
                        heading: 'upload-features',
                        content: 'Basic upload with r2AccessKey, r2SecretKey, r2AccountId, r2Bucket. Batch upload up to 100 files in one API call. Custom domain support for professional URLs. Real-time progress tracking with onProgress callback.',
                    },
                    {
                        heading: 'delete-files',
                        content: 'Single delete with fileUrl. Batch delete up to 1000 files in one operation. Fast deletion with immediate consistency.',
                    },
                    {
                        heading: 'download-signed-urls',
                        content: 'Generate secure time-limited download links. Configure expiration with expiresIn. Perfect for private file access.',
                    },
                    {
                        heading: 'advanced-features',
                        content: 'JWT Access Tokens for enterprise-grade security with scoped permissions. Generate tokens for specific files with read permissions. Revoke tokens anytime. List files with pagination and prefix filtering.',
                    },
                    {
                        heading: 'pro-tips',
                        content: 'Leverage zero egress fees for high-bandwidth applications. Use batch operations for uploading multiple files. Secure with JWTs instead of long-lived credentials. Connect custom domain for professional URLs.',
                    },
                ],
            },
        },
        // Supabase Provider Page
        {
            id: 'supabase-provider',
            title: 'Supabase Storage',
            description: 'Postgres-integrated object storage with Row Level Security (RLS) policies. SQL-integrated storage with fine-grained access control.',
            url: '/docs-new/providers/supabase',
            structuredData: {
                headings: [
                    { id: 'quick-start', content: 'Quick Start' },
                    { id: 'upload-features', content: 'Upload Features' },
                    { id: 'download-files', content: 'Download & Access' },
                    { id: 'bucket-management', content: 'Bucket Management' },
                    { id: 'rls-policies', content: 'RLS Policies' },
                    { id: 'pro-tips', content: 'Pro Tips' },
                ],
                contents: [
                    {
                        heading: 'quick-start',
                        content: 'Secure storage in 3 steps. Get project details from Supabase Dashboard including Project URL and service_role secret. Create bucket and policies. Upload file with supabaseUrl, supabaseToken, and bucket parameters.',
                    },
                    {
                        heading: 'upload-features',
                        content: 'Public bucket upload for easy read access. Private bucket upload with automatic signed URL generation. Progress tracking with real-time updates. Cancel upload functionality for user control.',
                    },
                    {
                        heading: 'download-files',
                        content: 'Public file access with direct URLs for public buckets. Private file access with signed URLs for time-limited secure access. Configure expiration with expiresIn parameter.',
                    },
                    {
                        heading: 'bucket-management',
                        content: 'List all buckets with metadata including public status. Create, update, and delete buckets programmatically. Manage bucket policies and permissions.',
                    },
                    {
                        heading: 'rls-policies',
                        content: 'Row Level Security for fine-grained access control. Create policies for public read access. User-owned file policies with auth.uid() checks. PostgreSQL-based policy management.',
                    },
                    {
                        heading: 'pro-tips',
                        content: 'Service role key bypasses RLS - never expose in client-side code. Buckets are private by default - must create RLS policies. Use signed URLs for temporary access to private files.',
                    },
                ],
            },
        },
        // Uploadcare Provider Page
        {
            id: 'uploadcare-provider',
            title: 'Uploadcare',
            description: 'Intelligent file CDN with smart image optimization and automatic virus scanning. Transform images on-the-fly without extra infrastructure.',
            url: '/docs-new/providers/uploadcare',
            structuredData: {
                headings: [
                    { id: 'quick-start', content: 'Quick Start' },
                    { id: 'upload-features', content: 'Upload Features' },
                    { id: 'virus-scanning', content: 'Virus Scanning' },
                    { id: 'transformations', content: 'Transformations' },
                    { id: 'download-urls', content: 'Download & CDN' },
                    { id: 'pro-tips', content: 'Pro Tips' },
                ],
                contents: [
                    {
                        heading: 'quick-start',
                        content: 'Get up and running in 3 steps. Get API keys from Uploadcare Dashboard - Public Key and Secret Key. Configure environment variables with UPLOADCARE_PUBLIC_KEY and UPLOADCARE_SECRET_KEY. Upload with image optimization enabled.',
                    },
                    {
                        heading: 'upload-features',
                        content: 'Basic upload to intelligent CDN. Auto image optimization with WebP and AVIF conversion. Manual optimization with format, quality, progressive, stripMeta, adaptiveQuality options. Real-time progress tracking with onProgress callback.',
                    },
                    {
                        heading: 'virus-scanning',
                        content: 'Automatic virus scanning with checkVirus option. Files are scanned during upload. Infected files are automatically deleted. Try-catch handling for virus detection errors.',
                    },
                    {
                        heading: 'transformations',
                        content: 'On-the-fly image transformations via URL parameters. Resize images with /-/resize/widthxheight/. Convert formats with /-/format/webp/. Crop and adjust quality. Chain multiple transformations.',
                    },
                    {
                        heading: 'download-urls',
                        content: 'Get CDN URLs for fast global delivery. Publicly accessible links for all uploaded files. Delete files when no longer needed.',
                    },
                    {
                        heading: 'pro-tips',
                        content: 'Use adaptiveQuality for AI-powered compression without visible quality loss. Enable checkVirus for user-generated content platforms. Apply transformations via URL params for consistent delivery without re-processing.',
                    },
                ],
            },
        },
    ],
});
