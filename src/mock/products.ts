import { faker } from '@faker-js/faker'

faker.seed(2002)

export type ProductCategory = 'Machines' | 'Accessories' | 'Consumables' | 'Spare Parts'

export interface Product {
  id: string
  sku: string
  name: string
  category: ProductCategory
  subCategory: string
  description: string
  hsn: string
  unit: string
  price: number
  currency: 'INR' | 'USD'
  imageSeed: string
  status: 'active' | 'discontinued' | 'draft'
  specs: Record<string, string>
  certifications: string[]
  hasVideo: boolean
  hasPdfCatalog: boolean
  warrantyMonths: number
  leadTimeDays: number
}

const MACHINE_LINES = [
  { name: 'HM CNC Router Pro', sub: 'CNC Routers' },
  { name: 'HM Laser Cutter X2', sub: 'Laser Cutting' },
  { name: 'HM Plasma Cutter Edge', sub: 'Plasma Cutting' },
  { name: 'HM Fiber Laser Marker', sub: 'Marking Systems' },
  { name: 'HM Vertical Machining Center', sub: 'VMC' },
  { name: 'HM Hydraulic Press Brake', sub: 'Sheet Metal' },
  { name: 'HM Automatic Lathe', sub: 'Turning' },
  { name: 'HM Woodworking Router', sub: 'Woodworking' },
]

const ACCESSORY_LINES = ['Rotary Axis Attachment', 'Auto Tool Changer', 'Water Chiller Unit', 'Dust Extraction System', 'Fume Extractor', 'Vacuum Table', 'Servo Motor Upgrade Kit', 'Rotary Chuck']
const CONSUMABLE_LINES = ['Carbide End Mill Set', 'Cutting Oil (20L)', 'Laser Lens Kit', 'Diamond Cutting Blade', 'Nozzle Assembly Kit', 'Filter Cartridge Pack', 'Coolant Concentrate']
const SPARE_LINES = ['Servo Drive Board', 'Ball Screw Assembly', 'Linear Guide Rail', 'Spindle Motor', 'PLC Control Module', 'Limit Switch Kit', 'Encoder Cable Assembly', 'Power Supply Unit']

function makeMachine(i: number): Product {
  const line = MACHINE_LINES[i % MACHINE_LINES.length]
  const model = `${line.name} ${faker.helpers.arrayElement(['1325', '2030', '1530', '2040', '1218'])}`
  return {
    id: `PRD-M-${1000 + i}`,
    sku: `HM-MC-${1000 + i}`,
    name: model,
    category: 'Machines',
    subCategory: line.sub,
    description: `Industrial-grade ${line.sub.toLowerCase()} machine engineered for heavy-duty production environments with high precision and repeatability.`,
    hsn: '8456',
    unit: 'Unit',
    price: faker.number.int({ min: 450000, max: 8500000 }),
    currency: 'INR',
    imageSeed: `machine-${i}`,
    status: faker.helpers.weightedArrayElement([{ value: 'active', weight: 8 }, { value: 'draft', weight: 1 }, { value: 'discontinued', weight: 1 }]),
    specs: {
      'Working Area': `${faker.number.int({ min: 1200, max: 2500 })} x ${faker.number.int({ min: 1200, max: 3000 })} mm`,
      'Power': `${faker.number.int({ min: 5, max: 40 })} kW`,
      'Voltage': faker.helpers.arrayElement(['220V/1P', '380V/3P', '440V/3P']),
      'Spindle Speed': `${faker.number.int({ min: 8000, max: 24000 })} RPM`,
      'Max Feed Rate': `${faker.number.int({ min: 8, max: 30 })} m/min`,
      'Weight': `${faker.number.int({ min: 800, max: 6000 })} kg`,
    },
    certifications: faker.helpers.arrayElements(['CE', 'ISO 9001', 'BIS', 'FDA'], { min: 1, max: 3 }),
    hasVideo: faker.datatype.boolean(0.7),
    hasPdfCatalog: true,
    warrantyMonths: faker.helpers.arrayElement([12, 18, 24]),
    leadTimeDays: faker.number.int({ min: 20, max: 75 }),
  }
}

function makeSimple(i: number, category: ProductCategory, names: string[], prefix: string, priceRange: [number, number]): Product {
  const name = names[i % names.length]
  return {
    id: `PRD-${prefix}-${1000 + i}`,
    sku: `HM-${prefix}-${1000 + i}`,
    name: `${name} ${faker.helpers.arrayElement(['Standard', 'Pro', 'Heavy Duty', ''])}`.trim(),
    category,
    subCategory: category,
    description: faker.commerce.productDescription(),
    hsn: faker.helpers.arrayElement(['8466', '8207', '3403', '8483']),
    unit: faker.helpers.arrayElement(['Piece', 'Set', 'Box', 'Litre']),
    price: faker.number.int({ min: priceRange[0], max: priceRange[1] }),
    currency: 'INR',
    imageSeed: `${prefix}-${i}`,
    status: faker.helpers.weightedArrayElement([{ value: 'active', weight: 9 }, { value: 'discontinued', weight: 1 }]),
    specs: {
      Material: faker.helpers.arrayElement(['Carbide', 'HSS', 'Steel Alloy', 'Aluminium', 'Composite']),
      Compatibility: 'Multiple machine models',
    },
    certifications: faker.helpers.arrayElements(['ISO 9001', 'RoHS'], { min: 0, max: 2 }),
    hasVideo: false,
    hasPdfCatalog: faker.datatype.boolean(0.5),
    warrantyMonths: faker.helpers.arrayElement([0, 3, 6, 12]),
    leadTimeDays: faker.number.int({ min: 2, max: 20 }),
  }
}

export const PRODUCTS: Product[] = [
  ...Array.from({ length: 24 }, (_, i) => makeMachine(i)),
  ...Array.from({ length: 18 }, (_, i) => makeSimple(i, 'Accessories', ACCESSORY_LINES, 'AC', [8000, 250000])),
  ...Array.from({ length: 20 }, (_, i) => makeSimple(i, 'Consumables', CONSUMABLE_LINES, 'CN', [500, 15000])),
  ...Array.from({ length: 22 }, (_, i) => makeSimple(i, 'Spare Parts', SPARE_LINES, 'SP', [1200, 95000])),
]

export function productById(id: string) {
  return PRODUCTS.find((p) => p.id === id)
}

export const MACHINES = PRODUCTS.filter((p) => p.category === 'Machines')

export const VOLTAGE_OPTIONS = ['220V / 1 Phase', '380V / 3 Phase', '415V / 3 Phase', '440V / 3 Phase']
export const COUNTRY_STANDARDS = ['India (BIS)', 'EU (CE)', 'USA (UL)', 'Middle East (GSO)', 'Africa (SONCAP)']
