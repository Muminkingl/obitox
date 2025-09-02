'use client';

import * as React from 'react';
import { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, RefreshCw, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { DomainStepper } from '@/components/domain-stepper';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the steps for our domain setup process
const steps = [
  {
    title: "Add Domain",
    description: "Enter your domain name",
    status: 'completed' as const
  },
  {
    title: "Verify Domain",
    description: "Configure DNS settings",
    status: 'current' as const
  },
  {
    title: "Complete Setup",
    description: "All done!",
    status: 'upcoming' as const
  },
];

// Example DNS records data
const dnsRecords = [
  {
    name: 'mail',
    type: 'MX',
    ttl: 'Auto',
    value: 'feedback-smtp.us-east-1.amazonaws.com',
    priority: '10'
  },
  {
    name: '@',
    type: 'MX',
    ttl: 'Auto',
    value: 'inbound-smtp.us-east-1.amazonaws.com',
    priority: '10'
  },
  {
    name: '_dmarc',
    type: 'TXT',
    ttl: 'Auto',
    value: 'v=DMARC1; p=none;',
    priority: ''
  },
  {
    name: '@',
    type: 'TXT',
    ttl: 'Auto',
    value: 'v=spf1 include:amazonses.com ~all',
    priority: ''
  },
  {
    name: '_amazonses',
    type: 'TXT',
    ttl: 'Auto',
    value: '3/D3ZaUFVRgfTlM0FiAAOFi9ZJEwkzfs...',
    priority: ''
  }
];

export default function DomainDetailPage() {
  const params = useParams();
  const domainId = params.id;
  const router = useRouter();
  
  // For demo purposes, assuming the domain name is constructed from the ID
  const domainName = `${domainId.toString().split('-')[1]}.example.com`;
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a small toast notification here
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
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
                  <BreadcrumbLink href="/dashboard/domains">
                    Domains
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{domainName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Back button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit" 
            onClick={() => router.push('/dashboard/domains')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Domains
          </Button>
          
          {/* Top domain info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                🌐
              </div>
              <div>
                <h1 className="text-2xl font-bold">{domainName}</h1>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-500">
                    Pending
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">Add DNS records to complete verification</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2">Refresh</span>
              </Button>
              <Button variant="outline" size="sm" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
                <span className="ml-2">Delete</span>
              </Button>
            </div>
          </div>
          
          {/* Stepper */}
          <div className="mb-10 px-4">
            <DomainStepper steps={steps} currentStep={2} />
          </div>

          {/* DNS Configuration Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold">Configure DNS</h2>
              <p className="text-muted-foreground mt-1">
                Add the following DNS records to your domain provider. Verification may take a few minutes after adding the records.
              </p>
              
              <div className="flex items-center mt-3 bg-blue-500/10 border border-blue-500/20 p-3 rounded-md">
                <div className="flex items-center justify-center bg-blue-500/20 rounded-full p-1 mr-3">
                  <span className="text-blue-500 text-lg">ℹ️</span>
                </div>
                <div className="text-sm">
                  <strong className="text-blue-500">Provider: DNS Provider</strong>
                </div>
              </div>
            </div>
            
            {/* DNS Records not yet verified alert */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-500 text-lg">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-500">DNS records not yet verified</h3>
                  <div className="mt-2 text-sm">
                    <p>
                      Please add the DNS records below to your domain provider. Verification may take a few minutes after adding the records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* DNS Records Table */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Record name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>TTL</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dnsRecords.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.ttl}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs truncate max-w-[200px]">
                            {record.value}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopy(record.value)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{record.priority}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
