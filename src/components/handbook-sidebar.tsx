'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface SidebarItem {
    title: string;
    href?: string;
    items?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
    {
        title: 'Company',
        items: [
            {
                title: 'Why we exist',
                href: '/handbook/company/why-we-exist',
            },
            {
                title: 'What we believe',
                href: '/handbook/company/what-we-believe',
            },
            {
                title: 'How we make money',
                href: '/handbook/company/how-we-make-money',
            },
            {
                title: 'How dogfooding shapes our product',
                href: '/handbook/company/how-dogfooding-shapes-our-product',
            },
        ],
    },
    {
        title: 'Architecture',
        items: [
            {
                title: 'System overview',
                href: '/handbook/architecture/system-overview',
            },
            {
                title: 'Control vs data plane',
                href: '/handbook/architecture/control-vs-data-plane',
            },
            {
                title: 'Security model',
                href: '/handbook/architecture/security-model',
            },
            {
                title: 'Performance philosophy',
                href: '/handbook/architecture/performance-philosophy',
            },
        ],
    },
    {
        title: 'Security',
        items: [
            {
                title: 'API keys & secrets',
                href: '/handbook/security/api-keys-and-secrets',
            },
            {
                title: 'Request signing',
                href: '/handbook/security/request-signing',
            },
            {
                title: 'Rate limits & abuse',
                href: '/handbook/security/rate-limits-and-abuse',
            },
            {
                title: 'Key revocation & rotation',
                href: '/handbook/security/key-revocation-and-rotation',
            },
        ],
    },

];

function SidebarSection({ item }: { item: SidebarItem }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);

    // If it's a simple link without children
    if (!item.items && item.href) {
        const isActive = pathname === item.href;
        return (
            <Link
                href={item.href}
                className={cn(
                    "flex items-center py-2 px-3 text-sm rounded-md transition-colors",
                    isActive
                        ? "text-white font-medium bg-neutral-900/50"
                        : "text-neutral-400 hover:text-neutral-200"
                )}
            >
                {item.title}
            </Link>
        );
    }

    // If it has children (collapsible section)
    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center w-full py-2 px-3 text-sm text-neutral-300 hover:text-white transition-colors group"
            >
                <ChevronRight
                    className={cn(
                        "w-3.5 h-3.5 mr-2 transition-transform text-neutral-500 group-hover:text-neutral-400",
                        isOpen && "rotate-90"
                    )}
                />
                <span className="font-medium">{item.title}</span>
            </button>
            {isOpen && item.items && (
                <div className="ml-5 space-y-0.5 border-l border-neutral-800/50 pl-3">
                    {item.items.map((subItem, index) => {
                        const isActive = pathname === subItem.href;
                        return (
                            <Link
                                key={index}
                                href={subItem.href || '#'}
                                className={cn(
                                    "block py-1.5 px-3 text-sm rounded-md transition-colors",
                                    isActive
                                        ? "text-white font-medium bg-neutral-900/30"
                                        : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/20"
                                )}
                            >
                                {subItem.title}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function HandbookSidebar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ title: string; href: string; section: string }[]>([]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        const results: { title: string; href: string; section: string }[] = [];
        const lowerQuery = query.toLowerCase();

        sidebarItems.forEach((section) => {
            if (section.items) {
                section.items.forEach((item) => {
                    if (item.title.toLowerCase().includes(lowerQuery)) {
                        results.push({
                            title: item.title,
                            href: item.href || '#',
                            section: section.title,
                        });
                    }
                });
            }
        });

        setSearchResults(results);
    };

    return (
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block md:w-64 border-r border-neutral-800/50 bg-black text-white">
            <div className="h-full py-6 pr-6 lg:py-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* Search Bar */}
                <div className="px-4 mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9 pr-16 bg-neutral-900/50 border-neutral-800 text-sm text-neutral-300 placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-neutral-700 focus-visible:border-neutral-700 h-9 rounded-lg"
                        />
                        <kbd className="absolute right-2 top-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-800 bg-neutral-900 px-1.5 font-mono text-[10px] font-medium text-neutral-500">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>

                {/* Search Results or Navigation */}
                {searchQuery ? (
                    <div className="px-4 space-y-1">
                        {searchResults.length > 0 ? (
                            searchResults.map((result, index) => (
                                <Link
                                    key={index}
                                    href={result.href}
                                    className="block group py-2"
                                >
                                    <div className="text-sm text-neutral-200 group-hover:text-white transition-colors">
                                        {result.title}
                                    </div>
                                    <div className="text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors">
                                        {result.section}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-neutral-500 py-2">No results found.</p>
                        )}
                    </div>
                ) : (
                    <nav className="px-3 space-y-1">
                        {sidebarItems.map((item, index) => (
                            <SidebarSection key={index} item={item} />
                        ))}
                    </nav>
                )}
            </div>
        </aside>
    );
}