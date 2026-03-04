import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, Zap, Globe, HardDrive, Code2, CloudOff, CheckCircle2, ArrowRight, Check } from 'lucide-react'

export default function FeatureGrid() {
    return (
        <section className="bg-gray-50 pt-5 pb-16 md:pt-5 md:pb-32 dark:bg-transparent">
            <div className="mx-auto max-w-5xl px-6">
                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-3">
                        {/* ========== LAYER 1: GREEN HERO CARD (TOP) ========== */}
                        {/* ðŸ”¥ HERO FEATURE: Files NEVER Touch Our Servers - LARGE CARD AT TOP */}
                        <Card className="relative col-span-full overflow-hidden border-2 border-green-500/30 bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/20">
                            <CardContent className="pt-8 pb-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Left: Main message */}
                                    <div className="flex flex-col justify-between space-y-5">
                                        {/* Badge */}
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full w-fit">
                                            <CheckCircle2 className="size-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                                100% VERIFIABLE CLAIM
                                            </span>
                                        </div>

                                        {/* Main headline */}
                                        <div className="space-y-3">
                                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                                                Your Files <span className="text-green-600">NEVER</span> Touch Our Servers
                                            </h2>
                                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                                Not marketing fluff. Here's the technical proof using <strong className="text-foreground">cryptographically signed URLs</strong>.
                                            </p>
                                        </div>

                                        {/* How it works */}
                                        <div className="space-y-4 pt-2">
                                            <h3 className="text-base font-semibold text-foreground">How Signed URLs Work:</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 size-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-bold text-blue-600">1</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        <strong className="text-foreground">You call our API</strong> - we generate a time-limited, cryptographically signed URL
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 size-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-bold text-purple-600">2</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        <strong className="text-foreground">We return the URL</strong> - your browser/app now has a secure upload endpoint (140ms total)
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 size-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-bold text-green-600">3</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        <strong className="text-foreground">File uploads DIRECTLY to your cloud</strong> - R2, S3, etc. (bypasses us completely)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    {/* Right: Visual diagram */}
                                    <div className="relative flex items-center">
                                        <div className="w-full space-y-4">
                                            {/* Flow visualization */}
                                            <div className="space-y-4">
                                                {/* Your App */}
                                                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-border shadow-sm">
                                                    <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                                        <Code2 className="size-6 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-foreground">Your App</div>
                                                        <div className="text-xs text-muted-foreground font-mono truncate">
                                                            POST /upload/r2/signed-url
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="size-5 text-primary flex-shrink-0" />
                                                </div>

                                                {/* ObitoX API */}
                                                <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-2 border-purple-500/30">
                                                    <div className="size-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                        <Zap className="size-6 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-foreground">ObitoX</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5"><Check className="size-3.5" /> Generates signed URL</span>
                                                            <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5"><Check className="size-3.5" /> No file data</span>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="size-5 text-primary flex-shrink-0" />
                                                </div>

                                                {/* Direct Upload */}
                                                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-500/30">
                                                    <div className="size-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                                        <CloudOff className="size-6 text-green-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-foreground">Your Cloud (R2/S3)</div>
                                                        <div className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5">
                                                            <Check className="size-3.5" /> File uploads DIRECTLY here
                                                        </div>
                                                    </div>
                                                    <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                <div className="p-3 bg-muted/50 rounded-md text-center">
                                                    <div className="text-2xl font-bold text-primary">140ms</div>
                                                    <div className="text-xs text-muted-foreground">API response</div>
                                                </div>
                                                <div className="p-3 bg-muted/50 rounded-md text-center">
                                                    <div className="text-2xl font-bold text-green-600">0 bytes</div>
                                                    <div className="text-xs text-muted-foreground">File data processed</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ========== LAYER 2: LARGE BANNER CARDS (MIDDLE) ========== */}
                        {/* Zero Vendor Lock-In */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3 mt-3">
                            <CardContent className="grid pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex size-12 rounded-xl border border-primary/20 bg-primary/5 shadow-sm">
                                        <HardDrive
                                            className="m-auto size-6 text-primary"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-medium">Zero Vendor Lock-In</h2>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Switch between R2, S3, or Supabase
                                            by changing one environment variable. Your code stays untouched.
                                        </p>
                                    </div>
                                </div>
                                <div className="rounded-tl-2xl relative -mb-6 -mr-6 mt-6 h-fit border-l border-t border-border/50 bg-secondary/5 p-6 py-6 sm:ml-6">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-blue-500" />
                                            <div className="h-2 w-24 rounded bg-blue-500/30" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-orange-500" />
                                            <div className="h-2 w-32 rounded bg-orange-500/30" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-green-500" />
                                            <div className="h-2 w-20 rounded bg-green-500/30" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-purple-500" />
                                            <div className="h-2 w-28 rounded bg-purple-500/30" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Developer-First Analytics */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3 mt-3">
                            <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex size-12 rounded-xl border border-primary/20 bg-primary/5 shadow-sm">
                                        <Code2
                                            className="m-auto size-6 text-primary"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-medium text-foreground transition dark:text-white">
                                            Developer-First Analytics
                                        </h2>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Real-time dashboards show upload stats, provider usage,
                                            and error rates. Know what's happening before users report it.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px before:bg-border/30 sm:-my-6 sm:-mr-6">
                                    <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                                        {/* Metric 1 */}
                                        <div className="relative flex w-[calc(50%+1rem)] items-center justify-end gap-2 pr-4">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-xs font-mono text-muted-foreground">1.2k</span>
                                                <div className="h-1 w-12 rounded-full bg-green-500/30">
                                                    <div className="h-full w-3/4 rounded-full bg-green-500" />
                                                </div>
                                            </div>
                                            <div className="flex size-8 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
                                                <div className="size-2 rounded-full bg-green-500" />
                                            </div>
                                        </div>
                                        {/* Metric 2 - Highlighted */}
                                        <div className="relative ml-[calc(50%-1rem)] flex items-center gap-2 pl-4">
                                            <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-full border border-primary/30 bg-primary/5">
                                                <div className="size-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
                                                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-mono font-medium text-primary">140ms</span>
                                                <div className="h-1 w-12 rounded-full bg-primary/30">
                                                    <div className="h-full w-4/5 rounded-full bg-primary" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Metric 3 */}
                                        <div className="relative flex w-[calc(50%+1rem)] items-center justify-end gap-2 pr-4">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-xs font-mono text-muted-foreground">99.9%</span>
                                                <div className="h-1 w-12 rounded-full bg-blue-500/30">
                                                    <div className="h-full w-full rounded-full bg-blue-500" />
                                                </div>
                                            </div>
                                            <div className="flex size-8 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
                                                <div className="size-2 rounded-full bg-blue-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ========== LAYER 3: SMALL FEATURE CARDS (BOTTOM) ========== */}
                        {/* SDK Card */}
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 mt-3">
                            <CardContent className="relative m-auto size-fit pt-6">
                                <div className="relative flex h-24 w-56 items-center">
                                    <svg
                                        className="text-primary absolute inset-0 size-full opacity-20"
                                        viewBox="0 0 254 104"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="mx-auto block w-fit text-5xl font-semibold tracking-tighter">SDK</span>
                                </div>
                                <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight">One API, Any Provider</h2>
                            </CardContent>
                        </Card>

                        {/* Battle-Tested Security */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 mt-3">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full border border-border/50 bg-secondary/10 shadow-inner">
                                    <Shield className="m-auto size-12 text-primary" strokeWidth={1.5} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="text-lg font-medium">Battle-Tested Security</h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">FILES NEVER TOUCH OUR SERVERS.</strong><br />
                                        Rate limiting, abuse detection, and HMAC signatures protect
                                        every upload. Your files stay in your cloud - we just orchestrate access.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lightning Fast */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 mt-3">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full border border-border/50 bg-secondary/10 shadow-inner">
                                    <Zap className="m-auto size-12 text-primary" strokeWidth={1.5} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="text-lg font-medium">Lightning Fast</h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Multi-layer caching delivers signed URLs in under 150ms.
                                        Your users won't even notice the API call.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
