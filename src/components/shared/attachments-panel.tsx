import { FileText, FileImage, FileSpreadsheet, Download, Upload, File as FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

export interface Attachment {
  id: string
  name: string
  type: 'pdf' | 'image' | 'sheet' | 'doc'
  size: string
  uploadedBy: string
  uploadedAt: string
}

const ICONS = { pdf: FileText, image: FileImage, sheet: FileSpreadsheet, doc: FileIcon }

export function AttachmentsPanel({ attachments }: { attachments: Attachment[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{attachments.length} file(s)</p>
        <Button size="sm" variant="outline">
          <Upload /> Upload
        </Button>
      </div>
      <div className="flex flex-col divide-y rounded-lg border">
        {attachments.map((file) => {
          const Icon = ICONS[file.type]
          return (
            <div key={file.id} className="flex items-center gap-3 px-3 py-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {file.size} · Uploaded by {file.uploadedBy} · {formatDate(file.uploadedAt)}
                </p>
              </div>
              <Button size="icon-sm" variant="ghost">
                <Download className="size-4" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
