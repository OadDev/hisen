import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateCustomer } from '@/features/customers/api'
import { ApiError } from '@/lib/api-client'

const schema = z.object({
  name: z.string().min(2, 'Company name is required'),
  industry: z.string().optional(),
  gstin: z.string().optional(),
  currency: z.string().min(1, 'Select a currency'),
  creditLimit: z.string().optional(),
  creditDays: z.string().optional(),
  status: z.string().min(1, 'Select a status'),
})

type FormValues = z.infer<typeof schema>

export function CustomerFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { currency: 'INR', status: 'prospect' } })

  const createCustomer = useCreateCustomer()

  async function onSubmit(values: FormValues) {
    try {
      const customer = await createCustomer.mutateAsync({
        name: values.name,
        industry: values.industry || undefined,
        gstin: values.gstin || undefined,
        currency: values.currency,
        credit_limit: values.creditLimit ? Number(values.creditLimit) : undefined,
        credit_days: values.creditDays ? Number(values.creditDays) : undefined,
        status: values.status,
      })
      toast.success(`Customer ${customer.name} created`)
      reset()
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create customer')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label>Company name</Label>
            <Input {...register('name')} placeholder="Acme Engineering Pvt. Ltd." />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Industry</Label>
            <Input {...register('industry')} placeholder="Automotive" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>GSTIN</Label>
            <Input {...register('gstin')} placeholder="27AAAPL1234C1Z5" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Currency</Label>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Credit limit (₹)</Label>
            <Input type="number" {...register('creditLimit')} placeholder="500000" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Credit days</Label>
            <Input type="number" {...register('creditDays')} placeholder="30" />
          </div>
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>Create Customer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
