"use client"

import * as React from "react"
import { CircleCheckIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 flex w-auto max-w-md items-center rounded-md border shadow-md transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        success: "border-emerald-500/20 bg-background text-foreground",
        destructive: "border-destructive bg-destructive text-destructive-foreground"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  visible?: boolean
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, visible = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), 
          "transition-opacity duration-300", 
          visible ? "opacity-100" : "opacity-0 pointer-events-none",
          className
        )}
        {...props}
      />
    )
  }
)
Toast.displayName = "Toast"

const ToastSuccess = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, visible = false, children, ...props }, ref) => {
    return (
      <Toast 
        ref={ref} 
        variant="success" 
        visible={visible}
        className={cn("px-4 py-3", className)} 
        {...props}
      >
        <p className="text-sm">
          <CircleCheckIcon
            className="me-3 -mt-0.5 inline-flex text-emerald-500"
            size={16}
            aria-hidden="true"
          />
          {children}
        </p>
      </Toast>
    )
  }
)
ToastSuccess.displayName = "ToastSuccess"

export { Toast, ToastSuccess }
