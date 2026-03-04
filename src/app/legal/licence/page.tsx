import { Metadata } from "next";
import Link from "next/link";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { Scale, FileText, Shield, CheckCircle, AlertCircle, ExternalLink, Building, Code, Users, Globe } from "lucide-react";

export const metadata: Metadata = {
    title: "Software License Agreement - ObitoX",
    description: "ObitoX SDK and API licensing information. MIT License for open source SDK, commercial terms for API services.",
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
                                <h1 className="text-4xl font-bold text-foreground">Software License Agreement</h1>
                                <p className="text-sm text-muted-foreground mt-1">Last updated: February 2026</p>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            This agreement governs your use of ObitoX software, including our open source SDK
                            and hosted API services. Please read carefully before using our products.
                        </p>
                    </div>

                    {/* Quick Summary */}
                    <div className="mb-10 p-6 rounded-xl border border-blue-500/20 bg-blue-500/5">
                        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-400" />
                            Quick Summary
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-2">
                                <Code className="h-4 w-4 text-violet-400 mt-0.5" />
                                <span><strong>SDK:</strong> MIT License (free for all uses)</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Building className="h-4 w-4 text-violet-400 mt-0.5" />
                                <span><strong>API:</strong> Commercial subscription required</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Users className="h-4 w-4 text-violet-400 mt-0.5" />
                                <span><strong>Attribution:</strong> Required for SDK redistribution</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Globe className="h-4 w-4 text-violet-400 mt-0.5" />
                                <span><strong>Jurisdiction:</strong> International</span>
                            </div>
                        </div>
                    </div>

                    {/* MIT License Badge */}
                    <div className="mb-10 p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                            <h2 className="text-xl font-semibold text-foreground">MIT License (SDK)</h2>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            The ObitoX SDK (software development kit) is released under the MIT License,
                            one of the most permissive and business-friendly open source licenses available.
                            This applies to all official ObitoX SDK packages published on npm, GitHub, and other package registries.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Free for commercial use
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Modification allowed
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Distribution allowed
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Sublicensing allowed
                            </span>
                        </div>
                    </div>

                    {/* License Text */}
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-violet-400" />
                            Full MIT License Text
                        </h2>
                        <div className="p-6 rounded-xl border border-border bg-muted/30 font-mono text-sm leading-relaxed text-muted-foreground overflow-x-auto">
                            <p className="mb-4 text-foreground font-semibold">MIT License</p>
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
                                title="You CAN"
                                items={[
                                    "Use the SDK in commercial products",
                                    "Modify the source code",
                                    "Distribute the SDK (with attribution)",
                                    "Use in proprietary software",
                                    "Sublicense as part of your product",
                                    "Use privately without restrictions"
                                ]}
                                variant="success"
                            />
                            <PermissionCard
                                title="You MUST"
                                items={[
                                    "Include the copyright notice",
                                    "Include the MIT license text",
                                    "Retain the license in modifications"
                                ]}
                                variant="warning"
                            />
                        </div>
                    </div>

                    {/* API Service Terms */}
                    <div className="mb-10 p-6 rounded-xl border border-amber-500/20 bg-amber-500/5">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-400" />
                            API Service Terms (Commercial)
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            While the ObitoX SDK is open source, the ObitoX API service is a hosted platform
                            subject to commercial terms. Usage of the API requires:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                                <span>A valid API key obtained through account registration</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                                <span>Adherence to rate limits based on your subscription tier</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                                <span>Compliance with our Acceptable Use Policy</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                                <span>Active subscription for paid tiers (Pro, Enterprise)</span>
                            </li>
                        </ul>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors text-sm"
                            >
                                View Pricing <ExternalLink className="h-3 w-3" />
                            </Link>
                            <Link
                                href="/docs"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm"
                            >
                                API Documentation
                            </Link>
                        </div>
                    </div>

                    {/* Trademark */}
                    <div className="mb-10 p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Trademark Notice</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            "ObitoX" and the ObitoX logo are trademarks of ObitoX. The MIT License does not
                            grant trademark rights. You may use the ObitoX name and logo to:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <span>Describe that your product uses or integrates with ObitoX</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <span>Link to the official ObitoX website or documentation</span>
                            </li>
                        </ul>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            You may NOT use the ObitoX name or logo to imply endorsement, sponsorship,
                            or official affiliation without explicit written permission.
                        </p>
                    </div>

                    {/* Third Party */}
                    <div className="mb-10 p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Third-Party Licenses</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            ObitoX uses several open source libraries, each with their own licenses.
                            Key dependencies include:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="p-3 rounded-lg bg-muted/50">
                                <span className="font-medium text-foreground">Next.js</span>
                                <span className="text-muted-foreground"> - MIT License</span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <span className="font-medium text-foreground">Supabase</span>
                                <span className="text-muted-foreground"> - MIT License</span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <span className="font-medium text-foreground">Tailwind CSS</span>
                                <span className="text-muted-foreground"> - MIT License</span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <span className="font-medium text-foreground">Radix UI</span>
                                <span className="text-muted-foreground"> - MIT License</span>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-sm mt-4">
                            For a complete list of dependencies and their licenses, please refer to our
                            GitHub repository or the package.json file in each SDK package.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="p-6 rounded-xl border border-border bg-card">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Questions?</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            If you have questions about licensing or need a custom license agreement
                            for enterprise use, please contact us:
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <a
                                href="mailto:support@obitox.dev"
                                className="text-violet-400 hover:underline"
                            >
                                support@obitox.dev
                            </a>
                            <Link
                                href="https://github.com/obitox"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-violet-400 hover:underline inline-flex items-center gap-1"
                            >
                                GitHub <ExternalLink className="h-3 w-3" />
                            </Link>
                        </div>
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
    const dotColor = variant === "success" ? "bg-emerald-400" : "bg-amber-400";

    return (
        <div className={`p-5 rounded-xl border ${borderColor} ${bgColor}`}>
            <h3 className="font-semibold text-foreground mb-3">{title}</h3>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mt-2 flex-shrink-0`} />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
