'use client';

import { AppearanceProvider } from '@/contexts/appearance-context';
import { SubscriptionProvider } from '@/contexts/subscription-context';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppearanceProvider>
            <SubscriptionProvider>
                {children}
            </SubscriptionProvider>
        </AppearanceProvider>
    );
}