import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Moon, Plus, Sun, LayoutGrid } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { NAV_GROUPS, filterNavByRole } from '@/lib/navigation'
import { useUiStore } from '@/stores/ui-store'
import { useAuthStore } from '@/stores/auth-store'

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen)
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen)
  const setTheme = useUiStore((s) => s.setTheme)
  const theme = useUiStore((s) => s.theme)
  const role = useAuthStore((s) => s.user?.role ?? 'super_admin')
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, setOpen])

  const groups = filterNavByRole(NAV_GROUPS, role)

  function go(to?: string) {
    if (!to) return
    navigate(to)
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command Palette" description="Search for pages and actions">
      <CommandInput placeholder="Search modules, records, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => go('/quotations?new=1')}>
            <Plus /> New Quotation
          </CommandItem>
          <CommandItem onSelect={() => go('/crm/leads?new=1')}>
            <Plus /> New Lead
          </CommandItem>
          <CommandItem onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun /> : <Moon />} Toggle Theme
          </CommandItem>
          <CommandItem onSelect={() => go('/dashboard/executive')}>
            <LayoutGrid /> Go to Dashboard
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        {groups.map((group) => (
          <CommandGroup heading={group.label} key={group.label}>
            {group.items.map((item) =>
              item.children?.length ? (
                item.children.map((child) => (
                  <CommandItem key={child.to} onSelect={() => go(child.to)}>
                    {item.label} / {child.label}
                  </CommandItem>
                ))
              ) : (
                <CommandItem key={item.to} onSelect={() => go(item.to)}>
                  {item.icon && <item.icon />}
                  {item.label}
                </CommandItem>
              ),
            )}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Session">
          <CommandItem onSelect={() => { logout(); navigate('/login') }}>
            <LogOut /> Sign out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
