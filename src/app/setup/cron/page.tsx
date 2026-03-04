/**
 * Cron Initialization Page
 * 
 * Visit this page ONCE to start the DNS verification cron job
 * After that, it runs in the background forever!
 * 
 * URL: http://localhost:3000/setup/cron
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

export default function CronSetupPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const startCron = async () => {
        setStatus('loading');
        try {
            const response = await fetch('/api/cron/start');
            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setMessage(data.message);
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to start cron');
            }
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-2xl font-bold mb-2">🔧 DNS Cron Setup</h1>
                <p className="text-gray-600 mb-6">
                    Click the button below to start the DNS verification cron job.
                    You only need to do this ONCE!
                </p>

                {status === 'idle' && (
                    <Button
                        onClick={startCron}
                        className="w-full"
                        size="lg"
                    >
                        Start DNS Verification Cron
                    </Button>
                )}

                {status === 'loading' && (
                    <div className="flex items-center justify-center space-x-2 text-blue-600">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Starting cron job...</span>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle2 className="h-6 w-6" />
                            <span className="font-semibold">Success!</span>
                        </div>
                        <p className="text-sm text-gray-600">{message}</p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                            <p className="font-semibold text-green-800 mb-2">✅ Cron job is now running!</p>
                            <p className="text-green-700">
                                The DNS verification will check pending domains every 20 minutes automatically.
                                You can close this page now!
                            </p>
                        </div>
                        <Button
                            onClick={() => window.location.href = '/dashboard/domains'}
                            variant="outline"
                            className="w-full"
                        >
                            Go to Domains →
                        </Button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-red-600">
                            <XCircle className="h-6 w-6" />
                            <span className="font-semibold">Error</span>
                        </div>
                        <p className="text-sm text-gray-600">{message}</p>
                        <Button
                            onClick={startCron}
                            variant="outline"
                            className="w-full"
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-sm mb-2">ℹ️ How it works:</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Runs every 20 minutes</li>
                        <li>• Checks pending domains for DNS records</li>
                        <li>• Updates domain status when verified</li>
                        <li>• Continues running in the background</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
