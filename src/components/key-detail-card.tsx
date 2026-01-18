/**
 * API Key Detail Card
 * 
 * Shows detailed stats for a single API key:
 * - Usage progress (requests used/limit)
 * - Created date
 * - Last used timestamp
 * - Request count
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface ApiKeyStats {
    id: string;
    name: string;
    key_value: string;
    created_at: string;
    last_used_at: string | null;
    requests_used?: number;
    requests_limit?: number;
}

interface KeyDetailCardProps {
    apiKey: ApiKeyStats;
    className?: string;
}

export function KeyDetailCard({ apiKey, className }: KeyDetailCardProps) {
    // Default values if not provided
    const requestsUsed = apiKey.requests_used ?? 0;
    const requestsLimit = apiKey.requests_limit ?? 1000;
    const usagePercent = (requestsUsed / requestsLimit) * 100;

    // Format dates
    const createdDate = new Date(apiKey.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const lastUsed = apiKey.last_used_at
        ? new Date(apiKey.last_used_at).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'Never used';

    // Usage status
    const getUsageStatus = () => {
        if (usagePercent >= 90) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Critical' };
        if (usagePercent >= 75) return { color: 'text-amber-600', bg: 'bg-amber-100', label: 'High' };
        if (usagePercent >= 50) return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Moderate' };
        return { color: 'text-green-600', bg: 'bg-green-100', label: 'Good' };
    };

    const status = getUsageStatus();

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                    <Badge variant="outline" className={`${status.color} ${status.bg} border-none`}>
                        {status.label}
                    </Badge>
                </div>
                <p className="text-xs text-gray-500 font-mono">{apiKey.key_value}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Usage Stats */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">API Usage</span>
                        </div>
                        <span className="text-gray-600">
                            {requestsUsed.toLocaleString()} / {requestsLimit.toLocaleString()}
                        </span>
                    </div>
                    <Progress value={usagePercent} className="h-2" />
                    <p className="text-xs text-gray-500">
                        {(100 - usagePercent).toFixed(1)}% remaining
                    </p>
                </div>

                {/* Warning if near limit */}
                {usagePercent >= 75 && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                        <div className="flex-1 text-xs text-amber-800">
                            <p className="font-medium">
                                {usagePercent >= 90 ? 'Critical: ' : 'Warning: '}
                                You're at {usagePercent.toFixed(0)}% of your limit
                            </p>
                            <p className="text-amber-700 mt-1">
                                Consider upgrading your plan or contact support.
                            </p>
                        </div>
                    </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span>Created</span>
                        </div>
                        <p className="text-sm font-medium">{createdDate}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Last Used</span>
                        </div>
                        <p className="text-sm font-medium">{lastUsed}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
