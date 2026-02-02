'use client';

import { DocsPage, DocsDescription, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { CodeBlock } from '@/components/fumadocs/components';
import Link from 'next/link';

const tocItems = [
    {
        title: 'create-docus CLI',
        url: '#create-docus-cli',
        depth: 2,
    },
    {
        title: 'Layer Integration',
        url: '#layer-integration',
        depth: 2,
    },
];

export default function Page() {
    return (
        <DocsPage toc={tocItems}>
            <DocsTitle>Installation</DocsTitle>
            <DocsDescription>
                Get started with Docus documentation theme.
            </DocsDescription>

            <DocsBody>
                <h2 id="create-docus-cli" className="scroll-m-20">create-docus CLI</h2>

                <Steps>
                    <Step>
                        <h3>Create your docs directory</h3>
                        <p>
                            Use the <code>create-docus</code> CLI to create a new Docus project:
                        </p>
                        <CodeBlock title="Terminal">
                            npx create-docus my-docs
                        </CodeBlock>
                        <p>
                            You can choose between two templates:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <code>default</code>: Basic Docus setup for single-language documentation
                            </li>
                            <li>
                                <code>i18n</code>: Includes internationalization support for multi-language documentation
                            </li>
                        </ul>
                        <div className="mt-4">
                            <CodeBlock title="Terminal">
                                {`# Create with i18n template
npx create-docus my-docs -t i18n`}
                            </CodeBlock>
                        </div>
                        <p className="mt-4">
                            We recommend using the <code>npm</code> package manager.
                        </p>
                    </Step>

                    <Step>
                        <h3>Start your docs server in development</h3>
                        <p>
                            Move to your docs directory and start your docs server in development mode:
                        </p>
                        <CodeBlock title="Terminal">
                            {`cd my-docs
npm run dev`}
                        </CodeBlock>
                        <p className="mt-4">
                            A local preview of your documentation will be available at <Link href="http://localhost:3000" className="text-fd-primary hover:underline">http://localhost:3000</Link>
                        </p>
                    </Step>

                    <Step>
                        <h3>Write your documentation</h3>
                        <p>
                            Head over the Edition section to learn how to write your documentation.
                        </p>
                    </Step>
                </Steps>

                <h2 id="layer-integration" className="scroll-m-20">Layer Integration</h2>

                <p>
                    Docus v4 uses a <strong>Nuxt layer-based approach</strong>, you can extend the Docus layer directly in your <code>nuxt.config.ts</code> with <code>extends: ['docus']</code>:
                </p>

                <CodeBlock title="nuxt.config.ts">
                    {`export default defineNuxtConfig({
  extends: ['docus']
})`}
                </CodeBlock>

                <div className="h-[200px]"></div>
            </DocsBody>
        </DocsPage>
    );
}
