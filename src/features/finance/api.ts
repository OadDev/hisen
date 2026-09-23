import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type Page } from '@/lib/api-client'

export type InvoiceStatus = 'paid' | 'partially-paid' | 'pending' | 'overdue'

export interface Invoice {
  id: string
  salesOrder: { id: string; dbId: number } | null
  customerName: string
  amount: number
  amountPaid: number
  currency: 'INR' | 'USD'
  issuedDate: string
  dueDate: string
  status: InvoiceStatus
  createdAt: string
}

/** amount/amountPaid arrive from Laravel's decimal cast as numeric strings — coerce to real numbers. */
function normalize(invoice: Invoice): Invoice {
  return { ...invoice, amount: Number(invoice.amount), amountPaid: Number(invoice.amountPaid) }
}

export function useInvoices(params?: { search?: string; status?: string; per_page?: number }) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: async () => {
      const page = await api.get<Page<Invoice>>('/invoices', params)
      return { ...page, data: page.data.map(normalize) }
    },
  })
}

export interface CreateInvoiceInput {
  customer_name: string
  amount: number
  amount_paid?: number
  currency?: string
  issued_date: string
  due_date: string
  status?: InvoiceStatus
}

export function useCreateInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateInvoiceInput) => api.post<Invoice>('/invoices', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  })
}
