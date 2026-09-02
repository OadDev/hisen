import { faker } from '@faker-js/faker'
import { SALES_ORDERS, customerForOrder } from '@/mock/sales-orders'

faker.seed(1818)

export interface Shipment {
  id: string
  salesOrderId: string
  customerName: string
  destination: string
  containerNo?: string
  mode: 'road' | 'sea' | 'air'
  status: 'packing' | 'ready' | 'in-transit' | 'delivered'
  dispatchDate: string
  eta: string
  exportDocsReady: boolean
}

export const SHIPMENTS: Shipment[] = SALES_ORDERS.filter((o) => ['dispatched', 'installed', 'completed'].includes(o.status))
  .slice(0, 24)
  .map((order, i) => {
    const customer = customerForOrder(order)
    const isExport = customer?.currency === 'USD'
    return {
      id: `SHP-${8800 + i}`,
      salesOrderId: order.id,
      customerName: customer?.name ?? 'Unknown',
      destination: customer?.branches[0] ? `${customer.branches[0].city}, ${customer.branches[0].country}` : 'Unknown',
      containerNo: isExport ? `MSCU${faker.string.numeric(7)}` : undefined,
      mode: isExport ? faker.helpers.arrayElement(['sea', 'air']) : 'road',
      status: faker.helpers.weightedArrayElement([{ value: 'packing', weight: 2 }, { value: 'ready', weight: 2 }, { value: 'in-transit', weight: 2 }, { value: 'delivered', weight: 4 }]),
      dispatchDate: faker.date.recent({ days: 25 }).toISOString(),
      eta: faker.date.soon({ days: 15 }).toISOString(),
      exportDocsReady: faker.datatype.boolean(0.7),
    }
  })
