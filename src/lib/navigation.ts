import type { Role } from '@/types/rbac'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  Wand2,
  FileText,
  ShoppingCart,
  Factory,
  ListTree,
  Truck,
  Warehouse,
  ShieldCheck,
  PackageCheck,
  Wrench,
  Headphones,
  Cog,
  CalendarClock,
  Landmark,
  BarChart3,
  Sparkles,
  Settings,
  ShieldAlert,
  MessageCircle,
  KanbanSquare,
  ClipboardList,
} from 'lucide-react'

export interface NavItem {
  label: string
  to?: string
  icon?: LucideIcon
  roles?: Role[]
  children?: NavItem[]
  badge?: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

const ALL: Role[] | undefined = undefined

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboards',
        icon: LayoutDashboard,
        roles: ALL,
        children: [
          { label: 'Executive', to: '/dashboard/executive', roles: ['super_admin'] },
          { label: 'Sales', to: '/dashboard/sales', roles: ['super_admin', 'sales_manager', 'sales_executive'] },
          { label: 'Production', to: '/dashboard/production', roles: ['super_admin', 'production_manager', 'production_engineer'] },
          { label: 'Purchase', to: '/dashboard/purchase', roles: ['super_admin', 'purchase_manager'] },
          { label: 'Inventory', to: '/dashboard/inventory', roles: ['super_admin', 'store_manager'] },
          { label: 'Service', to: '/dashboard/service', roles: ['super_admin', 'service_manager', 'field_service_engineer'] },
          { label: 'Finance', to: '/dashboard/finance', roles: ['super_admin', 'accounts'] },
        ],
      },
    ],
  },
  {
    label: 'Revenue',
    items: [
      {
        label: 'CRM',
        icon: Users,
        roles: ['super_admin', 'sales_manager', 'sales_executive'],
        children: [
          { label: 'Leads', to: '/crm/leads' },
          { label: 'Sales Pipeline', to: '/crm/pipeline', icon: KanbanSquare },
          { label: 'Lost Lead Analysis', to: '/crm/lost-leads' },
        ],
      },
      {
        label: 'Customers',
        to: '/customers',
        icon: Building2,
        roles: ['super_admin', 'sales_manager', 'sales_executive', 'service_manager', 'accounts'],
      },
      {
        label: 'Product Catalog',
        to: '/catalog',
        icon: Package,
        roles: ['super_admin', 'sales_manager', 'sales_executive', 'purchase_manager', 'store_manager'],
      },
      {
        label: 'Machine Configurator',
        to: '/configurator',
        icon: Wand2,
        roles: ['super_admin', 'sales_manager', 'sales_executive'],
      },
      {
        label: 'Quotations',
        to: '/quotations',
        icon: FileText,
        roles: ['super_admin', 'sales_manager', 'sales_executive'],
      },
      {
        label: 'Sales Orders',
        to: '/sales-orders',
        icon: ShoppingCart,
        roles: ['super_admin', 'sales_manager', 'sales_executive', 'accounts'],
      },
    ],
  },
  {
    label: 'Operations',
    items: [
      {
        label: 'Production',
        icon: Factory,
        roles: ['super_admin', 'production_manager', 'production_engineer'],
        children: [
          { label: 'Work Orders', to: '/production/work-orders' },
          { label: 'MRP', to: '/production/mrp' },
          { label: 'Production Calendar', to: '/production/calendar' },
          { label: 'Capacity Planning', to: '/production/capacity' },
        ],
      },
      {
        label: 'Bill of Materials',
        to: '/bom',
        icon: ListTree,
        roles: ['super_admin', 'production_manager', 'purchase_manager'],
      },
      {
        label: 'Purchase',
        icon: ClipboardList,
        roles: ['super_admin', 'purchase_manager'],
        children: [
          { label: 'RFQs', to: '/purchase/rfq' },
          { label: 'Purchase Orders', to: '/purchase/orders' },
          { label: 'Goods Receipt', to: '/purchase/grn' },
        ],
      },
      {
        label: 'Vendors',
        to: '/vendors',
        icon: Truck,
        roles: ['super_admin', 'purchase_manager'],
      },
      {
        label: 'Inventory',
        icon: Warehouse,
        roles: ['super_admin', 'store_manager', 'production_manager'],
        children: [
          { label: 'Stock Items', to: '/inventory/stock' },
          { label: 'Warehouses', to: '/inventory/warehouses' },
          { label: 'Stock Transfers', to: '/inventory/transfers' },
        ],
      },
      {
        label: 'Machine Tracking',
        to: '/machine-tracking',
        icon: Cog,
        roles: ['super_admin', 'service_manager', 'store_manager'],
      },
      {
        label: 'Quality Control',
        to: '/quality',
        icon: ShieldCheck,
        roles: ['super_admin', 'quality_manager', 'production_manager'],
      },
      {
        label: 'Dispatch',
        to: '/dispatch',
        icon: PackageCheck,
        roles: ['super_admin', 'store_manager', 'production_manager'],
      },
      {
        label: 'Installation',
        to: '/installation',
        icon: Wrench,
        roles: ['super_admin', 'service_manager', 'field_service_engineer'],
      },
    ],
  },
  {
    label: 'Customer Success',
    items: [
      {
        label: 'Service Desk',
        to: '/service',
        icon: Headphones,
        roles: ['super_admin', 'service_manager', 'field_service_engineer'],
      },
      {
        label: 'Spare Parts',
        to: '/spare-parts',
        icon: Package,
        roles: ['super_admin', 'service_manager', 'store_manager'],
      },
      {
        label: 'AMC',
        to: '/amc',
        icon: CalendarClock,
        roles: ['super_admin', 'service_manager', 'field_service_engineer', 'accounts'],
      },
      {
        label: 'WhatsApp Automation',
        to: '/whatsapp',
        icon: MessageCircle,
        roles: ['super_admin', 'sales_manager', 'service_manager'],
      },
    ],
  },
  {
    label: 'Insights',
    items: [
      {
        label: 'Finance',
        icon: Landmark,
        roles: ['super_admin', 'accounts'],
        children: [
          { label: 'Invoices', to: '/finance/invoices' },
          { label: 'Expenses', to: '/finance/expenses' },
          { label: 'Receivables', to: '/finance/receivables' },
          { label: 'Payables', to: '/finance/payables' },
          { label: 'GST / VAT', to: '/finance/tax' },
        ],
      },
      { label: 'Reports', to: '/reports', icon: BarChart3, roles: ALL },
      { label: 'AI Studio', to: '/ai', icon: Sparkles, roles: ALL },
    ],
  },
  {
    label: 'System',
    items: [
      {
        label: 'Administration',
        icon: ShieldAlert,
        roles: ['super_admin'],
        children: [
          { label: 'Users', to: '/admin/users' },
          { label: 'Roles & Permissions', to: '/admin/roles' },
          { label: 'Audit Logs', to: '/admin/audit-logs' },
        ],
      },
      { label: 'Settings', to: '/settings', icon: Settings, roles: ALL },
    ],
  },
]

export function filterNavByRole(groups: NavGroup[], role: Role): NavGroup[] {
  const matches = (roles?: Role[]) => !roles || roles.includes(role)
  return groups
    .map((group) => ({
      ...group,
      items: group.items
        .filter((item) => matches(item.roles))
        .map((item) => ({
          ...item,
          children: item.children?.filter((c) => matches(c.roles)),
        })),
    }))
    .filter((group) => group.items.length > 0)
}
