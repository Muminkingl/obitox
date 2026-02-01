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

            console.log('[SUBSCRIPTION CONTEXT] Checking authentication...');

            // Check if user is authenticated first
            const response = await fetch('/api/auth/session');

            if (!response.ok) {
                console.log('[SUBSCRIPTION CONTEXT] ⚠️ Not authenticated, skipping subscription fetch');
                setSubscription(null);
                setLoading(false);
                return;
            }

            const sessionData = await response.json();

            if (!sessionData?.user) {
                console.log('[SUBSCRIPTION CONTEXT] ⚠️ No user session, skipping subscription fetch');
                setSubscription(null);
                setLoading(false);
                return;
            }

            console.log('[SUBSCRIPTION CONTEXT] ✅ Authenticated, fetching subscription data...');

            const subscriptionResponse = await fetch('/api/subscription');

            if (!subscriptionResponse.ok) {
                if (subscriptionResponse.status === 429) {
                    throw new Error('Too many requests. Please wait a moment.');
                }
                throw new Error(`Failed to fetch subscription: ${subscriptionResponse.status}`);
            }

            const data = await subscriptionResponse.json();

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
