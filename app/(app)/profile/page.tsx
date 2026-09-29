'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Award, Flame, BookMarked, Footprints, Settings } from 'lucide-react'
import { USER, INITIAL_ACHIEVEMENTS } from '@/lib/mock-data'
import { useStore } from '@/components/nudge/store'
import { PageHeader, Panel, Eyebrow } from '@/components/nudge/primitives'

export default function ProfilePage() {
  const { streak, achievements, tracks, stats } = useStore()
  const unlocked = achievements.filter((a) => a.earned).length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="You"
        title="Profile"
        description="Your learning journey at a glance."
      />

      <Panel className="flex flex-col gap-4 p-5 md:p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full border border-border bg-secondary font-serif text-xl font-medium">
            {USER.initials}
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-2xl font-medium">{USER.name}</h2>
            <p className="text-sm text-muted-foreground">{USER.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border border-t border-border pt-4">
          <div className="flex flex-col gap-1 px-4">
            <Eyebrow>Streak</Eyebrow>
            <p className="flex items-center gap-1.5 font-serif text-2xl font-medium">
              <Flame className="size-4 text-ember" /> {streak}
            </p>
          </div>
          <div className="flex flex-col gap-1 px-4">
            <Eyebrow>Overall</Eyebrow>
            <p className="font-serif text-2xl font-medium tabular-nums">{stats.overall}%</p>
          </div>
          <div className="flex flex-col gap-1 px-4">
            <Eyebrow>Tracks</Eyebrow>
            <p className="font-serif text-2xl font-medium tabular-nums">{tracks.length}</p>
          </div>
        </div>
      </Panel>

      <Panel className="flex flex-col gap-4 p-5 md:p-6">
        <div className="flex items-center justify-between">
          <Eyebrow>Achievements</Eyebrow>
          <span className="text-xs text-muted-foreground">{unlocked} earned</span>
        </div>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {achievements.map((a, i) => {
            const earned = Boolean(a.earned)
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span
                  className={`flex size-10 items-center justify-center rounded-full border-2 ${
                    earned ? 'border-foreground bg-card text-foreground' : 'border-dashed border-border text-muted-foreground/40'
                  }`}
                >
                  {earned ? (
                    <span className="text-xs font-medium">{a.title.charAt(0)}</span>
                  ) : (
                    <span className="text-xs">?</span>
                  )}
                </span>
                <span className="eyebrow text-[0.5rem] leading-tight">{a.title}</span>
              </motion.div>
            )
          })}
        </div>
      </Panel>

      <div className="flex flex-col gap-2">
        <Link href="/settings" className="flex items-center gap-3 rounded-md border border-border bg-card p-4 hover:bg-accent">
          <Settings className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <Link href="/settings?section=plan" className="flex items-center gap-3 rounded-md border border-border bg-card p-4 hover:bg-accent">
          <BookMarked className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">My Learning Plan</span>
        </Link>
      </div>
    </div>
  )
}
