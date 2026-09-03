import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NAV_GROUPS, filterNavByRole, type NavItem } from '@/lib/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { useUiStore } from '@/stores/ui-store'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LogoMark } from '@/components/shared/logo-mark'

function isActive(pathname: string, item: NavItem): boolean {
  if (item.to && (pathname === item.to || pathname.startsWith(item.to + '/'))) return true
  return item.children?.some((c) => isActive(pathname, c)) ?? false
}

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation()
  const active = isActive(location.pathname, item)
  const Icon = item.icon

  const content = (
    <Link
      to={item.to ?? '#'}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
        active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
        collapsed && 'justify-center px-0',
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }
  return content
}

function NavGroupWithChildren({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation()
  const [open, setOpen] = useState(() => isActive(location.pathname, item))
  const Icon = item.icon

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="flex w-full items-center justify-center rounded-md py-2 text-sidebar-foreground/80 hover:bg-sidebar-accent/60">
            {Icon && <Icon className="size-4" />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="flex flex-col gap-1">
            {item.children?.map((c) => (
              <Link key={c.to} to={c.to ?? '#'} className="text-sm hover:underline">
                {c.label}
              </Link>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
          isActive(location.pathname, item) && 'text-sidebar-foreground',
        )}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        <span className="flex-1 truncate text-left">{item.label}</span>
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="mt-0.5 ml-[1.15rem] flex flex-col gap-0.5 border-l border-sidebar-border pl-3.5">
          {item.children?.map((child) => (
            <Link
              key={child.to}
              to={child.to ?? '#'}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-sm transition-colors',
                isActive(location.pathname, child)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const role = useAuthStore((s) => s.user?.role ?? 'super_admin')
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const groups = useMemo(() => filterNavByRole(NAV_GROUPS, role), [role])

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className={cn('flex h-14 items-center gap-2 border-b border-sidebar-border px-4', collapsed && 'justify-center px-0')}>
        <LogoMark className="size-7 text-primary" />
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-sm font-semibold text-sidebar-foreground">Hisen Machinery</p>
            <p className="text-[11px] text-sidebar-foreground/60">Enterprise ERP</p>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-2.5 py-3">
        <nav className="flex flex-col gap-4">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              {!collapsed && <p className="px-2.5 pb-1 text-[11px] font-semibold tracking-wide text-sidebar-foreground/45 uppercase">{group.label}</p>}
              {group.items.map((item) =>
                item.children?.length ? (
                  <NavGroupWithChildren key={item.label} item={item} collapsed={collapsed} />
                ) : (
                  <NavLink key={item.label} item={item} collapsed={collapsed} />
                ),
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-2.5">
        <Button variant="ghost" size="sm" className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground" onClick={toggleSidebar}>
          {collapsed ? <PanelLeftOpen className="size-4" /> : (
            <>
              <PanelLeftClose className="size-4" /> Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
