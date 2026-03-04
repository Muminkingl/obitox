'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Info,
    ExternalLink,
    CheckCheck,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type AuditNotification = {
    id: string;
    event_type: string;
    event_category: 'info' | 'warning' | 'critical';
    description: string;
    created_at: string;
    is_read: boolean;
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<AuditNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    async function fetchNotifications() {
        try {
            const response = await fetch('/api/audit-logs?limit=50');
            const data = await response.json();

            if (response.ok) {
                setNotifications(data.logs || []);
            } else {
                console.error('Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }

    const markAsRead = useCallback(async (logId: string) => {
        try {
            const response = await fetch('/api/audit/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logIds: [logId] }),
            });

            if (response.ok) {
                // Update local state
                setNotifications((prev) =>
                    prev.map((n) => (n.id === logId ? { ...n, is_read: true } : n))
                );
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    async function markAllAsRead() {
        setMarkingAll(true);
        try {
            const response = await fetch('/api/audit/mark-all-read', {
                method: 'POST',
            });

            const data = await response.json();

            if (response.ok) {
                // Update all to read
                setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
                toast.success(`Marked ${data.markedCount} notifications as read`);

                // No page reload needed! State updates automatically
            } else {
                toast.error('Failed to mark all as read');
            }
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            toast.error('An error occurred');
        } finally {
            setMarkingAll(false);
        }
    }

    function getCategoryIcon(category: string) {
        switch (category) {
            case 'critical':
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-orange-600" />;
            default:
                return <Info className="h-5 w-5 text-blue-600" />;
        }
    }

    function formatEventType(eventType: string) {
        return eventType
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString();
    }

    // Group notifications by category
    const grouped = {
        critical: notifications.filter((n) => n.event_category === 'critical'),
        warning: notifications.filter((n) => n.event_category === 'warning'),
        info: notifications.filter((n) => n.event_category === 'info'),
    };

    const unreadCount = notifications.filter((n) => !n.is_read || n.is_read === null).length;

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">Dashboard</BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Notifications</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
                            <p className="text-muted-foreground">
                                Stay informed about system events and alerts
                                {unreadCount > 0 && ` • ${unreadCount} unread`}
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <Button
                                onClick={markAllAsRead}
                                disabled={markingAll}
                                variant="outline"
                                size="sm"
                            >
                                <CheckCheck className="mr-2 h-4 w-4" />
                                {markingAll ? 'Marking...' : 'Mark all as read'}
                            </Button>
                        )}
                    </div>

                    {loading ? (
                        <div className="space-y-6">
                            {/* Critical Skeleton */}
                            <div>
                                <div className="h-6 bg-muted rounded w-32 mb-3 animate-pulse" />
                                <div className="space-y-2">
                                    {[...Array(2)].map((_, i) => (
                                        <Card key={i} className="border-red-200 dark:border-red-900">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900 animate-pulse" />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
                                                        <div className="h-4 bg-muted rounded w-full animate-pulse" />
                                                        <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Warning Skeleton */}
                            <div>
                                <div className="h-6 bg-muted rounded w-32 mb-3 animate-pulse" />
                                <div className="space-y-2">
                                    {[...Array(1)].map((_, i) => (
                                        <Card key={i} className="border-orange-200 dark:border-orange-900">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="h-5 w-5 rounded-full bg-orange-100 dark:bg-orange-900 animate-pulse" />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-5 bg-muted rounded w-2/3 animate-pulse" />
                                                        <div className="h-4 bg-muted rounded w-full animate-pulse" />
                                                        <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Info Skeleton */}
                            <div>
                                <div className="h-6 bg-muted rounded w-24 mb-3 animate-pulse" />
                                <div className="space-y-2">
                                    {[...Array(3)].map((_, i) => (
                                        <Card key={i}>
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900 animate-pulse" />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-5 bg-muted rounded w-1/2 animate-pulse" />
                                                        <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                                                        <div className="h-3 bg-muted rounded w-16 animate-pulse" />
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-medium">You're all caught up!</p>
                                <p className="text-sm text-muted-foreground">
                                    No notifications to display
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {/* Critical Notifications */}
                            {grouped.critical.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                        Critical ({grouped.critical.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {grouped.critical.map((notification) => (
                                            <Card
                                                key={notification.id}
                                                className={
                                                    !notification.is_read
                                                        ? 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20'
                                                        : ''
                                                }
                                            >
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3 flex-1">
                                                            {getCategoryIcon(notification.event_category)}
                                                            <div className="flex-1">
                                                                <CardTitle className="text-base">
                                                                    {formatEventType(notification.event_type)}
                                                                </CardTitle>
                                                                <CardDescription className="mt-1">
                                                                    {notification.description}
                                                                </CardDescription>
                                                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                                    <span>{formatDate(notification.created_at)}</span>
                                                                    <Link
                                                                        href="/dashboard/audit"
                                                                        className="flex items-center gap-1 hover:text-primary"
                                                                        onClick={() => markAsRead(notification.id)}
                                                                    >
                                                                        View in Audit <ExternalLink className="h-3 w-3" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {!notification.is_read && (
                                                            <div className="h-2 w-2 rounded-full bg-red-600" />
                                                        )}
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Warning Notifications */}
                            {grouped.warning.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                                        Warning ({grouped.warning.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {grouped.warning.map((notification) => (
                                            <Card
                                                key={notification.id}
                                                className={
                                                    !notification.is_read
                                                        ? 'border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20'
                                                        : ''
                                                }
                                            >
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3 flex-1">
                                                            {getCategoryIcon(notification.event_category)}
                                                            <div className="flex-1">
                                                                <CardTitle className="text-base">
                                                                    {formatEventType(notification.event_type)}
                                                                </CardTitle>
                                                                <CardDescription className="mt-1">
                                                                    {notification.description}
                                                                </CardDescription>
                                                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                                    <span>{formatDate(notification.created_at)}</span>
                                                                    <Link
                                                                        href="/dashboard/audit"
                                                                        className="flex items-center gap-1 hover:text-primary"
                                                                        onClick={() => markAsRead(notification.id)}
                                                                    >
                                                                        View in Audit <ExternalLink className="h-3 w-3" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {!notification.is_read && (
                                                            <div className="h-2 w-2 rounded-full bg-orange-600" />
                                                        )}
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Info Notifications */}
                            {grouped.info.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Info className="h-5 w-5 text-blue-600" />
                                        Info ({grouped.info.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {grouped.info.slice(0, 10).map((notification) => (
                                            <Card
                                                key={notification.id}
                                                className={!notification.is_read ? 'border-blue-200 dark:border-blue-900' : ''}
                                            >
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3 flex-1">
                                                            {getCategoryIcon(notification.event_category)}
                                                            <div className="flex-1">
                                                                <CardTitle className="text-base">
                                                                    {formatEventType(notification.event_type)}
                                                                </CardTitle>
                                                                <CardDescription className="mt-1">
                                                                    {notification.description}
                                                                </CardDescription>
                                                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                                    <span>{formatDate(notification.created_at)}</span>
                                                                    <Link
                                                                        href="/dashboard/audit"
                                                                        className="flex items-center gap-1 hover:text-primary"
                                                                        onClick={() => markAsRead(notification.id)}
                                                                    >
                                                                        View in Audit <ExternalLink className="h-3 w-3" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {!notification.is_read && (
                                                            <div className="h-2 w-2 rounded-full bg-blue-600" />
                                                        )}
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
