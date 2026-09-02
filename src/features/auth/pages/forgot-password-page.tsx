import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { ArrowLeft, Factory, MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({ email: z.string().email('Enter a valid email address') })
type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Factory className="size-4" />
          </span>
          <span className="text-base font-semibold">Hisen Machinery</span>
        </div>

        {!sent ? (
          <>
            <div className="mb-6 flex flex-col gap-1.5">
              <h2 className="text-xl font-semibold tracking-tight">Reset your password</h2>
              <p className="text-sm text-muted-foreground">We'll email you a link to reset your password.</p>
            </div>
            <form onSubmit={handleSubmit(() => setSent(true))} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" placeholder="you@hisenmachinery.com" {...register('email')} aria-invalid={!!errors.email} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <Button type="submit">Send reset link</Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-success/15">
              <MailCheck className="size-6 text-success" />
            </span>
            <p className="font-medium">Check your inbox</p>
            <p className="text-sm text-muted-foreground">We sent a password reset link to {getValues('email')}.</p>
          </div>
        )}

        <Link to="/login" className="mt-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to sign in
        </Link>
      </div>
    </div>
  )
}
