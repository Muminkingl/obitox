"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const tabs = [
        { name: "Appearance", href: "/dashboard/settings/appearance" },
        { name: "Team", href: "/dashboard/settings/team" },
        { name: "Billing", href: "/dashboard/settings/billing" },

    ]

    const isActive = (href: string) => {
        // Handle exact match or sub-paths if necessary, but exact match is usually best for tabs
        return pathname === href
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Header Section - Non-sticky, scrolls with page */}
                <div className="bg-background border-b">
                    <div className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                                    Dashboard
                                </Link>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-foreground">Settings</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-6 space-y-6">
                        {/* Title and Search */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

                            {/* Search */}
                            <div className="relative w-80">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search"
                                    className="pl-9 bg-muted/50"
                                />
                                <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>

                        {/* Tab Navigation - Pill Style */}
                        <nav className="inline-flex items-center gap-1 overflow-x-auto rounded-lg bg-muted p-1">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={cn(
                                        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                        isActive(tab.href)
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        {tab.name}
                                        {tab.badge && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                                                {tab.badge}
                                            </span>
                                        )}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 px-8 py-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
