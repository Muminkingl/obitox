import { DocsPage, DocsDescription, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { Cards, Card } from 'fumadocs-ui/components/card';
import { ArrowRight, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import Link from 'next/link';

const tocItems = [
    {
        title: 'Welcome',
        url: '#welcome',
        depth: 2,
    },
    {
        title: 'Choose Your Framework',
        url: '#frameworks',
        depth: 2,
    },
    {
        title: 'Next Steps',
        url: '#next-steps',
        depth: 2,
    },
];

export default function Page() {
    return (
        <DocsPage toc={tocItems}>
            <DocsTitle>Welcome to ObitoX</DocsTitle>
            <DocsDescription>
                Upload files to any cloud provider with one simple API.
                No more wrestling with SDKs or managing credentials.
            </DocsDescription>

            <DocsBody>
                <h2 id="welcome" className="scroll-m-20">What is ObitoX?</h2>

                <p>
                    ObitoX is a unified file upload API that lets you upload files to <strong>any cloud provider</strong> with a single, consistent interface. Whether you need S3, R2, Supabase, or Uploadcare, ObitoX handles the complexity so you can focus on building your application.
                </p>

                <h2 id="frameworks" className="scroll-m-20">Choose Your Framework</h2>

                <p>
                    Pick your stack and get started in 2 minutes. ObitoX supports all major frameworks and languages.
                </p>

                <Cards>
                    <Card
                        icon={<span className="text-lg">🟢</span>}
                        href="/docs-new/installation?lang=node"
                        title="Node.js"
                        description="JavaScript runtime built on Chrome's V8 engine"
                    />
                    <Card
                        icon={<span className="text-lg">⚡</span>}
                        href="/docs-new/installation?lang=next"
                        title="Next.js"
                        description="The React Framework for the Web"
                    />
                    <Card
                        icon={<span className="text-lg">🚂</span>}
                        href="/docs-new/installation?lang=express"
                        title="Express"
                        description="Fast, unopinionated web framework for Node.js"
                    />
                    <Card
                        icon={<span className="text-lg">🐍</span>}
                        href="/docs-new/installation?lang=python"
                        title="Python"
                        description="Programming language that lets you work quickly"
                    />
                    <Card
                        icon={<span className="text-lg">🐘</span>}
                        href="/docs-new/installation?lang=php"
                        title="PHP"
                        description="Popular general-purpose scripting language"
                    />
                    <Card
                        icon={<span className="text-lg">🎨</span>}
                        href="/docs-new/installation?lang=laravel"
                        title="Laravel"
                        description="PHP web application framework with expressive syntax"
                    />
                    <Card
                        icon={<span className="text-lg">🐹</span>}
                        href="/docs-new/installation?lang=go"
                        title="Go"
                        description="Build simple, secure, scalable systems"
                    />
                    <Card
                        icon={<span className="text-lg">💎</span>}
                        href="/docs-new/installation?lang=ruby"
                        title="Ruby"
                        description="A dynamic, open source programming language"
                    />
                </Cards>

                <Link
                    href="/docs-new/installation"
                    className="inline-flex items-center gap-2 text-sm text-fd-primary hover:text-fd-primary/80 font-medium group"
                >
                    View all frameworks
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <h2 id="next-steps" className="scroll-m-20">Ready to Start?</h2>

                <p>
                    Follow these steps to get up and running with ObitoX in minutes:
                </p>

                <Cards>
                    <Card
                        icon={<span className="text-fd-primary font-bold">1</span>}
                        href="/dashboard"
                        title="Get your API key"
                        description="Sign up and grab your key from the dashboard"
                    />
                    <Card
                        icon={<span className="text-fd-primary font-bold">2</span>}
                        href="/docs-new/quick-start"
                        title="Follow the quickstart"
                        description="Copy-paste code and upload your first file"
                    />
                    <Card
                        icon={<span className="text-fd-primary font-bold">3</span>}
                        href="/docs-new/providers"
                        title="Choose a provider"
                        description="Pick S3, R2, or any supported storage"
                    />
                </Cards>

                <div className="h-[200px]"></div>
            </DocsBody>
        </DocsPage>
    );
}
