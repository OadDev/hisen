import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Timeline, type TimelineEvent } from '@/components/shared/timeline'

export function ActivityFeed({ events, title = 'Recent Activity' }: { events: TimelineEvent[]; title?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Timeline events={events} />
      </CardContent>
    </Card>
  )
}
