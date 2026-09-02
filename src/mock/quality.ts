import { faker } from '@faker-js/faker'
import { WORK_ORDERS } from '@/mock/production'
import { randomStaff } from '@/mock/staff'

faker.seed(1717)

export type QcStage = 'Incoming' | 'Assembly' | 'Electrical' | 'PLC' | 'Final' | 'Packing'

export interface QcInspection {
  id: string
  workOrderId: string
  stage: QcStage
  inspectorId: string
  date: string
  result: 'passed' | 'failed' | 'pending'
  checklistItems: number
  checklistPassed: number
}

const STAGES: QcStage[] = ['Incoming', 'Assembly', 'Electrical', 'PLC', 'Final', 'Packing']

export const QC_INSPECTIONS: QcInspection[] = Array.from({ length: 40 }, (_, i) => {
  const checklistItems = faker.number.int({ min: 8, max: 20 })
  const result = faker.helpers.weightedArrayElement<QcInspection['result']>([
    { value: 'passed', weight: 7 },
    { value: 'failed', weight: 1 },
    { value: 'pending', weight: 2 },
  ])
  return {
    id: `QC-${7700 + i}`,
    workOrderId: faker.helpers.arrayElement(WORK_ORDERS).id,
    stage: faker.helpers.arrayElement(STAGES),
    inspectorId: randomStaff('quality_manager').id,
    date: faker.date.recent({ days: 30 }).toISOString(),
    result,
    checklistItems,
    checklistPassed: result === 'passed' ? checklistItems : result === 'failed' ? faker.number.int({ min: 0, max: checklistItems - 1 }) : 0,
  }
})

export interface Ncr {
  id: string
  workOrderId: string
  stage: QcStage
  description: string
  severity: 'minor' | 'major' | 'critical'
  status: 'open' | 'under-review' | 'closed'
  raisedBy: string
  raisedOn: string
}

const DEFECTS = ['Spindle vibration out of tolerance', 'Paint finish defect on frame', 'Wiring harness incorrectly routed', 'PLC program version mismatch', 'Dimensional deviation on base plate', 'Loose fastener on gantry assembly']

export const NCRS: Ncr[] = Array.from({ length: 12 }, (_, i) => ({
  id: `NCR-${100 + i}`,
  workOrderId: faker.helpers.arrayElement(WORK_ORDERS).id,
  stage: faker.helpers.arrayElement(STAGES),
  description: faker.helpers.arrayElement(DEFECTS),
  severity: faker.helpers.arrayElement(['minor', 'major', 'critical']),
  status: faker.helpers.weightedArrayElement([{ value: 'open', weight: 2 }, { value: 'under-review', weight: 2 }, { value: 'closed', weight: 3 }]),
  raisedBy: randomStaff('quality_manager').name,
  raisedOn: faker.date.recent({ days: 40 }).toISOString(),
}))

export const QC_STAGES = STAGES
