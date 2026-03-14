'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getWeekDays } from '@/lib/formatDate'

type StudentXp = {
  level?: number
  total_xp?: number
  current_streak?: number
  longest_streak?: number
}

type Achievement = {
  code: string
  name: string
  icon?: string | null
  subject_color?: string | null
  requirement?: string | null
  xp_reward?: number | null
}

type StudentAchievement = {
  achievement_code: string
  achievements?: Achievement | null
}

type DailyActivity = { activity_date: string }

export function GamificationPanel({ userId }: { userId: string }) {
  const supabase = createClient()
  const [xp, setXp] = useState<StudentXp | null>(null)
  const [earned, setEarned] = useState<StudentAchievement[]>([])
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([])
  const [activity, setActivity] = useState<DailyActivity[]>([])

  useEffect(() => {
    void (async () => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const [xpRes, earnedRes, allRes, activityRes] = await Promise.all([
        supabase.from('student_xp').select('*').eq('user_id', userId).single(),
        supabase.from('student_achievements').select('achievement_code, achievements(*)').eq('user_id', userId),
        supabase.from('achievements').select('*'),
        supabase.from('daily_activity').select('*').eq('user_id', userId).gte('activity_date', weekAgo).order('activity_date'),
      ])
      setXp((xpRes.data as StudentXp | null) ?? null)
      setEarned((earnedRes.data as StudentAchievement[] | null) ?? [])
      setAllAchievements((allRes.data as Achievement[] | null) ?? [])
      setActivity((activityRes.data as DailyActivity[] | null) ?? [])
    })()
  }, [supabase, userId])

  const earnedCodes = useMemo(() => new Set(earned.map((item) => item.achievement_code)), [earned])
  const currentXp = (xp?.total_xp ?? 0) % 500
  const level = xp?.level ?? Math.max(1, Math.floor((xp?.total_xp ?? 0) / 500) + 1)
  const activeDates = new Set(activity.map((item) => item.activity_date))

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="text-5xl font-extrabold" style={{ fontFamily: 'var(--font-sora, Sora, sans-serif)', background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{level}</div>
        <p className="mt-1 text-sm font-medium" style={{ color: '#fff' }}>Level {level}</p>
        <div className="mt-4 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full" style={{ width: `${(currentXp / 500) * 100}%`, background: 'var(--grad)', transition: 'width 0.4s ease' }} />
        </div>
        <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>{currentXp} / 500 XP to Level {level + 1}</p>
      </div>

      <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <p className="text-lg font-semibold" style={{ color: '#fff' }}>🔥 {xp?.current_streak ?? 0} day streak!</p>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Longest: {xp?.longest_streak ?? 0} days</p>
        <div className="mt-4 flex gap-2">
          {getWeekDays().map(({ label, date }) => {
            const key = date.toISOString().split('T')[0]
            const hasActivity = activeDates.has(key)
            return (
              <div key={key} className="flex h-10 w-10 flex-col items-center justify-center rounded-xl text-[10px] font-semibold" style={hasActivity ? { background: 'rgba(124,58,237,0.2)', color: '#C4B5FD' } : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)' }}>
                {label}
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold" style={{ color: '#fff' }}>Achievements ({earned.length}/{allAchievements.length})</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
          {allAchievements.map((achievement) => {
            const isEarned = earnedCodes.has(achievement.code)
            return (
              <div key={achievement.code} className="flex flex-col items-center rounded-2xl border p-3 text-center" title={achievement.requirement ?? achievement.name} style={{
                background: isEarned ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                borderColor: isEarned ? (achievement.subject_color || 'rgba(124,58,237,0.4)') : 'rgba(255,255,255,0.08)',
                boxShadow: isEarned ? `0 0 14px ${(achievement.subject_color || 'rgba(124,58,237,0.3)')}` : 'none',
                opacity: isEarned ? 1 : 0.35,
              }}>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full text-[28px]" style={{ background: isEarned ? `${achievement.subject_color || 'rgba(124,58,237,0.15)'}22` : 'rgba(255,255,255,0.04)' }}>
                  {achievement.icon || (isEarned ? '🌟' : '🔒')}
                </div>
                <p className="mt-2 text-[10px] font-medium" style={{ color: isEarned ? '#fff' : 'var(--text-muted)' }}>{achievement.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
