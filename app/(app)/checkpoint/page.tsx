'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useStore } from '@/components/nudge/store'
import { PageHeader, Panel, ProgressBar, Eyebrow } from '@/components/nudge/primitives'
import { CheckpointLine } from '@/components/nudge/checkpoint-line'

export default function CheckpointPage() {
  const { tracks } = useStore()
  const [selectedId, setSelectedId] = useState('aiml')
  const track = tracks.find((t) => t.id === selectedId) ?? tracks[0]

  const done = track.flatTopics.filter((t) => t.status === 'done').length
  const remaining = track.flatTopics.length - done
  const currentTopic = track.flatTopics.find((t) => t.status === 'current')
  const nextTopic = track.flatTopics.find((t) => t.status === 'todo')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Progress"
        title="Checkpoint"
        description="Where you are in each track."
      />

      <div className="flex flex-wrap gap-2">
        {tracks.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedId(t.id)}
            className={cn(
              'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
              t.id === track.id
                ? 'border-foreground bg-foreground text-primary-foreground'
                : 'border-border bg-card hover:bg-accent',
            )}
          >
            {t.name}
          </button>
        ))}
      </div>

      <motion.div
        key={track.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        <Panel className="flex flex-col gap-3 p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <Eyebrow>{track.fullName}</Eyebrow>
            <span className="text-sm font-medium tabular-nums">{track.liveProgress}%</span>
          </div>
          <h2 className="font-serif text-3xl font-medium">{track.name}</h2>
          <p className="text-sm text-muted-foreground">
            {track.phase} · {track.module}
          </p>
          <div className="pt-4">
            <ProgressBar value={track.liveProgress} tone="ember" label={`${track.name} progress`} />
          </div>
          <div className="pt-6">
            <Eyebrow className="pb-4">Topic progression</Eyebrow>
            <CheckpointLine topics={track.flatTopics} window={7} />
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel className="flex flex-col gap-3 p-5">
            <Eyebrow>Current topic</Eyebrow>
            <p className="font-serif text-xl font-medium">{currentTopic?.name ?? 'Complete'}</p>
            <p className="text-sm text-muted-foreground">
              {currentTopic ? 'In progress' : 'All topics done'}
            </p>
          </Panel>
          <Panel className="grid grid-cols-2 divide-x divide-border">
            <div className="flex flex-col gap-1 p-4">
              <Eyebrow>Completed</Eyebrow>
              <p className="font-serif text-2xl font-medium tabular-nums">{done}</p>
            </div>
            <div className="flex flex-col gap-1 p-4">
              <Eyebrow>Remaining</Eyebrow>
              <p className="font-serif text-2xl font-medium tabular-nums">{remaining}</p>
            </div>
          </Panel>
          {nextTopic && (
            <Panel className="flex flex-col gap-1 p-5">
              <Eyebrow>Next</Eyebrow>
              <p className="font-serif text-lg font-medium">{nextTopic.name}</p>
            </Panel>
          )}
        </div>
      </motion.div>
    </div>
  )
}
