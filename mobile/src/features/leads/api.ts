import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type Page } from '@/lib/api-client'

export type LeadSource = 'Website' | 'WhatsApp' | 'Trade Show' | 'Alibaba' | 'Made-in-China' | 'Email' | 'Referral' | 'Sales Executive'
export type LeadStage = 'Lead' | 'Discussion' | 'Technical Proposal' | 'Quotation' | 'Negotiation' | 'Advance' | 'Won' | 'Lost'

export interface StaffRef {
  id: number
  name: string
  email: string
  role: string
}

export interface LeadActivity {
  id: number
  type: 'call' | 'meeting' | 'email' | 'whatsapp' | 'note' | 'stage-change'
  title: string
  description: string | null
  occurredAt: string
  actor: StaffRef | null
}

export interface Lead {
  id: string
  company: string
  contactName: string
  email: string | null
  phone: string | null
  country: string | null
  source: LeadSource
  interestedProduct: string | null
  estimatedValue: number
  stage: LeadStage
  owner: StaffRef | null
  lostReason: string | null
  nextFollowUp: string | null
  createdAt: string
  activities?: LeadActivity[]
}

export function useLeads(params?: { search?: string; source?: string; stage?: string; per_page?: number }) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => api.get<Page<Lead>>('/leads', params),
  })
}

export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: () => api.get<Lead>(`/leads/${id}`),
    enabled: !!id,
  })
}

export interface CreateLeadInput {
  company: string
  contact_name: string
  email: string
  phone: string
  source: string
  interested_product: string
  estimated_value: number
}

export function useCreateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateLeadInput) => api.post<Lead>('/leads', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useUpdateLeadStage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: LeadStage }) => api.patch<Lead>(`/leads/${id}`, { stage }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useAddLeadActivity(id: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { type: string; title: string; description?: string }) => api.post<LeadActivity>(`/leads/${id}/activities`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads', id] }),
  })
}
