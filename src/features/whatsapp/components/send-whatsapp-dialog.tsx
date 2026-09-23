import { useState } from 'react'
import { toast } from 'sonner'
import { Send, Trash2, Plus, MessageCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateWhatsAppTemplate, useDeleteWhatsAppTemplate, useWhatsAppTemplates } from '@/features/whatsapp/api'
import { ApiError } from '@/lib/api-client'

export function SendWhatsAppDialog({
  open,
  onOpenChange,
  phone,
  onLogActivity,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  phone: string | null | undefined
  /** Called after the wa.me link is opened, so the caller can record the outreach (e.g. as a Lead activity). */
  onLogActivity?: (message: string) => Promise<unknown> | void
}) {
  const [message, setMessage] = useState('')
  const [addingTemplate, setAddingTemplate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newBody, setNewBody] = useState('')

  const { data: templates, isLoading } = useWhatsAppTemplates()
  const createTemplate = useCreateWhatsAppTemplate()
  const deleteTemplate = useDeleteWhatsAppTemplate()

  function reset() {
    setMessage('')
    setAddingTemplate(false)
    setNewName('')
    setNewBody('')
  }

  async function handleSend(text: string) {
    if (!text.trim()) {
      toast.error('Write a message first')
      return
    }
    if (!phone) {
      toast.error('No phone number on file for this contact')
      return
    }
    const digits = phone.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    try {
      await onLogActivity?.(text)
    } catch {
      // Logging the activity is a best-effort side effect; the message still opened in WhatsApp.
    }
    toast.success('Opened WhatsApp with your message')
    reset()
    onOpenChange(false)
  }

  async function handleCreateTemplate() {
    if (!newName.trim() || !newBody.trim()) {
      toast.error('Give the template a name and a message')
      return
    }
    try {
      await createTemplate.mutateAsync({ name: newName, body: newBody })
      toast.success('Template saved')
      setAddingTemplate(false)
      setNewName('')
      setNewBody('')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save template')
    }
  }

  async function handleDeleteTemplate(id: number) {
    try {
      await deleteTemplate.mutateAsync(id)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete template')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) reset()
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><MessageCircle className="size-5 text-[#25D366]" /> Send WhatsApp Message</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label>Compose Message</Label>
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Message Templates</Label>
            <Button variant="outline" size="sm" onClick={() => setAddingTemplate((v) => !v)}>
              <Plus /> New Template
            </Button>
          </div>

          {addingTemplate && (
            <div className="flex flex-col gap-2 rounded-lg border p-3">
              <Input placeholder="Template name" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Textarea placeholder="Template message" value={newBody} onChange={(e) => setNewBody(e.target.value)} rows={2} />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setAddingTemplate(false)}>Cancel</Button>
                <Button size="sm" onClick={handleCreateTemplate} disabled={createTemplate.isPending}>Save Template</Button>
              </div>
            </div>
          )}

          <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
            {isLoading && <p className="py-4 text-center text-sm text-muted-foreground">Loading templates…</p>}
            {!isLoading && templates?.length === 0 && !addingTemplate && (
              <p className="py-4 text-center text-sm text-muted-foreground">No saved templates yet.</p>
            )}
            {templates?.map((t) => (
              <div key={t.id} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.body}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleDeleteTemplate(t.id)}>
                    <Trash2 /> Delete
                  </Button>
                  <Button size="sm" className="ml-auto bg-[#25D366] text-white hover:bg-[#1ebd5a]" onClick={() => handleSend(t.body)}>
                    <Send /> Send
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full bg-[#25D366] text-white hover:bg-[#1ebd5a]" onClick={() => handleSend(message)}>
          <Send /> Send Message
        </Button>
      </DialogContent>
    </Dialog>
  )
}
