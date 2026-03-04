"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";

interface DataGridContextProps {
    table: Table<any>;
    recordCount: number;
    tableLayout?: {
        dense?: boolean;
    };
}

const DataGridContext = React.createContext<DataGridContextProps | undefined>(undefined);

export function useDataGrid() {
    const context = React.useContext(DataGridContext);
    if (!context) {
        throw new Error("useDataGrid must be used within a DataGrid");
    }
    return context;
}

export function DataGrid({
    table,
    recordCount,
    tableLayout,
    children,
}: DataGridContextProps & { children: React.ReactNode }) {
    return (
        <DataGridContext.Provider value={{ table, recordCount, tableLayout }}>
            <div className="flex flex-col gap-4 w-full">
                {children}
            </div>
        </DataGridContext.Provider>
    );
}

export function DataGridContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-md border bg-card text-card-foreground shadow">
            {children}
        </div>
    );
}
