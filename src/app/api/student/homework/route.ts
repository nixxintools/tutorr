import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('homework')
    .select('*')
    .eq('user_id', user.id)
    .order('due_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ homework: data ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, subject, due_date, description } = body as Record<string, string>
  if (!title || !subject || !due_date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const payload = {
    user_id: user.id,
    title,
    subject,
    due_date,
    description: description ?? '',
    status: 'not_started',
  }

  const { data, error } = await supabase.from('homework').insert(payload).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ homework: data })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, ...updates } = body as Record<string, unknown> & { id?: string }
  if (!id) return NextResponse.json({ error: 'Missing assignment id' }, { status: 400 })

  const { data, error } = await supabase
    .from('homework')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ homework: data })
}
