import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ParentDashboard from '@/components/dashboard/ParentDashboard'
import StudentDashboard from '@/components/dashboard/StudentDashboard'
import TeacherDashboard from '@/components/dashboard/TeacherDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [profileResult, conversationsResult, progressResult, weekMsgsResult, topicMasteryResult, xpResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('conversations')
      .select('id, user_id, subject, title, created_at, updated_at, mode, summary')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(10),
    supabase.from('progress').select('*').eq('user_id', user.id),
    supabase
      .from('messages')
      .select('created_at, role, conversations!inner(user_id)')
      .eq('role', 'user')
      .eq('conversations.user_id', user.id)
      .gte('created_at', weekAgo),
    supabase.from('topic_mastery').select('*').eq('user_id', user.id),
    supabase.from('student_xp').select('*').eq('user_id', user.id).single(),
  ])

  const profileData = profileResult.data
  const conversations = conversationsResult.data ?? []
  const progressData = progressResult.data ?? []
  const weekMsgs = weekMsgsResult.data ?? []
  const topicMastery = topicMasteryResult.data ?? []
  const xpData = xpResult.data ?? null
  const role = profileData?.role ?? 'student'

  if (role === 'teacher') {
    return <TeacherDashboard profile={profileData} conversations={conversations} />
  }

  if (role === 'parent') {
    return <ParentDashboard profile={profileData} />
  }

  return (
    <StudentDashboard
      userId={user.id}
      profile={profileData}
      conversations={conversations}
      progress={progressData}
      weekMsgs={weekMsgs}
      topicMastery={topicMastery}
      studentXp={xpData}
    />
  )
}
