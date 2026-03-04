'use client'

import { useId, useState } from 'react'
import { CircleAlertIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert'
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react'

interface DeleteApiKeyDialogProps {
  apiKeyName: string;
  onDelete: () => Promise<boolean>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteApiKeyDialog({ apiKeyName, onDelete, isOpen, onOpenChange }: DeleteApiKeyDialogProps) {
  const id = useId()
  const [inputValue, setInputValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (inputValue === apiKeyName) {
      setIsDeleting(true);
      try {
        const success = await onDelete();
        if (success) {
          onOpenChange(false);
          setInputValue('');
          toast.custom(
            (t) => (
              <Alert variant="mono" icon="success" onClose={() => toast.dismiss(t)}>
                <AlertIcon>
                  <RiCheckboxCircleFill className="text-green-500" />
                </AlertIcon>
                <AlertTitle>API key deleted successfully</AlertTitle>
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
                <AlertTitle>Failed to delete API key</AlertTitle>
              </Alert>
            ),
            { duration: 4000 }
          );
        }
      } catch (error) {
        toast.custom(
          (t) => (
            <Alert variant="mono" icon="destructive" onClose={() => toast.dismiss(t)}>
              <AlertIcon>
                <RiErrorWarningFill className="text-red-500" />
              </AlertIcon>
              <AlertTitle>An error occurred while deleting the API key</AlertTitle>
            </Alert>
          ),
          { duration: 4000 }
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open) setInputValue('');
      onOpenChange(open);
    }}>
      <AlertDialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10"
            aria-hidden="true"
          >
            <CircleAlertIcon className="text-red-500 opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="sm:text-center">
              Final confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="sm:text-center">
              This action cannot be undone. To confirm, please enter the API key
              name <span className="text-white font-medium">{apiKeyName}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
          <div className="*:not-first:mt-2">
            <Label htmlFor={id}>API Key Name</Label>
            <Input
              id={id}
              type="text"
              placeholder={`Type ${apiKeyName} to confirm`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-zinc-950 border-zinc-800"
            />
          </div>
          <AlertDialogFooter className="flex items-center gap-2">
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={inputValue !== apiKeyName || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete API Key"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}