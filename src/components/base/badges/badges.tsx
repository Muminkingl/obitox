import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeWithDotProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    color?: "brand" | "gray" | "error" | "warning" | "success"
    size?: "sm" | "md" | "lg"
    type?: "modern"
}

function BadgeWithDot({ className, variant, color = "brand", size = "sm", type, children, ...props }: BadgeWithDotProps) {
    const isModern = type === "modern"

    const colorStyles = {
        brand: {
            bg: isModern ? "bg-background" : "bg-green-500/15",
            text: isModern ? "text-foreground" : "text-green-700 dark:text-green-400",
            dot: "bg-green-500",
            border: isModern ? "border-green-900/40" : "border-green-500/20",
            iconColor: "text-green-500"
        },
        gray: {
            bg: "bg-gray-500/15",
            text: "text-gray-700 dark:text-gray-400",
            dot: "bg-gray-500",
            border: "border-gray-500/20",
            iconColor: "text-gray-500"
        },
        error: {
            bg: "bg-red-500/15",
            text: "text-red-700 dark:text-red-400",
            dot: "bg-red-500",
            border: "border-red-500/20",
            iconColor: "text-red-500"
        },
        warning: {
            bg: "bg-amber-500/15",
            text: "text-amber-700 dark:text-amber-400",
            dot: "bg-amber-500",
            border: "border-amber-500/20",
            iconColor: "text-amber-500"
        },
        success: {
            bg: "bg-emerald-500/15",
            text: "text-emerald-700 dark:text-emerald-400",
            dot: "bg-emerald-500",
            border: "border-emerald-500/20",
            iconColor: "text-emerald-500"
        }
    }

    const sizeStyles = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base"
    }

    const currentStyle = colorStyles[color] || colorStyles.brand
    const currentSize = sizeStyles[size] || sizeStyles.sm

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 rounded-full border font-medium",
            currentStyle.bg,
            currentStyle.text,
            currentStyle.border,
            currentSize,
            className
        )} {...props}>
            {isModern ? (
                <Check className={cn("h-3.5 w-3.5", currentStyle.iconColor)} />
            ) : (
                <span className={cn("h-1.5 w-1.5 rounded-full", currentStyle.dot)} />
            )}
            {children}
        </div>
    )
}

export { BadgeWithDot }
