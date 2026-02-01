"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ForbiddenPage() {
    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-6">
                {/* Ant Design-style 403 illustration */}
                <div className="relative">
                    <svg
                        className="w-64 h-48 md:w-80 md:h-56"
                        viewBox="0 0 400 300"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Gradient Background Circle */}
                        <defs>
                            <linearGradient id="grad403" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>
                        <ellipse cx="200" cy="240" rx="140" ry="20" fill="url(#grad403)" />

                        {/* Lock Body */}
                        <rect x="160" y="150" width="80" height="60" rx="8" fill="#fef3c7" stroke="#fcd34d" strokeWidth="2" />

                        {/* Lock Shackle */}
                        <path d="M175 150 V130 A25 25 0 0 1 225 130 V150" stroke="#f59e0b" strokeWidth="8" fill="none" strokeLinecap="round" />

                        {/* Keyhole */}
                        <circle cx="200" cy="175" r="10" fill="#f59e0b" />
                        <rect x="196" y="180" width="8" height="15" rx="2" fill="#f59e0b" />

                        {/* 403 Text */}
                        <text x="200" y="95" textAnchor="middle" fill="#f59e0b" fontSize="48" fontWeight="bold">403</text>

                        {/* Warning signs */}
                        <text x="290" y="130" fill="#fbbf24" fontSize="28" fontWeight="bold">⚠</text>
                        <text x="100" y="140" fill="#fcd34d" fontSize="22" fontWeight="bold">⚠</text>

                        {/* Ground line */}
                        <line x1="100" y1="220" x2="300" y2="220" stroke="#e2e8f0" strokeWidth="2" />
                    </svg>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        403
                    </h1>
                    <p className="mx-auto max-w-md text-lg text-muted-foreground leading-relaxed">
                        Sorry, you don't have permission to access this page.
                    </p>
                </div>

                <div className="pt-4">
                    <Button
                        asChild
                        size="lg"
                        className="rounded-xl px-8 h-12 min-w-[160px] bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25"
                    >
                        <Link href="/">Back Home</Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}
