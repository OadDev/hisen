import { faker } from '@faker-js/faker'
import { MACHINES } from '@/mock/products'

faker.seed(1313)

export interface BomComponent {
  id: string
  partNo: string
  name: string
  quantity: number
  unit: string
  unitCost: number
  supplier: string
  children?: BomComponent[]
}

function leaf(name: string): BomComponent {
  return {
    id: faker.string.uuid(),
    partNo: `PN-${faker.string.numeric(5)}`,
    name,
    quantity: faker.number.int({ min: 1, max: 8 }),
    unit: 'pcs',
    unitCost: faker.number.int({ min: 250, max: 45000 }),
    supplier: faker.helpers.arrayElement(['Precision Bearings Co.', 'Steel Alloy Suppliers', 'Servo Systems Inc.', 'ElectroParts Ltd.', 'In-house Fabrication']),
  }
}

function assembly(name: string, children: string[]): BomComponent {
  return {
    id: faker.string.uuid(),
    partNo: `ASM-${faker.string.numeric(4)}`,
    name,
    quantity: 1,
    unit: 'set',
    unitCost: 0,
    supplier: 'In-house Fabrication',
    children: children.map(leaf),
  }
}

export const MACHINE_BOM: BomComponent[] = [
  assembly('Structural Frame Assembly', ['Base Frame', 'Gantry Structure', 'Leveling Feet Set']),
  assembly('Motion System', ['Ball Screw Assembly', 'Linear Guide Rail', 'Servo Motor (X-Axis)', 'Servo Motor (Y-Axis)', 'Servo Motor (Z-Axis)']),
  assembly('Spindle Assembly', ['Spindle Motor', 'Spindle Bearing Set', 'Tool Holder Chuck']),
  assembly('Electrical & Control', ['PLC Control Module', 'Control Panel Enclosure', 'Power Supply Unit', 'Cable Harness Kit', 'Emergency Stop Switch']),
  assembly('Cooling & Lubrication', ['Water Chiller Unit', 'Coolant Pump', 'Lubrication System']),
]

export const BOM_MACHINES = MACHINES.slice(0, 10)
