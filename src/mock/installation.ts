import { faker } from '@faker-js/faker'
import { SHIPMENTS } from '@/mock/dispatch'
import { randomStaff } from '@/mock/staff'

faker.seed(1919)

export interface InstallationJob {
  id: string
  salesOrderId: string
  customerName: string
  engineerId: string
  scheduledDate: string
  status: 'scheduled' | 'in-progress' | 'completed'
  checklistDone: number
  checklistTotal: number
  customerSigned: boolean
  trainingCompleted: boolean
}

export const INSTALLATIONS: InstallationJob[] = SHIPMENTS.slice(0, 16).map((s, i) => {
  const checklistTotal = 12
  const status = faker.helpers.weightedArrayElement<InstallationJob['status']>([
    { value: 'scheduled', weight: 2 },
    { value: 'in-progress', weight: 2 },
    { value: 'completed', weight: 5 },
  ])
  return {
    id: `INS-${900 + i}`,
    salesOrderId: s.salesOrderId,
    customerName: s.customerName,
    engineerId: randomStaff('field_service_engineer').id,
    scheduledDate: faker.date.soon({ days: 25 }).toISOString(),
    status,
    checklistDone: status === 'completed' ? checklistTotal : status === 'in-progress' ? faker.number.int({ min: 3, max: 10 }) : 0,
    checklistTotal,
    customerSigned: status === 'completed',
    trainingCompleted: status === 'completed' ? faker.datatype.boolean(0.85) : false,
  }
})
