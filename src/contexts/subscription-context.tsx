'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface SubscriptionData {
    success: boolean;
    data: {
        user_id: string;
        email: string;
        tier: string;
        plan_name: string;
        monthly_price: number;
        requests_used: number;
        requests_limit: number;
        requests_remaining: number;
        usage_percent: number;
        billing_cycle_start: string;
        billing_cycle_end: string;
        features: {
            batch_operations: boolean;
            jwt_tokens: boolean;
            advanced_analytics: boolean;
            priority_support: boolean;
            commercial_use: boolean;
            max_batch_files: number;
            max_domains: number;
            max_api_keys: number;
        };
        ban: {
            isPermanentlyBanned: boolean;
            reason: string;
            bannedAt: string;
            canAppeal: boolean;
        } | null;
    };
}

interface SubscriptionContextValue {
    subscription: SubscriptionData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubscription = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('[SUBSCRIPTION CONTEXT] Fetching subscription data...');

            const response = await fetch('/api/subscription');

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Too many requests. Please wait a moment.');
                }
                throw new Error(`Failed to fetch subscription: ${response.status}`);
            }

            const data = await response.json();

            console.log('[SUBSCRIPTION CONTEXT] ✅ Data loaded successfully');
            setSubscription(data);
        } catch (err: any) {
            console.error('[SUBSCRIPTION CONTEXT] ❌ Error:', err);
            setError(err.message || 'Failed to load subscription data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    return (
        <SubscriptionContext.Provider
            value={{
                subscription,
                loading,
                error,
                refetch: fetchSubscription
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within SubscriptionProvider');
    }
    return context;
}
