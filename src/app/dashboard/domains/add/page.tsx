'use client';

import * as React from 'react';
import { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CircleCheckIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

// Define the steps for our domain setup process
const steps = [
  {
    title: "Add Domain",
    description: "Enter your domain name",
    status: 'current' as const
  },
  {
    title: "Verify Domain",
    description: "Configure DNS settings",
    status: 'upcoming' as const
  },
  {
    title: "Complete Setup",
    description: "All done!",
    status: 'upcoming' as const
  },
];

export default function AddDomainPage() {
  const [domain, setDomain] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const router = useRouter();

  // This function simulates adding a domain
  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate loading state and API call
    setIsLoading(true);
    
    setTimeout(() => {
      // After "API call" completes
      setIsLoading(false);
      setShowSuccessToast(true);
      
      // After showing success message, redirect
      setTimeout(() => {
        // Redirect to the domain detail page with a random ID for demo
        const demoId = 'demo-' + Math.random().toString(36).substring(2, 10);
        router.push(`/dashboard/domain/${demoId}`);
      }, 1500);
    }, 2000);
  };

  // Function to handle import from Resend
  const handleImportFromResend = () => {
    // This would normally make an API call using the Resend API key
    console.log("Import domains from Resend using:", resendApiKey);
    setResendApiKey('');
    // Additional functionality would be added here
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
                  <BreadcrumbPage>Add Domain</BreadcrumbPage>
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
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Domains
          </Button>
          
          {/* Stepper */}
          <div className="mb-10 px-4">
            <DomainStepper steps={steps} currentStep={1} />
          </div>

          {/* Add Domain Form */}
          <div className="max-w-lg mx-auto w-full">
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold">Add Domain</h1>
                <p className="text-muted-foreground mt-2">Add a domain you own to send emails.</p>
              </div>
              
              <form onSubmit={handleAddDomain} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="domain" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="bg-white text-black hover:bg-gray-100 w-full md:w-auto"
                  disabled={isLoading || !domain}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      Add Domain
                    </>
                  )}
                </Button>
              </form>

              {/* Resend Import Section */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-bold">Import from Resend</h2>
                <p className="text-muted-foreground mt-2 mb-4">Already have domains in Resend? Paste your API key to import them for bulk processing.</p>
                
                <div className="space-y-4">
                  <Input
                    placeholder="Paste your Resend API key (re_...)"
                    value={resendApiKey}
                    onChange={(e) => setResendApiKey(e.target.value)}
                    className="w-full"
                  />
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={!resendApiKey}
                    onClick={handleImportFromResend}
                  >
                    Import Domains
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    Your API key is not stored and only used to fetch your domains.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Success Toast */}
          {showSuccessToast && (
            <div className="fixed bottom-4 right-4 bg-white dark:bg-zinc-900 border rounded-md px-4 py-3 shadow-lg">
              <p className="text-sm">
                <CircleCheckIcon
                  className="me-3 -mt-0.5 inline-flex text-emerald-500"
                  size={16}
                  aria-hidden="true"
                />
                Domain added successfully!
              </p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
