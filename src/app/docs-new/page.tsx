import { DocsPage, DocsDescription, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { Cards, Card } from 'fumadocs-ui/components/card';
import { Image, Terminal, FileCode, Search, Type, Moon } from 'lucide-react';
import Link from 'next/link';

const tocItems = [
    {
        title: 'What is Docus?',
        url: '#what-is-docus',
        depth: 2,
    },
    {
        title: 'Key Features',
        url: '#key-features',
        depth: 2,
    },
];

export default function Page() {
    return (
        <DocsPage toc={tocItems}>
            <DocsTitle>Introduction</DocsTitle>
            <DocsDescription>
                Discover how to create, manage, and publish documentation effortlessly with Docus.
            </DocsDescription>

            <DocsBody>
                <p>
                    Welcome to <strong>Docus</strong>, a fully integrated documentation solution built with <Link href="https://ui.nuxt.com" className="text-fd-primary font-medium hover:underline">Nuxt UI</Link>.
                </p>

                <h2 id="what-is-docus" className="scroll-m-20">What is Docus?</h2>

                <p>
                    Docus is a theme based on the <Link href="https://docs-template.nuxt.dev/" className="text-fd-primary font-medium hover:underline">UI documentation template</Link>. While the visual style comes ready out of the box, your focus should be on writing content using the Markdown and <Link href="https://content.nuxt.com/docs/files/markdown#mdc-syntax" className="text-fd-primary font-medium hover:underline">MDC syntax</Link> provided by <Link href="https://content.nuxt.com" className="text-fd-primary font-medium hover:underline">Nuxt Content</Link>.
                </p>

                <p>
                    We use this theme across all our Nuxt module documentations, including:
                </p>

                <Cards>
                    <Card
                        icon={<Image className="text-fd-muted-foreground" />}
                        href="https://image.nuxt.com"
                        title="Nuxt Image"
                        description="The documentation of @nuxt/image"
                        external
                    />
                    <Card
                        href="https://content.nuxt.com"
                        title="Nuxt Content"
                        description="The documentation of @nuxt/content"
                        external
                    />
                    <Card
                        href="https://supabase.nuxtjs.org"
                        title="Nuxt Supabase"
                        description="The documentation of @nuxt/supabase"
                        external
                    />
                    <Card
                        href="https://strapi.nuxtjs.org"
                        title="Nuxt Strapi"
                        description="The documentation of @nuxt/strapi"
                        external
                    />
                </Cards>

                <h2 id="key-features" className="scroll-m-20">Key Features</h2>

                <p>
                    This theme includes a range of features designed to improve documentation management:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Powered by <Link href="https://nuxt.com" className="text-fd-primary font-medium hover:underline">Nuxt 4</Link></strong>: Utilizes the latest Nuxt framework for optimal performance.
                    </li>
                    <li>
                        <strong>Built with <Link href="https://ui.nuxt.com" className="text-fd-primary font-medium hover:underline">Nuxt UI</Link></strong>: Integrates a comprehensive suite of UI components.
                    </li>
                    <li>
                        <strong><Link href="https://content.nuxt.com/usage/markdown" className="text-fd-primary font-medium hover:underline">MDC Syntax</Link> via <Link href="https://content.nuxt.com" className="text-fd-primary font-medium hover:underline">Nuxt Content</Link></strong>: Supports Markdown with component integration for dynamic content.
                    </li>
                    <li>
                        <strong><Link href="https://content.nuxt.com/docs/studio" className="text-fd-primary font-medium hover:underline">Nuxt Studio</Link> Compatible</strong>: Write and edit your content visually. No Markdown knowledge is required!
                    </li>
                    <li>
                        <strong>Auto-generated Sidebar Navigation</strong>: Automatically generates navigation from content structure.
                    </li>
                    <li>
                        <strong>Full-Text Search</strong>: Includes built-in search functionality for content discovery.
                    </li>
                    <li>
                        <strong>Optimized Typography</strong>: Features refined typography for enhanced readability.
                    </li>
                    <li>
                        <strong>Dark Mode</strong>: Offers dark mode support for user preference.
                    </li>
                    <li>
                        <strong>Extensive Functionality</strong>: Explore the theme to fully appreciate its capabilities.
                    </li>
                </ul>

                <div className="h-[200px]"></div>
            </DocsBody>
        </DocsPage>
    );
}
