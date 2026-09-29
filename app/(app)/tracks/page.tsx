'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { useStore } from '@/components/nudge/store'
import { PageHeader, Panel, ProgressBar, Eyebrow } from '@/components/nudge/primitives'

export default function TracksPage() {
  const { tracks } = useStore()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Curriculum"
        title="Tracks"
        description="Your learning tracks, phases, and modules."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {tracks.map((track, i) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/tracks/${track.id}`}>
              <Panel className="group flex flex-col gap-3 p-5 transition-colors hover:border-foreground/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <Eyebrow>{track.fullName}</Eyebrow>
                    <h3 className="font-serif text-2xl font-medium">{track.name}</h3>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {track.phase} · {track.module}
                </p>
                <p className="text-sm font-medium">{track.current}</p>
                <div className="flex flex-col gap-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium tabular-nums">{track.liveProgress}%</span>
                  </div>
                  <ProgressBar value={track.liveProgress} tone="ember" label={`${track.name} progress`} />
                </div>
              </Panel>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
