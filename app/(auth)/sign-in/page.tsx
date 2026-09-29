'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { AuthLayout, AuthDivider, GoogleButton, PasswordField, TextField, DomainCheck } from '@/components/nudge/auth/auth-layout'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setTimeout(() => router.push('/dashboard'), 900)
  }

  const googleSignIn = () => {
    setGoogleLoading(true)
    setTimeout(() => router.push('/dashboard'), 1200)
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
    <AuthLayout eyebrow="Welcome back" title="Sign in">
      <form onSubmit={submit} className="flex flex-col gap-4">
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
        />
        <button
          type="submit"
          disabled={loading || !email || !password}
          className="mt-2 flex h-11 items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <Link href="/forgot-password" className="text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Forgot password?
        </Link>
      </form>

      <AuthDivider />
      <GoogleButton onClick={googleSignIn} />

      <p className="pt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/sign-up" className="font-medium text-foreground underline-offset-4 hover:underline">
          Create account
        </Link>
      </p>
    </AuthLayout>
  )
}
