'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { AuthLayout, AuthDivider, GoogleButton, PasswordField, TextField, DomainCheck } from '@/components/nudge/auth/auth-layout'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name || !email || !password) return
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setTimeout(() => router.push(`/verify-email?email=${encodeURIComponent(email)}`), 900)
  }

  const googleSignUp = () => {
    setGoogleLoading(true)
    setTimeout(() => router.push('/onboarding'), 1200)
  }

  if (googleLoading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-dots">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Signing in with Google...</p>
      </div>
    )
  }

  return (
    <AuthLayout eyebrow="Get started" title="Create account">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <TextField
          id="name"
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Your name"
          autoComplete="name"
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <DomainCheck email={email} />
        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />
        <PasswordField
          id="confirm"
          label="Confirm Password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          error={error ?? undefined}
        />
        <button
          type="submit"
          disabled={loading || !name || !email || !password}
          className="mt-2 flex h-11 items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <AuthDivider />
      <GoogleButton onClick={googleSignUp} />

      <p className="pt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
