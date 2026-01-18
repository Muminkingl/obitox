/**
 * Custom Hook: useUnreadAuditCount
 * 
 * Performance Optimizations:
 * - Client-side caching with 60s stale time
 * - Exponential backoff on errors
 * - Automatic polling with smart intervals
 * - Shared state across components (single fetch)
 */

import { useState, useEffect, useCallback, useRef } from 'react';

type UnreadData = {
    unreadCount: number;
    latestUnread: Array<{
        id: string;
        event_type: string;
        event_category: string;
        description: string;
        created_at: string;
    }>;
};

type UseUnreadAuditCountReturn = {
    count: number;
    latestUnread: UnreadData['latestUnread'];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};

// Shared cache across all hook instances (singleton pattern)
const cache = {
    data: null as UnreadData | null,
    timestamp: 0,
    STALE_TIME: 60 * 1000, // 60 seconds
};

export function useUnreadAuditCount(): UseUnreadAuditCountReturn {
    const [count, setCount] = useState(0);
    const [latestUnread, setLatestUnread] = useState<UnreadData['latestUnread']>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pollInterval, setPollInterval] = useState(60000); // Start with 60s
    const pollTimeoutRef = useRef<NodeJS.Timeout>();

    const fetchUnreadCount = useCallback(async () => {
        try {
            // Check cache first
            const now = Date.now();
            if (cache.data && (now - cache.timestamp) < cache.STALE_TIME) {
                setCount(cache.data.unreadCount);
                setLatestUnread(cache.data.latestUnread);
                setLoading(false);
                return;
            }

            const response = await fetch('/api/audit/unread-count', {
                // Prevent browser caching
                headers: { 'Cache-Control': 'no-cache' }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch unread count');
            }

            const data = await response.json();

            if (data.success) {
                const unreadData: UnreadData = {
                    unreadCount: data.unreadCount,
                    latestUnread: data.latestUnread,
                };

                // Update cache
                cache.data = unreadData;
                cache.timestamp = Date.now();

                setCount(unreadData.unreadCount);
                setLatestUnread(unreadData.latestUnread);
                setError(null);

                // Reset poll interval on success
                setPollInterval(60000);
            }
        } catch (err: any) {
            console.error('Failed to fetch unread count:', err);
            setError(err.message);

            // Exponential backoff on error (max 5 minutes)
            setPollInterval((prev) => Math.min(prev * 2, 300000));
        } finally {
            setLoading(false);
        }
    }, []);

    const refresh = useCallback(async () => {
        // Force cache invalidation
        cache.timestamp = 0;
        await fetchUnreadCount();
    }, [fetchUnreadCount]);

    useEffect(() => {
        // Initial fetch
        fetchUnreadCount();

        // Setup polling
        const startPolling = () => {
            pollTimeoutRef.current = setTimeout(() => {
                fetchUnreadCount();
                startPolling(); // Schedule next poll
            }, pollInterval);
        };

        startPolling();

        // Cleanup
        return () => {
            if (pollTimeoutRef.current) {
                clearTimeout(pollTimeoutRef.current);
            }
        };
    }, [fetchUnreadCount, pollInterval]);

    return {
        count,
        latestUnread,
        loading,
        error,
        refresh,
    };
}
