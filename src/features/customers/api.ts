import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type Page } from '@/lib/api-client'

export interface ContactPerson {
  id: string
  name: string
  designation: string
  email: string
  phone: string
  isPrimary: boolean
}

export interface Branch {
  id: string
  name: string
  city: string
  state: string
  country: string
  address: string
  isHeadOffice: boolean
}

export interface InstalledMachine {
  id: string
  productName: string
  serialNumber: string
  installedOn: string
  warrantyEndsOn: string
  amcActive: boolean
  status: 'operational' | 'under-service' | 'decommissioned'
}

export interface MachineRequirement {
  id: number
  productId: number | null
  productName: string
  specs: Record<string, string>
  quantity: number
  unitPrice: number
  notes: string | null
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  industry: string
  gstin: string
  panNumber: string
  currency: 'INR' | 'USD'
  creditLimit: number
  creditDays: number
  accountOwner: string | null
  status: 'active' | 'inactive' | 'prospect'
  tags: string[]
  lifetimeValue: number
  branches: Branch[]
  contacts: ContactPerson[]
  installedMachines: InstalledMachine[]
  machineRequirements: MachineRequirement[]
  createdAt: string
}

export function useCustomers(params?: { search?: string; status?: string; per_page?: number }) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => api.get<Page<Customer>>('/customers', params),
  })
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => api.get<Customer>(`/customers/${id}`),
    enabled: !!id,
  })
}

export interface CreateCustomerInput {
  name: string
  industry?: string
  gstin?: string
  pan_number?: string
  currency?: string
  credit_limit?: number
  credit_days?: number
  status?: string
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCustomerInput) => api.post<Customer>('/customers', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })
}

export function useAddMachineRequirement(customerId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { product_id: number; quantity?: number; unit_price?: number; notes?: string }) =>
      api.post<MachineRequirement>(`/customers/${customerId}/machine-requirements`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers', customerId] }),
  })
}

export function useUpdateMachineRequirement(customerId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; quantity?: number; unit_price?: number }) =>
      api.patch<MachineRequirement>(`/machine-requirements/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers', customerId] }),
  })
}

export function useRemoveMachineRequirement(customerId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/machine-requirements/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers', customerId] }),
  })
}
