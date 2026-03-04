import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsToc } from "@/components/docs/docs-toc";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Introduction - Docus",
    description: "Welcome to Docus theme documentation",
};

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-300 antialiased">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                <div className="flex gap-8">

                    {/* Left Sidebar */}
                    <aside className="hidden lg:block w-[240px] flex-shrink-0 py-8 border-r border-white/5">
                        <DocsSidebar />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 py-8 px-4 lg:px-12">
                        {children}
                    </main>

                    {/* Right TOC Sidebar */}
                    <DocsToc />
                </div>
            </div>
        </div>
    );
}
