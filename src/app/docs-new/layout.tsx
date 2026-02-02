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
            url: '/docs-new',
        },
        {
            type: 'page' as const,
            name: 'Installation',
            url: '/docs-new/installation',
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