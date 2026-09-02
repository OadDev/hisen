import { Download, Upload, Printer, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EntityToolbarProps {
  onNew?: () => void
  newLabel?: string
  showImport?: boolean
  showExport?: boolean
  showPrint?: boolean
}

export function EntityToolbar({ onNew, newLabel = 'New', showImport = true, showExport = true, showPrint = true }: EntityToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {showImport && (
        <Button variant="outline" size="sm">
          <Upload /> Import
        </Button>
      )}
      {showExport && (
        <Button variant="outline" size="sm">
          <Download /> Export
        </Button>
      )}
      {showPrint && (
        <Button variant="outline" size="sm">
          <Printer /> Print
        </Button>
      )}
      {onNew && (
        <Button size="sm" onClick={onNew}>
          <Plus /> {newLabel}
        </Button>
      )}
    </div>
  )
}
