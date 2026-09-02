import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ALL_ROLES, ROLES, type Role } from '@/types/rbac'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

const MODULES = ['CRM', 'Customers', 'Quotations', 'Sales Orders', 'Production', 'Purchase', 'Inventory', 'Quality', 'Dispatch', 'Installation', 'Service', 'AMC', 'Finance', 'Reports', 'Administration']

function defaultAccess(role: Role, module: string): boolean {
  if (role === 'super_admin') return true
  const map: Record<string, Role[]> = {
    CRM: ['sales_manager', 'sales_executive'],
    Customers: ['sales_manager', 'sales_executive', 'service_manager', 'accounts'],
    Quotations: ['sales_manager', 'sales_executive'],
    'Sales Orders': ['sales_manager', 'sales_executive', 'accounts'],
    Production: ['production_manager', 'production_engineer'],
    Purchase: ['purchase_manager'],
    Inventory: ['store_manager', 'production_manager'],
    Quality: ['quality_manager', 'production_manager'],
    Dispatch: ['store_manager', 'production_manager'],
    Installation: ['service_manager', 'field_service_engineer'],
    Service: ['service_manager', 'field_service_engineer'],
    AMC: ['service_manager', 'field_service_engineer', 'accounts'],
    Finance: ['accounts'],
    Reports: ALL_ROLES,
    Administration: [],
  }
  return map[module]?.includes(role) ?? false
}

export function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<Role>('sales_manager')
  const [access, setAccess] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(MODULES.map((m) => [m, defaultAccess(selectedRole, m)])),
  )

  function selectRole(role: Role) {
    setSelectedRole(role)
    setAccess(Object.fromEntries(MODULES.map((m) => [m, defaultAccess(role, m)])))
  }

  return (
    <div>
      <PageHeader title="Roles & Permissions" description="Define module-level access for each role." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Roles</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-1">
            {ALL_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => selectRole(role)}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${selectedRole === role ? 'bg-accent font-medium' : 'text-muted-foreground hover:bg-accent/50'}`}
              >
                {ROLES[role].label}
                {role === 'super_admin' && <Badge variant="secondary" className="text-[10px]">All Access</Badge>}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">{ROLES[selectedRole].label} — Module Access</CardTitle>
              <CardDescription>{ROLES[selectedRole].description}</CardDescription>
            </div>
            <Button size="sm" onClick={() => toast.success('Permissions updated')} disabled={selectedRole === 'super_admin'}>
              <Save /> Save Changes
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {MODULES.map((module) => (
                <label key={module} className="flex items-center gap-3 rounded-md border p-3">
                  <Checkbox
                    checked={selectedRole === 'super_admin' ? true : access[module]}
                    disabled={selectedRole === 'super_admin'}
                    onCheckedChange={(v) => setAccess((prev) => ({ ...prev, [module]: !!v }))}
                  />
                  <span className="text-sm font-medium">{module}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
