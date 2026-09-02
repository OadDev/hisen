import { Link } from 'react-router-dom'
import { CompassIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'

export function NotFoundPage() {
  return (
    <EmptyState
      icon={CompassIcon}
      title="Page not found"
      description="The page you are looking for doesn't exist or has moved."
      action={
        <Button asChild size="sm">
          <Link to="/dashboard/executive">Back to dashboard</Link>
        </Button>
      }
    />
  )
}
