"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonGroupProps {
    children: React.ReactNode
    selectedKeys?: string[]
    className?: string
}

interface ButtonGroupItemProps {
    id: string
    children: React.ReactNode
    className?: string
}

const ButtonGroupContext = React.createContext<{
    selectedKeys: string[]
}>({
    selectedKeys: [],
})

export const ButtonGroup = ({ children, selectedKeys = [], className }: ButtonGroupProps) => {
    return (
        <ButtonGroupContext.Provider value={{ selectedKeys }}>
            <div className={cn("inline-flex rounded-lg bg-muted p-1", className)} role="tablist">
                {children}
            </div>
        </ButtonGroupContext.Provider>
    )
}

export const ButtonGroupItem = ({ id, children, className }: ButtonGroupItemProps) => {
    const { selectedKeys } = React.useContext(ButtonGroupContext)
    const isSelected = selectedKeys.includes(id)

    return (
        <button
            role="tab"
            aria-selected={isSelected}
            data-state={isSelected ? "active" : "inactive"}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isSelected
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                className
            )}
        >
            {children}
        </button>
    )
}
