import { Metadata } from "next";
import Link from "next/link";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { Scale, FileText, Shield, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
    title: "Licence - ObitoX",
    description: "ObitoX SDK and API licensing information. MIT License for open source, commercial license for enterprise.",
};

export default function LicencePage() {
    return (
        <main className="relative min-h-screen bg-background">
            <HeroHeader />

            <div className="pt-24 pb-16">
                <div className="mx-auto max-w-4xl px-6">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20">
                                <Scale className="h-6 w-6 text-violet-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-foreground">Licence</h1>
                                <p className="text-sm text-muted-foreground mt-1">Last updated: January 2026</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            ObitoX is committed to open source. Our SDK is available under the MIT License,
                            making it free for personal and commercial use.
                        </p>
                    </div>

                    {/* MIT License Badge */}
                    <div className="mb-10 p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                            <h2 className="text-xl font-semibold text-foreground">MIT License</h2>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            The ObitoX SDK is released under the MIT License, one of the most permissive
                            and business-friendly open source licenses available.
                        </p>
                    </div>

                    {/* License Text */}
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-violet-400" />
                            Full License Text
                        </h2>
                        <div className="p-6 rounded-xl border border-border bg-muted/30 font-mono text-sm leading-relaxed text-muted-foreground">
                            <p className="mb-4">MIT License</p>
                            <p className="mb-4">Copyright (c) 2026 ObitoX</p>
                            <p className="mb-4">
                                Permission is hereby granted, free of charge, to any person obtaining a copy
                                of this software and associated documentation files (the "Software"), to deal
                                in the Software without restriction, including without limitation the rights
                                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                                copies of the Software, and to permit persons to whom the Software is
                                furnished to do so, subject to the following conditions:
                            </p>
                            <p className="mb-4">
                                The above copyright notice and this permission notice shall be included in all
                                copies or substantial portions of the Software.
                            </p>
                            <p className="uppercase">
                                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                                SOFTWARE.
                            </p>
                        </div>
                    </div>

                    {/* What This Means */}
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-violet-400" />
                            What This Means for You
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PermissionCard
                                title="✅ You Can"
                                items={[
                                    "Use commercially",
                                    "Modify the source code",
                                    "Distribute freely",
                                    "Use privately",
                                    "Sublicense"
                                ]}
                                variant="success"
                            />
                            <PermissionCard
                                title="⚠️ You Must"
                                items={[
                                    "Include copyright notice",
                                    "Include license text"
                                ]}
                                variant="warning"
                            />
                        </div>
                    </div>

                    {/* API Usage */}
                    <div className="mb-10 p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-400" />
                            API Service Terms
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            While the ObitoX SDK is open source, the ObitoX API service is a hosted service
                            subject to our <Link href="/legal/terms" className="text-violet-400 hover:underline">Terms of Service</Link>.
                            Usage of the API requires a valid API key and adherence to our rate limits and acceptable use policies.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/docs"
                                className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
                            >
                                View Documentation <ExternalLink className="h-3 w-3" />
                            </Link>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
                            >
                                See Pricing <ExternalLink className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>

                    {/* Third Party */}
                    <div className="p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Third-Party Licenses</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            ObitoX uses several open source libraries, each with their own licenses.
                            For a complete list of dependencies and their licenses, please refer to our
                            GitHub repository.
                        </p>
                        <Link
                            href="https://github.com/obitox/obitox-sdk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
                        >
                            View on GitHub <ExternalLink className="h-3 w-3" />
                        </Link>
                    </div>
                </div>
            </div>

            <FooterSection />
        </main>
    );
}

function PermissionCard({ title, items, variant }: {
    title: string;
    items: string[];
    variant: "success" | "warning";
}) {
    const borderColor = variant === "success" ? "border-emerald-500/20" : "border-amber-500/20";
    const bgColor = variant === "success" ? "bg-emerald-500/5" : "bg-amber-500/5";

    return (
        <div className={`p-4 rounded-xl border ${borderColor} ${bgColor}`}>
            <h3 className="font-semibold text-foreground mb-3">{title}</h3>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
