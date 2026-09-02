import { useNavigate } from 'react-router-dom'
import { Bell, Search, Sun, Moon, Laptop, LogOut, UserCog, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { useUiStore } from '@/stores/ui-store'
import { useAuthStore } from '@/stores/auth-store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { NOTIFICATIONS } from '@/mock/notifications'
import { Badge } from '@/components/ui/badge'
import { formatDateTime, initials } from '@/lib/utils'
import { ROLES, ALL_ROLES } from '@/types/rbac'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NAV_GROUPS, filterNavByRole } from '@/lib/navigation'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useLocation } from 'react-router-dom'

function MobileNav() {
  const role = useAuthStore((s) => s.user?.role ?? 'super_admin')
  const location = useLocation()
  const groups = filterNavByRole(NAV_GROUPS, role)
  return (
    <div className="flex flex-col gap-4 p-2">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-0.5">
          <p className="px-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{group.label}</p>
          {group.items.map((item) =>
            item.children?.length ? (
              <div key={item.label} className="flex flex-col">
                <p className="px-2 py-1.5 text-sm font-medium">{item.label}</p>
                {item.children.map((c) => (
                  <Link key={c.to} to={c.to ?? '#'} className={cn('rounded-md px-4 py-1.5 text-sm', location.pathname === c.to ? 'bg-accent' : 'text-muted-foreground')}>
                    {c.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.to} to={item.to ?? '#'} className={cn('rounded-md px-2 py-1.5 text-sm', location.pathname === item.to ? 'bg-accent font-medium' : 'text-muted-foreground')}>
                {item.label}
              </Link>
            ),
          )}
        </div>
      ))}
    </div>
  )
}

export function Topbar() {
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen)
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const switchRole = useAuthStore((s) => s.switchRole)
  const navigate = useNavigate()
  const unread = NOTIFICATIONS.filter((n) => !n.read).length

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <MobileNav />
        </SheetContent>
      </Sheet>

      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 text-muted-foreground sm:flex"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="size-3.5" />
          Search...
          <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
        </Button>
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setCommandPaletteOpen(true)}>
          <Search />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 flex size-2 rounded-full bg-destructive" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="secondary">{unread} new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {NOTIFICATIONS.slice(0, 8).map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 whitespace-normal">
                  <div className="flex w-full items-center justify-between gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {!n.read && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{n.description}</p>
                  <p className="text-[11px] text-muted-foreground/70">{formatDateTime(n.timestamp)}</p>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === 'dark' ? <Moon /> : theme === 'light' ? <Sun /> : <Laptop />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}>
              <DropdownMenuRadioItem value="light">
                <Sun /> Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon /> Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <Laptop /> System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-accent">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary text-primary-foreground">{user ? initials(user.name) : 'HM'}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{user?.name ?? 'Guest'}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/settings')}>
              <UserCog /> Account settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[11px]">Preview as role (demo)</DropdownMenuLabel>
            <div className="max-h-56 overflow-y-auto">
              {ALL_ROLES.map((role) => (
                <DropdownMenuItem key={role} onSelect={() => switchRole(role)} className={user?.role === role ? 'bg-accent' : ''}>
                  {ROLES[role].label}
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => { logout(); navigate('/login') }}>
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
