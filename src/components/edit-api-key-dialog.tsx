'use client'

import { useState } from 'react'
import { Loader2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert'
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EditApiKeyDialogProps {
  apiKey: {
    id: string;
    name: string;
  };
  onEdit: (id: string, name: string) => Promise<boolean>;
}

export default function EditApiKeyDialog({ apiKey, onEdit }: EditApiKeyDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(apiKey.name)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (name.trim() === apiKey.name) {
      setIsOpen(false)
      return
    }

    if (!name.trim()) {
      toast.custom(
        (t) => (
          <Alert variant="mono" icon="destructive" onClose={() => toast.dismiss(t)}>
            <AlertIcon>
              <RiErrorWarningFill className="text-red-500" />
            </AlertIcon>
            <AlertTitle>API key name cannot be empty</AlertTitle>
          </Alert>
        ),
        { duration: 4000 }
      );
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const success = await onEdit(apiKey.id, name.trim())

      if (success) {
        setIsOpen(false)
        toast.custom(
          (t) => (
            <Alert variant="mono" icon="success" onClose={() => toast.dismiss(t)}>
              <AlertIcon>
                <RiCheckboxCircleFill className="text-green-500" />
              </AlertIcon>
              <AlertTitle>API key name updated successfully</AlertTitle>
            </Alert>
          ),
          { duration: 4000 }
        );
      } else {
        toast.custom(
          (t) => (
            <Alert variant="mono" icon="destructive" onClose={() => toast.dismiss(t)}>
              <AlertIcon>
                <RiErrorWarningFill className="text-red-500" />
              </AlertIcon>
              <AlertTitle>Failed to update API key name</AlertTitle>
            </Alert>
          ),
          { duration: 4000 }
        );
      }
    } catch (err: any) {
      toast.custom(
        (t) => (
          <Alert variant="mono" icon="destructive" onClose={() => toast.dismiss(t)}>
            <AlertIcon>
              <RiErrorWarningFill className="text-red-500" />
            </AlertIcon>
            <AlertTitle>{err.message || 'An error occurred'}</AlertTitle>
          </Alert>
        ),
        { duration: 4000 }
      );
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (open) {
        setName(apiKey.name)
        setError(null)
      }
      setIsOpen(open)
    }}>
      <AlertDialogTrigger asChild>
        <div className="flex items-center px-2 py-1.5 text-sm w-full">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit API Key</AlertDialogTitle>
          <AlertDialogDescription>
            Change the name of your API key.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key-name">Name</Label>
            <Input
              id="api-key-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter API key name"
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={isLoading || !name.trim() || name.trim() === apiKey.name}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
