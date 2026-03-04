'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Key,
    Trash2,
    Edit,
    AlertTriangle,
    CheckCircle2,
    AlertCircle,
    FileText,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type AuditLog = {
    id: string;
    user_id: string;
    resource_type: string;
    resource_id: string | null;
    event_type: string;
    event_category: string;
    description: string;
    metadata: Record<string, any>;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    is_read?: boolean;  // Optional because old logs might not have this field
};

export default function AuditPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');
    const [page, setPage] = useState(0);
    const pageSize = 50;

    // ✅ Debounce filter changes by 300ms to prevent spam
    const [debouncedFilter] = useDebounce(filter, 300);

    // Use debounced filter to prevent spam
    useEffect(() => {
        fetchLogs();
    }, [debouncedFilter, page]);

    // Auto-mark displayed logs as read (debounced)
    useEffect(() => {
        if (logs.length === 0 || loading) return;

        const markTimer = setTimeout(async () => {
            const unreadLogIds = logs
                .filter(log => (log.is_read === false || log.is_read === null || log.is_read === undefined) &&
                    ['warning', 'critical'].includes(log.event_category))
                .map(log => log.id);

            if (unreadLogIds.length > 0) {
                try {
                    const response = await fetch('/api/audit/mark-read', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ logIds: unreadLogIds }),
                    });

                    // Handle rate limiting gracefully
                    if (response.status === 429) {
                        console.warn('[AUDIT] Rate limited on auto-mark, will retry later');
                        return;
                    }

                    if (!response.ok) {
                        throw new Error('Failed to mark logs as read');
                    }

                    const data = await response.json();
                    console.log(`[AUDIT] ✅ Auto-marked ${data.markedCount} logs as read`);

                    // Update local state to reflect marked logs
                    setLogs(prevLogs =>
                        prevLogs.map(log =>
                            unreadLogIds.includes(log.id)
                                ? { ...log, is_read: true }
                                : log
                        )
                    );
                } catch (error) {
                    console.error('[AUDIT] Failed to auto-mark logs:', error);
                }
            }
        }, 2000); // Wait 2 seconds before marking as read

        return () => clearTimeout(markTimer);
    }, [logs, loading]);

    async function fetchLogs() {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                limit: pageSize.toString(),
                offset: (page * pageSize).toString(),
            });

            if (debouncedFilter !== 'all') {
                params.set('event_type', debouncedFilter);
            }

            console.log(`[AUDIT] Fetching logs: filter=${debouncedFilter}, page=${page}`);

            const response = await fetch(`/api/audit-logs?${params}`);

            // Handle rate limiting
            if (response.status === 429) {
                const data = await response.json();
                setError(`Rate limited. Please wait ${data.retryAfter || 60} seconds.`);
                setLogs([]);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch logs');
            }

            const data = await response.json();
            setLogs(data.logs || []);

            console.log(`[AUDIT] ✅ Fetched ${data.logs?.length || 0} logs`);

        } catch (error: any) {
            console.error('[AUDIT] Error fetching logs:', error);
            setError(error.message || 'Failed to load audit logs');
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }

    function getEventIcon(eventType: string) {
        switch (eventType) {
            case 'api_key_created':
                return <CheckCircle2 className="h-4 w-4 text-green-600" />;
            case 'api_key_deleted':
                return <Trash2 className="h-4 w-4 text-red-600" />;
            case 'api_key_renamed':
                return <Edit className="h-4 w-4 text-blue-600" />;
            case 'usage_limit_reached':
                return <AlertCircle className="h-4 w-4 text-red-600" />;
            case 'usage_warning_50_percent':
            case 'usage_warning_80_percent':
                return <AlertTriangle className="h-4 w-4 text-orange-600" />;
            default:
                return <FileText className="h-4 w-4 text-gray-600" />;
        }
    }

    function getCategoryBadge(category: string) {
        const variants = {
            info: 'default',
            warning: 'outline',
            critical: 'destructive',
        } as const;

        return (
            <Badge variant={variants[category as keyof typeof variants] || 'default'}>
                {category}
            </Badge>
        );
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
                                    <BreadcrumbPage>Audit</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
                            <p className="text-muted-foreground">View all activity on your account</p>
                        </div>

                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by event" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                <SelectItem value="api_key_created">Key Created</SelectItem>
                                <SelectItem value="api_key_deleted">Key Deleted</SelectItem>
                                <SelectItem value="api_key_renamed">Key Renamed</SelectItem>
                                <SelectItem value="usage_limit_reached">Limit Reached (100%)</SelectItem>
                                <SelectItem value="usage_warning_80_percent">80% Warning</SelectItem>
                                <SelectItem value="usage_warning_50_percent">50% Warning</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12"></TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            Loading logs...
                                        </TableCell>
                                    </TableRow>
                                ) : logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No audit logs found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>{getEventIcon(log.event_type)}</TableCell>
                                            <TableCell className="font-medium">{formatEventType(log.event_type)}</TableCell>
                                            <TableCell className="max-w-md truncate">
                                                {log.description}
                                            </TableCell>
                                            <TableCell>{getCategoryBadge(log.event_category)}</TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {formatDate(log.created_at)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {!loading && logs.length > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, page * pageSize + logs.length)} of audit logs
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={logs.length < pageSize}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
