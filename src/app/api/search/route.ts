import { createSearchAPI } from 'fumadocs-core/search/server';

// Using 'advanced' mode with structuredData for proper search
export const { GET } = createSearchAPI('advanced', {
    language: 'english',
    indexes: [
        {
            id: 'intro',
            title: 'Introduction',
            description: 'This is a sample documentation page using Fumadocs UI.',
            url: '/docs-new',
            structuredData: {
                headings: [
                    { id: 'getting-started', content: 'Getting Started' },
                    { id: 'features', content: 'Features' },
                ],
                contents: [
                    {
                        heading: 'getting-started',
                        content: 'Fumadocs is a documentation framework for building beautiful documentation sites with Next.js.',
                    },
                    {
                        heading: 'features',
                        content: 'Built-in search with Orama. MDX support. Beautiful default theme. Full TypeScript support.',
                    },
                ],
            },
        },
    ],
});
