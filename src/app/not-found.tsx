"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-6">
                {/* Ant Design-style 404 illustration */}
                <div className="relative">
                    <svg
                        className="w-64 h-48 md:w-80 md:h-56"
                        viewBox="0 0 400 300"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Gradient Background Circle */}
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>
                        <ellipse cx="200" cy="240" rx="140" ry="20" fill="url(#grad1)" />

                        {/* Character Body */}
                        <rect x="160" y="140" width="80" height="80" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />

                        {/* Character Face - Confused */}
                        <circle cx="180" cy="170" r="6" fill="#94a3b8" />
                        <circle cx="220" cy="170" r="6" fill="#94a3b8" />
                        <path d="M175 195 Q200 185 225 195" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />

                        {/* 404 Text */}
                        <text x="200" y="95" textAnchor="middle" className="text-5xl font-bold" fill="#8b5cf6" fontSize="48" fontWeight="bold">404</text>

                        {/* Question mark floating */}
                        <text x="280" y="120" fill="#a78bfa" fontSize="32" fontWeight="bold">?</text>
                        <text x="120" y="130" fill="#c4b5fd" fontSize="24" fontWeight="bold">?</text>

                        {/* Ground line */}
                        <line x1="100" y1="220" x2="300" y2="220" stroke="#e2e8f0" strokeWidth="2" />
                    </svg>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        
                    </h1>
                    <p className="mx-auto max-w-md text-lg text-muted-foreground leading-relaxed">
                        hmm, the page you visited does not exist.
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
