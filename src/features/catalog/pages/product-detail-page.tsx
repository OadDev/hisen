import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, ShieldCheck, Truck, Wand2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductThumbnail } from '@/components/shared/product-thumbnail'
import { EmptyState } from '@/components/shared/empty-state'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { useProduct } from '@/features/catalog/api'
import { formatCurrency } from '@/lib/utils'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading, isError, error } = useProduct(id)

  if (isLoading) {
    return <PageSkeleton />
  }

  if (isError || !product) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Product not found"
        description={error?.message ?? 'This product may have been removed from the catalog.'}
      />
    )
  }

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" onClick={() => navigate('/catalog')}>
        <ArrowLeft /> Back to Catalog
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ProductThumbnail seed={product.sku} category={product.category} className="aspect-square w-full" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductThumbnail key={i} seed={`${product.sku}-${i}`} category={product.category} className="aspect-square" />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{product.subCategory}</Badge>
            <StatusBadge status={product.status} />
            {(product.certifications ?? []).map((c) => (
              <Badge key={c} variant="secondary">{c}</Badge>
            ))}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">SKU: {product.sku} · HSN: {product.hsn}</p>
          <p className="mt-4 text-sm text-foreground/90">{product.description}</p>

          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold">{formatCurrency(product.price, product.currency)}</span>
            <span className="text-sm text-muted-foreground">/ {product.unit}</span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3">
              <ShieldCheck className="size-4 text-muted-foreground" />
              <p className="mt-1.5 text-xs text-muted-foreground">Warranty</p>
              <p className="text-sm font-medium">{product.warrantyMonths || 0} months</p>
            </div>
            <div className="rounded-lg border p-3">
              <Truck className="size-4 text-muted-foreground" />
              <p className="mt-1.5 text-xs text-muted-foreground">Lead Time</p>
              <p className="text-sm font-medium">{product.leadTimeDays} days</p>
            </div>
            <div className="rounded-lg border p-3">
              <FileText className="size-4 text-muted-foreground" />
              <p className="mt-1.5 text-xs text-muted-foreground">Catalog</p>
              <p className="text-sm font-medium">{product.hasPdfCatalog ? 'PDF Available' : 'Not available'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button>
              <FileText /> Add to Quotation
            </Button>
            {product.category === 'Machines' && (
              <Button variant="outline" onClick={() => navigate('/configurator')}>
                <Wand2 /> Configure This Machine
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="specs" className="mt-8">
        <TabsList>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="pricing">Price Lists</TabsTrigger>
          <TabsTrigger value="related">Related Products</TabsTrigger>
        </TabsList>
        <TabsContent value="specs" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Technical Specifications</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {Object.entries(product.specs ?? {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between border-b pb-2 text-sm">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pricing" className="mt-4">
          <EmptyState icon={FileText} title="No alternate price lists" description="Region or currency specific price lists will appear here." />
        </TabsContent>
        <TabsContent value="related" className="mt-4">
          <EmptyState icon={FileText} title="No related products linked" description="Compatible accessories and spare parts will appear here." />
        </TabsContent>
      </Tabs>
    </div>
  )
}
