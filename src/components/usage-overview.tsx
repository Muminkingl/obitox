/**
 * Usage Overview Component
 * 
 * Shows current API usage with progress bar and warnings
 * Uses real data from /api/usage endpoint
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, AlertTriangle, Calendar, Clock } from 'lucide-react';

interface UsageData {
    tier: string;
    plan_name: string;
    monthly_price: number;
    requests_used: number;
    requests_limit: number;
    requests_remaining: number;
    usage_percent: number;
    billing_cycle_start: string;
    billing_cycle_end: string;
}

interface UsageOverviewProps {
    data: UsageData;
}

export function UsageOverview({ data }: UsageOverviewProps) {
    const {
        tier,
        plan_name,
        monthly_price,
        requests_used,
        requests_limit,
        requests_remaining,
        usage_percent,
        billing_cycle_end
    } = data;

    // Determine status
    const getStatus = () => {
        if (usage_percent >= 90) return { color: 'destructive', label: 'Critical', icon: '🔴' };
        if (usage_percent >= 75) return { color: 'warning', label: 'High', icon: '🟡' };
        if (usage_percent >= 50) return { color: 'default', label: 'Moderate', icon: '🔵' };
        return { color: 'default', label: 'Good', icon: '🟢' };
    };

    const status = getStatus();
    const resetDate = new Date(billing_cycle_end).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">API Usage This Month</CardTitle>
                    <Badge variant="outline" className="text-sm">
                        {plan_name} {monthly_price > 0 && `- $${monthly_price}/mo`}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Main Usage Display */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-gray-500" />
                            <span className="font-semibold text-3xl">
                                {requests_used.toLocaleString()}
                            </span>
                            <span className="text-gray-500">/ {requests_limit.toLocaleString()}</span>
                        </div>
                        <span className="text-2xl">{status.icon}</span>
                    </div>

                    <Progress value={usage_percent} className="h-3" />

                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{requests_remaining.toLocaleString()} requests remaining</span>
                        <span className="font-medium">{usage_percent.toFixed(1)}% used</span>
                    </div>
                </div>

                {/* Warning Alert */}
                {usage_percent >= 75 && (
                    <Alert variant={usage_percent >= 90 ? "destructive" : "default"}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            {usage_percent >= 90 ? (
                                <>
                                    <strong>Critical:</strong> You've used {usage_percent.toFixed(0)}% of your monthly limit.
                                    {tier === 'free' && ' Upgrade to Pro for 50x more requests!'}
                                </>
                            ) : (
                                <>
                                    <strong>Warning:</strong> You're at {usage_percent.toFixed(0)}% of your limit.
                                    {tier === 'free' && ' Consider upgrading to avoid hitting the cap.'}
                                </>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Billing Cycle */}
                <div className="flex items-center gap-4 pt-3 border-t text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Resets on:</span>
                    </div>
                    <span className="font-medium">{resetDate}</span>
                </div>
            </CardContent>
        </Card>
    );
}
