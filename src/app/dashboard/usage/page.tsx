'use client';

import React, { useState } from 'react';
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

// API usage data for 12 months with storage and file type breakdowns
const apiUsageData = [
  { 
    month: 'JAN', 
    uploads: 520, 
    bandwidth: 1.1, 
    apiCalls: 520, 
    successRate: 98.5,
    providers: {
      aws: 360,
      vercel: 120,
      firebase: 40
    },
    fileTypes: {
      images: 350,
      documents: 120,
      videos: 40,
      other: 10
    }
  },
  { 
    month: 'FEB', 
    uploads: 610, 
    bandwidth: 1.3, 
    apiCalls: 610, 
    successRate: 98.7,
    providers: {
      aws: 420,
      vercel: 150,
      firebase: 40
    },
    fileTypes: {
      images: 410,
      documents: 140,
      videos: 45,
      other: 15
    }
  },
  { 
    month: 'MAR', 
    uploads: 580, 
    bandwidth: 1.2, 
    apiCalls: 580, 
    successRate: 99.0,
    providers: {
      aws: 400,
      vercel: 140,
      firebase: 40
    },
    fileTypes: {
      images: 390,
      documents: 130,
      videos: 45,
      other: 15
    }
  },
  { 
    month: 'APR', 
    uploads: 720, 
    bandwidth: 1.5, 
    apiCalls: 720, 
    successRate: 98.9,
    providers: {
      aws: 500,
      vercel: 170,
      firebase: 50
    },
    fileTypes: {
      images: 480,
      documents: 170,
      videos: 55,
      other: 15
    }
  },
  { 
    month: 'MAY', 
    uploads: 850, 
    bandwidth: 1.8, 
    apiCalls: 850, 
    successRate: 99.1,
    providers: {
      aws: 580,
      vercel: 210,
      firebase: 60
    },
    fileTypes: {
      images: 570,
      documents: 195,
      videos: 65,
      other: 20
    }
  },
  { 
    month: 'JUN', 
    uploads: 920, 
    bandwidth: 1.9, 
    apiCalls: 920, 
    successRate: 99.3,
    providers: {
      aws: 630,
      vercel: 220,
      firebase: 70
    },
    fileTypes: {
      images: 620,
      documents: 210,
      videos: 70,
      other: 20
    }
  },
  { 
    month: 'JUL', 
    uploads: 980, 
    bandwidth: 2.0, 
    apiCalls: 980, 
    successRate: 99.1,
    providers: {
      aws: 680,
      vercel: 230,
      firebase: 70
    },
    fileTypes: {
      images: 660,
      documents: 225,
      videos: 75,
      other: 20
    }
  },
  { 
    month: 'AUG', 
    uploads: 1050, 
    bandwidth: 2.1, 
    apiCalls: 1050, 
    successRate: 99.0,
    providers: {
      aws: 720,
      vercel: 260,
      firebase: 70
    },
    fileTypes: {
      images: 700,
      documents: 240,
      videos: 85,
      other: 25
    }
  },
  { 
    month: 'SEP', 
    uploads: 1120, 
    bandwidth: 2.2, 
    apiCalls: 1120, 
    successRate: 99.2,
    providers: {
      aws: 770,
      vercel: 270,
      firebase: 80
    },
    fileTypes: {
      images: 750,
      documents: 260,
      videos: 90,
      other: 20
    }
  },
  { 
    month: 'OCT', 
    uploads: 1180, 
    bandwidth: 2.3, 
    apiCalls: 1180, 
    successRate: 99.3,
    providers: {
      aws: 810,
      vercel: 290,
      firebase: 80
    },
    fileTypes: {
      images: 790,
      documents: 270,
      videos: 95,
      other: 25
    }
  },
  { 
    month: 'NOV', 
    uploads: 1220, 
    bandwidth: 2.4, 
    apiCalls: 1220, 
    successRate: 99.2,
    providers: {
      aws: 840,
      vercel: 300,
      firebase: 80
    },
    fileTypes: {
      images: 815,
      documents: 280,
      videos: 100,
      other: 25
    }
  },
  { 
    month: 'DEC', 
    uploads: 1247, 
    bandwidth: 2.3, 
    apiCalls: 1247, 
    successRate: 99.2,
    providers: {
      aws: 856,
      vercel: 301,
      firebase: 90
    },
    fileTypes: {
      images: 835,
      documents: 287,
      videos: 100,
      other: 25
    }
  },
];

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
                  ? `${entry.value} GB`
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

// Period configuration
const PERIODS = {
  '1m': {
    key: '1m',
    label: '1 month',
    dateRange: 'Dec 01 - Dec 31, 2023',
  },
  '3m': {
    key: '3m',
    label: '3 months',
    dateRange: 'Oct 01 - Dec 31, 2023',
  },
  '6m': {
    key: '6m',
    label: '6 months',
    dateRange: 'Jul 01 - Dec 31, 2023',
  },
  '12m': {
    key: '12m',
    label: '12 months',
    dateRange: 'Jan 01 - Dec 31, 2023',
  },
} as const;

type PeriodKey = keyof typeof PERIODS;

// Storage provider filter data
const storageProviders = [
  { id: 'aws', label: 'AWS S3', value: 'aws', percentage: 69, detail: '856' },
  { id: 'vercel', label: 'Vercel Blob', value: 'vercel', percentage: 24, detail: '301' },
  { id: 'firebase', label: 'Firebase', value: 'firebase', percentage: 7, detail: '90' },
];

// File type filter data
const fileTypes = [
  { id: 'images', label: 'Images', value: 'images', percentage: 67, detail: '(jpg, png, gif)' },
  { id: 'documents', label: 'Documents', value: 'documents', percentage: 23, detail: '(pdf, docx)' },
  { id: 'videos', label: 'Videos', value: 'videos', percentage: 8, detail: '(mp4, mov)' },
  { id: 'other', label: 'Other', value: 'other', percentage: 2, detail: '' },
];

export default function UsagePage() {
  const [selectedMetric, setSelectedMetric] = useState<'uploads' | 'bandwidth' | 'apiCalls' | 'successRate'>('uploads');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2023, 11, 1), // Dec 1, 2023
    to: new Date(2023, 11, 31),  // Dec 31, 2023
  });
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  
  // Filter data based on selected date range, storage providers, and file types
  const getFilteredData = () => {
    if (!dateRange.from) return [apiUsageData[apiUsageData.length - 1]];
    
    // Filter by date range
    let dateFilteredData;
    // If selecting a specific date range, we would normally filter based on actual dates
    // For this demo, we'll map the date range to our predefined periods
    const daysDifference = dateRange.to 
      ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0;
    
    if (daysDifference <= 1) dateFilteredData = [apiUsageData[apiUsageData.length - 1]];
    else if (daysDifference <= 3) dateFilteredData = apiUsageData.slice(-3);
    else if (daysDifference <= 15) dateFilteredData = apiUsageData.slice(-6);
    else if (daysDifference <= 30) dateFilteredData = apiUsageData.slice(-12);
    else dateFilteredData = apiUsageData;

    // Apply storage provider and file type filters
    if (selectedProviders.length === 0 && selectedFileTypes.length === 0) {
      return dateFilteredData;
    }

    return dateFilteredData.map(dataPoint => {
      // Create a new data point with the same month and base metrics
      const newDataPoint = { 
        ...dataPoint,
        uploads: 0, // Reset uploads to recalculate based on filters
      };
      
      // Filter by storage provider
      let providerFiltered = false;
      if (selectedProviders.length > 0) {
        providerFiltered = true;
        for (const provider of selectedProviders) {
          newDataPoint.uploads += dataPoint.providers[provider] || 0;
        }
      } else {
        // If no providers selected, include all providers
        newDataPoint.uploads = Object.values(dataPoint.providers).reduce((sum, val) => sum + val, 0);
      }
      
      // Filter by file type
      let fileTypeFiltered = false;
      if (selectedFileTypes.length > 0) {
        fileTypeFiltered = true;
        let filteredByFileType = 0;
        for (const fileType of selectedFileTypes) {
          filteredByFileType += dataPoint.fileTypes[fileType] || 0;
        }
        
        // If both filters are active, we need to apply proportional filtering
        if (providerFiltered) {
          // Calculate the proportion of files that match the file type filter
          const fileTypeProportion = filteredByFileType / Object.values(dataPoint.fileTypes).reduce((sum, val) => sum + val, 0);
          newDataPoint.uploads = Math.round(newDataPoint.uploads * fileTypeProportion);
        } else {
          newDataPoint.uploads = filteredByFileType;
        }
      }
      
      return newDataPoint;
    });
  };

  const filteredData = getFilteredData();
  
  // Format the date range for display
  const dateRangeText = dateRange.from && dateRange.to
    ? `${dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : 'Select date range';
  
  // Calculate totals based on the most recent month
  const latestMonth = apiUsageData[apiUsageData.length - 1];
  
  // Process chart data to include provider or file type breakdowns when filters are selected
  const getChartData = () => {
    // When no filters are selected, just return the filtered data
    if (selectedProviders.length === 0 && selectedFileTypes.length === 0) {
      return filteredData;
    }
    
    // Create a copy of the filtered data with additional breakdown properties
    return filteredData.map(dataPoint => {
      const enhancedDataPoint = { ...dataPoint };
      
      // Add individual provider data when provider filter is active
      if (selectedProviders.length > 0) {
        selectedProviders.forEach(provider => {
          enhancedDataPoint[`provider_${provider}`] = dataPoint.providers[provider] || 0;
        });
      }
      
      // Add individual file type data when file type filter is active
      if (selectedFileTypes.length > 0) {
        selectedFileTypes.forEach(fileType => {
          enhancedDataPoint[`fileType_${fileType}`] = dataPoint.fileTypes[fileType] || 0;
        });
      }
      
      return enhancedDataPoint;
    });
  };
  
  const chartData = getChartData();
  
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
                    onDateRangeChange={setDateRange}
                    className="w-auto"
                  />
                  <FilterButton
                    icon={<Database className="h-4 w-4" />}
                    title="Storage Provider"
                    items={storageProviders}
                    selectedItems={selectedProviders}
                    onSelectionChange={setSelectedProviders}
                  />
                  <FilterButton
                    icon={<FileType className="h-4 w-4" />}
                    title="File Types"
                    items={fileTypes}
                    selectedItems={selectedFileTypes}
                    onSelectionChange={setSelectedFileTypes}
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
                        {filteredData[filteredData.length - 1].uploads.toLocaleString()} files
                        {(selectedProviders.length > 0 || selectedFileTypes.length > 0) && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Filtered from {latestMonth.uploads.toLocaleString()} total files
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Total Bandwidth</div>
                      <div className="text-2xl font-bold">
                        {(filteredData[filteredData.length - 1].bandwidth * (filteredData[filteredData.length - 1].uploads / latestMonth.uploads)).toFixed(1)} GB processed
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground mb-1">API Calls</div>
                      <div className="text-2xl font-bold">{filteredData[filteredData.length - 1].uploads.toLocaleString()} requests</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Success Rate</div>
                      <div className="text-2xl font-bold">
                        {filteredData[filteredData.length - 1].successRate}%
                        <Badge className="ml-2 bg-green-500/10 text-green-500">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          0.2%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="relative h-[300px] px-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={filteredData}
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
                      
                      {/* Provider breakdown lines when filters are applied */}
                      {selectedProviders.length > 0 && selectedProviders.map((provider, index) => (
                        <Line
                          key={provider}
                          type="monotone"
                          dataKey={`provider_${provider}`}
                          name={storageProviders.find(p => p.id === provider)?.label || provider}
                          stroke={['#FF6B6B', '#4ECDC4', '#FFA800'][index % 3]}
                          strokeWidth={2}
                          strokeDasharray={index === 0 ? "" : "3 3"}
                          dot={false}
                        />
                      ))}
                      
                      {/* File type breakdown lines when filters are applied */}
                      {selectedFileTypes.length > 0 && selectedFileTypes.map((fileType, index) => (
                        <Line
                          key={fileType}
                          type="monotone"
                          dataKey={`fileType_${fileType}`}
                          name={fileTypes.find(f => f.id === fileType)?.label || fileType}
                          stroke={['#6A0572', '#AB83A1', '#F7AEF8', '#B3C2F2'][index % 4]}
                          strokeWidth={2}
                          strokeDasharray="5 2"
                          dot={false}
                        />
                      ))}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
