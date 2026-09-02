import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores/auth-store'
import { useUiStore } from '@/stores/ui-store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initials } from '@/lib/utils'
import { Save } from 'lucide-react'

export function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)
  const [notifications, setNotifications] = useState({ email: true, push: true, whatsapp: false, sms: false })

  return (
    <div>
      <PageHeader title="Settings" description="Company profile, preferences, notifications, and security." />

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Your Profile</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-16"><AvatarFallback className="text-lg">{user ? initials(user.name) : 'HM'}</AvatarFallback></Avatar>
                <Button variant="outline" size="sm">Change Photo</Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5"><Label>Full Name</Label><Input defaultValue={user?.name} /></div>
                <div className="flex flex-col gap-1.5"><Label>Email</Label><Input defaultValue={user?.email} disabled /></div>
                <div className="flex flex-col gap-1.5"><Label>Department</Label><Input defaultValue={user?.department} disabled /></div>
                <div className="flex flex-col gap-1.5"><Label>Phone</Label><Input placeholder="+91 98765 43210" /></div>
              </div>
              <Button className="w-fit" onClick={() => toast.success('Profile updated')}><Save /> Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Company Profile</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5"><Label>Company Name</Label><Input defaultValue="Hisen Machinery Pvt. Ltd." /></div>
              <div className="flex flex-col gap-1.5"><Label>GSTIN</Label><Input defaultValue="24ABCDE1234F1Z5" /></div>
              <div className="flex flex-col gap-1.5"><Label>Registered Address</Label><Input defaultValue="Plot 42, GIDC Industrial Estate, Ahmedabad" /></div>
              <div className="flex flex-col gap-1.5"><Label>Default Currency</Label>
                <Select defaultValue="inr">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inr">INR (₹)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5"><Label>Financial Year Start</Label>
                <Select defaultValue="apr">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apr">April</SelectItem>
                    <SelectItem value="jan">January</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2"><Button className="w-fit" onClick={() => toast.success('Company profile updated')}><Save /> Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle><CardDescription>Choose how you want to be notified about ERP activity.</CardDescription></CardHeader>
            <CardContent className="flex flex-col divide-y">
              {[
                { key: 'email', label: 'Email notifications', description: 'Order updates, approvals, and daily digests' },
                { key: 'push', label: 'Push notifications', description: 'Real-time alerts within the ERP' },
                { key: 'whatsapp', label: 'WhatsApp notifications', description: 'Critical alerts sent to your WhatsApp' },
                { key: 'sms', label: 'SMS notifications', description: 'OTP and urgent escalations only' },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.description}</p>
                  </div>
                  <Switch
                    checked={notifications[n.key as keyof typeof notifications]}
                    onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [n.key]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <Label className="mb-2 block">Theme</Label>
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`rounded-lg border p-3 text-sm font-medium capitalize transition-colors ${theme === t ? 'border-primary ring-1 ring-primary' : 'hover:bg-accent'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Security</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5"><Label>Current Password</Label><Input type="password" /></div>
                <div />
                <div className="flex flex-col gap-1.5"><Label>New Password</Label><Input type="password" /></div>
                <div className="flex flex-col gap-1.5"><Label>Confirm New Password</Label><Input type="password" /></div>
              </div>
              <Button className="w-fit" onClick={() => toast.success('Password updated')}>Update Password</Button>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
