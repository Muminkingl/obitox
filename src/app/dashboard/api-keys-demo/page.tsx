/**
 * Test/Demo Page for Key Detail Card
 * 
 * Shows how the key detail card looks with different usage levels
 * Navigate to: /dashboard/api-keys/demo
 */

'use client';

import { KeyDetailCard } from '@/components/key-detail-card';

export default function KeyDetailDemo() {
    // Mock API keys with different usage levels
    const mockKeys = [
        {
            id: '1',
            name: 'Production API',
            key_value: 'ox_a3f8d9e2b4c1...xyz9',
            created_at: '2024-01-15T10:30:00Z',
            last_used_at: '2024-01-24T14:23:00Z',
            requests_used: 842,
            requests_limit: 1000
        },
        {
            id: '2',
            name: 'Development Key',
            key_value: 'ox_b2e7c4a1d3f2...abc5',
            created_at: '2024-01-20T08:15:00Z',
            last_used_at: '2024-01-23T09:45:00Z',
            requests_used: 156,
            requests_limit: 1000
        },
        {
            id: '3',
            name: 'Critical Usage',
            key_value: 'ox_f9d8c7b6a5e4...def3',
            created_at: '2024-01-05T16:20:00Z',
            last_used_at: '2024-01-24T15:10:00Z',
            requests_used: 987,
            requests_limit: 1000
        },
        {
            id: '4',
            name: 'Unused Key',
            key_value: 'ox_e1d2c3b4a5f6...ghi7',
            created_at: '2024-01-22T12:00:00Z',
            last_used_at: null,
            requests_used: 0,
            requests_limit: 1000
        }
    ];

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">API Key Detail Cards</h1>
                <p className="text-gray-600 mt-2">Testing different usage levels and states</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockKeys.map((key) => (
                    <KeyDetailCard key={key.id} apiKey={key} />
                ))}
            </div>
        </div>
    );
}
