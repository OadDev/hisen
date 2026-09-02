import { faker } from '@faker-js/faker'
import { VENDORS } from '@/mock/vendors'

faker.seed(1515)

const COMPONENTS = ['Servo Motor', 'Ball Screw Assembly', 'Linear Guide Rail', 'PLC Module', 'Spindle Unit', 'Control Panel', 'Steel Plate 10mm', 'Aluminium Extrusion', 'Cooling Fan', 'Cable Harness']

export interface Rfq {
  id: string
  item: string
  quantity: number
  vendorsInvited: number
  quotesReceived: number
  status: 'open' | 'closed' | 'awarded'
  dueDate: string
}

export const RFQS: Rfq[] = Array.from({ length: 18 }, (_, i) => ({
  id: `RFQ-${5100 + i}`,
  item: faker.helpers.arrayElement(COMPONENTS),
  quantity: faker.number.int({ min: 10, max: 300 }),
  vendorsInvited: faker.number.int({ min: 2, max: 6 }),
  quotesReceived: faker.number.int({ min: 0, max: 6 }),
  status: faker.helpers.weightedArrayElement([{ value: 'open', weight: 3 }, { value: 'closed', weight: 2 }, { value: 'awarded', weight: 3 }]),
  dueDate: faker.date.soon({ days: 20 }).toISOString(),
}))

export interface PurchaseOrder {
  id: string
  vendorId: string
  item: string
  quantity: number
  unitPrice: number
  totalValue: number
  status: 'draft' | 'pending' | 'approved' | 'dispatched' | 'received' | 'cancelled'
  orderDate: string
  expectedDelivery: string
}

export const PURCHASE_ORDERS: PurchaseOrder[] = Array.from({ length: 32 }, (_, i) => {
  const quantity = faker.number.int({ min: 10, max: 200 })
  const unitPrice = faker.number.int({ min: 500, max: 45000 })
  return {
    id: `PO-${4400 + i}`,
    vendorId: faker.helpers.arrayElement(VENDORS).id,
    item: faker.helpers.arrayElement(COMPONENTS),
    quantity,
    unitPrice,
    totalValue: quantity * unitPrice,
    status: faker.helpers.weightedArrayElement([
      { value: 'draft', weight: 1 },
      { value: 'pending', weight: 2 },
      { value: 'approved', weight: 2 },
      { value: 'dispatched', weight: 2 },
      { value: 'received', weight: 3 },
      { value: 'cancelled', weight: 1 },
    ]),
    orderDate: faker.date.past({ years: 1 }).toISOString(),
    expectedDelivery: faker.date.soon({ days: 30 }).toISOString(),
  }
})

export interface GoodsReceipt {
  id: string
  poId: string
  item: string
  quantityReceived: number
  quantityOrdered: number
  receivedDate: string
  qcStatus: 'pending' | 'passed' | 'failed'
  warehouse: string
}

export const GOODS_RECEIPTS: GoodsReceipt[] = PURCHASE_ORDERS.filter((po) => po.status === 'received' || po.status === 'dispatched')
  .slice(0, 20)
  .map((po, i) => ({
    id: `GRN-${6600 + i}`,
    poId: po.id,
    item: po.item,
    quantityReceived: po.quantity - faker.number.int({ min: 0, max: 5 }),
    quantityOrdered: po.quantity,
    receivedDate: faker.date.recent({ days: 30 }).toISOString(),
    qcStatus: faker.helpers.weightedArrayElement([{ value: 'passed', weight: 6 }, { value: 'pending', weight: 2 }, { value: 'failed', weight: 1 }]),
    warehouse: faker.helpers.arrayElement(['WH-Ahmedabad (Main)', 'WH-Pune', 'WH-Chennai']),
  }))
