import { faker } from '@faker-js/faker'

faker.seed(5005)

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

function series(base: number, variance: number, growth = 0) {
  return MONTHS.map((month, i) => ({
    month,
    value: Math.max(0, Math.round(base + i * growth + faker.number.int({ min: -variance, max: variance }))),
  }))
}

export const REVENUE_TREND = MONTHS.map((month, i) => ({
  month,
  revenue: Math.round(4200000 + i * 180000 + faker.number.int({ min: -400000, max: 500000 })),
  target: 4500000 + i * 200000,
}))

export const ORDER_FUNNEL = [
  { stage: 'Leads', value: 420 },
  { stage: 'Qualified', value: 286 },
  { stage: 'Quotation', value: 168 },
  { stage: 'Negotiation', value: 96 },
  { stage: 'Won', value: 58 },
]

export const SALES_BY_REGION = [
  { region: 'West India', value: 34 },
  { region: 'South India', value: 27 },
  { region: 'North India', value: 18 },
  { region: 'Middle East', value: 12 },
  { region: 'Africa', value: 9 },
]

export const PRODUCTION_OUTPUT = series(180, 25, 3)
export const PRODUCTION_EFFICIENCY = MONTHS.map((month, i) => ({
  month,
  planned: 92,
  actual: Math.round(78 + i * 0.6 + faker.number.int({ min: -4, max: 6 })),
}))

export const INVENTORY_VALUE_TREND = series(18500000, 900000, 120000)

export const PURCHASE_SPEND = series(2100000, 300000, 40000)

export const SERVICE_TICKET_TREND = MONTHS.map((month) => ({
  month,
  opened: faker.number.int({ min: 30, max: 70 }),
  resolved: faker.number.int({ min: 28, max: 68 }),
}))

export const CASH_FLOW = MONTHS.map((month) => ({
  month,
  inflow: faker.number.int({ min: 2800000, max: 6200000 }),
  outflow: faker.number.int({ min: 2200000, max: 5000000 }),
}))

export const CATEGORY_SALES_SPLIT = [
  { name: 'Machines', value: 62 },
  { name: 'Spare Parts', value: 16 },
  { name: 'Accessories', value: 14 },
  { name: 'Consumables', value: 8 },
]

export const TOP_CUSTOMERS_BY_REVENUE = Array.from({ length: 6 }, () => ({
  name: faker.company.name().replace(/,?\s*(LLC|Inc\.?|Ltd\.?)$/i, ''),
  value: faker.number.int({ min: 1200000, max: 8600000 }),
}))

export const WAREHOUSE_UTILIZATION = [
  { warehouse: 'WH-Ahmedabad (Main)', used: 78 },
  { warehouse: 'WH-Pune', used: 62 },
  { warehouse: 'WH-Chennai', used: 45 },
  { warehouse: 'WH-Export Bonded', used: 88 },
]
