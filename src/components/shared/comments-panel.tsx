import { useState } from 'react'
import { Send } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatDateTime, initials } from '@/lib/utils'

export interface Comment {
  id: string
  author: string
  message: string
  timestamp: string
}

export function CommentsPanel({ comments: initial }: { comments: Comment[] }) {
  const [comments, setComments] = useState(initial)
  const [draft, setDraft] = useState('')

  function submit() {
    if (!draft.trim()) return
    setComments((prev) => [...prev, { id: `c-${Date.now()}`, author: 'You', message: draft, timestamp: new Date().toISOString() }])
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="size-8">
              <AvatarFallback>{initials(comment.author)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium">{comment.author}</p>
                <span className="text-xs text-muted-foreground">{formatDateTime(comment.timestamp)}</span>
              </div>
              <p className="mt-1 text-sm text-foreground/90">{comment.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-10 resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
        />
        <Button size="icon" onClick={submit} disabled={!draft.trim()}>
          <Send />
        </Button>
      </div>
    </div>
  )
}
