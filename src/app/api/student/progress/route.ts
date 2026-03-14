import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [progressRes, masteryRes, activityRes, xpRes] = await Promise.all([
    supabase.from('progress').select('*').eq('user_id', user.id),
    supabase.from('topic_mastery').select('*').eq('user_id', user.id),
    supabase.from('daily_activity').select('*').eq('user_id', user.id).gte('activity_date', weekAgo).order('activity_date'),
    supabase.from('student_xp').select('*').eq('user_id', user.id).single(),
  ])

  return NextResponse.json({
    progress: progressRes.data ?? [],
    topic_mastery: masteryRes.data ?? [],
    daily_activity: activityRes.data ?? [],
    student_xp: xpRes.data ?? null,
  })
}
