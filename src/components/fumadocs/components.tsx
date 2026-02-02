'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================
// TAB CONTEXT FOR PERSISTENT SELECTION
// ============================================================

interface TabContextValue {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}

const TabContext = createContext<TabContextValue | null>(null);

function useTabContext() {
    const context = useContext(TabContext);
    if (!context) {
        throw new Error('Tab components must be used within CodeBlockTabs');
    }
    return context;
}

// ============================================================
// CODE BLOCK TABS (Package Manager Selector)
// ============================================================

interface CodeBlockTabsProps {
    children: ReactNode;
    defaultValue: string;
    groupId?: string;
    persist?: boolean;
}

export function CodeBlockTabs({ children, defaultValue, groupId = 'default' }: CodeBlockTabsProps) {
    const [selectedTab, setSelectedTab] = useState(defaultValue);

    useEffect(() => {
        if (groupId) {
            const stored = localStorage.getItem(`fumadocs-tab-${groupId}`);
            if (stored) setSelectedTab(stored);
        }
    }, [groupId]);

    const handleSetTab = (tab: string) => {
        setSelectedTab(tab);
        if (groupId) {
            localStorage.setItem(`fumadocs-tab-${groupId}`, tab);
        }
    };

    return (
        <TabContext.Provider value={{ selectedTab, setSelectedTab: handleSetTab }}>
            <div className="my-4 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                {children}
            </div>
        </TabContext.Provider>
    );
}

export function CodeBlockTabsList({ children }: { children: ReactNode }) {
    return (
        <div className="flex border-b border-zinc-800 bg-zinc-900/60 px-1 pt-1">
            {children}
        </div>
    );
}

export function CodeBlockTabsTrigger({ children, value }: { children: ReactNode; value: string }) {
    const { selectedTab, setSelectedTab } = useTabContext();
    const isActive = selectedTab === value;

    return (
        <button
            onClick={() => setSelectedTab(value)}
            className={`
        px-4 py-2 text-sm font-medium transition-all rounded-t-lg
        ${isActive
                    ? 'text-white bg-zinc-950 border-t border-l border-r border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }
      `}
        >
            {children}
        </button>
    );
}

export function CodeBlockTab({ children, value }: { children: ReactNode; value: string }) {
    const { selectedTab } = useTabContext();
    if (selectedTab !== value) return null;
    return <div className="p-4">{children}</div>;
}

// ============================================================
// CODE BLOCK WITH COPY BUTTON
// ============================================================

interface CodeBlockProps {
    children: string;
    language?: string;
    title?: string;
}

export function CodeBlock({ children, title }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(children.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
            {title && (
                <div className="px-4 py-2 text-xs text-zinc-500 border-b border-zinc-800 font-mono bg-zinc-950">
                    {title}
                </div>
            )}
            <div className="relative">
                <pre className="p-4 overflow-x-auto text-sm font-mono">
                    <code className="text-zinc-300">{children.trim()}</code>
                </pre>
                <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                    title="Copy to clipboard"
                >
                    {copied ? (
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}

// ============================================================
// FEEDBACK BLOCK
// ============================================================

export function FeedbackBlock({ children }: { children: ReactNode; id?: string; body?: string }) {
    return (
        <p className="text-zinc-300 leading-relaxed my-3">
            {children}
        </p>
    );
}

// ============================================================
// CALLOUT (Tip, Warning, Info)
// ============================================================

interface CalloutProps {
    children: ReactNode;
    title?: string;
    type?: 'info' | 'warning' | 'tip' | 'error';
}

export function Callout({ children, title, type = 'info' }: CalloutProps) {
    const styles = {
        info: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
        tip: 'border-green-500/30 bg-green-500/10 text-green-200',
        warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-200',
        error: 'border-red-500/30 bg-red-500/10 text-red-200',
    };

    const icons = {
        info: '💡',
        tip: '✨',
        warning: '⚠️',
        error: '❌',
    };

    return (
        <div className={`my-4 p-4 rounded-lg border ${styles[type]}`}>
            {title && (
                <div className="flex items-center gap-2 font-semibold mb-2">
                    <span>{icons[type]}</span>
                    <span>{title}</span>
                </div>
            )}
            <div className="text-sm opacity-90">{children}</div>
        </div>
    );
}

// ============================================================
// CARDS
// ============================================================

export function Cards({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {children}
        </div>
    );
}

interface CardProps {
    title: string;
    description: string;
    href?: string;
}

export function Card({ title, description, href }: CardProps) {
    const Wrapper = href ? 'a' : 'div';

    return (
        <Wrapper
            href={href}
            className="block p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group"
        >
            <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                {title}
            </h3>
            <p className="text-sm text-zinc-400">{description}</p>
        </Wrapper>
    );
}

// ============================================================
// TYPE TABLE (API Documentation)
// ============================================================

interface TypeTableEntry {
    name: string;
    type: string;
    description?: string;
    required?: boolean;
    deprecated?: boolean;
}

interface TypeTableProps {
    type: {
        name: string;
        description?: string;
        entries: TypeTableEntry[];
    };
}

export function TypeTable({ type }: TypeTableProps) {
    return (
        <div className="my-6 rounded-lg border border-zinc-800 overflow-hidden">
            {type.name && (
                <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 font-mono text-sm text-zinc-300">
                    {type.name}
                </div>
            )}
            <table className="w-full text-sm">
                <thead className="bg-zinc-900/50">
                    <tr>
                        <th className="px-4 py-2 text-left text-zinc-400 font-medium">Property</th>
                        <th className="px-4 py-2 text-left text-zinc-400 font-medium">Type</th>
                        <th className="px-4 py-2 text-left text-zinc-400 font-medium">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {type.entries.map((entry, i) => (
                        <tr key={i} className="border-t border-zinc-800">
                            <td className="px-4 py-3">
                                <code className="text-blue-400 font-mono text-xs">{entry.name}</code>
                                {entry.required && <span className="ml-1 text-red-400">*</span>}
                            </td>
                            <td className="px-4 py-3">
                                <code className="text-zinc-300 font-mono text-xs">{entry.type}</code>
                            </td>
                            <td className="px-4 py-3 text-zinc-400">{entry.description || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ============================================================
// FILES TREE
// ============================================================

export function Files({ children }: { children: ReactNode }) {
    return (
        <div className="my-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm">
            {children}
        </div>
    );
}

export function Folder({ name, children, defaultOpen = true }: { name: string; children?: ReactNode; defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-zinc-300 hover:text-white py-1 w-full text-left"
            >
                <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                <span>{name}</span>
            </button>
            {isOpen && <div className="ml-5 border-l border-zinc-800 pl-3">{children}</div>}
        </div>
    );
}

export function File({ name }: { name: string }) {
    return (
        <div className="flex items-center gap-2 text-zinc-400 py-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{name}</span>
        </div>
    );
}
