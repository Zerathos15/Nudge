'use client'

import { motion } from 'motion/react'
import { Check, ChevronRight, Coffee, ArrowUpRight, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TODAY_ISO } from '@/lib/mock-data'
import { formatLong, weekday } from '@/lib/schedule'
import { useStore } from '@/components/nudge/store'
import { PageHeader, Panel, StatusPill, Eyebrow } from '@/components/nudge/primitives'

export default function TodayPage() {
  const { tasks, openTask } = useStore()
  const study = tasks.filter((t) => t.kind === 'study')
  const current = study.filter((t) => t.status === 'in-progress')
  const upcoming = study.filter((t) => t.status === 'upcoming')
  const completed = study.filter((t) => t.status === 'completed')
  const carried = study.filter((t) => t.status === 'carried')
  const breaks = tasks.filter((t) => t.kind === 'break')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={`${weekday(TODAY_ISO)} · ${formatLong(TODAY_ISO)}`}
        title="Today"
        description="Your focused learning day."
      />

      <Section title="Current" items={current} openTask={openTask} empty="Nothing in progress right now." />
      <Section title="Up next" items={upcoming} openTask={openTask} empty="Nothing else scheduled." />
      <Section title="Completed" items={completed} openTask={openTask} empty="No completed tasks yet." />
      <Section title="Carried forward" items={carried} openTask={openTask} empty="You're all caught up." />
    </div>
  )
}

function Section({
  title,
  items,
  openTask,
  empty,
}: {
  title: string
  items: { id: string; kind: string; start: string; end: string; track: string; title: string; status: string }[]
  openTask: (id: string) => void
  empty: string
}) {
  return (
    <Panel className="flex flex-col gap-3 p-5 md:p-6">
      <Eyebrow>{title}</Eyebrow>
      {items.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((task, i) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                type="button"
                onClick={() => openTask(task.id)}
                className="group flex w-full items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-left transition-colors hover:border-border hover:bg-card"
              >
                <span className="w-16 text-xs tabular-nums text-muted-foreground">{task.start}</span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-sm font-medium">
                    <span className="text-muted-foreground">{task.track}</span>
                    {' — '}
                    {task.title}
                  </span>
                  <StatusPill status={task.status as any} />
                </span>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
