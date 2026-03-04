'use client';

import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/fumadocs/layout.shared';
import 'fumadocs-ui/style.css';

// Properly formatted tree structure following Fumadocs Page Tree conventions
const tree = {
    name: 'Docs',
    children: [
        {
            type: 'page' as const,
            name: 'Introduction',
            url: '/docs',
        },
        {
            type: 'page' as const,
            name: 'Installation',
            url: '/docs/installation',
        },

        {
            type: 'folder' as const,
            name: 'Providers',
            children: [
                {
                    type: 'page' as const,
                    name: 'S3',
                    url: '/docs/providers/s3',
                },
                {
                    type: 'page' as const,
                    name: 'Cloudflare R2',
                    url: '/docs/providers/r2',
                },
                {
                    type: 'page' as const,
                    name: 'Supabase',
                    url: '/docs/providers/supabase',
                },
                {
                    type: 'page' as const,
                    name: 'Uploadcare',
                    url: '/docs/providers/uploadcare',
                },
            ],
        },
    ],
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <DocsLayout {...baseOptions()} tree={tree}>
            {children}
        </DocsLayout>
    );
}