'use client'

import { Camera, Grid2x2, Send } from 'lucide-react'
import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { VoiceInput } from '@/components/student/VoiceInput'
import { ImageSolver } from '@/components/student/ImageSolver'

type ChatInputProps = {
  input: string
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: () => void
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  disabled: boolean
  remaining: number
  conversationId: string
  userId: string
  currentDifficulty?: 'easy' | 'medium' | 'hard'
  onTranscript: (text: string) => void
  onImageAnalysis: (text: string) => void
  onToggleFeatures?: () => void
}

export function ChatInput({
  input,
  onChange,
  onSubmit,
  onKeyDown,
  disabled,
  remaining,
  conversationId,
  userId,
  currentDifficulty = 'medium',
  onTranscript,
  onImageAnalysis,
  onToggleFeatures,
}: ChatInputProps) {
  const [showImageSolver, setShowImageSolver] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const node = textareaRef.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${Math.min(node.scrollHeight, 120)}px`
  }, [input])

  const difficultyLabel = useMemo(() => currentDifficulty[0].toUpperCase() + currentDifficulty.slice(1), [currentDifficulty])

  return (
    <div className="px-4 py-4 md:px-6" style={{ background: 'var(--bg-surface)', borderTop: '0.5px solid var(--border)' }}>
      <div className="mx-auto flex max-w-4xl flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button type="button" onClick={() => setShowImageSolver((value) => !value)} className="inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
              <Camera className="h-4 w-4" />
              Image Solver
            </button>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium" style={{ background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)', color: '#C4B5FD' }}>
              {difficultyLabel}
            </span>
          </div>
          {onToggleFeatures ? (
            <button type="button" onClick={onToggleFeatures} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
              <Grid2x2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {showImageSolver ? (
          <ImageSolver conversationId={conversationId} userId={userId} onAnalysis={(text) => { onImageAnalysis(text); setShowImageSolver(false) }} />
        ) : null}

        <div className="flex items-end gap-3">
          <div className="flex-1 rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={onChange}
              onKeyDown={onKeyDown}
              placeholder="Ask your tutor anything..."
              className="min-h-[44px] max-h-[120px] w-full resize-none bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
            />
          </div>
          <VoiceInput onTranscript={onTranscript} disabled={disabled} />
          <button
            type="button"
            onClick={() => setShowImageSolver((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border"
            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}
          >
            <Camera className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled || !input.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-white transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: 'var(--grad)' }}
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <p style={{ color: 'rgba(255,255,255,0.2)' }}>Shift+Enter for new line</p>
          {remaining < 5 ? <p style={{ color: '#FDE68A' }}>{remaining} messages left today</p> : null}
        </div>
      </div>
    </div>
  )
}
