"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";

export interface Tab {
    name: string;
    isActive: boolean;
    onClick: () => void;
}

interface CodeBlockProps {
    code: string;
    language: string;
    tabs?: Tab[];
}

export function CodeBlock({ code, language, tabs }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const resendTheme = {
        plain: {
            color: "#e2e8f0",
            backgroundColor: "transparent",
        },
        styles: [
            {
                types: ["comment"],
                style: {
                    color: "#64748b",
                },
            },
            {
                types: ["builtin", "variable", "constant"],
                style: {
                    color: "#e09b70",
                },
            },
            {
                types: ["string", "function", "attr-name"],
                style: {
                    color: "#4ade80",
                },
            },
            {
                types: ["keyword", "operator"],
                style: {
                    color: "#e09b70",
                },
            },
            {
                types: ["punctuation"],
                style: {
                    color: "#94a3b8",
                },
            },
        ],
    };

    return (
        <div className="relative group my-4 rounded-xl overflow-hidden border border-zinc-800/50 bg-[#0f0f0f]">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50">
                <div className="flex gap-6">
                    {tabs ? (
                        tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={tab.onClick}
                                className={`text-sm font-medium transition-colors relative pb-0.5 ${
                                    tab.isActive
                                        ? "text-white"
                                        : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                {tab.name}
                                {tab.isActive && (
                                    <div className="absolute -bottom-3 left-0 right-0 h-[2px] bg-white" />
                                )}
                            </button>
                        ))
                    ) : (
                        <span className="text-sm text-zinc-500 font-medium">
                            {language}
                        </span>
                    )}
                </div>

                <div className="flex items-center">
                    <button
                        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
                        onClick={handleCopy}
                        aria-label="Copy code"
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Code Content */}
            <Highlight theme={resendTheme} code={code} language={language}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                        style={{ ...style, backgroundColor: "transparent" }}
                        className="p-4 overflow-x-auto text-sm font-mono"
                    >
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })} className="table-row">
                                <span className="table-cell w-8 select-none text-zinc-600 text-right pr-4">
                                    {i + 1}
                                </span>
                                <span className="table-cell">
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </span>
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}