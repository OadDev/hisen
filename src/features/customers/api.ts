import { useQuery } from '@tanstack/react-query'
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
