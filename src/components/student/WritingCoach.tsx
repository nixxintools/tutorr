'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type WritingFeedback = {
  structure: number
  clarity: number
  argument: number
  grammar: number
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  summary: string
}

type Submission = {
  id: string
  title: string
  created_at: string
  feedback?: WritingFeedback | null
}

export function WritingCoach({ userId, conversationId }: { userId: string; conversationId: string }) {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null)
  const [loading, setLoading] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [error, setError] = useState<string | null>(null)

  const wordCount = useMemo(() => text.split(/\s+/).filter(Boolean).length, [text])

  const loadHistory = async () => {
    setHistoryOpen(true)
    const { data } = await supabase
      .from('writing_submissions')
      .select('id, title, created_at, feedback')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    setSubmissions((data ?? []) as Submission[])
  }

  const submit = async () => {
    setLoading(true)
    setError(null)
    const response = await fetch('/api/student/writing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, title, userId, conversationId }),
    })
    const data = await response.json()
    setLoading(false)
    if (!response.ok) {
      setError(data.error ?? 'Failed to get writing feedback')
      return
    }
    setFeedback(data.feedback)
  }

  const scoreColor = (score: number) => (score >= 8 ? '#6EE7B7' : score >= 5 ? '#FDE68A' : 'rgba(252,165,165,1)')

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold" style={{ color: '#fff' }}>Writing Coach</h2>
        <button type="button" onClick={loadHistory} className="rounded-xl px-4 py-2 text-sm font-medium" style={{ background: 'var(--bg-raised)', color: 'var(--text)' }}>My Submissions</button>
      </div>

      <div className="space-y-4 rounded-2xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your writing a title..." className="w-full rounded-xl px-4 py-3 text-sm" style={{ background: 'var(--bg-input)', border: '0.5px solid var(--border)', color: '#fff' }} />
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your essay, paragraph, or creative writing here..." className="min-h-[200px] w-full rounded-2xl p-4 text-sm" style={{ background: 'var(--bg-input)', border: '0.5px solid var(--border)', color: '#fff' }} />
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{wordCount} words</p>
          <button type="button" onClick={submit} disabled={loading} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white" style={{ background: 'var(--grad)' }}>
            {loading ? 'Reviewing...' : 'Get AI Feedback →'}
          </button>
        </div>
        {error ? <p className="text-sm" style={{ color: 'rgba(252,165,165,1)' }}>{error}</p> : null}
      </div>

      {feedback ? (
        <div className="space-y-4 rounded-2xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['Structure', feedback.structure],
              ['Clarity', feedback.clarity],
              ['Argument', feedback.argument],
              ['Grammar', feedback.grammar],
            ].map(([label, score]) => (
              <div key={label} className="rounded-2xl p-4 text-center" style={{ background: 'var(--bg-raised)' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(Number(score)) }}>{score}</div>
                <p className="mt-1 text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {feedback.strengths.map((item) => (
              <div key={item} className="rounded-xl p-3 text-sm" style={{ background: 'rgba(52,211,153,0.08)', color: '#6EE7B7' }}>
                <span className="mr-2 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: 'rgba(52,211,153,0.12)' }}>✓ Strength</span>
                {item}
              </div>
            ))}
            {feedback.improvements.map((item) => (
              <div key={item} className="rounded-xl p-3 text-sm" style={{ background: 'rgba(217,119,6,0.08)', color: '#FDE68A' }}>
                <span className="mr-2 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: 'rgba(217,119,6,0.12)' }}>⚠ Improve</span>
                {item}
              </div>
            ))}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: '#fff' }}>Suggestions</h3>
            <div className="space-y-3">
              {feedback.suggestions.map((suggestion, index) => (
                <div key={suggestion} className="rounded-xl p-3 text-sm" style={{ background: 'var(--bg-raised)', color: 'var(--text)' }}>
                  <span className="mr-2 font-semibold" style={{ color: '#C4B5FD' }}>{index + 1}.</span>
                  {suggestion}
                </div>
              ))}
            </div>
          </div>

          <button type="button" onClick={() => setFeedback(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: 'var(--grad)' }}>
            Revise & Resubmit
          </button>
        </div>
      ) : null}

      {historyOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4" onClick={() => setHistoryOpen(false)}>
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ color: '#fff' }}>My Submissions</h3>
              <button type="button" onClick={() => setHistoryOpen(false)} style={{ color: 'var(--text-muted)' }}>Close</button>
            </div>
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div key={submission.id} className="rounded-xl border p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
                  <p className="text-sm font-semibold" style={{ color: '#fff' }}>{submission.title}</p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(submission.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
