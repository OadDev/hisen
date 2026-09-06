import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MACHINES } from '@/mock/products'
import { useCreateLead } from '@/features/crm/api'
import { ApiError } from '@/lib/api-client'

const schema = z.object({
  company: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  source: z.string().min(1, 'Select a source'),
  interestedProduct: z.string().min(1, 'Select a product'),
  estimatedValue: z.string().min(1, 'Enter an estimated value'),
})

type FormValues = z.infer<typeof schema>

export function LeadFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const createLead = useCreateLead()

  async function onSubmit(values: FormValues) {
    try {
      await createLead.mutateAsync({
        company: values.company,
        contact_name: values.contactName,
        email: values.email,
        phone: values.phone,
        source: values.source,
        interested_product: values.interestedProduct,
        estimated_value: Number(values.estimatedValue),
      })
      toast.success(`Lead created for ${values.company}`)
      reset()
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create lead')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label>Company name</Label>
            <Input {...register('company')} placeholder="Acme Engineering Pvt. Ltd." />
            {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Contact name</Label>
            <Input {...register('contactName')} placeholder="Contact person" />
            {errors.contactName && <p className="text-xs text-destructive">{errors.contactName.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Phone</Label>
            <Input {...register('phone')} placeholder="+91 98765 43210" />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label>Email</Label>
            <Input type="email" {...register('email')} placeholder="contact@company.com" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Lead source</Label>
            <Controller
              control={control}
              name="source"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Website', 'WhatsApp', 'Trade Show', 'Alibaba', 'Made-in-China', 'Email', 'Referral', 'Sales Executive'].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.source && <p className="text-xs text-destructive">{errors.source.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Interested product</Label>
            <Controller
              control={control}
              name="interestedProduct"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {MACHINES.slice(0, 12).map((m) => (
                      <SelectItem key={m.id} value={m.name}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.interestedProduct && <p className="text-xs text-destructive">{errors.interestedProduct.message}</p>}
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label>Estimated value (₹)</Label>
            <Input type="number" {...register('estimatedValue')} placeholder="1500000" />
            {errors.estimatedValue && <p className="text-xs text-destructive">{errors.estimatedValue.message}</p>}
          </div>
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>Create Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
