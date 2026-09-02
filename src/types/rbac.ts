export type Role =
  | 'super_admin'
  | 'sales_manager'
  | 'sales_executive'
  | 'production_manager'
  | 'production_engineer'
  | 'purchase_manager'
  | 'store_manager'
  | 'quality_manager'
  | 'service_manager'
  | 'field_service_engineer'
  | 'accounts'

export interface RoleDefinition {
  id: Role
  label: string
  description: string
  color: string
}

export const ROLES: Record<Role, RoleDefinition> = {
  super_admin: { id: 'super_admin', label: 'Super Admin', description: 'Full system access across all modules', color: 'chart-1' },
  sales_manager: { id: 'sales_manager', label: 'Sales Manager', description: 'CRM, quotations, sales orders, sales reports', color: 'chart-2' },
  sales_executive: { id: 'sales_executive', label: 'Sales Executive', description: 'Leads, quotations, own pipeline', color: 'chart-2' },
  production_manager: { id: 'production_manager', label: 'Production Manager', description: 'MRP, work orders, capacity planning', color: 'chart-3' },
  production_engineer: { id: 'production_engineer', label: 'Production Engineer', description: 'Assigned work orders and stages', color: 'chart-3' },
  purchase_manager: { id: 'purchase_manager', label: 'Purchase Manager', description: 'RFQ, POs, vendor management', color: 'chart-4' },
  store_manager: { id: 'store_manager', label: 'Store Manager', description: 'Inventory, warehouses, stock transfers', color: 'chart-4' },
  quality_manager: { id: 'quality_manager', label: 'Quality Manager', description: 'QC checklists, NCRs, inspections', color: 'chart-5' },
  service_manager: { id: 'service_manager', label: 'Service Manager', description: 'Tickets, AMC, engineer allocation', color: 'chart-6' },
  field_service_engineer: { id: 'field_service_engineer', label: 'Field Service Engineer', description: 'Assigned tickets, installations, AMC visits', color: 'chart-6' },
  accounts: { id: 'accounts', label: 'Accounts', description: 'Invoices, payments, GST/VAT, financial reports', color: 'chart-1' },
}

export const ALL_ROLES: Role[] = Object.keys(ROLES) as Role[]
