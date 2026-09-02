import { lazy, Suspense, type ComponentType } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { ProtectedRoute } from '@/components/layout/protected-route'
import { LoginPage } from '@/features/auth/pages/login-page'
import { ForgotPasswordPage } from '@/features/auth/pages/forgot-password-page'
import { PageSkeleton } from '@/components/shared/page-skeleton'

function lazyPage(loader: () => Promise<{ default: ComponentType }>) {
  const LazyComponent = lazy(loader)
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LazyComponent />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard/executive" replace /> },
          { path: 'dashboard/executive', element: lazyPage(() => import('@/features/dashboard/pages/executive-dashboard').then((m) => ({ default: m.ExecutiveDashboard }))) },
          { path: 'dashboard/sales', element: lazyPage(() => import('@/features/dashboard/pages/sales-dashboard').then((m) => ({ default: m.SalesDashboard }))) },
          { path: 'dashboard/production', element: lazyPage(() => import('@/features/dashboard/pages/production-dashboard').then((m) => ({ default: m.ProductionDashboard }))) },
          { path: 'dashboard/purchase', element: lazyPage(() => import('@/features/dashboard/pages/purchase-dashboard').then((m) => ({ default: m.PurchaseDashboard }))) },
          { path: 'dashboard/inventory', element: lazyPage(() => import('@/features/dashboard/pages/inventory-dashboard').then((m) => ({ default: m.InventoryDashboard }))) },
          { path: 'dashboard/service', element: lazyPage(() => import('@/features/dashboard/pages/service-dashboard').then((m) => ({ default: m.ServiceDashboard }))) },
          { path: 'dashboard/finance', element: lazyPage(() => import('@/features/dashboard/pages/finance-dashboard').then((m) => ({ default: m.FinanceDashboard }))) },

          { path: 'crm/leads', element: lazyPage(() => import('@/features/crm/pages/leads-page').then((m) => ({ default: m.LeadsPage }))) },
          { path: 'crm/leads/:id', element: lazyPage(() => import('@/features/crm/pages/lead-detail-page').then((m) => ({ default: m.LeadDetailPage }))) },
          { path: 'crm/pipeline', element: lazyPage(() => import('@/features/crm/pages/pipeline-page').then((m) => ({ default: m.PipelinePage }))) },
          { path: 'crm/lost-leads', element: lazyPage(() => import('@/features/crm/pages/lost-leads-page').then((m) => ({ default: m.LostLeadsPage }))) },

          { path: 'customers', element: lazyPage(() => import('@/features/customers/pages/customers-page').then((m) => ({ default: m.CustomersPage }))) },
          { path: 'customers/:id', element: lazyPage(() => import('@/features/customers/pages/customer-detail-page').then((m) => ({ default: m.CustomerDetailPage }))) },

          { path: 'catalog', element: lazyPage(() => import('@/features/catalog/pages/catalog-page').then((m) => ({ default: m.CatalogPage }))) },
          { path: 'catalog/:id', element: lazyPage(() => import('@/features/catalog/pages/product-detail-page').then((m) => ({ default: m.ProductDetailPage }))) },
          { path: 'configurator', element: lazyPage(() => import('@/features/configurator/pages/configurator-page').then((m) => ({ default: m.ConfiguratorPage }))) },

          { path: 'quotations', element: lazyPage(() => import('@/features/quotations/pages/quotations-page').then((m) => ({ default: m.QuotationsPage }))) },
          { path: 'quotations/:id', element: lazyPage(() => import('@/features/quotations/pages/quotation-detail-page').then((m) => ({ default: m.QuotationDetailPage }))) },
          { path: 'sales-orders', element: lazyPage(() => import('@/features/sales-orders/pages/sales-orders-page').then((m) => ({ default: m.SalesOrdersPage }))) },
          { path: 'sales-orders/:id', element: lazyPage(() => import('@/features/sales-orders/pages/sales-order-detail-page').then((m) => ({ default: m.SalesOrderDetailPage }))) },

          { path: 'production/work-orders', element: lazyPage(() => import('@/features/production/pages/work-orders-page').then((m) => ({ default: m.WorkOrdersPage }))) },
          { path: 'production/work-orders/:id', element: lazyPage(() => import('@/features/production/pages/work-order-detail-page').then((m) => ({ default: m.WorkOrderDetailPage }))) },
          { path: 'production/mrp', element: lazyPage(() => import('@/features/production/pages/mrp-page').then((m) => ({ default: m.MrpPage }))) },
          { path: 'production/calendar', element: lazyPage(() => import('@/features/production/pages/production-calendar-page').then((m) => ({ default: m.ProductionCalendarPage }))) },
          { path: 'production/capacity', element: lazyPage(() => import('@/features/production/pages/capacity-planning-page').then((m) => ({ default: m.CapacityPlanningPage }))) },
          { path: 'bom', element: lazyPage(() => import('@/features/bom/pages/bom-page').then((m) => ({ default: m.BomPage }))) },

          { path: 'purchase/rfq', element: lazyPage(() => import('@/features/purchase/pages/rfq-page').then((m) => ({ default: m.RfqPage }))) },
          { path: 'purchase/orders', element: lazyPage(() => import('@/features/purchase/pages/purchase-orders-page').then((m) => ({ default: m.PurchaseOrdersPage }))) },
          { path: 'purchase/grn', element: lazyPage(() => import('@/features/purchase/pages/grn-page').then((m) => ({ default: m.GrnPage }))) },
          { path: 'vendors', element: lazyPage(() => import('@/features/vendors/pages/vendors-page').then((m) => ({ default: m.VendorsPage }))) },
          { path: 'vendors/:id', element: lazyPage(() => import('@/features/vendors/pages/vendor-detail-page').then((m) => ({ default: m.VendorDetailPage }))) },

          { path: 'inventory/stock', element: lazyPage(() => import('@/features/inventory/pages/stock-items-page').then((m) => ({ default: m.StockItemsPage }))) },
          { path: 'inventory/warehouses', element: lazyPage(() => import('@/features/inventory/pages/warehouses-page').then((m) => ({ default: m.WarehousesPage }))) },
          { path: 'inventory/transfers', element: lazyPage(() => import('@/features/inventory/pages/stock-transfers-page').then((m) => ({ default: m.StockTransfersPage }))) },
          { path: 'machine-tracking', element: lazyPage(() => import('@/features/machine-tracking/pages/machine-tracking-page').then((m) => ({ default: m.MachineTrackingPage }))) },

          { path: 'quality', element: lazyPage(() => import('@/features/quality/pages/quality-control-page').then((m) => ({ default: m.QualityControlPage }))) },
          { path: 'dispatch', element: lazyPage(() => import('@/features/dispatch/pages/dispatch-page').then((m) => ({ default: m.DispatchPage }))) },
          { path: 'installation', element: lazyPage(() => import('@/features/installation/pages/installation-page').then((m) => ({ default: m.InstallationPage }))) },

          { path: 'service', element: lazyPage(() => import('@/features/service/pages/service-desk-page').then((m) => ({ default: m.ServiceDeskPage }))) },
          { path: 'service/:id', element: lazyPage(() => import('@/features/service/pages/ticket-detail-page').then((m) => ({ default: m.TicketDetailPage }))) },
          { path: 'spare-parts', element: lazyPage(() => import('@/features/spare-parts/pages/spare-parts-page').then((m) => ({ default: m.SparePartsPage }))) },
          { path: 'amc', element: lazyPage(() => import('@/features/amc/pages/amc-page').then((m) => ({ default: m.AmcPage }))) },
          { path: 'whatsapp', element: lazyPage(() => import('@/features/whatsapp/pages/whatsapp-page').then((m) => ({ default: m.WhatsAppPage }))) },

          { path: 'finance/invoices', element: lazyPage(() => import('@/features/finance/pages/invoices-page').then((m) => ({ default: m.InvoicesPage }))) },
          { path: 'finance/expenses', element: lazyPage(() => import('@/features/finance/pages/expenses-page').then((m) => ({ default: m.ExpensesPage }))) },
          { path: 'finance/receivables', element: lazyPage(() => import('@/features/finance/pages/receivables-page').then((m) => ({ default: m.ReceivablesPage }))) },
          { path: 'finance/payables', element: lazyPage(() => import('@/features/finance/pages/payables-page').then((m) => ({ default: m.PayablesPage }))) },
          { path: 'finance/tax', element: lazyPage(() => import('@/features/finance/pages/tax-page').then((m) => ({ default: m.TaxPage }))) },

          { path: 'reports', element: lazyPage(() => import('@/features/reports/pages/reports-page').then((m) => ({ default: m.ReportsPage }))) },
          { path: 'ai', element: lazyPage(() => import('@/features/ai/pages/ai-studio-page').then((m) => ({ default: m.AiStudioPage }))) },

          { path: 'admin/users', element: lazyPage(() => import('@/features/admin/pages/users-page').then((m) => ({ default: m.UsersPage }))) },
          { path: 'admin/roles', element: lazyPage(() => import('@/features/admin/pages/roles-page').then((m) => ({ default: m.RolesPage }))) },
          { path: 'admin/audit-logs', element: lazyPage(() => import('@/features/admin/pages/audit-logs-page').then((m) => ({ default: m.AuditLogsPage }))) },
          { path: 'settings', element: lazyPage(() => import('@/features/settings/pages/settings-page').then((m) => ({ default: m.SettingsPage }))) },

          { path: '*', element: lazyPage(() => import('@/components/shared/not-found-page').then((m) => ({ default: m.NotFoundPage }))) },
        ],
      },
    ],
  },
])
