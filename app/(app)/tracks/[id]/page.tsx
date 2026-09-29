'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Check, ChevronDown, Circle, Dot, FlaskConical, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/components/nudge/store'
import { PageHeader, Panel, ProgressBar, Eyebrow, Tag } from '@/components/nudge/primitives'
import type { Phase, Module, Topic, InterviewItem } from '@/lib/mock-data'

export default function TrackDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { tracks, openTask } = useStore()
  const track = tracks.find((t) => t.id === id)

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    if (!track) return new Set()
    const set = new Set<string>()
    track.phases.forEach((p) => {
      p.modules.forEach((m) => {
        if (m.topics.some((t) => t.status === 'current' || t.status === 'todo')) {
          set.add(`${p.id}-${m.id}`)
        }
      })
    })
    return set
  })

  if (!track) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/tracks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to tracks
        </Link>
        <Panel className="p-12 text-center">
          <p className="text-sm text-muted-foreground">Track not found.</p>
        </Panel>
      </div>
    )
  }

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  return (
    <div className="flex flex-col gap-6">
      <Link href="/tracks" className="inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All tracks
      </Link>

      <PageHeader
        eyebrow={track.fullName}
        title={track.name}
        description={`${track.phase} · ${track.module} · ${track.current}`}
        actions={
          <div className="flex flex-col gap-1.5 min-w-40">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium tabular-nums">{track.liveProgress}%</span>
            </div>
            <ProgressBar value={track.liveProgress} tone="ember" label={`${track.name} progress`} />
          </div>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 flex flex-col gap-4">
          <Eyebrow>Curriculum</Eyebrow>
          {track.phases.map((phase) => (
            <PhaseBlock
              key={phase.id}
              phase={phase}
              expanded={expanded}
              toggle={toggle}
              onOpenTask={openTask}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:w-72">
          {track.kind === 'research' && <ResearchPanel track={track} />}
          {track.interview && <InterviewPanel items={track.interview} />}
        </div>
      </div>
    </div>
  )
}

function PhaseBlock({
  phase,
  expanded,
  toggle,
  onOpenTask,
}: {
  phase: Phase
  expanded: Set<string>
  toggle: (key: string) => void
  onOpenTask: (id: string) => void
}) {
  return (
    <Panel className="flex flex-col">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <Eyebrow>{phase.label}</Eyebrow>
        <span className="font-serif text-lg font-medium">{phase.name}</span>
      </div>
      <div className="flex flex-col p-2">
        {phase.modules.map((mod) => {
          const key = `${phase.id}-${mod.id}`
          const isOpen = expanded.has(key)
          return (
            <div key={mod.id} className="flex flex-col">
              <button
                type="button"
                onClick={() => toggle(key)}
                className="flex items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-accent/60"
              >
                <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', !isOpen && '-rotate-90')} />
                <span className="eyebrow text-muted-foreground">{mod.label}</span>
                <span className="text-sm font-medium">{mod.name}</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {mod.topics.map((topic) => (
                      <TopicRow key={topic.id} topic={topic} onOpenTask={onOpenTask} />
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

function TopicRow({ topic, onOpenTask }: { topic: Topic; onOpenTask: (id: string) => void }) {
  const done = topic.status === 'done'
  const current = topic.status === 'current'
  return (
    <li className="flex items-center gap-2 py-1.5 pl-10">
      <span
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-full border-2',
          done && 'border-success bg-success text-background',
          current && 'border-ember bg-card',
          topic.status === 'todo' && 'border-border bg-card',
        )}
      >
        {done && <Check className="size-2.5" strokeWidth={3.5} />}
        {current && <span className="size-1.5 rounded-full bg-ember" />}
      </span>
      <button
        type="button"
        disabled={!topic.taskId}
        onClick={() => topic.taskId && onOpenTask(topic.taskId)}
        className={cn(
          'text-sm text-left',
          done && 'text-muted-foreground line-through',
          current && 'font-medium',
          !done && !current && 'text-foreground',
          topic.taskId && 'hover:underline',
        )}
      >
        {topic.name}
      </button>
      {topic.mastered && <Tag className="border-success/30 text-success">M</Tag>}
      {current && <Tag className="border-ember/30 text-ember">Current</Tag>}
    </li>
  )
}

function ResearchPanel({ track }: { track: { flatTopics: Topic[] } }) {
  return (
    <Panel className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-2">
        <FlaskConical className="size-4 text-muted-foreground" />
        <Eyebrow>Research milestones</Eyebrow>
      </div>
      <ol className="flex flex-col gap-2">
        {track.flatTopics.map((topic, i) => {
          const done = topic.status === 'done'
          const current = topic.status === 'current'
          return (
            <li key={topic.id} className="flex items-center gap-2.5">
              <span
                className={cn(
                  'flex size-4 shrink-0 items-center justify-center rounded-full border-2',
                  done && 'border-success bg-success text-background',
                  current && 'border-ember bg-card',
                  topic.status === 'todo' && 'border-border bg-card',
                )}
              >
                {done && <Check className="size-2.5" strokeWidth={3.5} />}
                {current && <span className="size-1.5 rounded-full bg-ember" />}
              </span>
              <span className={cn('text-sm', done && 'text-muted-foreground', current && 'font-medium')}>
                {topic.name}
              </span>
            </li>
          )
        })}
      </ol>
    </Panel>
  )
}

function InterviewPanel({ items }: { items: InterviewItem[] }) {
  return (
    <Panel className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-2">
        <Mic className="size-4 text-muted-foreground" />
        <Eyebrow>Interview prep</Eyebrow>
      </div>
      <ol className="flex flex-col gap-2">
        {items.map((item, i) => {
          const done = item.status === 'done'
          const current = item.status === 'current'
          return (
            <li key={i} className="flex items-center gap-2.5">
              <span
                className={cn(
                  'flex size-4 shrink-0 items-center justify-center rounded-full border-2',
                  done && 'border-success bg-success text-background',
                  current && 'border-ember bg-card',
                  item.status === 'todo' && 'border-border bg-card',
                )}
              >
                {done && <Check className="size-2.5" strokeWidth={3.5} />}
                {current && <span className="size-1.5 rounded-full bg-ember" />}
              </span>
              <div className="flex flex-col">
                <span className="eyebrow text-[0.55rem] text-muted-foreground">{item.type}</span>
                <span className={cn('text-sm', done && 'text-muted-foreground', current && 'font-medium')}>
                  {item.title}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </Panel>
  )
}
