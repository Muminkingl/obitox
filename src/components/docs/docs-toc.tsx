"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, ExternalLink } from "lucide-react";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function DocsToc() {
    const [toc, setToc] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const pathname = usePathname();

    useEffect(() => {
        // Small delay to ensure DOM is updated after navigation
        const timeout = setTimeout(() => {
            const headings = Array.from(document.querySelectorAll("article h2, article h3"));
            const items: TocItem[] = headings.map((heading) => ({
                id: heading.id,
                text: heading.textContent || "",
                level: parseInt(heading.tagName.charAt(1)),
            }));
            setToc(items);
            setActiveId(""); // Reset active state on page change

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveId(entry.target.id);
                        }
                    });
                },
                {
                    rootMargin: "-100px 0px -66% 0px",
                    threshold: [0, 0.25, 0.5, 0.75, 1]
                }
            );

            headings.forEach((heading) => observer.observe(heading));
            return () => observer.disconnect();
        }, 100);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return (
        <aside className="hidden xl:block w-[240px] flex-shrink-0 py-8 border-l border-white/5">
            <div className="sticky top-8">
                {/* On this page */}
                <div className="mb-8">
                    <h4 className="text-sm font-semibold text-white mb-4">On this page</h4>
                    <nav className="space-y-2.5">
                        {toc.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className={cn(
                                    "block text-sm py-1 transition-colors border-l-2 pl-4",
                                    item.level === 3 && "pl-8",
                                    activeId === item.id
                                        ? "text-emerald-400 border-emerald-400"
                                        : "text-slate-400 border-transparent hover:text-white"
                                )}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById(item.id);
                                    if (element) {
                                        const yOffset = -100; // Account for any fixed headers
                                        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                        window.scrollTo({ top: y, behavior: "smooth" });
                                        setActiveId(item.id);
                                    }
                                }}
                            >
                                {item.text}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Handbook */}
                <div>
                    <h4 className="text-sm font-semibold text-white mb-4">Handbook</h4>
                    <nav className="space-y-3">
                        <CommunityLink href="/handbook/company/why-we-exist" label="Why we exist" />
                        <CommunityLink href="/handbook/architecture/system-overview" label="System Overview" />
                        <CommunityLink href="/handbook/architecture/security-model" label="Security Model" />
                    </nav>
                </div>
            </div>
        </aside>
    );
}

function CommunityLink({ href, label }: { href: string; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors group"
        >
            <BookOpen className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
    );
}
