import { faker } from '@faker-js/faker'
import { randomStaff } from '@/mock/staff'

faker.seed(2424)

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  entity: string
  module: string
  timestamp: string
  ipAddress: string
}

const ACTIONS = [
  { action: 'Created', entity: 'Quotation QTN-2451', module: 'Sales' },
  { action: 'Approved', entity: 'Purchase Order PO-4482', module: 'Purchase' },
  { action: 'Updated', entity: 'Customer Continental Fabricators', module: 'CRM' },
  { action: 'Deleted', entity: 'Draft Quotation QTN-2390', module: 'Sales' },
  { action: 'Changed status', entity: 'Work Order WO-2214', module: 'Production' },
  { action: 'Logged in', entity: 'Session', module: 'System' },
  { action: 'Updated permissions for', entity: 'Sales Executive role', module: 'Administration' },
  { action: 'Approved', entity: 'Warranty Claim WC-304', module: 'Service' },
  { action: 'Exported', entity: 'Finance report (Q2 FY26-27)', module: 'Finance' },
]

export const AUDIT_LOGS: AuditLogEntry[] = Array.from({ length: 40 }, (_, i) => {
  const item = faker.helpers.arrayElement(ACTIONS)
  return {
    id: `LOG-${10000 + i}`,
    actor: randomStaff().name,
    action: item.action,
    entity: item.entity,
    module: item.module,
    timestamp: faker.date.recent({ days: 15 }).toISOString(),
    ipAddress: faker.internet.ipv4(),
  }
}).sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
