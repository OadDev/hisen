import { useState } from 'react'
import { Plus, Trash2, Check, ClipboardList } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/empty-state'
import { ProductThumbnail } from '@/components/shared/product-thumbnail'
import { useProducts } from '@/features/catalog/api'
import {
  useAddMachineRequirement,
  useRemoveMachineRequirement,
  useUpdateMachineRequirement,
  type Customer,
} from '@/features/customers/api'
import { formatCurrency } from '@/lib/utils'
import { ApiError } from '@/lib/api-client'

export function MachineRequirementsCard({ customer }: { customer: Customer }) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const addRequirement = useAddMachineRequirement(customer.id)
  const updateRequirement = useUpdateMachineRequirement(customer.id)
  const removeRequirement = useRemoveMachineRequirement(customer.id)

  const requirements = customer.machineRequirements
  const totalValue = requirements.reduce((sum, r) => sum + r.quantity * r.unitPrice, 0)

  async function handleRemove(id: number) {
    try {
      await removeRequirement.mutateAsync(id)
      toast.success('Machine removed from requirements')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to remove machine')
    }
  }

  function handleFieldCommit(id: number, field: 'quantity' | 'unit_price', value: number) {
    if (Number.isNaN(value) || value < 0) return
    updateRequirement.mutate({ id, [field]: value })
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Machine Requirements</CardTitle>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus /> Add Machine
        </Button>
      </CardHeader>
      <CardContent>
        {requirements.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No machine requirements yet"
            description="Pick machines from the catalog to record what this customer is planning to buy — pricing fills in automatically and you can adjust it."
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Machine</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="font-medium">{r.productName}</p>
                      {Object.keys(r.specs).length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.entries(r.specs).slice(0, 3).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="font-normal">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min={1}
                        defaultValue={r.quantity}
                        className="ml-auto w-20 text-right"
                        onBlur={(e) => handleFieldCommit(r.id, 'quantity', e.target.valueAsNumber)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min={0}
                        defaultValue={r.unitPrice}
                        className="ml-auto w-32 text-right"
                        onBlur={(e) => handleFieldCommit(r.id, 'unit_price', e.target.valueAsNumber)}
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(r.quantity * r.unitPrice, customer.currency)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleRemove(r.id)}>
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end border-t pt-3 text-base font-semibold">
              <span className="mr-4 text-muted-foreground font-normal">Total Requirement Value</span>
              <span>{formatCurrency(totalValue, customer.currency)}</span>
            </div>
          </>
        )}
      </CardContent>

      <AddMachineDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={async (productId, quantity, unitPrice) => {
          try {
            await addRequirement.mutateAsync({ product_id: productId, quantity, unit_price: unitPrice })
            toast.success('Machine added to requirements')
            setDialogOpen(false)
          } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Failed to add machine')
          }
        }}
        isPending={addRequirement.isPending}
      />
    </Card>
  )
}

function AddMachineDialog({
  open,
  onOpenChange,
  onAdd,
  isPending,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (productId: number, quantity: number, unitPrice: number) => void
  isPending: boolean
}) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState(0)

  const { data, isLoading } = useProducts({ category: 'Machines', search: search || undefined, per_page: 12 })
  const products = data?.data ?? []
  const selected = products.find((p) => p.id === selectedId)

  function reset() {
    setSearch('')
    setSelectedId(null)
    setQuantity(1)
    setUnitPrice(0)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) reset()
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Machine Requirement</DialogTitle>
        </DialogHeader>

        {!selected ? (
          <div className="flex flex-col gap-3">
            <Input placeholder="Search machines by name..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
            <div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
              {isLoading && <p className="col-span-2 py-6 text-center text-sm text-muted-foreground">Loading machines…</p>}
              {!isLoading && products.length === 0 && (
                <p className="col-span-2 py-6 text-center text-sm text-muted-foreground">No machines found.</p>
              )}
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedId(p.id)
                    setUnitPrice(p.price)
                  }}
                  className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent/50"
                >
                  <ProductThumbnail seed={p.sku} category={p.category} className="size-12 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(p.price, p.currency)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <ProductThumbnail seed={selected.sku} category={selected.category} className="size-14 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{selected.name}</p>
                <p className="text-xs text-muted-foreground">{selected.subCategory}</p>
                {Object.keys(selected.specs).length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {Object.entries(selected.specs).slice(0, 4).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="font-normal">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
                Change
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mr-quantity">Quantity</Label>
                <Input
                  id="mr-quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, e.target.valueAsNumber || 1))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mr-price">Unit Price</Label>
                <Input
                  id="mr-price"
                  type="number"
                  min={0}
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Math.max(0, e.target.valueAsNumber || 0))}
                />
                <p className="text-xs text-muted-foreground">Pre-filled from the catalog price — edit if you're quoting a different rate.</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm">
              <span className="text-muted-foreground">Total Value</span>
              <span className="text-base font-semibold">{formatCurrency(quantity * unitPrice, selected.currency)}</span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {selected && (
            <Button onClick={() => onAdd(selected.id, quantity, unitPrice)} disabled={isPending}>
              <Check /> Add to Requirements
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
