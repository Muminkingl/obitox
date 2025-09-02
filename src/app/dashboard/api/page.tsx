'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Search, Lock, Shield, Download } from 'lucide-react';
import CreateApiKeyDialog from '@/components/create-api-key-dialog';
import DeleteApiKeyDialog from '@/components/delete-api-key-dialog';
import EditApiKeyDialog from '@/components/edit-api-key-dialog';
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
  const [selectedApiKey, setSelectedApiKey] = useState<{id: string, name: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingKeys, setRemainingKeys] = useState<number | null>(null);
  // Filter API keys based on search query
  const filteredApiKeys = apiKeys?.filter(key => 
    key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    key.key_value.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Fetch API keys from the server
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/apikeys');
      
      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }
      
      const data = await response.json();
      setApiKeys(data.apiKeys);
      
      // Get remaining API key count
      const limitResponse = await fetch('/api/apikeys/limit');
      if (limitResponse.ok) {
        const limitData = await limitResponse.json();
        setRemainingKeys(limitData.remaining);
      }
    } catch (err) {
      setError('Failed to load API keys');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Handle API key creation
  const handleCreateApiKey = async (name: string) => {
    try {
      const response = await fetch('/api/apikeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
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
        apiKey: data.data?.apiKey // Access via data.data.apiKey (from createResponse format)
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
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">API Keys</h1>
            <div className="flex items-center space-x-2">
              <CreateApiKeyDialog 
              onCreateApiKey={handleCreateApiKey} 
              disabled={remainingKeys !== null && remainingKeys <= 0}
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
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead>Name</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id} className="hover:bg-muted/50 border-b">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-500/10 text-green-500 p-1 rounded-full">
                          <Shield className="h-4 w-4" />
                        </div>
                        <span>{apiKey.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="bg-zinc-900 font-mono text-sm px-2 py-1 rounded inline-block">
                        {apiKey.key_value}
                      </div>
                    </TableCell>
                    <TableCell>{apiKey.last_used_at ? new Date(apiKey.last_used_at).toLocaleString() : 'No activity'}</TableCell>
                    <TableCell>{new Date(apiKey.created_at).toLocaleString()}</TableCell>
                    <TableCell>
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
                                apiKey={{ id: apiKey.id, name: apiKey.name }}
                                onEdit={handleEditApiKey}
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog(apiKey.id, apiKey.name)} className="text-red-500">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredApiKeys.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No API keys found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          

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
