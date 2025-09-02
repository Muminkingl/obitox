"use client"

import * as React from "react"
import { ToastSuccess } from "@/components/ui/toast"

type ToastType = {
  id: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

type ToastContextType = {
  toasts: ToastType[]
  addToast: (toast: Omit<ToastType, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastType[]>([])

  const addToast = React.useCallback((toast: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const duration = toast.duration || 3000
    
    setToasts((prev) => [...prev, { ...toast, id }])
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const value = React.useMemo(() => {
    return { toasts, addToast, removeToast }
  }, [toasts, addToast, removeToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.map((toast) => {
        if (toast.type === "success") {
          return (
            <ToastSuccess key={toast.id} visible={true}>
              {toast.message}
            </ToastSuccess>
          )
        }
        return null
      })}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}
