/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const meta = user.user_metadata
    const role = ['student', 'teacher', 'parent'].includes(meta?.role)
      ? meta.role
      : 'student'

    const { error } = await supabase
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

    if (error) {
      console.error('Profile ensure error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, role })
  } catch (err) {
    console.error('Profile ensure catch:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
