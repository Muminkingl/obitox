"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DocsBreadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length <= 1) {
        return null;
    }

    const breadcrumbs = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const title = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        return { href, title };
    });

    return (
        <nav className="mb-8 flex items-center space-x-2 text-sm text-emerald-400 font-medium">
            {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />}

                    {index === breadcrumbs.length - 1 ? (
                        <span className="text-emerald-400">{crumb.title}</span>
                    ) : (
                        // Parent categories are often just labels, but if they are links:
                        <span className="text-emerald-400">{crumb.title}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
