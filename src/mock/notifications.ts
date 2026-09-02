import { faker } from '@faker-js/faker'

faker.seed(4004)

export interface AppNotification {
  id: string
  title: string
  description: string
  timestamp: string
  read: boolean
  category: 'sales' | 'production' | 'inventory' | 'service' | 'finance' | 'system'
}

const TEMPLATES: Array<[AppNotification['category'], string, string]> = [
  ['sales', 'New lead assigned', 'A new website lead has been assigned to you.'],
  ['sales', 'Quotation approved', 'Quotation QTN-2451 has been approved by the customer.'],
  ['production', 'Work order delayed', 'WO-2214 electrical stage is running behind schedule.'],
  ['production', 'QC failed', 'Final QC failed for Work Order WO-2198 — NCR raised.'],
  ['inventory', 'Reorder alert', 'Stock for Servo Drive Board has fallen below reorder level.'],
  ['inventory', 'Stock transfer received', 'Transfer TRF-118 has been received at Warehouse B.'],
  ['service', 'New service ticket', 'High priority ticket raised by Continental Fabricators.'],
  ['service', 'AMC renewal due', 'AMC for HM CNC Router Pro 1325 expires in 15 days.'],
  ['finance', 'Payment received', 'Payment of ₹4,50,000 received against INV-3382.'],
  ['finance', 'Invoice overdue', 'Invoice INV-3310 is 12 days overdue.'],
  ['system', 'New user added', 'A new field service engineer account was created.'],
]

export const NOTIFICATIONS: AppNotification[] = Array.from({ length: 14 }, (_, i) => {
  const [category, title, description] = TEMPLATES[i % TEMPLATES.length]
  return {
    id: `ntf-${i}`,
    title,
    description,
    timestamp: faker.date.recent({ days: 6 }).toISOString(),
    read: i > 4,
    category,
  }
}).sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
