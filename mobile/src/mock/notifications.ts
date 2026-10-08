// Placeholder data, mirroring the web app's src/mock/notifications.ts.
// Real push notifications need a backend notifications table + FCM/APNs
// wiring -- not yet built on either client (tracked as Phase 2+ work).

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
  ['service', 'New service ticket', 'High priority ticket raised by Continental Fabricators.'],
  ['finance', 'Payment received', 'Payment of ₹4,50,000 received against INV-3382.'],
  ['finance', 'Invoice overdue', 'Invoice INV-3310 is 12 days overdue.'],
  ['system', 'New user added', 'A new field service engineer account was created.'],
]

export const NOTIFICATIONS: AppNotification[] = Array.from({ length: 10 }, (_, i) => {
  const [category, title, description] = TEMPLATES[i % TEMPLATES.length]
  const hoursAgo = i * 7 + 1
  return {
    id: `ntf-${i}`,
    title,
    description,
    timestamp: new Date(Date.now() - hoursAgo * 3600_000).toISOString(),
    read: i > 3,
    category,
  }
})
