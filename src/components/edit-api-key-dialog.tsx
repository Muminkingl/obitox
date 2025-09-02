'use client'

import { useState } from 'react'
import { Loader2, Pencil, Edit } from 'lucide-react'
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
  DialogTrigger,
} from '@/components/ui/dialog'
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
  const { addToast } = useToast()
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
      setError('API key name cannot be empty')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const success = await onEdit(apiKey.id, name.trim())
      
      if (success) {
        setIsOpen(false)
        addToast({
          type: 'success',
          message: 'API key name updated successfully',
          duration: 3000,
        })
      } else {
        setError('Failed to update API key name')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (open) {
        setName(apiKey.name)
        setError(null)
      }
      setIsOpen(open)
    }}>
      <DialogTrigger asChild>
        <div className="flex items-center px-2 py-1.5 text-sm w-full">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit API Key</DialogTitle>
          <DialogDescription>
            Change the name of your API key.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
              {error}
            </div>
          )}
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
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
