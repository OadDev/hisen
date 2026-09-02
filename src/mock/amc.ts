import { faker } from '@faker-js/faker'
import { CUSTOMERS } from '@/mock/customers'
import { randomStaff, staffById } from '@/mock/staff'

faker.seed(2222)

export interface AmcContract {
  id: string
  customerId: string
  customerName: string
  machine: string
  serialNumber: string
  startDate: string
  endDate: string
  visitsPerYear: number
  visitsCompleted: number
  value: number
  status: 'active' | 'expiring-soon' | 'expired'
  assignedEngineerId: string
}

const contracts: AmcContract[] = []
let counter = 0
for (const customer of CUSTOMERS) {
  for (const machine of customer.installedMachines) {
    if (!machine.amcActive) continue
    const start = faker.date.past({ years: 1 })
    const end = new Date(start)
    end.setFullYear(end.getFullYear() + 1)
    const daysToExpiry = (+end - Date.now()) / (1000 * 60 * 60 * 24)
    contracts.push({
      id: `AMC-${5000 + counter}`,
      customerId: customer.id,
      customerName: customer.name,
      machine: machine.productName,
      serialNumber: machine.serialNumber,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      visitsPerYear: 4,
      visitsCompleted: faker.number.int({ min: 0, max: 4 }),
      value: faker.number.int({ min: 45000, max: 280000 }),
      status: daysToExpiry < 0 ? 'expired' : daysToExpiry < 30 ? 'expiring-soon' : 'active',
      assignedEngineerId: randomStaff('field_service_engineer').id,
    })
    counter++
  }
}

export const AMC_CONTRACTS: AmcContract[] = contracts

export function amcEngineerName(contract: AmcContract) {
  return staffById(contract.assignedEngineerId)?.name ?? 'Unassigned'
}
