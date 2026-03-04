'use client';

import { CodeBlock, TypeTable } from '@/components/fumadocs/components';

export default function BreadcrumbPage() {
    return (
        <article className="prose prose-invert max-w-none">
            <header className="mb-8 not-prose">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Fumadocs Core: Breadcrumb
                </h1>
                <p className="text-zinc-400 text-lg">
                    The navigation component at the top of the screen
                </p>
            </header>

            <section className="mb-8">
                <p className="text-zinc-300 mb-4">
                    A hook for implementing Breadcrumb in your documentation. It returns breadcrumb items for a page based on the given page tree.
                </p>

                <blockquote className="border-l-4 border-zinc-700 pl-4 italic text-zinc-400 my-4">
                    If present, the index page of a folder will be used as the item.
                </blockquote>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4" id="usage">Usage</h2>
                <p className="text-zinc-300 mb-4">
                    It exports a <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm">useBreadcrumb</code> hook:
                </p>

                <CodeBlock>{`import { usePathname } from 'next/navigation';
import { useBreadcrumb } from 'fumadocs-core/breadcrumb';

// obtain \`pathname\` using the hook provided by your React framework.
const pathname = usePathname();
const items = useBreadcrumb(pathname, tree);`}</CodeBlock>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4" id="example">Example</h2>
                <p className="text-zinc-300 mb-4">
                    A styled example for Next.js.
                </p>

                <CodeBlock title="components/breadcrumb.tsx">{`'use client';
import { usePathname } from 'next/navigation';
import { useBreadcrumb } from 'fumadocs-core/breadcrumb';
import type { PageTree } from 'fumadocs-core/page-tree';
import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function Breadcrumb({ tree }: { tree: PageTree.Root }) {
  const pathname = usePathname();
  const items = useBreadcrumb(pathname, tree);

  if (items.length === 0) return null;

  return (
    <div className="-mb-3 flex flex-row items-center gap-1 text-sm font-medium text-fd-muted-foreground">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i !== 0 && <ChevronRight className="size-4 shrink-0 rtl:rotate-180" />}
          {item.url ? (
            <Link href={item.url} className="truncate hover:text-fd-accent-foreground">
              {item.name}
            </Link>
          ) : (
            <span className="truncate">{item.name}</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}`}</CodeBlock>

                <p className="text-zinc-300 mt-4">
                    You can use it by passing the page tree via <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm">tree</code> prop in a server component.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4" id="breadcrumb-item">Breadcrumb Item</h2>

                <TypeTable
                    type={{
                        name: "BreadcrumbItem",
                        description: "",
                        entries: [
                            {
                                name: "name",
                                type: "ReactNode",
                                description: "The display name of the breadcrumb item",
                                required: true,
                            },
                            {
                                name: "url",
                                type: "string | undefined",
                                description: "Optional URL for the breadcrumb link",
                                required: false,
                            },
                        ],
                    }}
                />
            </section>
        </article>
    );
}
