"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
    return (
        <main className="flex h-screen w-full flex-col items-center justify-center bg-background px-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-6">
                {/* Big Icon */}
                <div className="flex size-24 items-center justify-center rounded-2xl bg-secondary/20 border border-border/50 text-primary">
                    <FileQuestion className="size-12" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        404 - Page Not Found
                    </h1>
                    <p className="mx-auto max-w-md text-lg text-muted-foreground leading-relaxed">
                        Sorry, we couldn't find the page you're looking for.
                        The orchestration layer might have decoupled this path.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row items-center justify-center pt-4">
                    <Button asChild size="lg" className="rounded-xl px-8 h-12 min-w-[160px]">
                        <Link href="/">Return Back</Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg" className="rounded-xl px-8 h-12 min-w-[160px] border border-border/50 shadow-sm">
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}
