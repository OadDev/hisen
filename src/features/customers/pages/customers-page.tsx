import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { DataTable } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CUSTOMERS, accountOwnerName, type Customer } from '@/mock/customers'
import { formatCurrency, initials } from '@/lib/utils'

export function CustomersPage() {
  const navigate = useNavigate()

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: 'Customer',
      cell: ({ row }) => (
        <button className="flex items-center gap-2.5 text-left" onClick={() => navigate(`/customers/${row.original.id}`)}>
          <Avatar className="size-8 rounded-md">
            <AvatarFallback className="rounded-md bg-primary/10 text-primary">{initials(row.original.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground hover:text-primary">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.branches[0]?.city}, {row.original.branches[0]?.country}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'industry', header: 'Industry', cell: ({ row }) => <Badge variant="outline">{row.original.industry}</Badge> },
    { id: 'owner', header: 'Account Owner', accessorFn: (row) => accountOwnerName(row) },
    {
      accessorKey: 'lifetimeValue',
      header: 'Lifetime Value',
      cell: ({ row }) => formatCurrency(row.original.lifetimeValue),
    },
    {
      id: 'machines',
      header: 'Installed Machines',
      accessorFn: (row) => row.installedMachines.length,
    },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage companies, branches, contacts, and account history."
        actions={<EntityToolbar newLabel="New Customer" onNew={() => {}} />}
      />
      <DataTable
        columns={columns}
        data={CUSTOMERS}
        enableSelection
        searchPlaceholder="Search customers..."
        emptyTitle="No customers found"
        bulkActions={(selected) => (
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 /> Delete ({selected.length})
          </Button>
        )}
      />
    </div>
  )
}
