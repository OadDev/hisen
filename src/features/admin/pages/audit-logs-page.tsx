import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import { AUDIT_LOGS, type AuditLogEntry } from '@/mock/audit-logs'
import { formatDateTime } from '@/lib/utils'

export function AuditLogsPage() {
  const columns: ColumnDef<AuditLogEntry>[] = [
    { accessorKey: 'timestamp', header: 'Timestamp', cell: ({ row }) => formatDateTime(row.original.timestamp) },
    { accessorKey: 'actor', header: 'User' },
    {
      id: 'activity',
      header: 'Activity',
      cell: ({ row }) => (
        <span>
          {row.original.action} <span className="font-medium">{row.original.entity}</span>
        </span>
      ),
    },
    { accessorKey: 'module', header: 'Module', cell: ({ row }) => <Badge variant="outline">{row.original.module}</Badge> },
    { accessorKey: 'ipAddress', header: 'IP Address', cell: ({ row }) => <span className="font-mono text-xs">{row.original.ipAddress}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Full activity trail across every module for compliance and traceability."
        actions={<EntityToolbar showImport={false} />}
      />
      <DataTable columns={columns} data={AUDIT_LOGS} searchPlaceholder="Search activity logs..." />
    </div>
  )
}
