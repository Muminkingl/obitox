"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface FilterItem {
  id: string
  label: string
  value: string
  percentage?: number
  detail?: string
}

interface FilterButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  title: string
  items: FilterItem[]
  selectedItems: string[]
  onSelectionChange: (selectedIds: string[]) => void
  align?: "start" | "center" | "end"
}

export function FilterButton({
  icon,
  title,
  items,
  selectedItems,
  onSelectionChange,
  align = "end",
  className,
}: FilterButtonProps) {
  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter(id => id !== itemId))
    } else {
      onSelectionChange([...selectedItems, itemId])
    }
  }

  const selectAll = () => {
    onSelectionChange(items.map(item => item.id))
  }

  const clearAll = () => {
    onSelectionChange([])
  }

  const isAllSelected = items.length === selectedItems.length
  const hasSelection = selectedItems.length > 0
  
  // Create a display string for the selected items
  const selectedText = React.useMemo(() => {
    if (selectedItems.length === 0) return "All"
    if (selectedItems.length === 1) {
      const selected = items.find(item => item.id === selectedItems[0])
      return selected?.label || "All"
    }
    if (selectedItems.length === items.length) return "All"
    return `${selectedItems.length} selected`
  }, [selectedItems, items])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline" 
            className={cn(
              "gap-2 px-3 justify-between min-w-[140px]",
              !hasSelection && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              {icon}
              <span>{selectedText}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[240px] p-0" 
          align={align}
        >
          <div className="p-2 border-b">
            <div className="font-semibold text-sm px-2 py-1.5">{title}</div>
          </div>
          <div className="p-2 max-h-[320px] overflow-auto">
            <div className="grid gap-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-2 py-1 rounded-md text-sm hover:bg-muted cursor-pointer"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-4 h-4 rounded-sm border flex items-center justify-center",
                      selectedItems.includes(item.id) ? "bg-primary border-primary" : "border-input"
                    )}>
                      {selectedItems.includes(item.id) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <span>{item.label}</span>
                  </div>
                  {item.percentage !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {item.percentage}%
                      {item.detail && <span className="text-xs ml-1 text-muted-foreground/70">{item.detail}</span>}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border-t bg-muted/30">
            <Button 
              variant="ghost"
              size="sm" 
              className="text-xs h-8"
              onClick={selectAll}
              disabled={isAllSelected}
            >
              Select all
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs h-8"
              onClick={clearAll}
              disabled={!hasSelection}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
