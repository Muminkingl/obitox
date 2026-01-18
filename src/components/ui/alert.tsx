import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
    "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground",
                destructive:
                    "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
                mono: "bg-zinc-950 border-zinc-800 text-zinc-300 font-mono text-xs py-3 px-4 flex items-center gap-3",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface AlertProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
    onClose?: () => void;
    icon?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant, onClose, icon, children, ...props }, ref) => (
        <div
            ref={ref}
            role="alert"
            className={cn(
                alertVariants({ variant }),
                variant === "mono" && "rounded-xl border-zinc-800/50 shadow-2xl backdrop-blur-md",
                className
            )}
            {...props}
        >
            {children}
            {onClose && (
                <button
                    onClick={onClose}
                    className="ml-auto p-1 hover:bg-zinc-800 rounded-md transition-colors"
                >
                    <X className="h-3 w-3 text-zinc-500" />
                </button>
            )}
        </div>
    )
)
Alert.displayName = "Alert"

const AlertIcon = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex-shrink-0 [&>svg]:h-4 [&>svg]:w-4", className)}
        {...props}
    />
))
AlertIcon.displayName = "AlertIcon"

const AlertTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn("mb-1 font-medium leading-none tracking-tight", className)}
        {...props}
    />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
    />
))
AlertDescription.displayName = "AlertDescription"

import { X } from "lucide-react"

export { Alert, AlertTitle, AlertDescription, AlertIcon }
