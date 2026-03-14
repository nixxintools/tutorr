'use client'

import { Menu } from 'lucide-react'
import type { Subject } from '@/lib/supabase/types'

type ChatHeaderProps = {
  subject: Subject
  messagesToday: number
  onBack: () => void
  showCoachMode?: boolean
  coachMode?: boolean
  onToggleCoachMode?: () => void
}

const SUBJECT_META: Record<Subject, { label: string; icon: string; dot: string; accentBg: string; accentText: string }> = {
  math: { label: 'Math', icon: '📐', dot: 'bg-violet-500', accentBg: 'rgba(124,58,237,0.15)', accentText: '#C4B5FD' },
  reading: { label: 'Reading', icon: '📖', dot: 'bg-emerald-500', accentBg: 'rgba(5,150,105,0.15)', accentText: '#6EE7B7' },
  science: { label: 'Science', icon: '🔬', dot: 'bg-amber-500', accentBg: 'rgba(217,119,6,0.15)', accentText: '#FDE68A' },
  writing: { label: 'Writing', icon: '✍️', dot: 'bg-pink-500', accentBg: 'rgba(236,72,153,0.15)', accentText: '#F9A8D4' },
}

export function ChatHeader({ subject, messagesToday, onBack, showCoachMode = false, coachMode = false, onToggleCoachMode }: ChatHeaderProps) {
  const meta = SUBJECT_META[subject]

  return (
    <header className="px-4 py-4 shadow-sm md:px-6" style={{ background: 'var(--bg-surface)', borderBottom: '0.5px solid var(--border)' }}>
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="hidden rounded-xl p-2 transition-all duration-200 md:inline-flex" style={{ color: 'var(--text-muted)' }} aria-label="Back">
            ←
          </button>
          <button type="button" className="inline-flex rounded-xl p-2 transition-all duration-200 md:hidden" style={{ color: 'var(--text-muted)' }} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-lg" style={{ background: meta.accentBg, color: meta.accentText }}>
            {meta.icon}
          </div>
          <div>
            <p className="font-semibold" style={{ color: '#fff' }}>{meta.label}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>AI Tutor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showCoachMode ? (
            <button
              type="button"
              onClick={onToggleCoachMode}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={coachMode ? { background: 'var(--grad)', color: '#fff' } : { background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
            >
              Coach Mode
            </button>
          ) : null}
          <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
            {messagesToday} messages today
          </span>
          <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
        </div>
      </div>
    </header>
  )
}
