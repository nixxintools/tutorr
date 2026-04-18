import { createClient as createServerSupabase } from '@/lib/supabase/server'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

type VisionAnalysisResult = {
  extracted_text: string
  detected_subject: string
  description: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function extractTextFromUnknown(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(extractTextFromUnknown).join('\n')
  if (value && typeof value === 'object') {
    if ('text' in value && typeof (value as { text?: unknown }).text === 'string') {
      return (value as { text: string }).text
    }
  }
  return ''
}

function stripCodeFences(input: string) {
  return input.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
}

async function callOpenAI(messages: ChatMessage[], systemPrompt: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 600,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const errMsg = (err as { error?: { message?: string } }).error?.message ?? response.statusText
    throw new Error(`OpenAI: ${errMsg}`)
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
  return data.choices?.[0]?.message?.content?.trim() ?? ''
}

async function callGemini(messages: ChatMessage[], systemPrompt: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }],
        })),
        generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const errMsg = (err as { error?: { message?: string } }).error?.message ?? response.statusText
    throw new Error(`Gemini: ${errMsg}`)
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
}

async function callAnthropic(messages: ChatMessage[], systemPrompt: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 600,
      system: systemPrompt,
      messages,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const errMsg = (err as { error?: { message?: string } }).error?.message ?? response.statusText
    throw new Error(`Anthropic: ${errMsg}`)
  }

  const data = (await response.json()) as { content?: Array<{ type?: string; text?: string }> }
  return data.content?.find((item) => item.type === 'text')?.text?.trim() ?? ''
}

export async function generateAIText(messages: ChatMessage[], systemPrompt: string) {
  const errors: string[] = []
  let reply = ''

  if (!reply && process.env.OPENAI_API_KEY) {
    try {
      reply = await callOpenAI(messages, systemPrompt)
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }

  if (!reply && process.env.GEMINI_API_KEY) {
    try {
      reply = await callGemini(messages, systemPrompt)
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }

  if (!reply && process.env.ANTHROPIC_API_KEY) {
    try {
      reply = await callAnthropic(messages, systemPrompt)
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }

  return { reply, errors }
}

export async function generateAIJson<T>(messages: ChatMessage[], systemPrompt: string): Promise<{ data: T | null; raw: string; errors: string[] }> {
  const { reply, errors } = await generateAIText(messages, systemPrompt)
  if (!reply) return { data: null, raw: '', errors }

  try {
    return {
      data: JSON.parse(stripCodeFences(reply)) as T,
      raw: reply,
      errors,
    }
  } catch (error) {
    return {
      data: null,
      raw: reply,
      errors: [...errors, error instanceof Error ? error.message : String(error)],
    }
  }
}

async function callOpenAIVision(publicUrl: string, prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: publicUrl } },
            { type: 'text', text: prompt },
          ],
        },
      ],
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const errMsg = (err as { error?: { message?: string } }).error?.message ?? response.statusText
    throw new Error(`OpenAI: ${errMsg}`)
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
  return data.choices?.[0]?.message?.content?.trim() ?? ''
}

async function callGeminiVision(publicUrl: string, prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { fileData: { mimeType: 'image/jpeg', fileUri: publicUrl } },
              { text: prompt },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 500, temperature: 0.2 },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const errMsg = (err as { error?: { message?: string } }).error?.message ?? response.statusText
    throw new Error(`Gemini: ${errMsg}`)
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
}

export async function analyzeImageWithAI(publicUrl: string): Promise<{ data: VisionAnalysisResult | null; raw: string; errors: string[] }> {
  const prompt = 'Extract the text from this homework problem or question. Identify the subject. Return JSON: { "extracted_text": string, "detected_subject": string, "description": string }'
  const errors: string[] = []
  let raw = ''

  if (!raw && process.env.OPENAI_API_KEY) {
    try {
      raw = await callOpenAIVision(publicUrl, prompt)
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }

  if (!raw && process.env.GEMINI_API_KEY) {
    try {
      raw = await callGeminiVision(publicUrl, prompt)
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }

  if (!raw) return { data: null, raw: '', errors }

  try {
    return {
      data: JSON.parse(stripCodeFences(raw)) as VisionAnalysisResult,
      raw,
      errors,
    }
  } catch (error) {
    return { data: null, raw, errors: [...errors, error instanceof Error ? error.message : String(error)] }
  }
}

export async function runStudentSideEffects({
  userId,
  conversationId,
  lastUserMessage,
  aiReply,
}: {
  userId?: string
  conversationId?: string
  lastUserMessage?: string
  aiReply?: string
}) {
  try {
    const supabase = await createServerSupabase()
    const tasks: Promise<unknown>[] = []

    if (userId) {
      tasks.push(
        (async () => {
          await supabase.rpc('update_daily_activity', { p_user_id: userId, p_xp: 10 })
        })(),
        (async () => {
          await supabase.rpc('award_xp', { p_user_id: userId, p_event_type: 'message_sent', p_xp: 10 })
        })()
      )
    }

    if (conversationId && lastUserMessage) {
      tasks.push(
        (async () => {
          await supabase.from('messages').insert({ conversation_id: conversationId, role: 'user', content: lastUserMessage })
        })()
      )
    }

    if (conversationId && aiReply) {
      tasks.push(
        (async () => {
          await supabase.from('messages').insert({ conversation_id: conversationId, role: 'assistant', content: aiReply })
        })(),
        (async () => {
          await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId)
        })()
      )
    }

    await Promise.allSettled(tasks)
  } catch {
    // Best effort only.
  }
}

export function coerceSubject(input?: string | null) {
  if (input === 'reading' || input === 'science' || input === 'writing') return input
  return 'math'
}

export function buildQuotaResponse(errors: string[]) {
  const isQuota = errors.some((entry) => {
    const lower = entry.toLowerCase()
    return lower.includes('quota') || lower.includes('billing') || lower.includes('insufficient_quota') || lower.includes('rate limit')
  })

  if (isQuota) {
    return Response.json(
      {
        error: 'AI service is temporarily unavailable due to usage limits. Please try again later.',
        type: 'quota',
      },
      { status: 429 }
    )
  }

  return Response.json(
    {
      error: 'AI service unavailable right now. Please try again in a moment.',
      type: 'error',
      details: errors[0] ?? 'Unknown error',
    },
    { status: 503 }
  )
}
