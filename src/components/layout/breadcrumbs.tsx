import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { NAV_GROUPS, type NavItem } from '@/lib/navigation'

function findTrail(items: NavItem[], pathname: string, trail: NavItem[] = []): NavItem[] | null {
  for (const item of items) {
    const nextTrail = [...trail, item]
    if (item.to === pathname) return nextTrail
    if (item.children) {
      const found = findTrail(item.children, pathname, nextTrail)
      if (found) return found
    }
  }
  return null
}

function humanize(segment: string) {
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function Breadcrumbs() {
  const { pathname } = useLocation()
  const allItems = NAV_GROUPS.flatMap((g) => g.items)
  const trail = findTrail(allItems, pathname)

  const crumbs = trail
    ? trail.map((item) => ({ label: item.label, to: item.to }))
    : pathname
        .split('/')
        .filter(Boolean)
        .map((seg, idx, arr) => ({ label: humanize(seg), to: '/' + arr.slice(0, idx + 1).join('/') }))

  if (crumbs.length === 0) return null

  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link to="/dashboard/executive" className="hover:text-foreground">
        Home
      </Link>
      {crumbs.map((crumb, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <ChevronRight className="size-3" />
          {idx === crumbs.length - 1 || !crumb.to ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.to} className="hover:text-foreground">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
