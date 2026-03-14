import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildQuotaResponse, generateAIJson } from '@/lib/ai'

type LearningPathResponse = {
  current_difficulty: 'easy' | 'medium' | 'hard'
  next_session_focus: string
  recommended_topics: string[]
  weak_areas: string[]
  strong_areas: string[]
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { userId, subject } = (await request.json()) as { userId?: string; subject?: string }
    if (!userId || !subject) return NextResponse.json({ error: 'Missing userId or subject' }, { status: 400 })

    const { data: mastery } = await supabase
      .from('topic_mastery')
      .select('*')
      .eq('user_id', userId)
      .eq('subject', subject)

    const { data, errors } = await generateAIJson<LearningPathResponse>(
      [{ role: 'user', content: JSON.stringify({ subject, topic_mastery: mastery ?? [] }) }],
      'You are an adaptive learning planner. Analyze the topic mastery input and return ONLY valid JSON with: { "current_difficulty": "easy"|"medium"|"hard", "next_session_focus": string, "recommended_topics": string[], "weak_areas": string[], "strong_areas": string[] }.'
    )

    if (!data) return buildQuotaResponse(errors)

    const payload = {
      user_id: userId,
      subject,
      current_difficulty: data.current_difficulty,
      next_session_focus: data.next_session_focus,
      recommended_topics: data.recommended_topics,
      weak_areas: data.weak_areas,
      strong_areas: data.strong_areas,
      updated_at: new Date().toISOString(),
    }

    const { data: saved } = await supabase
      .from('learning_paths')
      .upsert(payload, { onConflict: 'user_id,subject' })
      .select('*')
      .single()

    return NextResponse.json({ learning_path: saved ?? payload })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 })
  }
}
