'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { HomeworkPanel } from '@/components/student/HomeworkPanel'
import { GamificationPanel } from '@/components/student/GamificationPanel'
import { ChatHistory } from '@/components/student/ChatHistory'

export function StudentQuickActions({ userId }: { userId: string }) {
  const router = useRouter()
  const [panel, setPanel] = useState<'homework' | 'badges' | 'history' | null>(null)

  return (
    <>
      <div className="px-4 pb-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: '#fff' }}>Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { key: 'homework', icon: '📚', label: 'Homework' },
            { key: 'badges', icon: '🏆', label: 'Badges' },
            { key: 'history', icon: '🕐', label: 'History' },
            { key: 'writing', icon: '✍️', label: 'Writing' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => item.key === 'writing' ? router.push('/chat/writing?mode=writing_coach') : setPanel(item.key as 'homework' | 'badges' | 'history')}
              className="flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: '#fff' }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {panel ? (
        <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md border-l p-4 shadow-2xl" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: '#fff' }}>{panel === 'homework' ? 'Homework' : panel === 'badges' ? 'Badges' : 'History'}</h3>
            <button type="button" onClick={() => setPanel(null)} style={{ color: 'var(--text-muted)' }}>Close</button>
          </div>
          {panel === 'homework' ? <HomeworkPanel userId={userId} /> : null}
          {panel === 'badges' ? <GamificationPanel userId={userId} /> : null}
          {panel === 'history' ? <ChatHistory userId={userId} onSelectConversation={(id, subject) => { setPanel(null); router.push(`/chat/${subject}?conversation=${id}`) }} /> : null}
        </div>
      ) : null}
    </>
  )
}
