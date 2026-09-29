'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { AuthLayout, PasswordField } from '@/components/nudge/auth/auth-layout'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [expired, setExpired] = useState(false)

  // Simulate expired link — 15% chance on mount
  useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('expired')) {
      setExpired(true)
    }
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (expired) return
    if (password.length < 6) {
      setError('Password is too weak. Use at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSuccess(true)
  }

  if (expired) {
    return (
      <AuthLayout eyebrow="Link expired" title="Reset link expired">
        <p className="text-sm text-muted-foreground text-pretty">
          This reset link has expired. Reset links are valid for 30 minutes. Please request a new one.
        </p>
        <button
          type="button"
          onClick={() => router.push('/forgot-password')}
          className="mt-6 flex h-11 w-full items-center justify-center rounded-md border border-border bg-card text-sm font-medium transition-colors hover:bg-accent"
        >
          Request new link
        </button>
      </AuthLayout>
    )
  }

  if (success) {
    return (
      <AuthLayout eyebrow="All set" title="Password updated">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-success text-background">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.2 4.2L19 7" />
            </svg>
          </span>
          <p className="text-sm text-muted-foreground text-pretty">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <button
            type="button"
            onClick={() => router.push('/sign-in')}
            className="flex h-11 w-full items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
          >
            Continue to Sign In
          </button>
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout eyebrow="Set a new password" title="Reset password">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <PasswordField
          id="new-password"
          label="New Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />
        <PasswordField
          id="confirm-password"
          label="Confirm Password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          error={error ?? undefined}
        />
        <button
          type="submit"
          disabled={!password || !confirm}
          className="mt-2 flex h-11 w-full items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          Reset Password
        </button>
      </form>
    </AuthLayout>
  )
}
