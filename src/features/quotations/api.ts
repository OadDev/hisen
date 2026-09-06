import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type Page } from '@/lib/api-client'
import type { StaffRef } from '@/features/crm/api'

export type QuotationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'won' | 'lost'

export interface QuotationCustomerRef {
  id: string
  name: string
  industry: string
  currency: 'INR' | 'USD'
}

export interface QuotationLineItem {
  id: number
  productName: string
  quantity: number
  unitPrice: number
  discountPct: number
}

export interface QuotationVersion {
  version: number
  note: string | null
  updatedAt: string
  updatedBy: StaffRef | null
}

export interface Quotation {
  id: string
  customer: QuotationCustomerRef | null
  owner: StaffRef | null
  status: QuotationStatus
  currency: 'INR' | 'USD'
  validUntil: string | null
  discountPct: number
  taxPct: number
  lineItems: QuotationLineItem[]
  versions: QuotationVersion[]
  total: number
  createdAt: string
}

export function useQuotations(params?: { status?: string; per_page?: number }) {
  return useQuery({
    queryKey: ['quotations', params],
    queryFn: () => api.get<Page<Quotation>>('/quotations', params),
  })
}

export function useQuotation(id: string | undefined) {
  return useQuery({
    queryKey: ['quotations', id],
    queryFn: () => api.get<Quotation>(`/quotations/${id}`),
    enabled: !!id,
  })
}

export interface CreateQuotationLineItemInput {
  product_name: string
  quantity: number
  unit_price: number
  discount_pct?: number
}

export interface CreateQuotationInput {
  customer_id: number
  owner_id?: number
  currency?: string
  valid_until?: string
  discount_pct?: number
  tax_pct?: number
  line_items: CreateQuotationLineItemInput[]
}

export function useCreateQuotation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateQuotationInput) => api.post<Quotation>('/quotations', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quotations'] }),
  })
}

export function useUpdateQuotation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; status?: QuotationStatus; discount_pct?: number; note?: string }) =>
      api.patch<Quotation>(`/quotations/${id}`, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      queryClient.invalidateQueries({ queryKey: ['quotations', variables.id] })
    },
  })
}

export function useConvertQuotationToSalesOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.post(`/quotations/${id}/convert`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      queryClient.invalidateQueries({ queryKey: ['sales-orders'] })
    },
  })
}
