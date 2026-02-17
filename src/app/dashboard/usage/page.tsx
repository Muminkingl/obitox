'use client';

import React, { useState, useEffect } from 'react';
import { useSubscription } from '@/contexts/subscription-context';
import { useDebounce } from 'use-debounce';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/date-range-picker';
import { FilterButton } from '@/components/filter-button';
import { TrendingUp, Database, FileType, Shield, Trash2, ShieldX } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { type DateRange } from 'react-day-picker';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
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
import { PlanBadge } from '@/components/plan-badge'
import { Progress } from "@/components/ui/progress"
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// Types for our live data
interface UsageData {
  month: string;
  uploads: number;
  bandwidth: number;
  apiCalls: number;
  successRate: number;
}

interface ProviderData {
  id: string;
  label: string;
  value: string;
  percentage: number;
  detail: string;
  totalFileSize: number;
  averageFileSize: number;
  lastUsedAt: string | null;
}

interface FileTypeData {
  id: string;
  label: string;
  value: string;
  percentage: number;
  detail: string;
  count?: number;
}

interface CurrentUsage {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalFileSize: number;
  totalFilesUploaded: number;
  lastUsedAt: string | null;
}

// Chart configuration with explicit colors
const chartConfig = {
  usage: {
    label: 'Usage',
  },
  uploads: {
    label: 'Uploads',
    color: '#8b5cf6', // violet-500
  },
  apiCalls: {
    label: 'API Calls',
    color: '#06b6d4', // cyan-500
  },
} satisfies ChartConfig;

// Default data for loading state
const defaultUsageData: UsageData[] = [];
const defaultProviderData: ProviderData[] = [];
const defaultFileTypeData: FileTypeData[] = [];
const defaultCurrentUsage: CurrentUsage = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalFileSize: 0,
  totalFilesUploaded: 0,
  lastUsedAt: null
};

export default function UsagePage() {
  const [selectedMetric, setSelectedMetric] = useState<'uploads' | 'bandwidth' | 'apiCalls' | 'successRate'>('uploads');
  const [timeRange, setTimeRange] = useState('90d');

  // Set default date range to last month to today
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return {
      from: lastMonth,
      to: today,
    };
  });

  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);

  // Debounce filter changes - wait 500ms after last change before fetching
  const [debouncedProviders] = useDebounce(selectedProviders, 500);
  const [debouncedFileTypes] = useDebounce(selectedFileTypes, 500);

  // Live data state
  const [apiUsageData, setApiUsageData] = useState<UsageData[]>(defaultUsageData);
  const [storageProviders, setStorageProviders] = useState<ProviderData[]>(defaultProviderData);
  const [fileTypes, setFileTypes] = useState<FileTypeData[]>(defaultFileTypeData);
  const [currentUsage, setCurrentUsage] = useState<CurrentUsage>(defaultCurrentUsage);
  const [usageByKey, setUsageByKey] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Use subscription context instead of fetching
  const { subscription: subscriptionData } = useSubscription();
  const [error, setError] = useState<string | null>(null);

  // Fetch live data from API
  const fetchUsageData = async (dateRangeToUse = dateRange) => {
    try {
      setLoading(true);
      setError(null);

      // Format dates for the API
      const startDate = dateRangeToUse.from ? dateRangeToUse.from.toISOString() : undefined;
      const endDate = dateRangeToUse.to ? dateRangeToUse.to.toISOString() : undefined;

      const url = new URL('/api/usage/history', window.location.origin);
      if (startDate) url.searchParams.append('startDate', startDate);
      if (endDate) url.searchParams.append('endDate', endDate);

      // Use debounced filter values
      if (debouncedProviders.length > 0) url.searchParams.append('providers', debouncedProviders.join(','));
      if (debouncedFileTypes.length > 0) url.searchParams.append('fileTypes', debouncedFileTypes.join(','));

      // Only fetch usage data, subscription comes from context
      const usageRes = await fetch(url.toString());

      if (!usageRes.ok) throw new Error('Failed to fetch usage data');

      const usageData = await usageRes.json();

      setApiUsageData(usageData.monthlyData || []);
      setStorageProviders(usageData.providerBreakdown || []);
      setFileTypes(usageData.fileTypeBreakdown || []);
      setCurrentUsage(usageData.currentUsage || defaultCurrentUsage);
      setUsageByKey(usageData.usageByKey || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch usage data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when debounced filters change
  useEffect(() => {
    fetchUsageData();
  }, [debouncedProviders, debouncedFileTypes]);


  // Handle date range change
  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
    fetchUsageData(newDateRange);
  };

  // Handle provider filter change
  const handleProviderChange = (newProviders: string[]) => {
    setSelectedProviders(newProviders);
  };

  // Handle file type filter change
  const handleFileTypeChange = (newFileTypes: string[]) => {
    setSelectedFileTypes(newFileTypes);
  };

  // Format the date range for display
  const dateRangeText = dateRange.from && dateRange.to
    ? `${dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : 'Select date range';

  // Filter chart data based on time range
  const filteredChartData = React.useMemo(() => {
    if (apiUsageData.length === 0) return [];
    
    // Get the most recent date from the data
    const dates = apiUsageData.map(d => {
      // Parse month format like "Jan 2024" or "2024-01"
      const parts = d.month.split(' ');
      if (parts.length === 2) {
        // Format: "Jan 2024"
        return new Date(`${parts[0]} 1, ${parts[1]}`);
      }
      return new Date(d.month);
    }).filter(d => !isNaN(d.getTime()));
    
    if (dates.length === 0) return apiUsageData;
    
    const referenceDate = new Date(Math.max(...dates.map(d => d.getTime())));
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    
    return apiUsageData.filter((item, index) => {
      const date = dates[index];
      return date >= startDate;
    });
  }, [apiUsageData, timeRange]);

  // Calculate totals based on the most recent month
  const latestMonth = apiUsageData[apiUsageData.length - 1] || {
    uploads: 0,
    bandwidth: 0,
    apiCalls: 0,
    successRate: 0
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
                  <BreadcrumbPage>Usage</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Permanent Ban Alert */}
          {subscriptionData?.data?.ban?.isPermanentlyBanned && (
            <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
              <ShieldX className="h-4 w-4" />
              <AlertTitle>Account Permanently Banned</AlertTitle>
              <AlertDescription>
                Your account has been permanently banned from using this API.
                {subscriptionData.data.ban.reason && (
                  <span className="block mt-1 text-xs opacity-80">Reason: {subscriptionData.data.ban.reason}</span>
                )}
                {subscriptionData.data.ban.canAppeal && (
                  <a href="mailto:support@obitox.com" className="block mt-2 underline font-medium">
                    Contact Support to Appeal
                  </a>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Usage Chart */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="border-0 min-h-auto pt-6 pb-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-lg font-semibold text-3xl">API Usage</CardTitle>
                  <PlanBadge />
                </div>
                <div className="flex gap-2">
                  <DateRangePicker
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                    className="w-auto"
                  />
                  <FilterButton
                    icon={<Database className="h-4 w-4" />}
                    title="Storage Provider"
                    items={storageProviders}
                    selectedItems={selectedProviders}
                    onSelectionChange={handleProviderChange}
                  />
                  <FilterButton
                    icon={<FileType className="h-4 w-4" />}
                    title="File Types"
                    items={fileTypes}
                    selectedItems={selectedFileTypes}
                    onSelectionChange={handleFileTypeChange}
                  />
                </div>
              </CardHeader>

              <CardContent className="px-0">
                {/* Stats Section */}
                <div className="px-5 mb-8">
                  <div className="text-xs font-medium text-muted-foreground tracking-wide mb-2">
                    {dateRangeText}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Plan Quota Card */}
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-muted-foreground">Monthly Quota</div>
                        {subscriptionData?.data && (
                          <div className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                            {subscriptionData.data.plan_name}
                          </div>
                        )}
                      </div>
                      <div className="text-2xl font-bold mb-3">
                        {loading ? '...' : (
                          subscriptionData?.data ? (
                            <>
                              {subscriptionData.data.requests_used.toLocaleString()}
                              <span className="text-sm font-normal text-muted-foreground ml-1">
                                / {subscriptionData.data.requests_limit.toLocaleString()}
                              </span>
                            </>
                          ) : 'No data'
                        )}
                      </div>
                      {subscriptionData?.data && (
                        <div className="space-y-1.5">
                          <Progress value={subscriptionData.data.usage_percent} className="h-1.5" />
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>{subscriptionData.data.usage_percent}% used</span>
                            <span>{subscriptionData.data.requests_remaining.toLocaleString()} left</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Total Uploads</div>
                      <div className="text-2xl font-bold">
                        {loading ? 'Loading...' : (
                          selectedProviders.length > 0 || selectedFileTypes.length > 0
                            ? apiUsageData.reduce((sum, month) => sum + month.uploads, 0).toLocaleString()
                            : currentUsage.totalFilesUploaded.toLocaleString()
                        )} files
                        {(selectedProviders.length > 0 || selectedFileTypes.length > 0) && !loading && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Filtered from {currentUsage.totalFilesUploaded.toLocaleString()} total files
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Total API Calls</div>
                      <div className="text-2xl font-bold">
                        {loading ? 'Loading...' : (
                          selectedProviders.length > 0 || selectedFileTypes.length > 0
                            ? apiUsageData.reduce((sum, month) => sum + month.apiCalls, 0).toLocaleString()
                            : currentUsage.totalRequests.toLocaleString()
                        )} requests
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="relative px-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-[250px]">
                      <div className="text-muted-foreground">Loading chart data...</div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-[250px]">
                      <div className="text-red-500">Error: {error}</div>
                    </div>
                  ) : apiUsageData.length === 0 ? (
                    <div className="flex items-center justify-center h-[250px]">
                      <div className="text-muted-foreground">No data available for the selected period</div>
                    </div>
                  ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                      <AreaChart data={apiUsageData}>
                        <defs>
                          <linearGradient id="fillUploads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="fillApiCalls" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          minTickGap={32}
                          tickFormatter={(value) => value}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              className="w-[180px]"
                              labelFormatter={(value) => value}
                              indicator="dot"
                            />
                          }
                        />
                        <Area
                          dataKey="apiCalls"
                          type="natural"
                          fill="url(#fillApiCalls)"
                          stroke="#06b6d4"
                          stackId="a"
                        />
                        <Area
                          dataKey="uploads"
                          type="natural"
                          fill="url(#fillUploads)"
                          stroke="#8b5cf6"
                          stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                      </AreaChart>
                    </ChartContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* API Key Usage Table */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Usage by API Key</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b">
                        <TableHead>Key Name</TableHead>
                        <TableHead>Token Fragment</TableHead>
                        <TableHead className="text-right">Usage</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            Loading key usage...
                          </TableCell>
                        </TableRow>
                      ) : usageByKey.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            No API keys found
                          </TableCell>
                        </TableRow>
                      ) : (
                        usageByKey.map((key) => (
                          <TableRow key={key.id} className="hover:bg-muted/50 border-b">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                {key.id === 'deleted-keys' ? (
                                  <div className="bg-red-500/10 text-red-500 p-1 rounded-full">
                                    <Trash2 className="h-4 w-4" />
                                  </div>
                                ) : (
                                  <div className="bg-green-500/10 text-green-500 p-1 rounded-full">
                                    <Shield className="h-4 w-4" />
                                  </div>
                                )}
                                <span className={key.id === 'deleted-keys' ? "font-medium text-muted-foreground" : "font-medium"}>
                                  {key.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                                {key.key_value.substring(0, 10)}...{key.key_value.substring(key.key_value.length - 4)}
                              </code>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="font-semibold">{key.usage.toLocaleString()}</span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {key.last_used_at ? new Date(key.last_used_at).toLocaleString() : 'Never'}
                            </TableCell>
                            <TableCell className="text-right">
                              {key.id === 'deleted-keys' ? (
                                <span className="text-xs text-muted-foreground">—</span>
                              ) : (
                                <a
                                  href="/dashboard/api"
                                  className="text-xs text-primary hover:underline font-medium"
                                >
                                  Manage
                                </a>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}