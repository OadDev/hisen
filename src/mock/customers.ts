import { faker } from '@faker-js/faker'
import { staffById, randomStaff } from '@/mock/staff'
import { MACHINES } from '@/mock/products'

faker.seed(3003)

export interface ContactPerson {
  id: string
  name: string
  designation: string
  email: string
  phone: string
  isPrimary: boolean
}

export interface Branch {
  id: string
  name: string
  city: string
  state: string
  country: string
  address: string
  isHeadOffice: boolean
}

export interface InstalledMachine {
  id: string
  productName: string
  serialNumber: string
  installedOn: string
  warrantyEndsOn: string
  amcActive: boolean
  status: 'operational' | 'under-service' | 'decommissioned'
}

export interface Customer {
  id: string
  name: string
  logoSeed: string
  industry: string
  gstin: string
  panNumber: string
  currency: 'INR' | 'USD'
  creditLimit: number
  creditDays: number
  accountOwnerId: string
  status: 'active' | 'inactive' | 'prospect'
  tags: string[]
  branches: Branch[]
  contacts: ContactPerson[]
  installedMachines: InstalledMachine[]
  lifetimeValue: number
  createdAt: string
}

const INDUSTRIES = ['Automotive Components', 'Sheet Metal Fabrication', 'Furniture Manufacturing', 'Aerospace Parts', 'Signage & Advertising', 'General Engineering', 'Electronics Enclosures', 'Packaging Machinery']
const CITIES: Array<[string, string, string]> = [
  ['Ahmedabad', 'Gujarat', 'India'],
  ['Pune', 'Maharashtra', 'India'],
  ['Coimbatore', 'Tamil Nadu', 'India'],
  ['Rajkot', 'Gujarat', 'India'],
  ['Ludhiana', 'Punjab', 'India'],
  ['Dubai', 'Dubai', 'UAE'],
  ['Riyadh', 'Riyadh', 'Saudi Arabia'],
  ['Lagos', 'Lagos', 'Nigeria'],
  ['Nairobi', 'Nairobi', 'Kenya'],
  ['Jakarta', 'Jakarta', 'Indonesia'],
]

function buildBranches(companyName: string, count: number): Branch[] {
  return Array.from({ length: count }, (_, i) => {
    const [city, state, country] = faker.helpers.arrayElement(CITIES)
    return {
      id: `BR-${faker.string.alphanumeric(6).toUpperCase()}`,
      name: i === 0 ? `${companyName} - Head Office` : `${companyName} - ${city} Branch`,
      city,
      state,
      country,
      address: faker.location.streetAddress(),
      isHeadOffice: i === 0,
    }
  })
}

function buildContacts(count: number): ContactPerson[] {
  return Array.from({ length: count }, (_, i) => {
    const name = faker.person.fullName()
    return {
      id: `CT-${faker.string.alphanumeric(6).toUpperCase()}`,
      name,
      designation: faker.helpers.arrayElement(['Procurement Manager', 'Plant Head', 'Managing Director', 'Production Manager', 'Purchase Executive']),
      email: faker.internet.email({ firstName: name.split(' ')[0] }).toLowerCase(),
      phone: faker.phone.number(),
      isPrimary: i === 0,
    }
  })
}

function buildInstalledMachines(count: number): InstalledMachine[] {
  return Array.from({ length: count }, () => {
    const machine = faker.helpers.arrayElement(MACHINES)
    const installedOn = faker.date.past({ years: 4 })
    const warrantyEnds = new Date(installedOn)
    warrantyEnds.setMonth(warrantyEnds.getMonth() + faker.helpers.arrayElement([12, 18, 24]))
    return {
      id: `IM-${faker.string.alphanumeric(8).toUpperCase()}`,
      productName: machine.name,
      serialNumber: `HSN-${faker.string.numeric(8)}`,
      installedOn: installedOn.toISOString(),
      warrantyEndsOn: warrantyEnds.toISOString(),
      amcActive: faker.datatype.boolean(0.55),
      status: faker.helpers.weightedArrayElement([
        { value: 'operational', weight: 8 },
        { value: 'under-service', weight: 1 },
        { value: 'decommissioned', weight: 1 },
      ]),
    }
  })
}

function buildCustomer(i: number): Customer {
  const name = `${faker.company.name().replace(/,?\s*(LLC|Inc\.?|Ltd\.?|Group)$/i, '')} ${faker.helpers.arrayElement(['Industries', 'Engineering Works', 'Manufacturing', 'Machine Tools', 'Fabricators', 'Pvt. Ltd.'])}`
  return {
    id: `CUS-${1000 + i}`,
    name,
    logoSeed: `cust-${i}`,
    industry: faker.helpers.arrayElement(INDUSTRIES),
    gstin: `${faker.number.int({ min: 10, max: 36 })}ABCDE${faker.number.int({ min: 1000, max: 9999 })}F1Z${faker.number.int({ min: 1, max: 9 })}`,
    panNumber: `ABCDE${faker.number.int({ min: 1000, max: 9999 })}F`,
    currency: faker.helpers.weightedArrayElement([{ value: 'INR', weight: 7 }, { value: 'USD', weight: 3 }]),
    creditLimit: faker.number.int({ min: 100000, max: 5000000 }),
    creditDays: faker.helpers.arrayElement([0, 15, 30, 45, 60]),
    accountOwnerId: randomStaff('sales_executive').id,
    status: faker.helpers.weightedArrayElement([{ value: 'active', weight: 7 }, { value: 'prospect', weight: 2 }, { value: 'inactive', weight: 1 }]),
    tags: faker.helpers.arrayElements(['Key Account', 'Export', 'AMC Customer', 'High Value', 'New'], { min: 0, max: 2 }),
    branches: buildBranches(name, faker.number.int({ min: 1, max: 3 })),
    contacts: buildContacts(faker.number.int({ min: 1, max: 4 })),
    installedMachines: buildInstalledMachines(faker.number.int({ min: 0, max: 5 })),
    lifetimeValue: faker.number.int({ min: 200000, max: 42000000 }),
    createdAt: faker.date.past({ years: 5 }).toISOString(),
  }
}

export const CUSTOMERS: Customer[] = Array.from({ length: 48 }, (_, i) => buildCustomer(i))

export function customerById(id: string) {
  return CUSTOMERS.find((c) => c.id === id)
}

export function accountOwnerName(customer: Customer) {
  return staffById(customer.accountOwnerId)?.name ?? 'Unassigned'
}
