'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type LearningPath = {
  current_difficulty?: 'easy' | 'medium' | 'hard'
  next_session_focus?: string | null
  recommended_topics?: string[] | null
  weak_areas?: string[] | null
  strong_areas?: string[] | null
}

export function AdaptiveLearning({
  userId,
  subject,
  onTopicSelect,
}: {
  userId: string
  subject: string
  onTopicSelect?: (topic: string) => void
}) {
  const supabase = createClient()
  const [path, setPath] = useState<LearningPath | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.from('learning_paths').select('*').eq('user_id', userId).eq('subject', subject).maybeSingle()
      if (data) {
        setPath(data as LearningPath)
        setLoading(false)
        return
      }

      const defaults: LearningPath = {
        current_difficulty: 'medium',
        next_session_focus: `Build confidence in ${subject}`,
        recommended_topics: [],
        weak_areas: [],
        strong_areas: [],
      }
      setPath(defaults)
      setLoading(false)
      void (async () => {
        await supabase.from('learning_paths').insert({ user_id: userId, subject, ...defaults })
      })().catch(() => null)
    })()
  }, [subject, supabase, userId])

  const updateDifficulty = async (currentDifficulty: 'easy' | 'medium' | 'hard') => {
    setPath((prev) => ({ ...(prev ?? {}), current_difficulty: currentDifficulty }))
    await supabase.from('learning_paths').update({ current_difficulty: currentDifficulty }).eq('user_id', userId).eq('subject', subject)
  }

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading path...</p>

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>Difficulty</p>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => updateDifficulty(level)}
              className="rounded-xl border px-3 py-2 text-sm capitalize"
              style={path?.current_difficulty === level ? { background: 'rgba(124,58,237,0.2)', borderColor: 'rgba(124,58,237,0.5)', color: '#C4B5FD' } : { background: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>Currently learning</p>
        <div className="rounded-xl p-3 text-sm" style={{ background: 'var(--bg-raised)', color: '#C4B5FD' }}>{path?.next_session_focus || `Build confidence in ${subject}`}</div>
      </div>

      <TopicPills title="Up Next" items={path?.recommended_topics ?? []} onSelect={onTopicSelect} />
      <TopicPills title="Needs Practice" items={path?.weak_areas ?? []} onSelect={onTopicSelect} tone="weak" />
      <TopicPills title="You're great at" items={path?.strong_areas ?? []} onSelect={onTopicSelect} tone="strong" />
    </div>
  )
}

function TopicPills({ title, items, onSelect, tone = 'neutral' }: { title: string; items: string[]; onSelect?: (topic: string) => void; tone?: 'neutral' | 'weak' | 'strong' }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.length > 0 ? items.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => onSelect?.(topic)}
            className="rounded-full border px-3 py-1.5 text-xs"
            style={tone === 'weak'
              ? { background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: 'rgba(252,165,165,1)' }
              : tone === 'strong'
                ? { background: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.2)', color: '#6EE7B7' }
                : { background: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            {topic}
          </button>
        )) : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>No data yet</span>}
      </div>
    </div>
  )
}
