'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { AnimatedGroup } from '@/components/motion-primitives/animated-group';
import { HeroHeader } from '@/components/header';
import RotatingText from '@/components/ui/RotatingText';
import DarkVeil from '@/components/ui/DarkVeil';

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="relative overflow-hidden">
        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup className="absolute inset-0 -z-20">
              <DarkVeil />
            </AnimatedGroup>
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]" />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <div className="text-balance text-4xl font-bold md:text-5xl lg:mt-16 xl:text-6xl">
                  <h1>Universal Upload API for Developers</h1>
                  <div className="flex justify-center items-baseline">
                    <h1>Focus on building, not&nbsp;</h1>
                    <RotatingText
                      texts={['config', 'uploads', 'debugging']}
                      mainClassName="px-3 sm:px-3 md:px-4 bg-[#6633ff] text-white overflow-hidden py-1 sm:py-1.5 md:py-2 justify-center items-center flex rounded-lg min-h-[1.2em] leading-none"
                      staggerFrom={'last'}
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '-120%' }}
                      staggerDuration={0.025}
                      splitLevelClassName="overflow-hidden flex items-center justify-center h-full"
                      elementLevelClassName="flex items-center justify-center leading-none"
                      transition={{
                        type: 'spring',
                        damping: 30,
                        stiffness: 400,
                      }}
                      rotationInterval={2000}
                    />
                  </div>
                </div>
                <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                  Highly customizable components for building modern websites
                  and applications that look and feel the way you mean it.
                </p>

                <AnimatedGroup className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                  <div
                    key={1}
                    className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <Link href="/login">
                        <span className="text-nowrap">Start Building</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10.5 rounded-xl px-5"
                  >
                    <Link href="#link">
                      <span className="text-nowrap">Request a demo</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup>
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div
                  aria-hidden
                  className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Image
                    className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                    src="https://picsum.photos/1350/720"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                  <Image
                    className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                    src="https://picsum.photos/1350/720"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
}