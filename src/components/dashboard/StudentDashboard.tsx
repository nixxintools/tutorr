import Link from 'next/link'
import { RoleBadge } from '@/components/dashboard/RoleBadge'
import { formatRelative, getWeekDays } from '@/lib/formatDate'
import { StudentQuickActions } from '@/components/student/StudentQuickActions'

type DashboardProfile = {
  full_name?: string | null
  role?: 'student' | 'teacher' | 'parent' | null
  subscription_tier?: 'free' | 'pro' | null
}

type Conversation = {
  id: string
  subject?: string | null
  title?: string | null
  created_at?: string | null
  updated_at?: string | null
}

type Progress = {
  subject?: string | null
  session_count?: number | null
}

type WeekMessage = {
  created_at: string
  role: string
}

type TopicMastery = {
  topic_name?: string | null
  topic?: string | null
  subject?: string | null
  mastery_level?: number | null
}

type StudentXp = {
  level?: number | null
  total_xp?: number | null
}

type StudentSubject = 'math' | 'reading' | 'science' | 'writing'

const SUBJECT_CONFIG: Record<StudentSubject, {
  icon: string
  label: string
  gradStart: string
  gradEnd: string
  bgLight: string
  textColor: string
  buttonBg: string
}> = {
  math: { icon: '📐', label: 'Math', gradStart: '#7C3AED', gradEnd: '#A78BFA', bgLight: 'rgba(124,58,237,0.15)', textColor: '#C4B5FD', buttonBg: 'rgba(124,58,237,0.12)' },
  reading: { icon: '📖', label: 'Reading', gradStart: '#059669', gradEnd: '#34D399', bgLight: 'rgba(5,150,105,0.12)', textColor: '#6EE7B7', buttonBg: 'rgba(5,150,105,0.1)' },
  science: { icon: '🔬', label: 'Science', gradStart: '#D97706', gradEnd: '#FCD34D', bgLight: 'rgba(217,119,6,0.12)', textColor: '#FDE68A', buttonBg: 'rgba(217,119,6,0.1)' },
  writing: { icon: '✍️', label: 'Writing', gradStart: '#EC4899', gradEnd: '#F9A8D4', bgLight: 'rgba(236,72,153,0.12)', textColor: '#F9A8D4', buttonBg: 'rgba(236,72,153,0.1)' },
}

const STUDY_TIPS = [
  'Try the Pomodoro technique - 25 min focused, 5 min break. Consistency beats cramming every time.',
  'After each session, write 3 things you learned in your own words. It cements memory!',
  'Struggling with a concept? Ask your tutor to explain it a different way - analogies help.',
  'Your Math sessions show strong momentum. Keep the streak going today!',
  'Reading comprehension improves fastest when you summarize each paragraph before moving on.',
  'Quiz yourself at the end of each session - active recall beats re-reading by 3x.',
  'Great week so far! Challenge yourself with a harder problem today.',
] as const

const MASTERY_LABELS = ['Not Started', 'Beginner', 'Developing', 'Proficient', 'Mastered']
const MASTERY_COLORS = ['rgba(255,255,255,0.12)', 'rgba(239,68,68,0.45)', 'rgba(217,119,6,0.45)', 'rgba(37,99,235,0.45)', 'rgba(52,211,153,0.45)']

export default function StudentDashboard({
  userId,
  profile,
  conversations,
  progress,
  weekMsgs,
  topicMastery,
  studentXp,
}: {
  userId: string
  profile: DashboardProfile | null
  conversations: Conversation[]
  progress: Progress[]
  weekMsgs: WeekMessage[]
  topicMastery: TopicMastery[]
  studentXp: StudentXp | null
}) {
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const activeDates = new Set(weekMsgs.map((message) => message.created_at.split('T')[0]))
  const streak = activeDates.size
  const totalSessions = conversations.length
  const totalMessages = weekMsgs.length
  const latestConversation = conversations[0]
  const subjectMap: Record<string, number> = {}
  progress.forEach((item) => {
    if (item.subject) subjectMap[item.subject] = item.session_count ?? 0
  })
  const tip = STUDY_TIPS[new Date().getDay()]
  const level = studentXp?.level ?? Math.max(1, Math.floor((studentXp?.total_xp ?? 0) / 500) + 1)
  const xpInLevel = (studentXp?.total_xp ?? 0) % 500

  return (
    <div className="w-full" style={{ background: 'var(--bg-base)' }}>
      <section className="mx-4 mt-4 rounded-[20px] border p-7 md:mx-6" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(37,99,235,0.25))', borderColor: 'rgba(124,58,237,0.2)', color: '#fff' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: 'var(--font-sora, Sora, sans-serif)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px' }}>
              {greeting}, {firstName}! 👋
            </h1>
            <p className="mt-1 text-[13px] text-white/65">{totalSessions} sessions completed · {streak} day streak</p>
            <div className="mt-3"><RoleBadge role="student" size="sm" /></div>
            <div className="mt-4 max-w-xs rounded-xl border p-3" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)' }}>
              <p className="text-xs uppercase tracking-wide text-white/50">Level & XP</p>
              <p className="mt-1 text-sm font-semibold text-white">Level {level} · {xpInLevel}/500 XP</p>
              <div className="mt-2 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${(xpInLevel / 500) * 100}%`, background: 'linear-gradient(90deg,#C4B5FD,#93C5FD)' }} /></div>
            </div>
            {latestConversation ? (
              <div className="mt-5">
                <p className="mb-2 text-[11px] uppercase tracking-wider text-white/50">Continue where you left off:</p>
                <Link href={`/chat/${latestConversation.subject ?? 'math'}?conversation=${latestConversation.id}`} className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[13px] font-semibold text-white no-underline" style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)' }}>
                  <span>{SUBJECT_CONFIG[(latestConversation.subject as StudentSubject) ?? 'math']?.icon ?? '📐'}</span>
                  <span>Resume {latestConversation.subject ?? 'math'} session</span>
                  <span className="ml-auto">→</span>
                </Link>
              </div>
            ) : <p className="mt-4 text-[13px] text-white/55">Pick a subject below to start your first session 👇</p>}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 14, padding: '12px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>{streak}🔥</div>
            <div className="mt-1 text-[10px] text-white/55">Day streak</div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
        {[
          { icon: '📚', bg: 'rgba(124,58,237,0.15)', value: totalSessions, label: 'Total sessions' },
          { icon: '📅', bg: 'rgba(5,150,105,0.12)', value: activeDates.size, label: 'Days active' },
          { icon: '💬', bg: 'rgba(37,99,235,0.12)', value: totalMessages, label: 'Messages this week' },
          { icon: '⭐', bg: profile?.subscription_tier === 'pro' ? 'linear-gradient(135deg,#7C3AED,#2563EB)' : 'rgba(255,255,255,0.06)', value: profile?.subscription_tier?.toUpperCase() ?? 'FREE', label: 'Current plan' },
        ].map((card) => (
          <div key={card.label} style={{ background: 'var(--bg-card)', borderRadius: 14, border: '0.5px solid var(--border)', padding: 16 }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] text-xl" style={{ background: card.bg, color: '#fff' }}>{card.icon}</div>
            <div className="mt-2" style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-sora, Sora, sans-serif)', color: '#fff' }}>{card.value}</div>
            <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.5px]" style={{ color: 'var(--text-faint)' }}>{card.label}</div>
            {card.label === 'Current plan' && (profile?.subscription_tier ?? 'free') === 'free' ? <Link href="/upgrade" className="mt-1 block text-xs no-underline" style={{ color: '#A78BFA' }}>Upgrade →</Link> : null}
          </div>
        ))}
      </div>

      <div className="px-4 pb-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: '#fff' }}>Start a Session</h2>
          <Link href="/chat/math" className="text-sm no-underline" style={{ color: '#A78BFA' }}>View all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(Object.keys(SUBJECT_CONFIG) as StudentSubject[]).map((subject) => {
            const meta = SUBJECT_CONFIG[subject]
            const sessions = subjectMap[subject] ?? 0
            const width = `${Math.min((sessions / 20) * 100, 100)}%`
            return (
              <Link key={subject} href={`/chat/${subject}`} className="overflow-hidden rounded-2xl no-underline transition-all duration-200 hover:-translate-y-[1px]" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>
                <div style={{ height: 3, background: `linear-gradient(90deg, ${meta.gradStart}, ${meta.gradEnd})` }} />
                <div className="p-3.5">
                  <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-[11px] text-[20px]" style={{ background: meta.bgLight }}>{meta.icon}</div>
                  <div className="text-sm font-semibold" style={{ color: '#fff' }}>{meta.label}</div>
                  <div className="mb-2 mt-0.5 text-xs" style={{ color: 'var(--text-faint)' }}>{sessions} sessions</div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}><div className="h-full rounded-full" style={{ width, background: `linear-gradient(90deg, ${meta.gradStart}, ${meta.gradEnd})` }} /></div>
                  <div className="mt-2.5 rounded-xl py-2 text-center text-xs font-semibold transition-colors" style={{ background: meta.buttonBg, color: meta.textColor }}>Start session →</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <StudentQuickActions userId={userId} />

      <div className="px-4 pb-4">
        <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold" style={{ color: '#fff' }}>Topic Mastery</h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{topicMastery.length} topics</span>
          </div>
          <div className="space-y-3">
            {topicMastery.length > 0 ? topicMastery.map((topic) => {
              const level = Math.max(0, Math.min(4, topic.mastery_level ?? 0))
              const topicName = topic.topic_name || topic.topic || 'Untitled topic'
              return (
                <div key={`${topic.subject}-${topicName}`} className="rounded-xl border p-3" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#fff' }}>{topicName}</p>
                      <span className="mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>{topic.subject}</span>
                    </div>
                    <span className="text-xs" style={{ color: MASTERY_COLORS[level] }}>{MASTERY_LABELS[level]}</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className="h-3 flex-1 rounded-sm" style={{ background: index < level ? MASTERY_COLORS[level] : 'rgba(255,255,255,0.06)' }} />
                    ))}
                  </div>
                </div>
              )
            }) : <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Mastery data will appear as you practice more topics.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 pt-0 md:grid-cols-2">
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '0.5px solid var(--border)', padding: 18 }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Recent Sessions</div>
            <Link href="/chat/math" className="text-xs no-underline" style={{ color: '#A78BFA' }}>View All</Link>
          </div>
          {conversations.slice(0, 5).length > 0 ? conversations.slice(0, 5).map((conversation, index) => {
            const subject = (conversation.subject as StudentSubject) ?? 'math'
            const meta = SUBJECT_CONFIG[subject] ?? SUBJECT_CONFIG.math
            return (
              <div key={conversation.id} className="flex items-center gap-3 py-2" style={{ borderBottom: index === Math.min(conversations.length, 5) - 1 ? 'none' : '0.5px solid rgba(255,255,255,0.05)' }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] text-sm" style={{ background: meta.bgLight }}>{meta.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium" style={{ color: 'var(--text)' }}>{conversation.title ?? `${meta.label} Session`}</div>
                  <div className="mt-0.5 text-[11px]" style={{ color: 'var(--text-faint)' }}>{formatRelative(conversation.updated_at || conversation.created_at || new Date().toISOString())}</div>
                </div>
                <Link href={`/chat/${subject}?conversation=${conversation.id}`} className="text-xs font-semibold no-underline" style={{ color: '#A78BFA' }}>Resume →</Link>
              </div>
            )
          }) : (
            <div className="flex flex-col items-center py-6 text-center"><div className="mb-2 text-3xl">🎯</div><div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No sessions yet</div><div className="mt-1 text-xs" style={{ color: 'var(--text-faint)' }}>Pick a subject above to start</div></div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div style={{ background: 'rgba(124,58,237,0.1)', borderLeft: '2px solid #7C3AED', borderRadius: '0 14px 14px 0', padding: 16 }}>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: '#C4B5FD' }}>💡 AI Study Tip</div>
            <p className="text-[13px] leading-6" style={{ color: '#A78BFA' }}>{tip}</p>
          </div>

          <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '0.5px solid var(--border)', padding: 16 }}>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.3)' }}>This Week</div>
            <div className="flex gap-1.5">
              {getWeekDays().map(({ label, date }) => {
                const key = date.toISOString().split('T')[0]
                const hasActivity = activeDates.has(key)
                const isToday = date.toDateString() === new Date().toDateString()

                let background = 'rgba(255,255,255,0.04)'
                let color = 'rgba(255,255,255,0.2)'
                let border = 'none'
                let boxShadow = 'none'
                let dot = 'rgba(255,255,255,0.1)'

                if (hasActivity && isToday) {
                  background = 'linear-gradient(135deg,#7C3AED,#2563EB)'
                  color = '#fff'
                  boxShadow = '0 6px 14px rgba(124,58,237,0.25)'
                  dot = '#fff'
                } else if (hasActivity) {
                  background = 'rgba(124,58,237,0.2)'
                  color = '#C4B5FD'
                  dot = '#7C3AED'
                } else if (isToday) {
                  background = 'rgba(124,58,237,0.1)'
                  color = '#A78BFA'
                  border = '1px dashed rgba(167,139,250,0.4)'
                }

                return (
                  <div key={key} className="flex h-9 w-9 flex-col items-center justify-center rounded-[10px] text-center" style={{ background, color, border, boxShadow }}>
                    <span className="text-[9px] font-semibold">{label}</span>
                    <span className="mt-1 inline-block h-1 w-1 rounded-full" style={{ background: dot }} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
