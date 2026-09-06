import { useQuery } from '@tanstack/react-query'
import { api, type Page } from '@/lib/api-client'
import type { StaffRef } from '@/features/crm/api'
import type { QuotationLineItem } from '@/features/quotations/api'

export type SalesOrderStatus = 'pending' | 'in-progress' | 'production' | 'dispatched' | 'installed' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'partially-paid' | 'paid' | 'overdue'

export interface SalesOrderCustomerRef {
  id: string
  name: string
  industry: string
}

export interface SalesOrder {
  id: string
  customer: SalesOrderCustomerRef | null
  owner: StaffRef | null
  status: SalesOrderStatus
  paymentStatus: PaymentStatus
  orderValue: number
  advancePaid: number
  currency: 'INR' | 'USD'
  orderDate: string
  expectedDispatch: string | null
  productionProgress: number
  quotation?: { id: string; lineItems: QuotationLineItem[] } | null
}

export function useSalesOrders(params?: { status?: string; per_page?: number }) {
  return useQuery({
    queryKey: ['sales-orders', params],
    queryFn: () => api.get<Page<SalesOrder>>('/sales-orders', params),
  })
}

export function useSalesOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['sales-orders', id],
    queryFn: () => api.get<SalesOrder>(`/sales-orders/${id}`),
    enabled: !!id,
  })
}
