import type { CSSProperties } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Loader2, Eye, EyeOff, BarChart3, ShieldCheck, Workflow } from 'lucide-react'
import { LogoMark } from '@/components/shared/logo-mark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/stores/auth-store'
import { STAFF } from '@/mock/staff'
import { ROLES, type Role } from '@/types/rbac'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

const DEMO_ROLES: Role[] = ['super_admin', 'sales_manager', 'production_manager', 'store_manager', 'service_manager', 'accounts']

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'arvind.rao@hisenmachinery.com', password: '', remember: true },
  })

  function authenticate(email: string) {
    const staff = STAFF.find((s) => s.email === email) ?? STAFF[0]
    setLoading(true)
    setTimeout(() => {
      login({ id: staff.id, name: staff.name, email: staff.email, role: staff.role, department: staff.department })
      setLoading(false)
      toast.success(`Welcome back, ${staff.name.split(' ')[0]}`)
      navigate('/dashboard/executive')
    }, 500)
  }

  function onSubmit(values: FormValues) {
    authenticate(values.email)
  }

  function quickLogin(role: Role) {
    const staff = STAFF.find((s) => s.role === role)
    if (staff) {
      setValue('email', staff.email)
      authenticate(staff.email)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative flex items-center gap-2">
          <LogoMark className="size-9 text-white" style={{ '--logo-stripe': 'var(--primary)' } as CSSProperties} />
          <span className="text-lg font-semibold">Hisen Machinery ERP</span>
        </div>
        <div className="relative flex flex-col gap-8">
          <h1 className="max-w-md text-3xl font-semibold leading-tight text-balance">
            One platform to run your entire machinery manufacturing business.
          </h1>
          <div className="flex flex-col gap-5">
            {[
              { icon: Workflow, text: 'End-to-end workflow from lead to AMC renewal' },
              { icon: BarChart3, text: 'Real-time dashboards across sales, production & finance' },
              { icon: ShieldCheck, text: 'Role-based access with full audit trail' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/15">
                  <Icon className="size-4" />
                </span>
                <p className="text-sm text-primary-foreground/90">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-primary-foreground/60">© {new Date().getFullYear()} Hisen Machinery. All rights reserved.</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col gap-1.5 lg:hidden">
            <div className="flex items-center gap-2">
              <LogoMark className="size-8 text-primary" />
              <span className="text-base font-semibold">Hisen Machinery</span>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-1.5">
            <h2 className="text-xl font-semibold tracking-tight">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground">Enter your credentials to access the ERP.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="you@hisenmachinery.com" {...register('email')} aria-invalid={!!errors.email} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('password')} aria-invalid={!!errors.password} />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" defaultChecked onCheckedChange={(v) => setValue('remember', !!v)} />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                Keep me signed in for 30 days
              </Label>
            </div>
            <Button type="submit" className="mt-1" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Preview as (demo)</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ROLES.map((role) => (
                <Button key={role} type="button" variant="outline" size="sm" onClick={() => quickLogin(role)} className="justify-start">
                  {ROLES[role].label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
