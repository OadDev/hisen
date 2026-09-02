import { Cog, Package, Droplet, Wrench } from 'lucide-react'
import type { ProductCategory } from '@/mock/products'
import { cn } from '@/lib/utils'

const CATEGORY_ICON: Record<ProductCategory, typeof Cog> = {
  Machines: Cog,
  Accessories: Wrench,
  Consumables: Droplet,
  'Spare Parts': Package,
}

function hashHue(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i)
  return Math.abs(hash) % 360
}

export function ProductThumbnail({ seed, category, className }: { seed: string; category: ProductCategory; className?: string }) {
  const Icon = CATEGORY_ICON[category]
  const hue = hashHue(seed)
  return (
    <div
      className={cn('flex items-center justify-center rounded-lg', className)}
      style={{ background: `linear-gradient(135deg, oklch(0.94 0.03 ${hue}), oklch(0.86 0.06 ${hue + 30}))` }}
    >
      <Icon className="size-1/3 text-black/30" strokeWidth={1.5} />
    </div>
  )
}
