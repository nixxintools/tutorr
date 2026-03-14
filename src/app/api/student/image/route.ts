import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeImageWithAI, buildQuotaResponse } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { publicUrl, userId, conversationId } = (await request.json()) as {
      publicUrl?: string
      userId?: string
      conversationId?: string
    }

    if (!publicUrl) {
      return NextResponse.json({ error: 'publicUrl is required' }, { status: 400 })
    }

    const { data, errors, raw } = await analyzeImageWithAI(publicUrl)
    if (!data) return buildQuotaResponse(errors)

    void (async () => {
      await supabase.from('image_uploads').insert({
        user_id: userId,
        conversation_id: conversationId,
        image_url: publicUrl,
        extracted_text: data.extracted_text,
        detected_subject: data.detected_subject,
        description: data.description,
        raw_response: raw,
      })
    })().catch(() => null)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 })
  }
}
