'use client'

import { useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
// Suspense boundary required by useSearchParams
import { motion, AnimatePresence } from 'motion/react'
import { Check, FileText, Loader2, RotateCcw, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLAN_REFERENCES, IMPORT_STATS, IMPORT_TREE } from '@/lib/mock-data'
import { PageHeader, Panel, Eyebrow, Button } from '@/components/nudge/primitives'

type Section = 'account' | 'plan' | 'preferences'

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="h-40" />}>
      <SettingsContent />
    </Suspense>
  )
}

function SettingsContent() {
  const params = useSearchParams()
  const [section, setSection] = useState<Section>(
    (params.get('section') as Section) || 'account',
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Manage your account and learning plan."
      />

      <div className="flex flex-wrap gap-2">
        {([
          { id: 'account' as const, label: 'Account' },
          { id: 'plan' as const, label: 'My Learning Plan' },
          { id: 'preferences' as const, label: 'Preferences' },
        ]).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSection(tab.id)}
            className={cn(
              'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
              section === tab.id
                ? 'border-foreground bg-foreground text-primary-foreground'
                : 'border-border bg-card hover:bg-accent',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {section === 'account' && (
          <motion.div key="account" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <AccountSection />
          </motion.div>
        )}
        {section === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <PlanSection />
          </motion.div>
        )}
        {section === 'preferences' && (
          <motion.div key="prefs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <PreferencesSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AccountSection() {
  return (
    <Panel className="flex flex-col gap-5 p-5 md:p-6">
      <Eyebrow>Account details</Eyebrow>
      <div className="flex flex-col gap-4">
        <Field label="Name" value="Alex Morgan" />
        <Field label="Email" value="alex.morgan@example.com" />
        <Field label="Password" value="••••••••" />
      </div>
      <div className="border-t border-border pt-4">
        <Button variant="outline" size="md">Update details</Button>
      </div>
    </Panel>
  )
}

function PlanSection() {
  const [replacing, setReplacing] = useState<'schedule' | 'topics' | null>(null)
  const [replaced, setReplaced] = useState<Set<string>>(new Set())
  const fileRef = useRef<HTMLInputElement>(null)

  const replace = (which: 'schedule' | 'topics') => {
    setReplacing(which)
    setTimeout(() => {
      setReplaced((prev) => new Set([...prev, which]))
      setReplacing(null)
    }, 1800)
  }

  return (
    <div className="flex flex-col gap-4">
      <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="sr-only" tabIndex={-1} />

      <Panel className="flex flex-col gap-4 p-5 md:p-6">
        <Eyebrow>Reference documents</Eyebrow>

        <RefCard
          label="Schedule Reference"
          version={PLAN_REFERENCES.schedule.version}
          fileName={PLAN_REFERENCES.schedule.fileName}
          updated={PLAN_REFERENCES.schedule.updated}
          replacing={replacing === 'schedule'}
          replaced={replaced.has('schedule')}
          onReplace={() => replace('schedule')}
        />
        <RefCard
          label="Topic Reference"
          version={PLAN_REFERENCES.topics.version}
          fileName={PLAN_REFERENCES.topics.fileName}
          updated={PLAN_REFERENCES.topics.updated}
          replacing={replacing === 'topics'}
          replaced={replaced.has('topics')}
          onReplace={() => replace('topics')}
        />
      </Panel>

      <Panel className="flex flex-col gap-4 p-5 md:p-6">
        <Eyebrow>Plan summary</Eyebrow>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {IMPORT_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 rounded-md border border-border bg-card p-3 text-center">
              <p className="font-serif text-xl font-medium tabular-nums">{stat.value}</p>
              <p className="eyebrow text-[0.55rem] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function RefCard({
  label,
  version,
  fileName,
  updated,
  replacing,
  replaced,
  onReplace,
}: {
  label: string
  version: number
  fileName: string
  updated: string
  replacing: boolean
  replaced: boolean
  onReplace: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-card p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-ember/10 text-ember">
        {replacing ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm font-medium">{label}</p>
        <p className="truncate text-xs text-muted-foreground">
          {replaced ? `Version ${version + 1} · Updated today` : `Version ${version} · Updated ${updated}`}
        </p>
        <p className="truncate text-xs text-muted-foreground">{replaced ? `${fileName.replace(/v\d/, `v${version + 1}`)}` : fileName}</p>
      </div>
      <button
        type="button"
        onClick={onReplace}
        disabled={replacing}
        className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-50"
      >
        {replacing ? (
          <>Replacing...</>
        ) : replaced ? (
          <><Check className="size-3 text-success" /> Replaced</>
        ) : (
          <><RotateCcw className="size-3" /> Replace</>
        )}
      </button>
    </div>
  )
}

function PreferencesSection() {
  const [notifications, setNotifications] = useState(true)
  const [carryForward, setCarryForward] = useState(true)
  const [masteryReminders, setMasteryReminders] = useState(true)

  return (
    <Panel className="flex flex-col gap-4 p-5 md:p-6">
      <Eyebrow>Preferences</Eyebrow>
      <Toggle
        label="Task notifications"
        description="Get notified when tasks need notes or carry forward."
        checked={notifications}
        onChange={setNotifications}
      />
      <Toggle
        label="Automatic carry-forward"
        description="Incomplete tasks carry to the next day automatically."
        checked={carryForward}
        onChange={setCarryForward}
      />
      <Toggle
        label="Mastery reminders"
        description="Remind you when a mastery check is ready."
        checked={masteryReminders}
        onChange={setMasteryReminders}
      />
    </Panel>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-foreground' : 'bg-muted',
        )}
      >
        <motion.span
          layout
          className="absolute top-0.5 size-5 rounded-full bg-card shadow-sm"
          animate={{ left: checked ? 'calc(100% - 1.375rem)' : '0.125rem' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="eyebrow text-muted-foreground">{label}</label>
      <input
        type="text"
        defaultValue={value}
        readOnly
        className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm text-muted-foreground outline-none"
      />
    </div>
  )
}
