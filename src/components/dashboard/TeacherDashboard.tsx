'use client'

import { RoleBadge } from '@/components/dashboard/RoleBadge'

type DashboardProfile = {
  full_name?: string | null
  role?: 'student' | 'teacher' | 'parent' | null
}

type Conversation = {
  id: string
}

export default function TeacherDashboard({
  profile,
  conversations,
}: {
  profile: DashboardProfile | null
  conversations: Conversation[]
}) {
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Teacher'

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 md:p-8">
      <section
        className="rounded-3xl p-8 text-white"
        style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.35), rgba(13,148,136,0.2))', border: '0.5px solid rgba(5,150,105,0.2)' }}
      >
        <h1 className="text-3xl font-bold">Welcome, {firstName}</h1>
        <div className="mt-3">
          <RoleBadge role="teacher" size="md" />
        </div>
        <p className="mt-3 text-sm text-white/80">
          You have {conversations.length} recent conversation{conversations.length === 1 ? '' : 's'}.
        </p>
      </section>

      <section className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Teacher dashboard placeholder is active with the emerald theme.
        </p>
      </section>
    </div>
  )
}
