import { faker } from '@faker-js/faker'

faker.seed(1414)

export interface Vendor {
  id: string
  name: string
  category: string
  city: string
  country: string
  rating: number
  onTimeDeliveryPct: number
  qualityScore: number
  leadTimeDays: number
  certifications: string[]
  totalOrders: number
  totalSpend: number
  status: 'active' | 'inactive' | 'blacklisted'
}

const CATEGORIES = ['Raw Materials', 'Electrical Components', 'Servo & Motion', 'Machined Parts', 'Consumables', 'Logistics']

function buildVendor(i: number): Vendor {
  return {
    id: `VND-${1000 + i}`,
    name: `${faker.company.name().replace(/,?\s*(LLC|Inc\.?|Ltd\.?)$/i, '')} ${faker.helpers.arrayElement(['Suppliers', 'Industries', 'Components Pvt. Ltd.', 'Trading Co.'])}`,
    category: faker.helpers.arrayElement(CATEGORIES),
    city: faker.location.city(),
    country: faker.helpers.arrayElement(['India', 'China', 'Germany', 'Taiwan', 'South Korea']),
    rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
    onTimeDeliveryPct: faker.number.int({ min: 70, max: 99 }),
    qualityScore: faker.number.int({ min: 75, max: 99 }),
    leadTimeDays: faker.number.int({ min: 5, max: 45 }),
    certifications: faker.helpers.arrayElements(['ISO 9001', 'ISO 14001', 'CE', 'RoHS'], { min: 0, max: 3 }),
    totalOrders: faker.number.int({ min: 5, max: 120 }),
    totalSpend: faker.number.int({ min: 200000, max: 12000000 }),
    status: faker.helpers.weightedArrayElement([{ value: 'active', weight: 9 }, { value: 'inactive', weight: 1 }]),
  }
}

export const VENDORS: Vendor[] = Array.from({ length: 26 }, (_, i) => buildVendor(i))

export function vendorById(id: string) {
  return VENDORS.find((v) => v.id === id)
}
