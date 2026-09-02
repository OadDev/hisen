import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { STAFF, type StaffMember } from '@/mock/staff'
import { ROLES } from '@/types/rbac'
import { initials } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export function UsersPage() {
  const columns: ColumnDef<StaffMember>[] = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8"><AvatarFallback>{initials(row.original.name)}</AvatarFallback></Avatar>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: 'department', header: 'Department' },
    { id: 'role', header: 'Role', accessorFn: (row) => ROLES[row.role].label, cell: ({ row }) => <Badge variant="outline">{ROLES[row.original.role].label}</Badge> },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'active', header: 'Status', cell: ({ row }) => (row.original.active ? <Badge variant="success">Active</Badge> : <Badge variant="muted">Inactive</Badge>) },
  ]

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage internal users, departments, and role assignment."
        actions={<EntityToolbar newLabel="Invite User" onNew={() => {}} />}
      />
      <DataTable
        columns={columns}
        data={STAFF}
        enableSelection
        searchPlaceholder="Search users..."
        bulkActions={(selected) => (
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 /> Deactivate ({selected.length})
          </Button>
        )}
      />
    </div>
  )
}
