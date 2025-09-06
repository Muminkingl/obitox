'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/date-range-picker';
import { FilterButton } from '@/components/filter-button';
import { TrendingUp, Database, FileType } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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

// Types for our live data
interface UsageData {
  month: string;
  uploads: number;
  bandwidth: number;
  apiCalls: number;
  successRate: number;
  providers: { [key: string]: number };
  fileTypes: { [key: string]: number };
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

// Chart configuration
const chartConfig = {
  uploads: {
    label: 'Uploads',
    color: 'var(--violet-500, #8b5cf6)',
  },
  bandwidth: {
    label: 'Bandwidth',
    color: 'var(--blue-500, #3b82f6)',
  },
  apiCalls: {
    label: 'API Calls',
    color: 'var(--emerald-500, #10b981)',
  },
  successRate: {
    label: 'Success Rate',
    color: 'var(--amber-500, #f59e0b)',
  },
};

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-zinc-900 text-white p-3 shadow-lg">
        <div className="text-xs font-medium mb-1">{label}</div>
        <div className="grid gap-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <div className="text-xs font-medium">{entry.dataKey}:</div>
              <div className="text-sm font-semibold">
                {entry.dataKey === 'bandwidth'
                  ? entry.value > 1000 
                    ? `${(entry.value / 1000).toFixed(2)} GB` 
                    : `${entry.value.toFixed(2)} MB`
                  : entry.dataKey === 'successRate'
                  ? `${entry.value}%`
                  : entry.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

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
  
  // Live data state
  const [apiUsageData, setApiUsageData] = useState<UsageData[]>(defaultUsageData);
  const [storageProviders, setStorageProviders] = useState<ProviderData[]>(defaultProviderData);
  const [fileTypes, setFileTypes] = useState<FileTypeData[]>(defaultFileTypeData);
  const [currentUsage, setCurrentUsage] = useState<CurrentUsage>(defaultCurrentUsage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch live data from API
  const fetchUsageData = async (dateRangeToUse = dateRange) => {
    try {
      setLoading(true);
      setError(null);
      
      // Format dates for the API
      const startDate = dateRangeToUse.from ? dateRangeToUse.from.toISOString() : undefined;
      const endDate = dateRangeToUse.to ? dateRangeToUse.to.toISOString() : undefined;
      
      // Build the URL with date parameters
      const url = new URL('/api/usage/history', window.location.origin);
      if (startDate) url.searchParams.append('startDate', startDate);
      if (endDate) url.searchParams.append('endDate', endDate);
      
      // Add provider and file type filters
      if (selectedProviders.length > 0) {
        url.searchParams.append('providers', selectedProviders.join(','));
      }
      if (selectedFileTypes.length > 0) {
        url.searchParams.append('fileTypes', selectedFileTypes.join(','));
      }
      
      console.log('Fetching data with filters:', { 
        startDate, 
        endDate, 
        providers: selectedProviders, 
        fileTypes: selectedFileTypes 
      });
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch usage data');
      }
      
      const data = await response.json();
      
      setApiUsageData(data.monthlyData || []);
      setStorageProviders(data.providerBreakdown || []);
      setFileTypes(data.fileTypeBreakdown || []);
      setCurrentUsage(data.currentUsage || defaultCurrentUsage);
    } catch (err) {
      console.error('Error fetching usage data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch usage data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchUsageData();
  }, [selectedProviders, selectedFileTypes]);


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
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Usage Chart */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="border-0 min-h-auto pt-6 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">API Usage</CardTitle>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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
                      <div className="text-sm font-medium text-muted-foreground mb-1">Total Bandwidth</div>
                      <div className="text-2xl font-bold">
                        {loading ? 'Loading...' : (
                          (() => {
                            // Calculate bandwidth in MB
                            const bandwidthMB = selectedProviders.length > 0 || selectedFileTypes.length > 0
                              ? apiUsageData.reduce((sum, month) => sum + month.bandwidth, 0)
                              : (currentUsage.totalFileSize / (1024 * 1024));
                            
                            // Auto-convert to GB if over 1000 MB
                            if (bandwidthMB > 1000) {
                              return `${(bandwidthMB / 1000).toFixed(2)} GB`;
                            } else {
                              return `${bandwidthMB.toFixed(2)} MB`;
                            }
                          })()
                        )} processed
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground mb-1">API Calls</div>
                      <div className="text-2xl font-bold">
                        {loading ? 'Loading...' : (
                          selectedProviders.length > 0 || selectedFileTypes.length > 0
                            ? apiUsageData.reduce((sum, month) => sum + month.apiCalls, 0).toLocaleString()
                            : currentUsage.totalRequests.toLocaleString()
                        )} requests
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Success Rate</div>
                      <div className="text-2xl font-bold">
                        {loading ? 'Loading...' : (
                          <>
                            {selectedProviders.length > 0 || selectedFileTypes.length > 0
                              ? apiUsageData.length > 0 
                                ? Math.round(apiUsageData.reduce((sum, month) => sum + month.successRate, 0) / apiUsageData.length)
                                : 0
                              : currentUsage.totalRequests > 0 
                                ? Math.round((currentUsage.successfulRequests / currentUsage.totalRequests) * 100)
                                : 0
                            }%
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="relative h-[300px] px-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-muted-foreground">Loading chart data...</div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-red-500">Error: {error}</div>
                    </div>
                  ) : apiUsageData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-muted-foreground">No data available for the selected period</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={apiUsageData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        {/* Gradient */}
                        <defs>
                          <linearGradient id="uploadsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartConfig.uploads.color} stopOpacity={0.15} />
                            <stop offset="100%" stopColor={chartConfig.uploads.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray="4 12"
                          stroke="var(--input)"
                          strokeOpacity={1}
                          horizontal={true}
                          vertical={false}
                        />

                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                          tickMargin={12}
                        />

                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `${value}`}
                          domain={[0, 'dataMax + 100']}
                          tickCount={6}
                          tickMargin={12}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {/* Area under line */}
                        <Area
                          type="monotone"
                          dataKey="uploads"
                          stroke="transparent"
                          fill="url(#uploadsGradient)"
                          strokeWidth={0}
                          dot={false}
                        />

                        {/* Main line */}
                        <Line
                          type="monotone"
                          dataKey="uploads"
                          stroke={chartConfig.uploads.color}
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            fill: chartConfig.uploads.color,
                            stroke: 'white',
                            strokeWidth: 2,
                          }}
                          activeDot={{
                            r: 6,
                            fill: chartConfig.uploads.color,
                            stroke: 'white',
                            strokeWidth: 2,
                          }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}