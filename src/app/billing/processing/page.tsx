'use client';

/**
 * Payment Processing Page
 * /billing/processing?referenceId=xxx
 * 
 * Shown after user redirects from Wayl
 * Polls backend to check payment status
 * Webhook handles actual account activation
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentProcessingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const referenceId = searchParams.get('referenceId');

    const [status, setStatus] = useState<'checking' | 'completed' | 'failed' | 'cancelled' | 'expired'>('checking');
    const [pollCount, setPollCount] = useState(0);

    useEffect(() => {
        if (!referenceId) {
            router.push('/dashboard');
            return;
        }

        // Poll for payment status every 3 seconds
        const checkStatus = async () => {
            try {
                const response = await fetch(`/api/billing/check-status?referenceId=${referenceId}`);
                const data = await response.json();

                if (data.success) {
                    if (data.status === 'completed') {
                        setStatus('completed');
                        // Redirect to dashboard after 2 seconds
                        setTimeout(() => router.push('/dashboard'), 2000);
                    } else if (data.status === 'failed') {
                        setStatus('failed');
                    } else if (data.status === 'cancelled') {
                        setStatus('cancelled');
                    } else if (data.status === 'expired') {
                        setStatus('expired');
                    }
                }
            } catch (error) {
                console.error('Failed to check payment status:', error);
            }
        };

        // Initial check
        checkStatus();

        // Poll every 3 seconds for up to 2 minutes
        const interval = setInterval(() => {
            setPollCount(prev => prev + 1);
            checkStatus();
        }, 3000);

        // Stop polling after 2 minutes (40 polls)
        const timeout = setTimeout(() => {
            clearInterval(interval);
            if (status === 'checking') {
                setStatus('expired');
            }
        }, 120000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [referenceId, router, status]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    {status === 'checking' && (
                        <>
                            <div className="flex justify-center mb-4">
                                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                            </div>
                            <CardTitle>Processing Your Payment</CardTitle>
                            <CardDescription>
                                Please wait while we confirm your payment...
                                <br />
                                <span className="text-xs text-muted-foreground">
                                    Checking status ({pollCount} of 40)
                                </span>
                            </CardDescription>
                        </>
                    )}

                    {status === 'completed' && (
                        <>
                            <div className="flex justify-center mb-4">
                                <CheckCircle2 className="h-16 w-16 text-green-600" />
                            </div>
                            <CardTitle className="text-green-600">Payment Successful!</CardTitle>
                            <CardDescription>
                                Your account has been upgraded successfully.
                                <br />
                                Redirecting to dashboard...
                            </CardDescription>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <div className="flex justify-center mb-4">
                                <XCircle className="h-16 w-16 text-red-600" />
                            </div>
                            <CardTitle className="text-red-600">Payment Failed</CardTitle>
                            <CardDescription>
                                Your payment was rejected. Please try again or contact support.
                            </CardDescription>
                        </>
                    )}

                    {status === 'cancelled' && (
                        <>
                            <div className="flex justify-center mb-4">
                                <AlertCircle className="h-16 w-16 text-orange-600" />
                            </div>
                            <CardTitle className="text-orange-600">Payment Cancelled</CardTitle>
                            <CardDescription>
                                You cancelled the payment. No charges were made.
                            </CardDescription>
                        </>
                    )}

                    {status === 'expired' && (
                        <>
                            <div className="flex justify-center mb-4">
                                <AlertCircle className="h-16 w-16 text-gray-600" />
                            </div>
                            <CardTitle className="text-gray-600">Payment Expired</CardTitle>
                            <CardDescription>
                                The payment link has expired. Please try again.
                            </CardDescription>
                        </>
                    )}
                </CardHeader>

                {status !== 'checking' && status !== 'completed' && (
                    <CardContent>
                        <Button
                            className="w-full"
                            onClick={() => router.push('/dashboard')}
                        >
                            Return to Dashboard
                        </Button>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
