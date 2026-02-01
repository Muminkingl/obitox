"use client";

import Link from "next/link";
import { Search, Github, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Logo } from "@/components/logo";

export function DocsHeader() {
    const { setTheme, theme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0C0D0E]/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center px-4 lg:px-8 max-w-[1536px]">

                {/* Left: Logo & Branding */}
                <div className="flex items-center gap-2 mr-8">
                    <Link href="/docs" className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
                        <Logo className="h-6 w-6" />
                        <span>Docus</span>
                    </Link>
                </div>

                {/* Center: Search Bar */}
                <div className="flex-1 flex max-w-lg">
                    <button className="relative flex h-9 w-full items-center gap-2 rounded-lg bg-slate-800/50 px-3 text-sm text-slate-400 hover:bg-slate-800 border border-slate-800 transition-colors">
                        <Search className="h-4 w-4" />
                        <span>Search...</span>
                        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border border-slate-700 bg-slate-900 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                            <span className="text-xs">CTRL K</span>
                        </kbd>
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 ml-auto">
                    {/* Version Badge */}
                    <div className="px-2 py-1 text-xs font-medium text-slate-400">
                        GB
                    </div>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* GitHub Link */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                        asChild
                    >
                        <Link href="https://github.com/nuxt-content/docus" target="_blank">
                            <Github className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>

            </div>
        </header>
    );
}
