'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useSubscription } from '@/contexts/subscription-context';

interface PlanBadgeProps {
    className?: string;
}

export function PlanBadge({ className }: PlanBadgeProps) {
    // Use shared subscription context instead of fetching
    const { subscription, loading } = useSubscription();

    if (loading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;

    const tier = subscription?.data?.tier || 'free';

    const tierColors: Record<string, string> = {
        free: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
        pro: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        enterprise: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    };

    const label: Record<string, string> = {
        free: 'Free Plan',
        pro: 'Pro Plan',
        enterprise: 'Enterprise',
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                "capitalize font-medium px-2.5 py-0.5",
                tierColors[tier || 'free'],
                className
            )}
        >
            {label[tier || 'free'] || tier}
        </Badge>
    );
}
