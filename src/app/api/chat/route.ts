import { NextRequest, NextResponse } from 'next/server'
import { buildQuotaResponse, coerceSubject, generateAIText, runStudentSideEffects } from '@/lib/ai'

type Mode = 'tutor' | 'homework' | 'writing_coach'

const MODE_PROMPTS: Record<Mode, string> = {
  tutor: `You are a Socratic AI tutor for middle school students.
NEVER give direct answers. Ask guiding questions. Break into steps.
Be warm, encouraging, and patient. Max 150 words per response.
Format math with LaTeX between $$ delimiters.`,
  homework: `You are a homework helper for middle school students.
Help them work through problems step by step. Ask what they've tried first.
Explain concepts clearly. Check their work and point out errors kindly.
Max 200 words per response.`,
  writing_coach: `You are a writing coach for middle school students.
Give structured feedback on: thesis, evidence, transitions, grammar, clarity.
Always end with 2-3 specific actionable suggestions.
Be encouraging. Max 250 words.`,
}

const SUBJECT_CONTEXT: Record<string, string> = {
  math: 'Subject focus: math. Use equations when helpful.',
  reading: 'Subject focus: reading. Emphasize inference, comprehension, and evidence from the text.',
  science: 'Subject focus: science. Use age-appropriate real-world examples.',
  writing: 'Subject focus: writing. Help students improve their own draft rather than rewriting it for them.',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, subject, mode = 'tutor', userId, conversationId } = body as {
      messages: Array<{ role: string; content: string }>
      subject?: string
      mode?: Mode
      userId?: string
      conversationId?: string
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    const normalizedMode: Mode = mode === 'homework' || mode === 'writing_coach' ? mode : 'tutor'
    const normalizedSubject = coerceSubject(subject)
    const cleanMessages = messages
      .filter((message) => message.role && message.content?.trim())
      .map((message) => ({ role: (message.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant', content: message.content.trim() }))

    if (cleanMessages.length === 0) {
      return NextResponse.json({ error: 'No valid messages provided' }, { status: 400 })
    }

    const systemPrompt = `${MODE_PROMPTS[normalizedMode]}\n\n${SUBJECT_CONTEXT[normalizedSubject] ?? SUBJECT_CONTEXT.math}`
    const lastUserMessage = [...cleanMessages].reverse().find((message) => message.role === 'user')?.content ?? ''

    const { reply, errors } = await generateAIText(cleanMessages, systemPrompt)
    if (!reply) {
      return buildQuotaResponse(errors)
    }

    void runStudentSideEffects({
      userId,
      conversationId,
      lastUserMessage,
      aiReply: reply,
    })

    return NextResponse.json({ role: 'assistant', content: reply })
  } catch (error) {
    console.error('Chat route error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
