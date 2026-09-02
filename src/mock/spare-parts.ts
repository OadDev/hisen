import { faker } from '@faker-js/faker'
import { PRODUCTS } from '@/mock/products'

faker.seed(2121)

export interface SparePartStock {
  id: string
  name: string
  sku: string
  compatibleMachines: string[]
  quantity: number
  reorderLevel: number
  warrantyClaimable: boolean
  price: number
}

const SPARES = PRODUCTS.filter((p) => p.category === 'Spare Parts')

export const SPARE_PARTS_STOCK: SparePartStock[] = SPARES.map((p, i) => ({
  id: `SP-${i}`,
  name: p.name,
  sku: p.sku,
  compatibleMachines: faker.helpers.arrayElements(['HM CNC Router Pro', 'HM Laser Cutter X2', 'HM VMC 1325', 'HM Plasma Cutter Edge'], { min: 1, max: 3 }),
  quantity: faker.number.int({ min: 0, max: 120 }),
  reorderLevel: faker.number.int({ min: 5, max: 30 }),
  warrantyClaimable: faker.datatype.boolean(0.4),
  price: p.price,
}))

export interface WarrantyClaim {
  id: string
  partName: string
  customerName: string
  status: 'submitted' | 'under-review' | 'approved' | 'rejected'
  submittedOn: string
}

export const WARRANTY_CLAIMS: WarrantyClaim[] = Array.from({ length: 10 }, (_, i) => ({
  id: `WC-${300 + i}`,
  partName: faker.helpers.arrayElement(SPARE_PARTS_STOCK).name,
  customerName: faker.company.name(),
  status: faker.helpers.weightedArrayElement([{ value: 'submitted', weight: 2 }, { value: 'under-review', weight: 2 }, { value: 'approved', weight: 3 }, { value: 'rejected', weight: 1 }]),
  submittedOn: faker.date.recent({ days: 30 }).toISOString(),
}))
