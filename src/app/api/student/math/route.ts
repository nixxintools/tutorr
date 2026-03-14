import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildQuotaResponse, generateAIJson } from '@/lib/ai'

type MathStep = { step_num: number; explanation: string; expression: string }
type MathResponse = { latex: string; steps: MathStep[]; solution: string }

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { expression, userId, conversationId } = (await request.json()) as {
      expression?: string
      userId?: string
      conversationId?: string
    }

    if (!expression?.trim()) {
      return NextResponse.json({ error: 'Expression is required' }, { status: 400 })
    }

    const { data, errors, raw } = await generateAIJson<MathResponse>(
      [{ role: 'user', content: expression }],
      'Parse this math expression and return JSON with: { "latex": string, "steps": [{"step_num": number, "explanation": string, "expression": string}], "solution": string }. Return ONLY valid JSON, no other text.'
    )

    if (!data) return buildQuotaResponse(errors)

    void (async () => {
      await supabase.from('math_sessions').insert({
        user_id: userId,
        conversation_id: conversationId,
        expression,
        latex: data.latex,
        steps: data.steps,
        solution: data.solution,
        raw_response: raw,
      })
    })().catch(() => null)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 })
  }
}
