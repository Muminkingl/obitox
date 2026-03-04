'use client';

import { CodeBlock, TypeTable } from '@/components/fumadocs/components';

export default function TocPage() {
    return (
        <article className="prose prose-invert max-w-none">
            <header className="mb-8 not-prose">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Fumadocs Core: TOC
                </h1>
                <p className="text-zinc-400 text-lg">
                    Table of Contents
                </p>
            </header>

            <section className="mb-8">
                <p className="text-zinc-300 mb-4">
                    A Table of Contents with active anchor observer and auto scroll.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4" id="usage">Usage</h2>
                <CodeBlock>{`import * as Base from 'fumadocs-core/toc';

return (
  <Base.AnchorProvider>
    <Base.ScrollProvider>
      <Base.TOCItem />
      <Base.TOCItem />
    </Base.ScrollProvider>
  </Base.AnchorProvider>
);`}</CodeBlock>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4" id="anchor-provider">Anchor Provider</h2>
                <p className="text-zinc-300 mb-4">
                    Watches for the active anchor using the Intersection Observer API.
                </p>

                <TypeTable
                    type={{
                        name: "AnchorProviderProps",
                        description: "",
                        entries: [
                            {
                                name: "toc",
                                type: "TOC.TableOfContents",
                                description: "Table of contents data",
                                required: true,
                            },
                            {
                                name: "single",
                                type: "boolean | undefined",
                                description: "Only accept one active item at most",
                                required: false,
                            },
                            {
                                name: "children",
                                type: "ReactNode",
                                description: "React children",
                                required: false,
                            },
                        ],
                    }}
                />
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4" id="scroll-provider">Scroll Provider</h2>
                <p className="text-zinc-300 mb-4">
                    Scrolls the scroll container to the active anchor.
                </p>

                <TypeTable
                    type={{
                        name: "ScrollProviderProps",
                        description: "",
                        entries: [
                            {
                                name: "containerRef",
                                type: "RefObject<HTMLElement | null>",
                                description: "Scroll into the view of container when active",
                                required: true,
                            },
                            {
                                name: "children",
                                type: "ReactNode",
                                description: "React children",
                                required: false,
                            },
                        ],
                    }}
                />
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4" id="toc-item">TOC Item</h2>
                <p className="text-zinc-300 mb-4">
                    An anchor item for jumping to the target anchor.
                </p>

                <div className="my-6 rounded-lg border border-zinc-800 overflow-hidden not-prose">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-900/50">
                            <tr>
                                <th className="px-4 py-2 text-left text-zinc-400 font-medium">Data Attribute</th>
                                <th className="px-4 py-2 text-left text-zinc-400 font-medium">Values</th>
                                <th className="px-4 py-2 text-left text-zinc-400 font-medium">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-zinc-800">
                                <td className="px-4 py-3 font-mono text-xs text-blue-400">data-active</td>
                                <td className="px-4 py-3 font-mono text-xs text-zinc-300">true, false</td>
                                <td className="px-4 py-3 text-zinc-400">Is the anchor active</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4" id="example">Example</h2>

                <CodeBlock>{`import { AnchorProvider, ScrollProvider, TOCItem, type TOCItemType } from 'fumadocs-core/toc';
import { type ReactNode, useRef } from 'react';

export function Page({ items, children }: { items: TOCItemType[]; children: ReactNode }) {
  const viewRef = useRef<HTMLDivElement>(null);

  return (
    <AnchorProvider toc={items}>
      <div ref={viewRef} className="overflow-auto">
        <ScrollProvider containerRef={viewRef}>
          {items.map((item) => (
            <TOCItem key={item.url} href={item.url}>
              {item.title}
            </TOCItem>
          ))}
        </ScrollProvider>
      </div>
      {children}
    </AnchorProvider>
  );
}`}</CodeBlock>
            </section>
        </article>
    );
}
