'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Logo } from '../brand'

export function AuthLayout({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode
  eyebrow: string
  title: string
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-dots">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col px-6 py-10">
        <Link href="/sign-in" className="mb-12 inline-flex items-center gap-2.5 self-start">
          <Logo />
          <span className="sr-only">NUDGE</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col"
        >
          <p className="eyebrow text-muted-foreground">{eyebrow}</p>
          <h1 className="pb-8 pt-2 font-serif text-3xl font-medium tracking-tight">
            {title}
          </h1>
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="eyebrow text-muted-foreground">Or</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

export function GoogleButton({ label = 'Continue with Google', onClick }: { label?: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-border bg-card text-sm font-medium transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring outline-none"
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      {label}
    </button>
  )
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  autoComplete = 'current-password',
  error,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  error?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="eyebrow text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className="h-11 w-full rounded-md border border-input bg-card px-3 pr-10 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="eyebrow text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function DomainCheck({ email }: { email: string }) {
  const domain = email.split('@')[1] ?? ''
  const checked = email.includes('@') && domain.length > 0
  const verified = checked && !domain.includes('invalid')

  if (!checked) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="flex items-center gap-2 text-xs"
    >
      {verified ? (
        <span className="flex items-center gap-1.5 text-success">
          <span className="flex size-4 items-center justify-center rounded-full border border-success bg-success/10">
            <svg viewBox="0 0 24 24" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
          </span>
          Email domain verified
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-warning">
          <span className="flex size-4 items-center justify-center rounded-full border border-warning bg-warning/10">
            <span className="text-xs">!</span>
          </span>
          We couldn't verify this email domain.
        </span>
      )}
    </motion.div>
  )
}
