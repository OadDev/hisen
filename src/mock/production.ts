import { faker } from '@faker-js/faker'
import { SALES_ORDERS } from '@/mock/sales-orders'
import { MACHINES } from '@/mock/products'
import { randomStaff, staffById } from '@/mock/staff'

faker.seed(9009)

export type WorkOrderStage = 'Assembly' | 'Electrical' | 'PLC Programming' | 'Testing' | 'Final QC' | 'Dispatch Ready'

export interface WorkOrder {
  id: string
  salesOrderId: string
  machineName: string
  stage: WorkOrderStage
  progress: number
  assignedEngineerId: string
  startDate: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  status: 'on-track' | 'delayed' | 'completed'
}

const STAGES: WorkOrderStage[] = ['Assembly', 'Electrical', 'PLC Programming', 'Testing', 'Final QC', 'Dispatch Ready']

function buildWorkOrder(i: number): WorkOrder {
  const so = SALES_ORDERS[i % SALES_ORDERS.length]
  const startDate = faker.date.recent({ days: 45 })
  const dueDate = new Date(startDate)
  dueDate.setDate(dueDate.getDate() + faker.number.int({ min: 15, max: 40 }))
  const status = faker.helpers.weightedArrayElement<WorkOrder['status']>([
    { value: 'on-track', weight: 6 },
    { value: 'delayed', weight: 2 },
    { value: 'completed', weight: 3 },
  ])
  return {
    id: `WO-${2100 + i}`,
    salesOrderId: so.id,
    machineName: faker.helpers.arrayElement(MACHINES).name,
    stage: status === 'completed' ? 'Dispatch Ready' : faker.helpers.arrayElement(STAGES),
    progress: status === 'completed' ? 100 : faker.number.int({ min: 5, max: 95 }),
    assignedEngineerId: randomStaff('production_engineer').id,
    startDate: startDate.toISOString(),
    dueDate: dueDate.toISOString(),
    priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
    status,
  }
}

export const WORK_ORDERS: WorkOrder[] = Array.from({ length: 30 }, (_, i) => buildWorkOrder(i))

export function workOrderById(id: string) {
  return WORK_ORDERS.find((w) => w.id === id)
}

export function engineerName(wo: WorkOrder) {
  return staffById(wo.assignedEngineerId)?.name ?? 'Unassigned'
}

export const WORK_ORDER_STAGES = STAGES

export interface MrpRequirement {
  id: string
  component: string
  required: number
  inStock: number
  onOrder: number
  unit: string
  shortfall: number
}

export const MRP_REQUIREMENTS: MrpRequirement[] = Array.from({ length: 16 }, (_, i) => {
  const required = faker.number.int({ min: 20, max: 400 })
  const inStock = faker.number.int({ min: 0, max: required })
  const onOrder = faker.number.int({ min: 0, max: required - inStock })
  return {
    id: `MRP-${i}`,
    component: faker.helpers.arrayElement(['Servo Motor', 'Ball Screw Assembly', 'Linear Guide Rail', 'PLC Module', 'Spindle Unit', 'Control Panel', 'Timing Belt', 'Limit Switch', 'Cable Harness', 'Cooling Fan']),
    required,
    inStock,
    onOrder,
    unit: 'pcs',
    shortfall: Math.max(0, required - inStock - onOrder),
  }
})
