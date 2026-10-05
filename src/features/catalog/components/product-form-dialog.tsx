import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateProduct } from '@/features/catalog/api'
import { ApiError } from '@/lib/api-client'

const schema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(2, 'Product name is required'),
  category: z.string().min(1, 'Select a category'),
  subCategory: z.string().optional(),
  unit: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().min(1),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function ProductFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { category: 'Machines', currency: 'INR' } })

  const createProduct = useCreateProduct()

  async function onSubmit(values: FormValues) {
    try {
      const product = await createProduct.mutateAsync({
        sku: values.sku,
        name: values.name,
        category: values.category as 'Machines' | 'Accessories' | 'Consumables' | 'Spare Parts',
        sub_category: values.subCategory || undefined,
        unit: values.unit || undefined,
        price: values.price ? Number(values.price) : undefined,
        currency: values.currency,
        description: values.description || undefined,
        status: 'active',
      })
      toast.success(`Product ${product.name} created`)
      reset({ category: 'Machines', currency: 'INR', sku: '', name: '', subCategory: '', unit: '', price: '', description: '' })
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create product')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>SKU</Label>
            <Input {...register('sku')} placeholder="HM-MC-1032" />
            {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Machines">Machines</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Consumables">Consumables</SelectItem>
                    <SelectItem value="Spare Parts">Spare Parts</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label>Product name</Label>
            <Input {...register('name')} placeholder="HM CNC Router Pro 1325" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Sub-category</Label>
            <Input {...register('subCategory')} placeholder="CNC Routers" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Unit</Label>
            <Input {...register('unit')} placeholder="Unit" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Price</Label>
            <Input type="number" {...register('price')} placeholder="650000" />
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
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label>Description</Label>
            <Textarea {...register('description')} placeholder="Short product description" rows={2} />
          </div>
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>Create Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
