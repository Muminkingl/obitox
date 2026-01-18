/**
 * Create API Key Dialog with Proof-of-Work
 * 
 * Enhanced version with PoW security to prevent mass key creation
 * 
 * Flow:
 * 1. User enters key name
 * 2. Solves PoW puzzle (~500ms)
 * 3. Creates key with backend
 * 4. Shows key ONCE
 */

'use client';

import { useState } from 'react';
import { Check, Copy, Loader2, Plus, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { solveChallenge, estimateSolvingTime } from '@/lib/pow-solver';
import { toast } from 'sonner';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';

interface CreateApiKeyDialogProps {
  onCreateApiKey: (name: string, challenge: string, solution: string) => Promise<{ success: boolean; error?: string; apiKey?: { apiKey: string, apiSecret: string } }>;
  disabled?: boolean;
  remainingKeys: number | null;
}

export default function CreateApiKeyDialog({ onCreateApiKey, disabled = false, remainingKeys }: CreateApiKeyDialogProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [createdApiSecret, setCreatedApiSecret] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [powProgress, setPowProgress] = useState(0);
  const [powStatus, setPowStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setCreatedApiKey(null);
    setCreatedApiSecret(null);
    setPowProgress(0);

    try {
      // Step 1: Get challenge FROM SERVER (CRITICAL SECURITY FIX)
      setPowStatus('Requesting security challenge...');
      const challengeRes = await fetch('/api/pow/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!challengeRes.ok) {
        throw new Error('Failed to get security challenge');
      }

      const { challenge, difficulty, tier, estimatedTime } = await challengeRes.json();
      console.log(`[PoW] Challenge received - Tier: ${tier}, Difficulty: ${difficulty}, Est: ${estimatedTime}`);

      // Step 2: Solve PoW with server-provided difficulty
      setPowStatus('Security Checking...');

      const solution = await solveChallenge(challenge, difficulty, (progress) => {
        setPowProgress(progress);
      });

      console.log('[PoW] Solution found:', String(solution).substring(0, 20) + '...');

      // Step 3: Create key WITH SOLUTION
      setPowStatus('Creating API key...');
      setPowProgress(100);

      // Send challenge + solution to backend for verification
      const result = await onCreateApiKey(name, challenge, solution);

      if (result.success && result.apiKey) {
        setCreatedApiKey(result.apiKey.apiKey);
        setCreatedApiSecret(result.apiKey.apiSecret);
        setPowStatus('Success!');

        // Custom success toast
        toast.custom(
          (t) => (
            <Alert variant="mono" icon="success" onClose={() => toast.dismiss(t)}>
              <AlertIcon>
                <RiCheckboxCircleFill className="text-green-500" />
              </AlertIcon>
              <AlertTitle>API Key generated successfully</AlertTitle>
            </Alert>
          ),
          { duration: 5000 }
        );
      } else {
        const errorMsg = result.error || 'Failed to create API key';
        toast.custom(
          (t) => (
            <Alert variant="mono" icon="destructive" onClose={() => toast.dismiss(t)}>
              <AlertIcon>
                <RiErrorWarningFill className="text-red-500" />
              </AlertIcon>
              <AlertTitle>{errorMsg}</AlertTitle>
            </Alert>
          ),
          { duration: 5000 }
        );
        setError(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An unexpected error occurred';
      toast.custom(
        (t) => (
          <Alert variant="mono" icon="destructive" onClose={() => toast.dismiss(t)}>
            <AlertIcon>
              <RiErrorWarningFill className="text-red-500" />
            </AlertIcon>
            <AlertTitle>{errorMsg}</AlertTitle>
          </Alert>
        ),
        { duration: 5000 }
      );
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, isSecret: boolean) => {
    if (text) {
      navigator.clipboard.writeText(text);
      if (isSecret) {
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
      } else {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setName('');
    setCreatedApiKey(null);
    setCreatedApiSecret(null);
    setCopiedKey(false);
    setCopiedSecret(false);
    setPowProgress(0);
    setPowStatus('');
    setError(null);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
      else setIsOpen(true);
    }}>
      <AlertDialogTrigger asChild>
        <Button
          className="bg-white text-black hover:bg-white border border-gray-300"
          disabled={disabled}
          title={disabled ? "You've reached the API key limit for your plan" : ''}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {createdApiKey ? '✅ API Key Created!' : '🔑 Add API Key'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {!createdApiKey && (
              <>
                Create a new API key for your application.
                {remainingKeys !== null && (
                  <span className="block mt-2 text-sm">
                    You can create <strong>{remainingKeys}</strong> more API key{remainingKeys !== 1 ? 's' : ''}.
                  </span>
                )}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!createdApiKey ? (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Production, Development"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
                maxLength={30}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                Give your key a memorable name (3-30 characters)
              </p>
            </div>

            {/* PoW Progress UI */}
            {isLoading && (
              <div className="space-y-3 bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{powStatus}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{Math.round(powProgress)}%</span>
                  </div>
                  <Progress value={powProgress} className="h-2" />
                </div>
                {powProgress > 0 && powProgress < 100 && (
                  <p className="text-xs text-muted-foreground">
                    <Info className="h-3 w-3 inline mr-1" />
                    This may take a moment
                  </p>
                )}
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={isLoading || !name}
                className="bg-white text-black hover:bg-white border border-gray-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Add'
                )}
              </Button>
            </AlertDialogFooter>

            {!isLoading && (
              <p className="text-xs text-gray-500 text-center">
                <Info className="h-3 w-3 inline mr-1" />
                Creating takes ~{estimateSolvingTime(4)}ms to prevent abuse
              </p>
            )}
          </form>
        ) : (
          <div className="space-y-4 py-4">
            {/* Critical Warning */}
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>⚠️ SAVE BOTH KEYS NOW!</strong> You won't see them again.
              </AlertDescription>
            </Alert>

            {/* API Key (Public) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Badge variant="outline" className="text-[10px]">PUBLIC</Badge>
              </div>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  value={createdApiKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => createdApiKey && copyToClipboard(createdApiKey, false)}
                >
                  {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Use this in your API requests
              </p>
            </div>

            {/* Secret Key (Private) - TODO: Get from backend response */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="apiSecret" className="text-red-600">Secret Key</Label>
                <Badge variant="destructive" className="text-[10px]">PRIVATE</Badge>
              </div>
              <div className="flex gap-2">
                <Input
                  id="apiSecret"
                  value={createdApiSecret || ''}
                  readOnly
                  className="font-mono text-sm bg-red-950/30 border-red-900/50"
                  type="password"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => createdApiSecret && copyToClipboard(createdApiSecret, true)}
                >
                  {copiedSecret ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-red-600">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Required for request signing. Never share!
              </p>
            </div>

            {/* Layer 2 Info */}
            <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-md">
              <h4 className="text-sm font-medium text-blue-400 mb-1">🔐 Layer 2: Request Signatures</h4>
              <p className="text-xs text-blue-300/80">
                Your secret key signs requests, making stolen API keys useless.
              </p>
            </div>

            <AlertDialogFooter>
              <Button
                type="button"
                onClick={handleClose}
                className="w-full"
              >
                I've Saved Both Keys
              </Button>
            </AlertDialogFooter>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}