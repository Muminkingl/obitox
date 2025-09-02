'use client';

import * as React from 'react';
import { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
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
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Plus, Download, MoreHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data
const domains = [
  {
    id: '1',
    name: 'example.gmil.com',
    status: 'Pending',
    created: '10 minutes ago',
    region: 'Tokyo',
    regionCode: 'ap-northeast-1',
    icon: '🌐'
  },
  {
    id: '2',
    name: 'yourdomain.com',
    status: 'Active',
    created: '2 days ago',
    region: 'US East',
    regionCode: 'us-east-1',
    icon: '🌐'
  },
  {
    id: '3',
    name: 'client-site.net',
    status: 'Active',
    created: '1 week ago',
    region: 'Europe',
    regionCode: 'eu-west-1',
    icon: '🌐'
  },
  {
    id: '4',
    name: 'api.myservice.org',
    status: 'Active',
    created: '2 weeks ago',
    region: 'US West',
    regionCode: 'us-west-2',
    icon: '🌐'
  },
  {
    id: '5',
    name: 'cdn.bigproject.io',
    status: 'Pending',
    created: '3 days ago',
    region: 'Asia',
    regionCode: 'ap-south-1',
    icon: '🌐'
  },
  {
    id: '6',
    name: 'test.devsite.co',
    status: 'Active',
    created: '1 month ago',
    region: 'US Central',
    regionCode: 'us-central-1',
    icon: '🌐'
  },
];

export default function DomainsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Number of domains to show per page
  
  // Filter domains based on search query
  const filteredDomains = domains.filter(domain => 
    domain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalDomains = filteredDomains.length;
  const totalPages = Math.max(1, Math.ceil(totalDomains / itemsPerPage));
  
  // Ensure currentPage is always valid
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  
  // Get current page domains
  const getCurrentPageDomains = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalDomains);
    return filteredDomains.slice(startIndex, endIndex);
  };
  
  const currentDomains = getCurrentPageDomains();
  
  // Handle pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
                  <BreadcrumbPage>Domains</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Domains</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <a href="/dashboard/domains/add">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Domain
                </a>
              </Button>
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
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDomains.map((domain) => (
                  <TableRow key={domain.id} className="hover:bg-muted/50 border-b">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{domain.icon}</span>
                        <span>{domain.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        domain.status === 'Active' 
                          ? 'bg-green-900/30 text-green-500' 
                          : 'bg-yellow-900/30 text-yellow-500'
                      }`}>
                        {domain.status}
                      </span>
                    </TableCell>
                    <TableCell>{domain.created}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {currentDomains.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      No domains found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div>
              Page {currentPage} of {totalPages} ({totalDomains} domains)
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={goToPrevPage}
                    className="gap-1 px-2 sm:pe-4"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                    <span>Previous</span>
                  </Button>
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <Button 
                      variant={currentPage === index + 1 ? "outline" : "ghost"}
                      size="icon"
                      className="size-9"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={goToNextPage}
                    className="gap-1 px-2 sm:ps-4"
                  >
                    <span>Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

