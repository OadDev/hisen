import { faker } from '@faker-js/faker'
import { PRODUCTS } from '@/mock/products'

faker.seed(1616)

export interface Warehouse {
  id: string
  name: string
  city: string
  type: 'main' | 'regional' | 'bonded'
  capacityPct: number
  binLocations: number
}

export const WAREHOUSES: Warehouse[] = [
  { id: 'WH-01', name: 'WH-Ahmedabad (Main)', city: 'Ahmedabad', type: 'main', capacityPct: 78, binLocations: 340 },
  { id: 'WH-02', name: 'WH-Pune', city: 'Pune', type: 'regional', capacityPct: 62, binLocations: 180 },
  { id: 'WH-03', name: 'WH-Chennai', city: 'Chennai', type: 'regional', capacityPct: 45, binLocations: 150 },
  { id: 'WH-04', name: 'WH-Export Bonded', city: 'Mundra', type: 'bonded', capacityPct: 88, binLocations: 90 },
]

export interface StockItem {
  id: string
  sku: string
  name: string
  category: string
  warehouseId: string
  binLocation: string
  quantity: number
  reorderLevel: number
  unit: string
  batchNumber?: string
  agingDays: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

function buildStockItem(i: number): StockItem {
  const product = PRODUCTS[i % PRODUCTS.length]
  const reorderLevel = faker.number.int({ min: 5, max: 60 })
  const quantity = faker.number.int({ min: 0, max: reorderLevel * 4 })
  return {
    id: `STK-${1000 + i}`,
    sku: product.sku,
    name: product.name,
    category: product.category,
    warehouseId: faker.helpers.arrayElement(WAREHOUSES).id,
    binLocation: `${faker.string.alpha({ length: 1, casing: 'upper' })}-${faker.number.int({ min: 1, max: 24 })}-${faker.number.int({ min: 1, max: 6 })}`,
    quantity,
    reorderLevel,
    unit: product.unit,
    batchNumber: product.category === 'Consumables' ? `BATCH-${faker.string.numeric(6)}` : undefined,
    agingDays: faker.number.int({ min: 1, max: 380 }),
    status: quantity === 0 ? 'out_of_stock' : quantity < reorderLevel ? 'low_stock' : 'in_stock',
  }
}

export const STOCK_ITEMS: StockItem[] = Array.from({ length: 60 }, (_, i) => buildStockItem(i))

export interface StockTransfer {
  id: string
  item: string
  quantity: number
  fromWarehouse: string
  toWarehouse: string
  status: 'pending' | 'in-transit' | 'completed'
  requestedDate: string
}

export const STOCK_TRANSFERS: StockTransfer[] = Array.from({ length: 14 }, (_, i) => {
  const [from, to] = faker.helpers.arrayElements(WAREHOUSES, 2)
  return {
    id: `TRF-${100 + i}`,
    item: faker.helpers.arrayElement(STOCK_ITEMS).name,
    quantity: faker.number.int({ min: 5, max: 100 }),
    fromWarehouse: from.name,
    toWarehouse: to.name,
    status: faker.helpers.weightedArrayElement([{ value: 'pending', weight: 2 }, { value: 'in-transit', weight: 2 }, { value: 'completed', weight: 4 }]),
    requestedDate: faker.date.recent({ days: 20 }).toISOString(),
  }
})
