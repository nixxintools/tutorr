import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildQuotaResponse, generateAIJson } from '@/lib/ai'

type WritingFeedback = {
  structure: number
  clarity: number
  argument: number
  grammar: number
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  summary: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { text, title, userId, conversationId } = (await request.json()) as {
      text?: string
      title?: string
      userId?: string
      conversationId?: string
    }

    const wordCount = (text ?? '').trim().split(/\s+/).filter(Boolean).length
    if (wordCount < 50) {
      return NextResponse.json({ error: 'Writing sample must be at least 50 words' }, { status: 400 })
    }

    const systemPrompt = `You are a writing coach for middle school students.
Give structured feedback as valid JSON only.
Return: {"structure": number, "clarity": number, "argument": number, "grammar": number, "strengths": string[], "improvements": string[], "suggestions": string[], "summary": string}
Scores must be integers from 0 to 10.
Always include 2-3 specific actionable suggestions.`

    const { data, errors, raw } = await generateAIJson<WritingFeedback>(
      [{ role: 'user', content: `Title: ${title ?? 'Untitled'}\n\n${text}` }],
      systemPrompt
    )

    if (!data) return buildQuotaResponse(errors)

    void (async () => {
      await supabase.from('writing_submissions').insert({
        user_id: userId,
        conversation_id: conversationId,
        title: title ?? 'Untitled',
        text,
        feedback: data,
        raw_response: raw,
      })
    })().catch(() => null)

    return NextResponse.json({ feedback: data })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 })
  }
}
