import { NextResponse } from 'next/server'

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 })
  }

  const results: Record<string, string> = {}

  if (process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Say: OK' }],
          max_tokens: 5,
        }),
      })
      results.openai = r.ok ? '✅ Working' : `❌ ${r.status} ${r.statusText}`
    } catch (e) {
      results.openai = `❌ ${e instanceof Error ? e.message : String(e)}`
    }
  } else {
    results.openai = '⚠️ OPENAI_API_KEY not set'
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Say: OK' }] }],
            generationConfig: { maxOutputTokens: 5 },
          }),
        }
      )
      results.gemini = r.ok ? '✅ Working' : `❌ ${r.status} ${r.statusText}`
    } catch (e) {
      results.gemini = `❌ ${e instanceof Error ? e.message : String(e)}`
    }
  } else {
    results.gemini = '⚠️ GEMINI_API_KEY not set'
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 5,
          messages: [{ role: 'user', content: 'Say: OK' }],
        }),
      })
      results.anthropic = r.ok ? '✅ Working' : `❌ ${r.status} ${r.statusText}`
    } catch (e) {
      results.anthropic = `❌ ${e instanceof Error ? e.message : String(e)}`
    }
  } else {
    results.anthropic = '⚠️ ANTHROPIC_API_KEY not set'
  }

  return NextResponse.json({
    providers: results,
    recommendation: Object.values(results).some((v) => v.startsWith('✅'))
      ? '✅ At least one provider is working — chat should work'
      : '❌ No providers working — add an API key to .env.local',
  })
}
