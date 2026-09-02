import { faker } from '@faker-js/faker'
import type { Role } from '@/types/rbac'

faker.seed(1001)

export interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  department: string
  avatarUrl?: string
  active: boolean
}

const roleDept: Array<[Role, string, number]> = [
  ['sales_manager', 'Sales', 2],
  ['sales_executive', 'Sales', 8],
  ['production_manager', 'Production', 2],
  ['production_engineer', 'Production', 10],
  ['purchase_manager', 'Purchase', 2],
  ['store_manager', 'Inventory', 3],
  ['quality_manager', 'Quality', 3],
  ['service_manager', 'Service', 2],
  ['field_service_engineer', 'Service', 9],
  ['accounts', 'Finance', 3],
]

function buildStaff(): StaffMember[] {
  const list: StaffMember[] = [
    {
      id: 'usr-0001',
      name: 'Arvind Rao',
      email: 'arvind.rao@hisenmachinery.com',
      phone: faker.phone.number(),
      role: 'super_admin',
      department: 'Management',
      active: true,
    },
  ]
  let counter = 2
  for (const [role, department, count] of roleDept) {
    for (let i = 0; i < count; i++) {
      const name = faker.person.fullName()
      list.push({
        id: `usr-${String(counter).padStart(4, '0')}`,
        name,
        email: faker.internet.email({ firstName: name.split(' ')[0], lastName: name.split(' ').at(-1), provider: 'hisenmachinery.com' }).toLowerCase(),
        phone: faker.phone.number(),
        role,
        department,
        active: faker.datatype.boolean(0.92),
      })
      counter++
    }
  }
  return list
}

export const STAFF: StaffMember[] = buildStaff()

export function staffByRole(role: Role) {
  return STAFF.filter((s) => s.role === role)
}

export function randomStaff(role?: Role) {
  const pool = role ? staffByRole(role) : STAFF
  return faker.helpers.arrayElement(pool)
}

export function staffById(id: string) {
  return STAFF.find((s) => s.id === id)
}
