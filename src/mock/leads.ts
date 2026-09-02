import { faker } from '@faker-js/faker'
import { randomStaff, staffById } from '@/mock/staff'
import { MACHINES } from '@/mock/products'

faker.seed(6006)

export type LeadSource = 'Website' | 'WhatsApp' | 'Trade Show' | 'Alibaba' | 'Made-in-China' | 'Email' | 'Referral' | 'Sales Executive'
export type LeadStage = 'Lead' | 'Discussion' | 'Technical Proposal' | 'Quotation' | 'Negotiation' | 'Advance' | 'Won' | 'Lost'

export interface LeadActivity {
  id: string
  type: 'call' | 'meeting' | 'email' | 'whatsapp' | 'note' | 'stage-change'
  title: string
  description?: string
  timestamp: string
  actor: string
}

export interface Lead {
  id: string
  company: string
  contactName: string
  email: string
  phone: string
  country: string
  source: LeadSource
  interestedProduct: string
  estimatedValue: number
  stage: LeadStage
  ownerId: string
  createdAt: string
  lastActivityAt: string
  lostReason?: string
  activities: LeadActivity[]
  nextFollowUp?: string
}

const SOURCES: LeadSource[] = ['Website', 'WhatsApp', 'Trade Show', 'Alibaba', 'Made-in-China', 'Email', 'Referral', 'Sales Executive']
const STAGES: LeadStage[] = ['Lead', 'Discussion', 'Technical Proposal', 'Quotation', 'Negotiation', 'Advance']
const LOST_REASONS = ['Price too high', 'Chose competitor', 'Budget deferred', 'No response', 'Requirement changed', 'Financing not approved']
const COUNTRIES = ['India', 'UAE', 'Saudi Arabia', 'Nigeria', 'Kenya', 'Indonesia', 'Vietnam', 'Bangladesh']

function buildActivities(stage: LeadStage): LeadActivity[] {
  const count = faker.number.int({ min: 2, max: 6 })
  const types: LeadActivity['type'][] = ['call', 'meeting', 'email', 'whatsapp', 'note']
  const activities: LeadActivity[] = Array.from({ length: count }, (_, i) => {
    const type = faker.helpers.arrayElement(types)
    const titles: Record<LeadActivity['type'], string> = {
      call: 'Outbound call',
      meeting: 'Site / video meeting',
      email: 'Email sent',
      whatsapp: 'WhatsApp message',
      note: 'Internal note added',
      'stage-change': 'Stage updated',
    }
    return {
      id: `act-${i}`,
      type,
      title: titles[type],
      description: faker.lorem.sentence(),
      timestamp: faker.date.recent({ days: 45 }).toISOString(),
      actor: randomStaff('sales_executive').name,
    }
  })
  activities.push({
    id: 'act-stage',
    type: 'stage-change',
    title: `Stage moved to ${stage}`,
    timestamp: faker.date.recent({ days: 10 }).toISOString(),
    actor: randomStaff('sales_executive').name,
  })
  return activities.sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp))
}

function buildLead(i: number): Lead {
  const isLost = faker.datatype.boolean(0.18)
  const stage: LeadStage = isLost ? 'Lost' : faker.datatype.boolean(0.08) ? 'Won' : faker.helpers.arrayElement(STAGES)
  const createdAt = faker.date.past({ years: 1 })
  return {
    id: `LD-${2000 + i}`,
    company: `${faker.company.name().replace(/,?\s*(LLC|Inc\.?|Ltd\.?)$/i, '')} ${faker.helpers.arrayElement(['Industries', 'Engineering', 'Manufacturing Co.', 'Trading LLC'])}`,
    contactName: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number(),
    country: faker.helpers.arrayElement(COUNTRIES),
    source: faker.helpers.arrayElement(SOURCES),
    interestedProduct: faker.helpers.arrayElement(MACHINES).name,
    estimatedValue: faker.number.int({ min: 350000, max: 9500000 }),
    stage,
    ownerId: randomStaff('sales_executive').id,
    createdAt: createdAt.toISOString(),
    lastActivityAt: faker.date.recent({ days: 20 }).toISOString(),
    lostReason: isLost ? faker.helpers.arrayElement(LOST_REASONS) : undefined,
    activities: buildActivities(stage),
    nextFollowUp: stage !== 'Lost' && stage !== 'Won' ? faker.date.soon({ days: 14 }).toISOString() : undefined,
  }
}

export const LEADS: Lead[] = Array.from({ length: 64 }, (_, i) => buildLead(i))

export function leadById(id: string) {
  return LEADS.find((l) => l.id === id)
}

export function leadOwnerName(lead: Lead) {
  return staffById(lead.ownerId)?.name ?? 'Unassigned'
}

export const PIPELINE_STAGES: LeadStage[] = ['Lead', 'Discussion', 'Technical Proposal', 'Quotation', 'Negotiation', 'Advance', 'Won']
