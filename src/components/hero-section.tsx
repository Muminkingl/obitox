import React from 'react'
import Link from 'next/link'
import LogoCloud from './logo-cloud'
import { Button } from '@/components/ui/button'
import CommandButton from '@/components/ui/command-button'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from './header'
import TypewriterTitle from '@/components/texttttt'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                        {/* Unified Background is now global in page.tsx */}

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                    One API, Any Storage Provider.
                                </TextEffect>

                                {/* Typewriter rotating subtext */}
                                <div className="mx-auto mt-8 max-w-2xl">
                                    <TypewriterTitle
                                        sequences={[
                                            { text: "S3, Cloudflare R2, GCS, DigitalOcean, anywhere", deleteAfter: true, pauseAfter: 2500 },
                                            { text: "Switch clouds without touching your code", deleteAfter: true, pauseAfter: 2500 },
                                            { text: "Upload once. Works everywhere.", deleteAfter: true, pauseAfter: 2500 },
                                        ]}
                                        typingSpeed={50}
                                        deleteSpeed={30}
                                        pauseBeforeDelete={2500}
                                        autoLoop={true}
                                        loopDelay={500}
                                        naturalVariance={true}
                                    />
                                </div>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-4">
                                    <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
                                        <div
                                            key={1}
                                            className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                            <Button
                                                asChild
                                                size="lg"
                                                className="rounded-xl px-5 text-base">
                                                <Link href="/dashboard">
                                                    <span className="text-nowrap">Start Free</span>
                                                </Link>
                                            </Button>
                                        </div>
                                        <Link href="/docs" key={2}>
                                            <CommandButton className="h-10.5 px-5 shadow-sm min-w-[140px]">
                                                Documentation
                                            </CommandButton>
                                        </Link>
                                    </div>

                                    {/* Trust Signals */}
                                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground/80">
                                        <div className="flex items-center gap-2">
                                            <span className="text-primary font-bold">✓</span>
                                            <span>1,000 free requests/month</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className="text-primary font-bold">✓</span>
                                            <span>No credit card required</span>
                                        </div>
                                    </div>
                                </AnimatedGroup>
                            </div>
                        </div>
                    </div>
                </section>
                <LogoCloud />
            </main>
        </>
    )
}
