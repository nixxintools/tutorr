import type { EmailOtpType } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (!token_hash || !type) {
    return NextResponse.redirect(
      `${origin}/login?error=Invalid+confirmation+link`
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  if (error || !data.user) {
    return NextResponse.redirect(
      `${origin}/login?error=Confirmation+link+expired.+Please+sign+up+again.`
    )
  }

  const user = data.user
  const meta = user.user_metadata

  let role: 'student' | 'teacher' | 'parent' = 'student'
  if (meta?.role === 'teacher') role = 'teacher'
  else if (meta?.role === 'parent') role = 'parent'

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        full_name: meta?.full_name ?? user.email?.split('@')[0] ?? 'User',
        role,
        subscription_tier: 'free',
      },
      { onConflict: 'id' }
    )

  if (profileError) {
    console.error('Profile upsert after confirm failed:', profileError.message)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
