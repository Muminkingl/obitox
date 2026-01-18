'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/base/buttons/button'
import { Construction, Wrench, Hammer, Sparkles } from 'lucide-react'

export default function MaintenancePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleReturn = () => {
        setLoading(true)
        // Ensure redirect happens
        router.push('/dashboard')
    }

    return (
        <div className="relative flex min-h-[80vh] flex-col items-center justify-center p-4 text-center overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            {/* Floating tools animation */}
            <div className="absolute inset-0 -z-5 pointer-events-none">
                <Wrench className="absolute top-1/4 left-1/4 w-8 h-8 text-primary/20 animate-float" />
                <Hammer className="absolute top-1/3 right-1/4 w-6 h-6 text-primary/15 animate-float-delayed" />
                <Sparkles className="absolute bottom-1/3 left-1/3 w-7 h-7 text-primary/20 animate-float-slow" />
            </div>

            {/* Main content */}
            <div className="relative animate-in fade-in zoom-in duration-700">
                {/* Construction illustration */}
                <div className="relative mb-8">
                    {/* Main construction icon with pulsing ring */}
                    <div className="relative inline-block">
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 ring-8 ring-primary/10 backdrop-blur-sm">
                            <Construction className="h-12 w-12 text-primary animate-bounce-gentle" />
                        </div>
                    </div>

                    {/* Orbiting tools */}
                    <div className="absolute inset-0 animate-spin-slow">
                        <Wrench className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 text-primary/60" />
                    </div>
                    <div className="absolute inset-0 animate-spin-slow-reverse">
                        <Hammer className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 text-primary/60" />
                    </div>
                </div>

                {/* Text content with staggered animation */}
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Under Construction
                    </h1>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                        <div className="h-1 w-1 rounded-full bg-primary animate-pulse delay-200" />
                        <div className="h-1 w-1 rounded-full bg-primary animate-pulse delay-400" />
                    </div>
                    <p className="mx-auto max-w-[500px] text-muted-foreground text-lg leading-relaxed">
                        We're crafting something amazing for you! <br />
                        Our team is hard at work building new features.
                        <br />
                        <span className="inline-flex items-center gap-1 mt-2 text-sm text-primary/80">
                            <Sparkles className="w-4 h-4" />
                            Check back soon for updates
                        </span>
                    </p>
                </div>

                {/* Button */}
                <div className="mt-5">
                    <Button
                        color="primary"
                        size="md"
                        isLoading={loading}
                        onClick={handleReturn}
                        showTextWhileLoading={false}
                    >
                        {loading ? 'Loading...' : 'Return to Dashboard'}
                    </Button>
                </div>

                {/* Progress bar indicator (optional visual element) */}

            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-5deg); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-25px) scale(1.1); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-slow-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                @keyframes bounce-gentle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes progress-shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 5s ease-in-out infinite;
                }
                .animate-float-slow {
                    animation: float-slow 7s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-spin-slow-reverse {
                    animation: spin-slow-reverse 15s linear infinite;
                }
                .animate-bounce-gentle {
                    animation: bounce-gentle 2s ease-in-out infinite;
                }
                .animate-progress-shimmer {
                    background-size: 200% 100%;
                    animation: progress-shimmer 2s linear infinite;
                }
                .delay-200 {
                    animation-delay: 200ms;
                }
                .delay-400 {
                    animation-delay: 400ms;
                }
                .delay-500 {
                    animation-delay: 500ms;
                }
                .delay-700 {
                    animation-delay: 700ms;
                }
            `}</style>
        </div>
    )
}