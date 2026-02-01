"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-6">
                {/* Ant Design-style 500 illustration */}
                <div className="relative">
                    <svg
                        className="w-64 h-48 md:w-80 md:h-56"
                        viewBox="0 0 400 300"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Gradient Background Circle */}
                        <defs>
                            <linearGradient id="grad500" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#f87171" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>
                        <ellipse cx="200" cy="240" rx="140" ry="20" fill="url(#grad500)" />

                        {/* Server Box - With Error */}
                        <rect x="145" y="130" width="110" height="90" rx="8" fill="#fef2f2" stroke="#fecaca" strokeWidth="2" />

                        {/* Server lights */}
                        <circle cx="170" cy="155" r="6" fill="#ef4444" />
                        <circle cx="190" cy="155" r="6" fill="#ef4444" />
                        <circle cx="210" cy="155" r="6" fill="#fbbf24" />

                        {/* Server lines */}
                        <rect x="160" y="175" width="80" height="6" rx="3" fill="#fecaca" />
                        <rect x="160" y="190" width="60" height="6" rx="3" fill="#fecaca" />

                        {/* 500 Text */}
                        <text x="200" y="95" textAnchor="middle" fill="#ef4444" fontSize="48" fontWeight="bold">500</text>

                        {/* Error spark/lightning */}
                        <path d="M280 110 L270 140 L285 140 L270 170" stroke="#fbbf24" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M120 120 L130 145 L115 145 L130 175" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Ground line */}
                        <line x1="100" y1="220" x2="300" y2="220" stroke="#e2e8f0" strokeWidth="2" />
                    </svg>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        500
                    </h1>
                    <p className="mx-auto max-w-md text-lg text-muted-foreground leading-relaxed">
                        Sorry, something went wrong.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row items-center justify-center pt-4">
                    <Button
                        onClick={() => reset()}
                        size="lg"
                        variant="outline"
                        className="rounded-xl px-8 h-12 min-w-[160px] border-violet-600/50 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30"
                    >
                        Try Again
                    </Button>
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
