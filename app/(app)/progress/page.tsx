'use client'

import { motion } from 'motion/react'
import { useStore } from '@/components/nudge/store'
import { MASTERY_SERIES, MASTERY_TARGET } from '@/lib/mock-data'
import { PageHeader, Panel, BlockBar, ProgressBar, Eyebrow } from '@/components/nudge/primitives'
import { MasteryChart } from '@/components/nudge/dashboard/mastery-chart'

export default function ProgressPage() {
  const { tracks, stats, streak, masteredToday } = useStore()
  const latest = MASTERY_SERIES.at(-1)!
  const peak = Math.max(...MASTERY_SERIES.map((d) => d.score))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Analytics"
        title="Progress"
        description="Simple, honest numbers."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Overall" value={`${stats.overall}%`} />
        <StatCard label="Streak" value={`${streak} days`} />
        <StatCard label="Mastered" value={`${masteredToday + 18} topics`} />
      </div>

      <Panel className="flex flex-col gap-5 p-5 md:p-6">
        <Eyebrow>Track progress</Eyebrow>
        <div className="flex flex-col gap-4">
          {tracks.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{track.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{track.liveProgress}%</span>
              </div>
              <BlockBar value={track.liveProgress} blocks={10} />
            </motion.div>
          ))}
        </div>
      </Panel>

      <MasteryChart />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Panel className="flex flex-col gap-1 p-5">
      <Eyebrow>{label}</Eyebrow>
      <p className="font-serif text-3xl font-medium tabular-nums">{value}</p>
    </Panel>
  )
}
