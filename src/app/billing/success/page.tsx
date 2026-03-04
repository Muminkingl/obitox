'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

type VerificationState = 'verifying' | 'success' | 'error';

export default function BillingSuccessPage() {
    const router = useRouter();
    const [state, setState] = useState<VerificationState>('verifying');
    const [errorMessage, setErrorMessage] = useState('');
    const [planName, setPlanName] = useState('');

    useEffect(() => {
        verifyPayment();
    }, []);

    async function verifyPayment() {
        try {
            const response = await fetch('/api/billing/verify', {
                method: 'POST',
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setState('success');
                setPlanName(data.plan);
                toast.success('Payment verified! Your account has been upgraded.');

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                setState('error');
                setErrorMessage(data.error || 'Payment verification failed');

                // Show hint if available
                if (data.hint) {
                    toast.error(data.hint);
                }
            }
        } catch (error) {
            console.error('Verification error:', error);
            setState('error');
            setErrorMessage('Unable to verify payment. Please contact support.');
            toast.error('Verification failed. Please try again or contact support.');
        }
    }

    function handleRetry() {
        setState('verifying');
        setErrorMessage('');
        verifyPayment();
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    {state === 'verifying' && (
                        <>
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Verifying Payment</CardTitle>
                            <CardDescription>
                                Please wait while we confirm your payment...
                            </CardDescription>
                        </>
                    )}

                    {state === 'success' && (
                        <>
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                                Payment Successful!
                            </CardTitle>
                            <CardDescription>
                                Your account has been upgraded to <strong className="capitalize">{planName}</strong> plan
                            </CardDescription>
                        </>
                    )}

                    {state === 'error' && (
                        <>
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                                <XCircle className="h-8 w-8 text-destructive" />
                            </div>
                            <CardTitle className="text-2xl text-destructive">
                                Verification Failed
                            </CardTitle>
                            <CardDescription className="text-destructive/80">
                                {errorMessage}
                            </CardDescription>
                        </>
                    )}
                </CardHeader>

                <CardContent>
                    {state === 'verifying' && (
                        <div className="space-y-2 text-center text-sm text-muted-foreground">
                            <p>⏳ Contacting payment provider...</p>
                            <p>📋 Checking payment status...</p>
                            <p>🔄 Updating your account...</p>
                        </div>
                    )}

                    {state === 'success' && (
                        <div className="space-y-4">
                            <div className="rounded-lg bg-green-50 dark:bg-green-900/10 p-4 text-sm text-green-800 dark:text-green-200">
                                <p className="font-medium mb-2">✅ What's next?</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• Redirecting you to dashboard...</li>
                                    <li>• Your new limits are now active</li>
                                    <li>• Check your email for receipt</li>
                                </ul>
                            </div>

                            <Button
                                onClick={() => router.push('/dashboard')}
                                className="w-full"
                            >
                                Go to Dashboard
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {state === 'error' && (
                        <div className="space-y-4">
                            <div className="rounded-lg bg-destructive/10 p-4 text-sm">
                                <p className="font-medium mb-2 text-destructive">What can you do?</p>
                                <ul className="space-y-1 text-xs text-muted-foreground">
                                    <li>• Click "Retry Verification" below</li>
                                    <li>• Contact support if issue persists</li>
                                    <li>• Check your payment was processed</li>
                                </ul>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleRetry}
                                    variant="default"
                                    className="flex-1"
                                >
                                    Retry Verification
                                </Button>
                                <Button
                                    onClick={() => router.push('/dashboard')}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Back to Dashboard
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
