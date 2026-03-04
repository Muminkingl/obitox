"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  dateRange: DateRange | undefined
  onDateRangeChange: (dateRange: DateRange | undefined) => void
  align?: "start" | "center" | "end"
  className?: string
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  align = "center",
  className,
}: DateRangePickerProps) {
  // Predefined ranges
  const predefinedRanges = [
    { name: "Today", date: { from: new Date(), to: new Date() } },
    { name: "Yesterday", date: { from: addDays(new Date(), -1), to: addDays(new Date(), -1) } },
    { name: "Last 3 days", date: { from: addDays(new Date(), -3), to: new Date() } },
    { name: "Last 7 days", date: { from: addDays(new Date(), -7), to: new Date() } },
    { name: "Last 15 days", date: { from: addDays(new Date(), -15), to: new Date() } },
    { name: "Last 30 days", date: { from: addDays(new Date(), -30), to: new Date() } },
  ]

  const dateRangeText = React.useMemo(() => {
    if (!dateRange?.from) {
      return "Select date range"
    }

    // Check if the selected date range matches any predefined range
    const predefinedRange = predefinedRanges.find(
      range => 
        range.date.from?.toDateString() === dateRange.from?.toDateString() && 
        range.date.to?.toDateString() === dateRange.to?.toDateString()
    )
    
    if (predefinedRange) {
      return predefinedRange.name
    }

    if (dateRange.from && dateRange.to) {
      if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
        return format(dateRange.from, "MMM dd, yyyy")
      }
      return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`
    }

    return format(dateRange.from, "MMM dd, yyyy")
  }, [dateRange, predefinedRanges])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline" 
            className={cn(
              "w-[240px] justify-between text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <span>{dateRangeText}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-background border rounded-md shadow-md" 
          align={align}
        >
          <div className="flex">
            <div className="border-r w-[180px]">
              <div className="p-2 bg-muted/40">
                <h3 className="font-semibold text-xs px-2 py-1">Date Range</h3>
              </div>
              <div className="grid gap-1 p-2">
                {predefinedRanges.map((range) => (
                  <Button 
                    key={range.name}
                    variant="ghost"
                    className="justify-start text-xs font-normal py-1 px-2 h-auto"
                    onClick={() => onDateRangeChange(range.date)}
                  >
                    {range.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="p-2">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={1}
                className="rounded-md"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
