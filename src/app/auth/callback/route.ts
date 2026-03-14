import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const ROLE_REDIRECT: Record<string, string> = {
  student: '/dashboard',
  teacher: '/dashboard',
  parent: '/dashboard',
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        // New Google user -- create profile, send to onboarding to pick role
        const meta = data.user.user_metadata
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: meta?.full_name ?? meta?.name ?? data.user.email?.split('@')[0] ?? 'User',
          subscription_tier: 'free',
        })
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      if (!profile.role) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      const redirectPath = ROLE_REDIRECT[profile.role] ?? '/dashboard'
      return NextResponse.redirect(`${origin}${redirectPath}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could+not+authenticate`)
}
