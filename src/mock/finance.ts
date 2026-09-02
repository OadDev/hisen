import { faker } from '@faker-js/faker'
import { SALES_ORDERS, customerForOrder } from '@/mock/sales-orders'
import { VENDORS } from '@/mock/vendors'

faker.seed(2323)

export interface Invoice {
  id: string
  salesOrderId: string
  customerName: string
  amount: number
  amountPaid: number
  currency: 'INR' | 'USD'
  issuedDate: string
  dueDate: string
  status: 'paid' | 'partially-paid' | 'pending' | 'overdue'
}

export const INVOICES: Invoice[] = SALES_ORDERS.map((order, i) => {
  const customer = customerForOrder(order)
  const dueDate = new Date(order.orderDate)
  dueDate.setDate(dueDate.getDate() + 30)
  const overdue = dueDate < new Date() && order.paymentStatus !== 'paid'
  return {
    id: `INV-${3300 + i}`,
    salesOrderId: order.id,
    customerName: customer?.name ?? 'Unknown',
    amount: order.orderValue,
    amountPaid: order.paymentStatus === 'paid' ? order.orderValue : order.advancePaid,
    currency: order.currency,
    issuedDate: order.orderDate,
    dueDate: dueDate.toISOString(),
    status: overdue ? 'overdue' : order.paymentStatus,
  }
})

export interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: string
  status: 'pending' | 'approved' | 'reimbursed'
  submittedBy: string
}

const EXPENSE_CATEGORIES = ['Travel', 'Site Visit', 'Office Supplies', 'Utilities', 'Marketing', 'Logistics', 'Training']

export const EXPENSES: Expense[] = Array.from({ length: 30 }, (_, i) => ({
  id: `EXP-${900 + i}`,
  category: faker.helpers.arrayElement(EXPENSE_CATEGORIES),
  description: faker.finance.transactionDescription(),
  amount: faker.number.int({ min: 1200, max: 85000 }),
  date: faker.date.recent({ days: 40 }).toISOString(),
  status: faker.helpers.weightedArrayElement([{ value: 'pending', weight: 2 }, { value: 'approved', weight: 3 }, { value: 'reimbursed', weight: 4 }]),
  submittedBy: faker.person.fullName(),
}))

export interface Payable {
  id: string
  vendorName: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
}

export const PAYABLES: Payable[] = Array.from({ length: 20 }, (_, i) => ({
  id: `PAY-${700 + i}`,
  vendorName: faker.helpers.arrayElement(VENDORS).name,
  amount: faker.number.int({ min: 25000, max: 1200000 }),
  dueDate: faker.date.soon({ days: 25 }).toISOString(),
  status: faker.helpers.weightedArrayElement([{ value: 'pending', weight: 3 }, { value: 'paid', weight: 5 }, { value: 'overdue', weight: 1 }]),
}))
