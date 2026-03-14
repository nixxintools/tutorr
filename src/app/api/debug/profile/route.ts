import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 })
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    auth: {
      id: user.id,
      email: user.email,
      confirmed_at: user.confirmed_at,
      metadata: user.user_metadata,
    },
    profile: profile ?? null,
    profile_error: profileError?.message ?? null,
    checks: {
      profile_exists: profile !== null ? '✅' : '❌ MISSING',
      role_set: profile?.role ? `✅ ${profile.role}` : '❌ role is null',
      name_set: profile?.full_name ? `✅ ${profile.full_name}` : '❌ full_name null',
      tier_set: profile?.subscription_tier ? `✅ ${profile.subscription_tier}` : '❌ tier null',
    },
  })
}
