'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSubscription } from '@/contexts/subscription-context';
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Search, Lock, Shield, Download, TrendingUp, ShieldX } from 'lucide-react';
import Link from 'next/link';
import CreateApiKeyDialog from '@/components/create-api-key-dialog';
import DeleteApiKeyDialog from '@/components/delete-api-key-dialog';
import EditApiKeyDialog from '@/components/edit-api-key-dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useMemo } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';


// API key type definition
interface ApiKey {
  id: string;
  name: string;
  key_value: string;
  created_at: string;
  last_used_at: string | null;
}

export default function ApiKeysPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState<{ id: string, name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingKeys, setRemainingKeys] = useState<number | null>(null);

  // Use subscription context instead of fetching
  const { subscription, loading: subLoading } = useSubscription();
  const subscriptionData = subscription?.data;
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  // Columns definition for DataGrid
  const columns = useMemo<ColumnDef<ApiKey>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <div className="bg-green-500/10 text-green-500 p-1 rounded-full">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: 'key_value',
        header: 'Token',
        cell: ({ row }) => (
          <div className="bg-zinc-900 font-mono text-sm px-2 py-1 rounded inline-block">
            {row.original.key_value}
          </div>
        ),
        size: 250,
      },
      {
        accessorKey: 'last_used_at',
        header: 'Last Used',
        cell: ({ row }) => row.original.last_used_at ? new Date(row.original.last_used_at).toLocaleString() : 'No activity',
        size: 180,
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
        size: 180,
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <EditApiKeyDialog
                    apiKey={{ id: row.original.id, name: row.original.name }}
                    onEdit={handleEditApiKey}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openDeleteDialog(row.original.id, row.original.name)} className="text-red-500">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 50,
        enableSorting: false,
      },
    ],
    []
  );

  // Filter API keys based on search query
  const filteredApiKeys = useMemo(() => {
    return apiKeys?.filter(key =>
      key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.key_value.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [apiKeys, searchQuery]);

  // TanStack Table instance
  const table = useReactTable({
    columns,
    data: filteredApiKeys,
    pageCount: Math.ceil((filteredApiKeys?.length || 0) / pagination.pageSize),
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Fetch API keys from the server
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[API KEYS] Fetching data from combined endpoint...');

      // ✅ COMBINED ENDPOINT: Single call for both keys and metadata
      const response = await fetch('/api/apikeys/with-metadata');

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch API keys');
      }

      console.log('[API KEYS] ✅ Combined data loaded successfully');

      // Set both apiKeys and metadata from single response
      setApiKeys(data.apiKeys || []);
      setRemainingKeys(data.metadata?.remaining ?? null);

    } catch (err: any) {
      console.error('[API KEYS] Error:', err);
      setError(err.message || 'Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Handle API key creation
  const handleCreateApiKey = async (name: string, challenge: string, solution: string) => {
    try {
      const response = await fetch('/api/apikeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, challenge, solution })
      });

      // Clone the response so we can read it twice
      const responseClone = response.clone();

      // First, check for errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create API key');
      }

      // Get the response data with the API key
      const data = await responseClone.json();

      // Refresh the list of API keys
      fetchApiKeys();

      // Return the API key data for display
      return {
        success: true,
        apiKey: data.data // Pass the full data object which contains apiKey and apiSecret
      };
    } catch (err: any) {
      console.error('Error creating API key:', err);
      return { success: false, error: err.message };
    }
  };

  // Handle API key deletion
  const handleDeleteApiKey = async (id: string) => {
    try {
      const response = await fetch(`/api/apikeys/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }

      // Refresh the API keys list
      fetchApiKeys();
      return true;
    } catch (err) {
      console.error('Error deleting API key:', err);
      return false;
    }
  };

  // Handle API key edit
  const handleEditApiKey = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/apikeys/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });

      if (!response.ok) {
        throw new Error('Failed to update API key');
      }

      // Refresh the API keys list
      fetchApiKeys();
      return true;
    } catch (err) {
      console.error('Error updating API key:', err);
      return false;
    }
  };

  // Handle delete dialog
  const openDeleteDialog = (id: string, name: string) => {
    setSelectedApiKey({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedApiKey) {
      await handleDeleteApiKey(selectedApiKey.id);
      setSelectedApiKey(null);
    }
    return true;
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  Dashboard
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>API Keys</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Permanent Ban Alert */}
          {subscriptionData?.ban?.isPermanentlyBanned && (
            <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
              <ShieldX className="h-4 w-4" />
              <AlertTitle>Account Permanently Banned</AlertTitle>
              <AlertDescription>
                Your account has been permanently banned from using our API.
                {subscriptionData.ban.reason && (
                  <span className="block mt-1 text-xs opacity-80">Reason: {subscriptionData.ban.reason}</span>
                )}
                {subscriptionData.ban.canAppeal && (
                  <a href="mailto:support@obitox.com" className="block mt-2 underline font-medium">
                    Contact Support to Appeal
                  </a>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">API Keys</h1>
            </div>
            <div className="flex items-center space-x-2">
              <CreateApiKeyDialog
                onCreateApiKey={handleCreateApiKey}
                disabled={
                  subscriptionData?.ban?.isPermanentlyBanned ||
                  (remainingKeys !== null && remainingKeys <= 0)
                }
                remainingKeys={remainingKeys}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 border rounded-md w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Button variant="outline" className="p-2">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DataGrid table={table} recordCount={filteredApiKeys.length} tableLayout={{ dense: true }}>
            <div className="w-full space-y-4">
              <DataGridContainer>
                <ScrollArea>
                  <DataGridTable />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </DataGridContainer>
              <DataGridPagination />
            </div>
          </DataGrid>
        </div>

        {/* Delete Confirmation Dialog */}
        {selectedApiKey && (
          <DeleteApiKeyDialog
            apiKeyName={selectedApiKey.name}
            onDelete={handleConfirmDelete}
            isOpen={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
