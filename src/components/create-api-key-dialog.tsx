'use client'

import { useState } from 'react'
import { Check, Copy, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CreateApiKeyDialogProps {
  onCreateApiKey: (name: string) => Promise<{ success: boolean; error?: string; apiKey?: { key_value: string, fullKeyValue: string } }>;
  disabled?: boolean;
  remainingKeys: number | null;
}

export default function CreateApiKeyDialog({ onCreateApiKey, disabled = false, remainingKeys }: CreateApiKeyDialogProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setCreatedApiKey(null);
    
    try {
      const result = await onCreateApiKey(name);
      
      if (result.success) {
        if (result.apiKey?.fullKeyValue) {
          setCreatedApiKey(result.apiKey.fullKeyValue);
        } else {
          // Close if no API key was returned (shouldn't happen)
          setIsOpen(false);
          setName('');
        }
      } else {
        setError(result.error || 'Failed to create API key');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (createdApiKey) {
      navigator.clipboard.writeText(createdApiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleClose = () => {
    setIsOpen(false);
    setName('');
    setCreatedApiKey(null);
    setCopied(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
      else setIsOpen(true);
    }}>
      <DialogTrigger asChild>
        <Button 
          className="bg-white text-black hover:bg-white border border-gray-300"
          disabled={disabled}
          title={disabled ? "You've reached the API key limit for your plan" : ''}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add API Key</DialogTitle>
          <DialogDescription>
            Create a new API key for your application.
            {remainingKeys !== null && (
              <div className="mt-2">
                <span className="text-sm">You can create <strong>{remainingKeys}</strong> more API key{remainingKeys !== 1 ? 's' : ''}.</span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {!createdApiKey ? (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your API Key name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
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
                  "Add"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="font-medium text-yellow-800">Save this API key!</h3>
              <p className="text-sm text-yellow-700 mt-1">
                For security reasons, we'll only show this once. Make sure to copy it somewhere safe.
              </p>
            </div>
            
            <div className="mt-4">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="mt-1 flex">
                <Input
                  id="apiKey"
                  value={createdApiKey}
                  readOnly
                  className="font-mono text-sm flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="ml-2" 
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                onClick={handleClose}
                className="bg-white text-black hover:bg-white border border-gray-300"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}