'use client';

export interface Framework {
    id: string;
    name: string;
    lang: string;
}

interface FrameworkTabsProps {
    frameworks: Framework[];
    activeFramework: string;
    onSelect: (id: string) => void;
    color?: 'emerald' | 'orange' | 'blue' | 'purple' | 'rose' | 'pink';
}

export function FrameworkTabs({ frameworks, activeFramework, onSelect, color = 'emerald' }: FrameworkTabsProps) {
    const colorClasses: Record<string, string> = {
        emerald: "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5",
        orange: "text-orange-400 border-b-2 border-orange-400 bg-orange-400/5",
        blue: "text-blue-400 border-b-2 border-blue-400 bg-blue-400/5",
        purple: "text-purple-400 border-b-2 border-purple-400 bg-purple-400/5",
        rose: "text-rose-400 border-b-2 border-rose-400 bg-rose-400/5",
        pink: "text-pink-400 border-b-2 border-pink-400 bg-pink-400/5",
    };

    const activeClass = colorClasses[color] || colorClasses.emerald;

    return (
        <div className="border-b border-fd-border mb-2">
            <div className="flex gap-1 overflow-x-auto pb-px no-scrollbar">
                {frameworks.map((framework) => (
                    <button
                        key={framework.id}
                        onClick={() => onSelect(framework.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeFramework === framework.id
                            ? activeClass
                            : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted/50"
                            }`}
                    >
                        {framework.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
