'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type HomeworkItem = {
  id: string
  title: string
  subject: 'math' | 'reading' | 'science' | 'writing'
  due_date: string
  description?: string | null
  status?: 'not_started' | 'in_progress' | 'completed' | 'overdue'
  progress?: number | null
}

const SUBJECT_ICON = {
  math: '📐',
  reading: '📖',
  science: '🔬',
  writing: '✍️',
} as const

const STATUS_LABELS = {
  all: 'All',
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
} as const

export function HomeworkPanel({ userId }: { userId: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [assignments, setAssignments] = useState<HomeworkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState<keyof typeof STATUS_LABELS>('all')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState<HomeworkItem['subject']>('math')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const { data, error: fetchError } = await supabase.from('homework').select('*').eq('user_id', userId).order('due_date')
        if (fetchError) throw fetchError
        setAssignments((data ?? []) as HomeworkItem[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load homework')
      } finally {
        setLoading(false)
      }
    })()
  }, [supabase, userId])

  const filtered = useMemo(() => {
    if (tab === 'all') return assignments
    return assignments.filter((item) => item.status === tab)
  }, [assignments, tab])

  const addAssignment = async () => {
    setError(null)
    const { data, error: insertError } = await supabase
      .from('homework')
      .insert({ user_id: userId, title, subject, due_date: dueDate, description, status: 'not_started' })
      .select('*')
      .single()
    if (insertError) {
      setError(insertError.message)
      return
    }
    setAssignments((prev) => [...prev, data as HomeworkItem])
    setShowForm(false)
    setTitle('')
    setDescription('')
    setDueDate('')
  }

  const openInChat = (item: HomeworkItem) => {
    const prefill = encodeURIComponent(`Homework: ${item.title}\n${item.description ?? ''}`)
    router.push(`/chat/${item.subject}?mode=homework&prefill=${prefill}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: '#fff' }}>Homework</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Track assignments and jump into focused help.</p>
        </div>
        <button type="button" onClick={() => setShowForm((v) => !v)} className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: 'var(--grad)' }}>
          Add Assignment
        </button>
      </div>

      {showForm ? (
        <div className="grid gap-3 rounded-2xl border p-4 md:grid-cols-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="rounded-xl px-4 py-3 text-sm" style={{ background: 'var(--bg-input)', border: '0.5px solid var(--border)', color: '#fff' }} />
          <select value={subject} onChange={(e) => setSubject(e.target.value as HomeworkItem['subject'])} className="rounded-xl px-4 py-3 text-sm" style={{ background: 'var(--bg-input)', border: '0.5px solid var(--border)', color: '#fff' }}>
            <option value="math">Math</option>
            <option value="reading">Reading</option>
            <option value="science">Science</option>
            <option value="writing">Writing</option>
          </select>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-xl px-4 py-3 text-sm" style={{ background: 'var(--bg-input)', border: '0.5px solid var(--border)', color: '#fff' }} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="rounded-xl px-4 py-3 text-sm md:col-span-2" style={{ minHeight: 110, background: 'var(--bg-input)', border: '0.5px solid var(--border)', color: '#fff' }} />
          <div className="flex gap-3 md:col-span-2">
            <button type="button" onClick={addAssignment} className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: 'var(--grad)' }}>Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-4 py-2 text-sm" style={{ color: 'var(--text-muted)' }}>Cancel</button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {(Object.keys(STATUS_LABELS) as Array<keyof typeof STATUS_LABELS>).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className="rounded-full px-4 py-2 text-sm font-medium"
            style={tab === value ? { background: 'var(--grad)', color: '#fff' } : { background: 'var(--bg-raised)', color: 'var(--text-muted)', border: '0.5px solid var(--border)' }}
          >
            {STATUS_LABELS[value]}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading homework...</p> : null}
      {error ? <p style={{ color: 'rgba(252,165,165,1)' }}>{error}</p> : null}

      <div className="space-y-3">
        {filtered.map((item) => {
          const overdue = item.status === 'overdue'
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => openInChat(item)}
              className="flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition"
              style={{
                background: 'var(--bg-card)',
                borderColor: overdue ? 'rgba(239,68,68,0.3)' : 'var(--border)',
                borderLeft: overdue ? '3px solid rgba(239,68,68,0.5)' : undefined,
              }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)' }}>{SUBJECT_ICON[item.subject]}</div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold" style={{ color: '#fff' }}>{item.title}</p>
                    <p className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>{item.description || 'No description yet'}</p>
                    <p className="mt-1 text-[11px]" style={{ color: 'var(--text-faint)' }}>Due {item.due_date}</p>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: overdue ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)', color: overdue ? 'rgba(252,165,165,1)' : 'var(--text-muted)' }}>
                  {item.status?.replace('_', ' ') ?? 'not started'}
                </span>
                {item.status === 'in_progress' ? (
                  <div className="mt-2 h-1.5 w-24 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${item.progress ?? 45}%`, background: 'var(--grad)' }} />
                  </div>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>

      {!loading && filtered.length === 0 ? (
        <div className="rounded-2xl border p-6 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <p className="text-sm font-medium" style={{ color: '#fff' }}>Nothing here yet</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>Add an assignment to get started.</p>
          <button type="button" onClick={() => setShowForm(true)} className="mt-4 rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: 'var(--grad)' }}>Quick add</button>
        </div>
      ) : null}
    </div>
  )
}
