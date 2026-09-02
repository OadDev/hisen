import { faker } from '@faker-js/faker'
import { CUSTOMERS } from '@/mock/customers'
import { QUOTATIONS, quotationTotal } from '@/mock/quotations'
import { randomStaff } from '@/mock/staff'

faker.seed(8008)

export type SalesOrderStatus = 'pending' | 'in-progress' | 'production' | 'dispatched' | 'installed' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'partially-paid' | 'paid' | 'overdue'

export interface SalesOrder {
  id: string
  quotationId: string
  customerId: string
  ownerId: string
  status: SalesOrderStatus
  paymentStatus: PaymentStatus
  orderValue: number
  advancePaid: number
  currency: 'INR' | 'USD'
  orderDate: string
  expectedDispatch: string
  productionProgress: number
}

const wonQuotations = QUOTATIONS.filter((q) => q.status === 'won' || q.status === 'approved')

function buildOrder(i: number): SalesOrder {
  const quotation = wonQuotations[i % wonQuotations.length] ?? QUOTATIONS[i % QUOTATIONS.length]
  const { total } = quotationTotal(quotation)
  const status = faker.helpers.weightedArrayElement<SalesOrderStatus>([
    { value: 'pending', weight: 2 },
    { value: 'in-progress', weight: 2 },
    { value: 'production', weight: 3 },
    { value: 'dispatched', weight: 2 },
    { value: 'installed', weight: 2 },
    { value: 'completed', weight: 3 },
    { value: 'cancelled', weight: 1 },
  ])
  const orderDate = faker.date.past({ years: 1 })
  const dispatch = new Date(orderDate)
  dispatch.setDate(dispatch.getDate() + faker.number.int({ min: 25, max: 70 }))
  const advancePct = faker.helpers.arrayElement([0.3, 0.4, 0.5])

  return {
    id: `SO-${3300 + i}`,
    quotationId: quotation.id,
    customerId: quotation.customerId,
    ownerId: randomStaff('sales_executive').id,
    status,
    paymentStatus: faker.helpers.weightedArrayElement<PaymentStatus>([
      { value: 'pending', weight: 2 },
      { value: 'partially-paid', weight: 3 },
      { value: 'paid', weight: 4 },
      { value: 'overdue', weight: 1 },
    ]),
    orderValue: Math.round(total),
    advancePaid: Math.round(total * advancePct),
    currency: quotation.currency,
    orderDate: orderDate.toISOString(),
    expectedDispatch: dispatch.toISOString(),
    productionProgress: faker.number.int({ min: 0, max: 100 }),
  }
}

export const SALES_ORDERS: SalesOrder[] = Array.from({ length: 38 }, (_, i) => buildOrder(i))

export function salesOrderById(id: string) {
  return SALES_ORDERS.find((o) => o.id === id)
}

export function customerForOrder(order: SalesOrder) {
  return CUSTOMERS.find((c) => c.id === order.customerId)
}
