"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNavigation } from "@/config/docs-navigation";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
    return (
        <nav className="space-y-8">
            {docsNavigation.map((section, index) => (
                <div key={index}>   
                    <h4 className="mb-3 text-sm font-semibold text-white px-2">
                        {section.title}
                    </h4>
                    <div className="space-y-1">
                        {section.items.map((item, itemIndex) => (
                            <NavLink key={itemIndex} item={item} />
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    );
}

function NavLink({ item }: { item: any }) {
    const pathname = usePathname();
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={cn(
                "group flex items-center gap-2.5 px-2 py-1.5 text-sm rounded-md transition-colors border-l-2 relative",
                isActive
                    ? "text-emerald-400 border-emerald-400 bg-emerald-400/5"
                    : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
            )}
        >
            {Icon && (
                <Icon
                    className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-400"
                    )}
                />
            )}
            <span>{item.title}</span>
        </Link>
    );
}
