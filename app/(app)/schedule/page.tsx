'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TODAY_ISO } from '@/lib/mock-data'
import type { Task } from '@/lib/mock-data'
import {
  addDays,
  formatShort,
  formatLong,
  weekday,
  monthGrid,
  monthLabel,
  daysBetween,
  getDayPlan,
  type PlanItem,
} from '@/lib/schedule'
import { useStore } from '@/components/nudge/store'
import { PageHeader, Panel, Eyebrow, StatusPill, StatusDot } from '@/components/nudge/primitives'

type Tab = 'today' | 'week' | 'month'

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="h-40" />}>
      <ScheduleContent />
    </Suspense>
  )
}

function ScheduleContent() {
  const params = useSearchParams()
  const [tab, setTab] = useState<Tab>((params.get('view') as Tab) || 'week')
  const { tasks, openTask } = useStore()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Planner"
        title="Schedule"
        description="Your learning week at a glance."
        actions={
          <div className="flex rounded-md border border-border bg-card p-0.5">
            {(['today', 'week', 'month'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  'relative rounded-sm px-4 py-1.5 text-sm font-medium capitalize transition-colors',
                  tab === t ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab === t && (
                  <motion.span layoutId="schedule-tab" className="absolute inset-0 rounded-sm bg-primary" />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        }
      />

      <AnimatePresence mode="wait">
        {tab === 'today' && (
          <motion.div key="today" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <TodayView tasks={tasks} openTask={openTask} />
          </motion.div>
        )}
        {tab === 'week' && (
          <motion.div key="week" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <WeekView tasks={tasks} openTask={openTask} />
          </motion.div>
        )}
        {tab === 'month' && (
          <motion.div key="month" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <MonthView tasks={tasks} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TodayView({ tasks, openTask }: { tasks: Task[]; openTask: (id: string) => void }) {
  const plan = getDayPlan(TODAY_ISO, tasks)
  if (!plan) return <EmptyState text="Schedule unavailable." />
  return (
    <Panel className="flex flex-col gap-2 p-5 md:p-6">
      <Eyebrow>{formatLong(TODAY_ISO)}</Eyebrow>
      <PlanList items={plan} openTask={openTask} />
    </Panel>
  )
}

function WeekView({ tasks, openTask }: { tasks: Task[]; openTask: (id: string) => void }) {
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(TODAY_ISO, i)), [])
  return (
    <div className="flex flex-col gap-3">
      {days.map((iso) => {
        const plan = getDayPlan(iso, tasks)
        if (!plan) return null
        const isToday = iso === TODAY_ISO
        const dow = weekday(iso)
        const dayNum = iso.split('-')[2]
        return (
          <Panel key={iso} className={cn('flex flex-col gap-2 p-4 md:p-5', isToday && 'border-ember/30')}>
            <div className="flex items-center gap-3 pb-2">
              <div className={cn('flex size-10 flex-col items-center justify-center rounded-md', isToday ? 'bg-ember text-ember-foreground' : 'bg-card border border-border')}>
                <span className="eyebrow text-[0.55rem]">{dow}</span>
                <span className="font-serif text-sm font-medium tabular-nums">{dayNum}</span>
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-sm font-medium">{formatLong(iso)}</p>
                <p className="text-xs text-muted-foreground">
                  {plan.length} {plan.length === 1 ? 'item' : 'items'}
                  {isToday && ' · Today'}
                </p>
              </div>
            </div>
            <PlanList items={plan} openTask={openTask} compact />
          </Panel>
        )
      })}
    </div>
  )
}

function MonthView({ tasks }: { tasks: Task[] }) {
  const [offset, setOffset] = useState(0)
  const baseDate = new Date(TODAY_ISO + 'T00:00:00Z')
  const refDate = new Date(baseDate)
  refDate.setUTCMonth(refDate.getUTCMonth() + offset)
  const year = refDate.getUTCFullYear()
  const month = refDate.getUTCMonth()
  const grid = monthGrid(year, month)
  const todayNum = parseInt(TODAY_ISO.split('-')[2])

  return (
    <Panel className="flex flex-col gap-4 p-5 md:p-6">
      <div className="flex items-center justify-between">
        <Eyebrow>{monthLabel(year, month)}</Eyebrow>
        <div className="flex gap-1">
          <button type="button" onClick={() => setOffset((o) => o - 1)} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent">‹</button>
          <button type="button" onClick={() => setOffset(0)} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent">Today</button>
          <button type="button" onClick={() => setOffset((o) => o + 1)} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d} className="eyebrow pb-2 text-center text-[0.55rem] text-muted-foreground">{d}</span>
        ))}
        {grid.map((cell) => {
          const isToday = cell.iso === TODAY_ISO
          const plan = getDayPlan(cell.iso, tasks)
          const hasStudy = plan?.some((p) => p.status !== 'break')
          return (
            <div
              key={cell.iso}
              className={cn(
                'flex min-h-16 flex-col gap-1 rounded-md border p-1.5 text-xs',
                !cell.inMonth && 'bg-muted/50 border-transparent text-muted-foreground/40',
                cell.inMonth && 'border-border bg-card',
                isToday && 'border-ember bg-ember/5',
              )}
            >
              <span className={cn('font-medium tabular-nums', isToday && 'text-ember')}>
                {parseInt(cell.iso.split('-')[2])}
              </span>
              {cell.inMonth && hasStudy && (
                <div className="flex flex-col gap-0.5">
                  {plan?.slice(0, 3).filter((p) => p.status !== 'break').map((p) => (
                    <span key={p.id} className="flex items-center gap-1 truncate">
                      <StatusDot status={p.status} />
                      <span className="truncate text-[0.65rem] text-muted-foreground">{p.title}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

function PlanList({ items, openTask, compact }: { items: PlanItem[]; openTask: (id: string) => void; compact?: boolean }) {
  return (
    <ol className="flex flex-col">
      {items.map((item, i) => {
        const isBreak = item.track === 'Break'
        return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-3 py-1.5"
          >
            <span className="w-16 text-xs tabular-nums text-muted-foreground">{item.time}</span>
            <StatusDot status={item.status} />
            {isBreak ? (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Coffee className="size-3.5" /> Break
              </span>
            ) : (
              <button
                type="button"
                onClick={() => item.taskId && openTask(item.taskId)}
                className="group flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <span className={cn('truncate text-sm', item.status === 'completed' ? 'text-muted-foreground line-through' : 'font-medium')}>
                  <span className="text-muted-foreground">{item.track}</span>
                  {' — '}
                  {item.title}
                </span>
                {item.taskId && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />}
              </button>
            )}
            <StatusPill status={item.status} compact />
          </motion.li>
        )
      })}
    </ol>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <Panel className="flex items-center justify-center p-12">
      <p className="text-sm text-muted-foreground">{text}</p>
    </Panel>
  )
}
