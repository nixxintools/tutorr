'use client'

import { RoleBadge } from '@/components/dashboard/RoleBadge'

type DashboardProfile = {
  full_name?: string | null
  role?: 'student' | 'teacher' | 'parent' | null
}

export default function ParentDashboard({
  profile,
}: {
  profile: DashboardProfile | null
}) {
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Parent'

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 md:p-8">
      <section
        className="rounded-3xl p-8 text-white"
        style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.3), rgba(245,158,11,0.18))', border: '0.5px solid rgba(217,119,6,0.2)' }}
      >
        <h1 className="text-3xl font-bold">Welcome, {firstName}</h1>
        <div className="mt-3">
          <RoleBadge role="parent" size="md" />
        </div>
        <p className="mt-3 text-sm text-white/80">
          Parent dashboard placeholder is ready.
        </p>
      </section>

      <section className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Parent view is using the amber theme and role-aware routing.
        </p>
      </section>
    </div>
  )
}
