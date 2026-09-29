'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { AuthLayout, TextField } from '@/components/nudge/auth/auth-layout'
import { maskEmail } from '@/lib/schedule'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <AuthLayout eyebrow="Check your email" title="Check your email">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <p className="text-sm text-muted-foreground">
            We sent a password reset link to:
          </p>
          <p className="font-serif text-lg font-medium">
            {maskEmail(email) || 'a•••••@gmail.com'}
          </p>
          <p className="text-sm text-muted-foreground text-pretty">
            The link will expire in 30 minutes. If you don't see the email, check your spam folder.
          </p>
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout eyebrow="Trouble signing in?" title="Forgot password?">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (email) setSent(true)
        }}
        className="flex flex-col gap-4"
      >
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={!email}
          className="mt-2 flex h-11 w-full items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          Send Reset Link
        </button>
      </form>
    </AuthLayout>
  )
}
