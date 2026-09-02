import { faker } from '@faker-js/faker'
import { CUSTOMERS } from '@/mock/customers'
import { randomStaff, staffById } from '@/mock/staff'

faker.seed(2020)

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed'

export interface ServiceTicket {
  id: string
  customerId: string
  subject: string
  description: string
  machine: string
  priority: TicketPriority
  status: TicketStatus
  engineerId: string
  createdAt: string
  slaDueAt: string
  feedbackRating?: number
}

const ISSUES = [
  'Machine not powering on',
  'Spindle overheating during operation',
  'PLC throwing error code E-204',
  'Coolant leakage from pump',
  'Axis positioning inaccuracy',
  'Touchscreen unresponsive',
  'Unusual noise from gearbox',
  'Software licensing issue',
]

function buildTicket(i: number): ServiceTicket {
  const customer = faker.helpers.arrayElement(CUSTOMERS.filter((c) => c.installedMachines.length > 0))
  const machine = customer?.installedMachines[0]?.productName ?? 'HM CNC Router Pro'
  const status = faker.helpers.weightedArrayElement<TicketStatus>([
    { value: 'open', weight: 2 },
    { value: 'in-progress', weight: 3 },
    { value: 'resolved', weight: 2 },
    { value: 'closed', weight: 4 },
  ])
  const createdAt = faker.date.recent({ days: 45 })
  const slaDueAt = new Date(createdAt)
  slaDueAt.setHours(slaDueAt.getHours() + faker.helpers.arrayElement([4, 8, 24, 48]))

  return {
    id: `TCK-${1100 + i}`,
    customerId: customer?.id ?? CUSTOMERS[0].id,
    subject: faker.helpers.arrayElement(ISSUES),
    description: faker.lorem.sentences(2),
    machine,
    priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent']),
    status,
    engineerId: randomStaff('field_service_engineer').id,
    createdAt: createdAt.toISOString(),
    slaDueAt: slaDueAt.toISOString(),
    feedbackRating: status === 'closed' ? faker.number.int({ min: 3, max: 5 }) : undefined,
  }
}

export const TICKETS: ServiceTicket[] = Array.from({ length: 36 }, (_, i) => buildTicket(i))

export function ticketById(id: string) {
  return TICKETS.find((t) => t.id === id)
}

export function ticketEngineer(ticket: ServiceTicket) {
  return staffById(ticket.engineerId)?.name ?? 'Unassigned'
}

export function ticketCustomer(ticket: ServiceTicket) {
  return CUSTOMERS.find((c) => c.id === ticket.customerId)
}
