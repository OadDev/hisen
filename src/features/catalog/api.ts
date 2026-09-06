import { useQuery } from '@tanstack/react-query'
import { api, type Page } from '@/lib/api-client'
import type { ProductCategory } from '@/mock/products'

export type { ProductCategory }

export interface Product {
  id: number
  sku: string
  name: string
  category: ProductCategory
  subCategory: string | null
  description: string | null
  hsn: string | null
  unit: string | null
  price: number
  currency: 'INR' | 'USD'
  status: 'active' | 'discontinued' | 'draft'
  specs: Record<string, string>
  certifications: string[]
  hasVideo: boolean
  hasPdfCatalog: boolean
  warrantyMonths: number | null
  leadTimeDays: number | null
}

export function useProducts(params?: { category?: string; search?: string; per_page?: number }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get<Page<Product>>('/products', params),
  })
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => api.get<Product>(`/products/${id}`),
    enabled: !!id,
  })
}
