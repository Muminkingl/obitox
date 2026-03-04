/**
 * Create API Key Modal with Proof-of-Work
 * 
 * Flow:
 * 1. User enters key name
 * 2. Clicks "Create" → Solves PoW (shows progress)
 * 3. Sends solution to backend
 * 4. Shows API key + secret (ONE TIME ONLY!)
 * 
 * Security Features:
 * - PoW prevents mass key creation (~500ms per key)
 * - Secret shown only once
 * - Copy buttons for easy use
 * - Validation on key name
 */

'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Copy, Loader2, Info, AlertTriangle } from 'lucide-react';
import { solveChallenge, estimateSolvingTime } from '@/lib/pow-solver';

interface CreatedKey {
    apiKey: string;
    apiSecret: string;
    keyId: string;
}

export function CreateKeyModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [keyName, setKeyName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const [createdKey, setCreatedKey] = useState<CreatedKey | null>(null);
    const [error, setError] = useState('');
    const [copiedKey, setCopiedKey] = useState(false);
    const [copiedSecret, setCopiedSecret] = useState(false);

    const resetState = () => {
        setKeyName('');
        setIsCreating(false);
        setProgress(0);
        setStatus('');
        setCreatedKey(null);
        setError('');
        setCopiedKey(false);
        setCopiedSecret(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        resetState();
    };

    const handleCreate = async () => {
        if (!keyName.trim()) {
            setError('Please enter a key name');
            return;
        }

        if (keyName.trim().length < 3) {
            setError('Key name must be at least 3 characters');
            return;
        }

        setIsCreating(true);
        setError('');
        setProgress(0);

        try {
            // Step 1: Get challenge from backend (mock for now)
            setStatus('Getting security challenge...');

            // TODO: Replace with real API call
            // const challengeRes = await fetch('/api/v1/apikeys/challenge');
            // const { challenge, difficulty } = await challengeRes.json();

            // Mock challenge for now
            const challenge = 'mock_challenge_' + Date.now();
            const difficulty = 4;

            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network

            // Step 2: Solve PoW
            setStatus(`Solving security puzzle (difficulty: ${difficulty})...`);
            console.log('Starting PoW solver...');

            const solution = await solveChallenge(challenge, difficulty, (p) => {
                setProgress(p);
            });

            console.log('PoW solved! Solution:', solution);

            // Step 3: Create key with backend
            setStatus('Creating API key...');
            setProgress(100);

            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network

            // TODO: Replace with real API call
            // const createRes = await fetch('/api/apikeys', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ name: keyName, challenge, solution })
            // });
            // const data = await createRes.json();

            // Mock successful response
            const mockData = {
                success: true,
                apiKey: 'ox_' + Math.random().toString(36).substring(2, 34),
                apiSecret: Math.random().toString(36).substring(2, 34) + Math.random().toString(36).substring(2, 34),
                keyId: 'key_' + Date.now()
            };

            if (!mockData.success) {
                throw new Error('Failed to create API key');
            }

            setCreatedKey({
                apiKey: mockData.apiKey,
                apiSecret: mockData.apiSecret,
                keyId: mockData.keyId
            });

            setStatus('Success!');

        } catch (error: any) {
            console.error('Error creating key:', error);
            setError(error.message || 'Failed to create API key');
        } finally {
            setIsCreating(false);
        }
    };

    const copyToClipboard = async (text: string, type: 'key' | 'secret') => {
        try {
            await navigator.clipboard.writeText(text);
            if (type === 'key') {
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
            } else {
                setCopiedSecret(true);
                setTimeout(() => setCopiedSecret(false), 2000);
            }
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>+ Create API Key</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {createdKey ? '✅ API Key Created!' : '🔑 Create New API Key'}
                    </DialogTitle>
                </DialogHeader>

                {!createdKey ? (
                    <div className="space-y-4">
                        {/* Key Name Input */}
                        <div className="space-y-2">
                            <Label htmlFor="keyName">Key Name</Label>
                            <Input
                                id="keyName"
                                placeholder="e.g., Production, Development"
                                value={keyName}
                                onChange={(e) => setKeyName(e.target.value)}
                                disabled={isCreating}
                                maxLength={30}
                            />
                            <p className="text-xs text-gray-500">
                                Give your key a memorable name (3-30 characters)
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Progress UI */}
                        {isCreating && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>{status}</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Progress</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                </div>
                                {progress < 100 && progress > 0 && (
                                    <p className="text-xs text-gray-500">
                                        <Info className="h-3 w-3 inline mr-1" />
                                        This prevents abuse by making mass key creation expensive
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Create Button */}
                        <Button
                            onClick={handleCreate}
                            disabled={isCreating || !keyName.trim()}
                            className="w-full"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create API Key'
                            )}
                        </Button>

                        <p className="text-xs text-gray-500">
                            <Info className="h-3 w-3 inline mr-1" />
                            Creating a key takes ~{estimateSolvingTime(4)}ms to prevent abuse
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Success Message */}
                        <Alert>
                            <Check className="h-4 w-4" />
                            <AlertDescription>
                                Your API key has been created successfully!
                            </AlertDescription>
                        </Alert>

                        {/* API Key */}
                        <div className="space-y-2">
                            <Label>API Key (Public)</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={createdKey.apiKey}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => copyToClipboard(createdKey.apiKey, 'key')}
                                >
                                    {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* API Secret */}
                        <div className="space-y-2">
                            <Label className="text-amber-600">API Secret (Private) ⚠️</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={createdKey.apiSecret}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => copyToClipboard(createdKey.apiSecret, 'secret')}
                                >
                                    {copiedSecret ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Save this secret now! You won't be able to see it again.
                                </AlertDescription>
                            </Alert>
                        </div>

                        {/* Done Button */}
                        <Button onClick={handleClose} className="w-full">
                            Done
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
