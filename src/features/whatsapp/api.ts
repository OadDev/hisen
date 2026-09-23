import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

export interface WhatsAppTemplate {
  id: number
  name: string
  body: string
  createdAt: string
}

export function useWhatsAppTemplates() {
  return useQuery({
    queryKey: ['whatsapp-templates'],
    queryFn: () => api.get<WhatsAppTemplate[]>('/whatsapp-templates'),
  })
}

export function useCreateWhatsAppTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { name: string; body: string }) => api.post<WhatsAppTemplate>('/whatsapp-templates', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whatsapp-templates'] }),
  })
}

export function useDeleteWhatsAppTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/whatsapp-templates/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whatsapp-templates'] }),
  })
}
