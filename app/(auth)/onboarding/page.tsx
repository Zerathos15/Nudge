'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { Check, FileText, Loader2, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IMPORT_STATS } from '@/lib/mock-data'
import { Logo } from '@/components/nudge/brand'

type Stage = 'select' | 'uploading' | 'reading' | 'understanding' | 'preview' | 'done'
type RefState = 'empty' | 'selected' | 'processing' | 'done'

const STEPS = [
  { key: 'upload', label: 'Upload' },
  { key: 'read', label: 'Read' },
  { key: 'understand', label: 'Understand' },
  { key: 'review', label: 'Review' },
  { key: 'ready', label: 'Ready' },
] as const

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function OnboardingPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('select')
  const [schedule, setSchedule] = useState<RefState>('empty')
  const [topics, setTopics] = useState<RefState>('empty')
  const [progress, setProgress] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const runId = useRef(0)

  const build = async () => {
    const id = ++runId.current
    const alive = () => runId.current === id
    setStage('uploading')
    setStepIdx(0)
    setSchedule('processing')
    setTopics('processing')

    // Upload
    for (let p = 0; p <= 100; p += 10) {
      if (!alive()) return
      setProgress(p)
      await sleep(80)
    }
    setSchedule('done')
    setStage('reading')
    setStepIdx(1)
    await sleep(800)
    if (!alive()) return

    // Read
    setStage('understanding')
    setStepIdx(2)
    await sleep(1000)
    if (!alive()) return

    // Understand
    setStage('preview')
    setStepIdx(3)
    await sleep(900)
    if (!alive()) return

    // Review / Ready
    setStepIdx(4)
    setTopics('done')
  }

  const finish = () => {
    setStage('done')
    setTimeout(() => router.push('/dashboard'), 600)
  }

  if (stage === 'done') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-dots">
        <motion.span
          initial={{ scale: 0.5 }}
          animate={{ scale: [0.5, 1.12, 1] }}
          className="flex size-14 items-center justify-center rounded-full bg-success text-background"
        >
          <Check className="size-7" strokeWidth={3} />
        </motion.span>
        <p className="font-serif text-xl font-medium">Your plan is ready.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-dots">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-10">
        <div className="mb-10 inline-flex items-center gap-2.5">
          <Logo />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="eyebrow text-muted-foreground">First time here</p>
          <h1 className="pb-3 pt-2 font-serif text-3xl font-medium tracking-tight">
            Let's build your learning plan
          </h1>
          <p className="pb-8 text-sm text-muted-foreground text-pretty">
            Each user has their own schedule and curriculum. Upload your reference PDFs to get started.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex flex-1 items-center gap-2">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full border-2 text-xs transition-colors',
                    i < stepIdx && 'border-success bg-success text-background',
                    i === stepIdx && 'border-ember bg-card text-ember',
                    i > stepIdx && 'border-border bg-card text-muted-foreground',
                  )}
                >
                  {i < stepIdx ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span className={cn('eyebrow text-[0.55rem]', i <= stepIdx ? 'text-foreground' : 'text-muted-foreground')}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span className={cn('h-0.5 flex-1 rounded-full', i < stepIdx ? 'bg-success' : 'bg-border')} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {stage === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col gap-4"
            >
              <UploadSlot
                title="Schedule Reference PDF"
                description="Study hours, availability, breaks, college/work timing, weekend rules"
                state={schedule}
                onPick={() => setSchedule('selected')}
              />
              <UploadSlot
                title="Topic / Task Reference PDF"
                description="Tracks, phases, modules, topics, tasks, ordering, prerequisites"
                state={topics}
                onPick={() => setTopics('selected')}
              />

              <button
                type="button"
                disabled={schedule !== 'selected' || topics !== 'selected'}
                onClick={build}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                Build My Plan
              </button>
            </motion.div>
          )}

          {(stage === 'uploading' || stage === 'reading' || stage === 'understanding') && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-3 rounded-md border border-border bg-card p-4">
                <Loader2 className="size-5 animate-spin text-ember" />
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-sm font-medium">
                    {stage === 'uploading' && 'Uploading...'}
                    {stage === 'reading' && 'Reading documents...'}
                    {stage === 'understanding' && 'Understanding structure...'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stage === 'uploading' && 'Uploading your reference PDFs'}
                    {stage === 'reading' && 'Extracting content from documents'}
                    {stage === 'understanding' && 'Preparing learning plan...'}
                  </p>
                </div>
                {stage === 'uploading' && (
                  <span className="text-xs tabular-nums text-muted-foreground">{progress}%</span>
                )}
              </div>
              {stage === 'uploading' && (
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div className="h-full bg-foreground" animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
                </div>
              )}
            </motion.div>
          )}

          {stage === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="eyebrow text-muted-foreground">Your learning plan</p>
                <p className="pt-1 font-serif text-2xl font-medium">Ready to go.</p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {IMPORT_STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex flex-col gap-1 rounded-md border border-border bg-card p-4 text-center"
                  >
                    <p className="font-serif text-2xl font-medium tabular-nums">{stat.value}</p>
                    <p className="eyebrow text-[0.58rem] text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              <button
                type="button"
                onClick={finish}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-ember text-ember-foreground text-sm font-medium transition-colors hover:bg-ember/90"
              >
                Start Learning
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function UploadSlot({
  title,
  description,
  state,
  onPick,
}: {
  title: string
  description: string
  state: RefState
  onPick: () => void
}) {
  if (state === 'done') {
    return (
      <div className="flex items-center gap-3 rounded-md border border-success/30 bg-success/5 p-4">
        <span className="flex size-9 items-center justify-center rounded-md bg-success/15 text-success">
          <Check className="size-4" strokeWidth={3} />
        </span>
        <div className="flex flex-1 flex-col">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">Imported successfully</p>
        </div>
      </div>
    )
  }

  if (state === 'processing') {
    return (
      <div className="flex items-center gap-3 rounded-md border border-ember/30 bg-ember/5 p-4">
        <Loader2 className="size-5 animate-spin text-ember" />
        <div className="flex flex-1 flex-col">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">Processing...</p>
        </div>
      </div>
    )
  }

  if (state === 'selected') {
    return (
      <div className="flex items-center gap-3 rounded-md border border-border bg-card p-4">
        <span className="flex size-9 items-center justify-center rounded-md bg-ember/10 text-ember">
          <FileText className="size-4" />
        </span>
        <div className="flex flex-1 flex-col">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">Selected</p>
        </div>
        <button
          type="button"
          onClick={() => onPick()}
          className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Change
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onPick}
      className="group flex flex-col items-center gap-3 rounded-lg border border-dashed border-input bg-card p-6 text-center transition-colors hover:border-ember hover:bg-ember/5"
    >
      <span className="flex size-10 items-center justify-center rounded-md border border-border bg-paper transition-colors group-hover:border-ember/30">
        <Upload className="size-4" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium">+ Add {title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  )
}
