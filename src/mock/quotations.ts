import { faker } from '@faker-js/faker'
import { CUSTOMERS } from '@/mock/customers'
import { MACHINES } from '@/mock/products'
import { randomStaff, staffById } from '@/mock/staff'

faker.seed(7007)

export type QuotationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'won' | 'lost'

export interface QuotationLineItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  discountPct: number
}

export interface QuotationVersion {
  version: number
  updatedAt: string
  updatedBy: string
  note: string
}

export interface Quotation {
  id: string
  customerId: string
  ownerId: string
  status: QuotationStatus
  currency: 'INR' | 'USD'
  createdAt: string
  validUntil: string
  lineItems: QuotationLineItem[]
  versions: QuotationVersion[]
  discountPct: number
  taxPct: number
}

function buildLineItems(): QuotationLineItem[] {
  const count = faker.number.int({ min: 1, max: 3 })
  return Array.from({ length: count }, (_, i) => {
    const machine = faker.helpers.arrayElement(MACHINES)
    return {
      id: `li-${i}`,
      productName: machine.name,
      quantity: faker.number.int({ min: 1, max: 3 }),
      unitPrice: machine.price,
      discountPct: faker.helpers.arrayElement([0, 2, 5, 8, 10]),
    }
  })
}

function buildQuotation(i: number): Quotation {
  const customer = faker.helpers.arrayElement(CUSTOMERS)
  const status = faker.helpers.weightedArrayElement<QuotationStatus>([
    { value: 'draft', weight: 2 },
    { value: 'pending', weight: 3 },
    { value: 'approved', weight: 2 },
    { value: 'won', weight: 2 },
    { value: 'lost', weight: 1 },
    { value: 'rejected', weight: 1 },
  ])
  const createdAt = faker.date.past({ years: 1 })
  const validUntil = new Date(createdAt)
  validUntil.setDate(validUntil.getDate() + 30)
  const ownerId = randomStaff('sales_executive').id
  const versionCount = faker.number.int({ min: 1, max: 3 })

  return {
    id: `QTN-${2400 + i}`,
    customerId: customer.id,
    ownerId,
    status,
    currency: customer.currency,
    createdAt: createdAt.toISOString(),
    validUntil: validUntil.toISOString(),
    lineItems: buildLineItems(),
    discountPct: faker.helpers.arrayElement([0, 3, 5, 7]),
    taxPct: 18,
    versions: Array.from({ length: versionCount }, (_, v) => ({
      version: v + 1,
      updatedAt: faker.date.between({ from: createdAt, to: new Date() }).toISOString(),
      updatedBy: staffById(ownerId)?.name ?? 'Sales Team',
      note: v === 0 ? 'Initial quotation created' : faker.helpers.arrayElement(['Revised pricing after negotiation', 'Added extraction accessory', 'Updated payment terms', 'Applied special discount']),
    })),
  }
}

export const QUOTATIONS: Quotation[] = Array.from({ length: 42 }, (_, i) => buildQuotation(i))

export function quotationTotal(q: Quotation) {
  const subtotal = q.lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice * (1 - li.discountPct / 100), 0)
  const afterDiscount = subtotal * (1 - q.discountPct / 100)
  const tax = afterDiscount * (q.taxPct / 100)
  return { subtotal, afterDiscount, tax, total: afterDiscount + tax }
}

export function quotationById(id: string) {
  return QUOTATIONS.find((q) => q.id === id)
}
