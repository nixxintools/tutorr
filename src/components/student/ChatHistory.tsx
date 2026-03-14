'use client'

import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatRelative } from '@/lib/formatDate'

type ConversationRow = {
  id: string
  subject: string
  title?: string | null
  mode?: string | null
  created_at?: string | null
  updated_at?: string | null
  summary?: string | null
}

const subjectDots: Record<string, string> = {
  math: '#A78BFA',
  reading: '#34D399',
  science: '#FCD34D',
  writing: '#F9A8D4',
}

export function ChatHistory({
  userId,
  onSelectConversation,
}: {
  userId: string
  onSelectConversation: (id: string, subject: string) => void
}) {
  const supabase = createClient()
  const [conversations, setConversations] = useState<ConversationRow[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubject, setFilterSubject] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from('conversations')
        .select('id, subject, title, mode, created_at, updated_at, summary')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(50)
      setConversations((data ?? []) as ConversationRow[])
      setLoading(false)
    })()
  }, [supabase, userId])

  const filtered = useMemo(() => {
    return conversations.filter((conversation) => {
      const matchesSubject = filterSubject === 'all' || conversation.subject === filterSubject
      const matchesSearch = !searchQuery || (conversation.title ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSubject && matchesSearch
    })
  }, [conversations, filterSubject, searchQuery])

  return (
    <div className="flex h-full flex-col">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-faint)' }} />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search sessions" className="w-full rounded-xl py-3 pl-10 pr-4 text-sm" style={{ background: 'var(--bg-input)', border: '0.5px solid var(--border)', color: '#fff' }} />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {['all', 'math', 'reading', 'science', 'writing'].map((subject) => (
          <button
            key={subject}
            type="button"
            onClick={() => setFilterSubject(subject)}
            className="rounded-full px-3 py-1.5 text-xs font-medium"
            style={filterSubject === subject ? { background: 'var(--grad)', color: '#fff' } : { background: 'var(--bg-raised)', color: 'var(--text-muted)' }}
          >
            {subject === 'all' ? 'All' : subject[0].toUpperCase() + subject.slice(1)}
          </button>
        ))}
      </div>

      <p className="mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>{filtered.length} sessions</p>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading history...</p> : null}
        {filtered.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelectConversation(conversation.id, conversation.subject)}
            className="flex w-full items-center gap-3 border-b py-3 text-left"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: subjectDots[conversation.subject] ?? '#A78BFA' }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" style={{ color: '#fff' }}>{conversation.title || 'Session'}</p>
              {conversation.mode && conversation.mode !== 'tutor' ? (
                <span className="mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                  {conversation.mode === 'homework' ? 'Homework Help' : 'Writing Coach'}
                </span>
              ) : null}
              <p className="mt-1 truncate text-xs" style={{ color: 'var(--text-muted)' }}>{conversation.summary || 'No summary yet'}</p>
              <p className="mt-1 text-[11px]" style={{ color: 'var(--text-faint)' }}>{formatRelative(conversation.updated_at || conversation.created_at || new Date().toISOString())}</p>
            </div>
            <span style={{ color: 'var(--text-faint)' }}>→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
