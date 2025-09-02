'use client'

import { useId, useState } from 'react'
import { CircleAlertIcon, Loader2 } from 'lucide-react'
import { useToast } from '@/components/toast-provider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DeleteApiKeyDialogProps {
  apiKeyName: string;
  onDelete: () => Promise<boolean>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteApiKeyDialog({ apiKeyName, onDelete, isOpen, onOpenChange }: DeleteApiKeyDialogProps) {
  const id = useId()
  const { addToast } = useToast()
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
          addToast({
            type: "success",
            message: "API key deleted successfully",
            duration: 3000
          });
        } else {
          addToast({
            type: "error",
            message: "Failed to delete API key",
            duration: 3000
          });
        }
      } catch (error) {
        addToast({
          type: "error",
          message: "An error occurred while deleting the API key",
          duration: 3000
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) setInputValue('');
      onOpenChange(open);
    }}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="text-red-500 opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Final confirmation
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              This action cannot be undone. To confirm, please enter the API key
              name <span className="text-primary">{apiKeyName}</span>.
            </DialogDescription>
          </DialogHeader>
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
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
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
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}