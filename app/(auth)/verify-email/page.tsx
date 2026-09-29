'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { AuthLayout } from '@/components/nudge/auth/auth-layout'
import { maskEmail } from '@/lib/schedule'

const CODE_LENGTH = 6
const EXPIRE_SECONDS = 600

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="h-40" />}>
      <VerifyEmailContent />
    </Suspense>
  )
}

function VerifyEmailContent() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') ?? 'a•••••@gmail.com'
  const masked = email.includes('@') && !email.includes('•') ? maskEmail(email) : email

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [error, setError] = useState<string | null>(null)
  const [expired, setExpired] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [seconds, setSeconds] = useState(EXPIRE_SECONDS)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (expired) return
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setExpired(true)
          clearInterval(id)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [expired])

  const setDigit = (i: number, val: string) => {
    const clean = val.replace(/\D/g, '')
    if (!clean && val !== '') return
    setError(null)
    setDigits((prev) => {
      const next = [...prev]
      next[i] = clean.slice(-1)
      return next
    })
    if (clean && i < CODE_LENGTH - 1) refs.current[i + 1]?.focus()
  }

  const onKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!text) return
    const next = Array(CODE_LENGTH).fill('')
    text.split('').forEach((c, i) => (next[i] = c))
    setDigits(next)
    refs.current[Math.min(text.length, CODE_LENGTH - 1)]?.focus()
  }

  const code = digits.join('')
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  const verify = () => {
    if (expired) {
      setError('Verification code expired. Please resend.')
      return
    }
    if (code.length < CODE_LENGTH) return
    setError(null)
    setLoading(true)
    setTimeout(() => {
      if (code === '000000') {
        setError('Incorrect verification code.')
        setLoading(false)
      } else {
        router.push('/onboarding')
      }
    }, 1000)
  }

  const resend = () => {
    setResending(true)
    setExpired(false)
    setSeconds(EXPIRE_SECONDS)
    setDigits(Array(CODE_LENGTH).fill(''))
    setError(null)
    setTimeout(() => {
      setResending(false)
      refs.current[0]?.focus()
    }, 800)
  }

  return (
    <AuthLayout eyebrow="One last step" title="Verify your email">
      <p className="pb-2 text-sm text-muted-foreground">
        We sent a 6-digit code to:
      </p>
      <p className="pb-8 font-serif text-lg font-medium">{masked}</p>

      <div className="flex gap-2" onPaste={onPaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            disabled={expired}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            aria-label={`Digit ${i + 1}`}
            className={`h-14 w-12 rounded-md border bg-card text-center font-serif text-2xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/30 ${
              error ? 'border-destructive' : expired ? 'border-muted' : 'border-input focus-visible:border-ring'
            }`}
          />
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-3 text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}

      {expired && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-3 text-sm text-warning"
        >
          Verification code expired. Please resend.
        </motion.p>
      )}

      <p className="pt-4 text-xs text-muted-foreground">
        Code expires in:{' '}
        <span className={`tabular-nums ${seconds < 60 ? 'text-warning' : ''}`}>
          {mm}:{ss}
        </span>
      </p>

      <button
        type="button"
        onClick={verify}
        disabled={loading || code.length < CODE_LENGTH || expired}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? 'Verifying...' : 'Verify'}
      </button>

      <button
        type="button"
        onClick={resend}
        disabled={resending}
        className="mt-3 text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
      >
        {resending ? 'Resending code...' : 'Resend code'}
      </button>
    </AuthLayout>
  )
}
