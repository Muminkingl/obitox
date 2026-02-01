import { AlertCircle, AlertTriangle, CheckCircle, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "warning" | "danger" | "success" | "note";

interface CalloutProps {
    variant?: CalloutVariant;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const variantStyles: Record<CalloutVariant, { container: string; icon: string; IconComponent: any }> = {
    info: {
        container: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
        icon: "text-blue-600 dark:text-blue-400",
        IconComponent: Info,
    },
    warning: {
        container: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30",
        icon: "text-yellow-600 dark:text-yellow-400",
        IconComponent: AlertTriangle,
    },
    danger: {
        container: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
        icon: "text-red-600 dark:text-red-400",
        IconComponent: AlertCircle,
    },
    success: {
        container: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30",
        icon: "text-emerald-600 dark:text-emerald-400",
        IconComponent: CheckCircle,
    },
    note: {
        container: "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/30",
        icon: "text-gray-600 dark:text-gray-400",
        IconComponent: Lightbulb,
    },
};

export function Callout({ variant = "info", title, children, className }: CalloutProps) {
    const styles = variantStyles[variant];
    const Icon = styles.IconComponent;

    return (
        <div className={cn("my-6 flex gap-3 rounded-lg border p-4", styles.container, className)}>
            <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", styles.icon)} />
            <div className="flex-1 space-y-2">
                {title && <p className="font-semibold">{title}</p>}
                <div className="text-sm leading-relaxed [&>p]:m-0">{children}</div>
            </div>
        </div>
    );
}
