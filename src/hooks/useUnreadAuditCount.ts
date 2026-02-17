'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseUnreadAuditCountResult {
    count: number;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useUnreadAuditCount(
    intervalMs: number = 30000
): UseUnreadAuditCountResult {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCount = useCallback(async () => {
        try {
            const response = await fetch('/api/audit/unread-count');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setCount(data.count ?? 0);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, intervalMs);
        return () => clearInterval(interval);
    }, [fetchCount, intervalMs]);

    return { count, loading, error, refetch: fetchCount };
}
