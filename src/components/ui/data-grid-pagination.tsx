"use client";

import * as React from "react";
import { useDataGrid } from "./data-grid";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DataGridPagination() {
    const { table, recordCount } = useDataGrid();
    const state = table.getState().pagination;
    const pageCount = table.getPageCount();
    const currentPage = state.pageIndex + 1;

    // Generate page numbers
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

    // Show only a few pages if there are many (optional, but good practice)
    // For now let's just show them all since the demo data is small
    const visiblePages = pages.slice(
        Math.max(0, state.pageIndex - 1),
        Math.min(pageCount, state.pageIndex + 2)
    );

    return (
        <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center space-x-2">
                <p className="text-sm font-normal text-muted-foreground/80">Rows per page</p>
                <Select
                    value={`${state.pageSize}`}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value));
                    }}
                >
                    <SelectTrigger className="h-8 w-fit min-w-[40px] bg-transparent border-zinc-800 text-foreground font-medium rounded-md focus:ring-0 px-2 gap-2">
                        <SelectValue placeholder={state.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top" className="bg-zinc-950 border-zinc-800">
                        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`} className="focus:bg-zinc-900 focus:text-white">
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center space-x-6">
                <div className="text-sm font-normal text-muted-foreground/80">
                    {state.pageIndex * state.pageSize + 1} - {Math.min((state.pageIndex + 1) * state.pageSize, recordCount)} of {recordCount}
                </div>

                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-zinc-900 hover:text-white disabled:opacity-30"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {pages.map((page) => (
                        <Button
                            key={page}
                            variant={state.pageIndex + 1 === page ? "secondary" : "ghost"}
                            className={cn(
                                "h-8 w-8 p-0 text-sm font-medium transition-colors",
                                state.pageIndex + 1 === page
                                    ? "bg-zinc-900 text-white hover:bg-zinc-800"
                                    : "text-muted-foreground hover:bg-zinc-900 hover:text-white"
                            )}
                            onClick={() => table.setPageIndex(page - 1)}
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-zinc-900 hover:text-white disabled:opacity-30"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
