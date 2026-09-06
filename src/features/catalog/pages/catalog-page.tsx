import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, List, Video, FileBadge, Wand2, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EntityToolbar } from '@/components/shared/entity-toolbar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProductThumbnail } from '@/components/shared/product-thumbnail'
import { StatusBadge } from '@/components/shared/status-badge'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { useProducts, type ProductCategory } from '@/features/catalog/api'
import { formatCurrency } from '@/lib/utils'

const CATEGORIES: (ProductCategory | 'All')[] = ['All', 'Machines', 'Accessories', 'Consumables', 'Spare Parts']

export function CatalogPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<ProductCategory | 'All'>('All')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const { data, isLoading, isError, error } = useProducts({
    per_page: 200,
    category: category === 'All' ? undefined : category,
    search: query || undefined,
  })
  const filtered = data?.data ?? []

  return (
    <div>
      <PageHeader
        title="Product Catalog"
        description="Machines, accessories, consumables, and spare parts."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/configurator')}>
              <Wand2 /> Machine Configurator
            </Button>
            <EntityToolbar newLabel="New Product" onNew={() => {}} />
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={category} onValueChange={(v) => setCategory(v as ProductCategory | 'All')}>
          <TabsList>
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c}>
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="pl-8" />
          </div>
          <div className="flex rounded-md border p-0.5">
            <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon-sm" onClick={() => setView('grid')}>
              <LayoutGrid className="size-4" />
            </Button>
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon-sm" onClick={() => setView('list')}>
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <PageSkeleton />
      ) : isError ? (
        <EmptyState icon={AlertTriangle} title="Couldn't load products" description={error.message} />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer gap-3 overflow-hidden py-0 transition-shadow hover:shadow-md"
              onClick={() => navigate(`/catalog/${product.id}`)}
            >
              <ProductThumbnail seed={product.sku} category={product.category} className="h-40 rounded-none" />
              <CardContent className="px-4 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-tight">{product.name}</p>
                  <StatusBadge status={product.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{product.sku} · {product.subCategory}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">{formatCurrency(product.price, product.currency)}</p>
                  <div className="flex gap-1.5 text-muted-foreground">
                    {product.hasVideo && <Video className="size-3.5" />}
                    {product.hasPdfCatalog && <FileBadge className="size-3.5" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y rounded-xl border">
          {filtered.map((product) => (
            <button
              key={product.id}
              onClick={() => navigate(`/catalog/${product.id}`)}
              className="flex items-center gap-4 px-4 py-3 text-left hover:bg-accent/50"
            >
              <ProductThumbnail seed={product.sku} category={product.category} className="size-12 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sku} · {product.subCategory}</p>
              </div>
              <Badge variant="outline" className="hidden sm:inline-flex">{product.category}</Badge>
              <p className="w-28 shrink-0 text-right text-sm font-semibold">{formatCurrency(product.price, product.currency)}</p>
              <StatusBadge status={product.status} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
