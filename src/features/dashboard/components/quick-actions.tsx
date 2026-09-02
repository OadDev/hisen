import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface QuickAction {
  label: string
  to: string
  icon: LucideIcon
}

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="flex flex-col items-start gap-2 rounded-lg border p-3 transition-colors hover:bg-accent"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <action.icon className="size-4" />
            </span>
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
