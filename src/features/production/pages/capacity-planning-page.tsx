import { faker } from '@faker-js/faker'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

faker.seed(1212)

const LINES = ['Assembly Line 1', 'Assembly Line 2', 'Electrical Bay', 'PLC & Testing Bay', 'Paint & Finishing']
const WEEKS = ['This Week', 'Next Week', 'Week 3', 'Week 4']

const DATA = LINES.map((line) => ({
  line,
  weeks: WEEKS.map(() => faker.number.int({ min: 45, max: 105 })),
}))

function heat(value: number) {
  if (value >= 100) return 'bg-destructive/20 text-destructive'
  if (value >= 85) return 'bg-warning/25 text-warning-foreground'
  if (value >= 60) return 'bg-info/15 text-info'
  return 'bg-success/15 text-success'
}

export function CapacityPlanningPage() {
  return (
    <div>
      <PageHeader title="Capacity Planning" description="Line-wise utilization forecast across the next four weeks." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Utilization Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-separate border-spacing-1.5">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground">Production Line</th>
                  {WEEKS.map((w) => (
                    <th key={w} className="text-center text-xs font-medium text-muted-foreground">{w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DATA.map((row) => (
                  <tr key={row.line}>
                    <td className="whitespace-nowrap py-1 pr-4 text-sm font-medium">{row.line}</td>
                    {row.weeks.map((value, i) => (
                      <td key={i} className="p-0">
                        <div className={cn('flex h-14 w-full items-center justify-center rounded-md text-sm font-semibold', heat(value))}>
                          {value}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-success/40" /> Healthy (&lt;60%)</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-info/40" /> Moderate (60–85%)</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-warning/50" /> High (85–100%)</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-destructive/40" /> Overbooked (&gt;100%)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
