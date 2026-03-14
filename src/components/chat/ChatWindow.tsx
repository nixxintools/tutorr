'use client'

import { useCallback, useEffect, useMemo, useRef, useState, KeyboardEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PanelRightClose, PanelRightOpen, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'
import { UpgradeModal } from '@/components/UpgradeModal'
import { ChatHeader } from './ChatHeader'
import { ChatHistory } from '@/components/student/ChatHistory'
import { AdaptiveLearning } from '@/components/student/AdaptiveLearning'
import { WritingCoach } from '@/components/student/WritingCoach'
import type { Subject } from '@/lib/supabase/types'

type Message = {
  role: 'user' | 'assistant'
  content: string
  id: string
  created_at?: string
  mathSteps?: Array<{ step_num: number; explanation: string; expression: string }>
  solution?: string
}
type ProgressRow = { subject?: string | null; session_count?: number | null }

type ChatMode = 'tutor' | 'homework' | 'writing_coach'

interface ChatWindowProps {
  subject: Subject
  conversationId: string
  userId: string
}

const SUBJECT_META: Record<Subject, { icon: string; name: string }> = {
  math: { icon: '📐', name: 'Math' },
  reading: { icon: '📖', name: 'Reading' },
  science: { icon: '🔬', name: 'Science' },
  writing: { icon: '✍️', name: 'Writing' },
}

export function ChatWindow({ subject, conversationId, userId }: ChatWindowProps) {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialConversation = searchParams.get('conversation') ?? conversationId
  const initialMode = (searchParams.get('mode') as ChatMode | null) ?? 'tutor'
  const initialPrefill = searchParams.get('prefill') ?? ''

  const [activeConversationId, setActiveConversationId] = useState(initialConversation)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState(initialPrefill)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [remaining, setRemaining] = useState(10)
  const [featurePanelOpen, setFeaturePanelOpen] = useState(false)
  const [featureTab, setFeatureTab] = useState<'history' | 'progress' | 'adaptive'>('history')
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([])
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [mode, setMode] = useState<ChatMode>(initialMode)
  const bottomRef = useRef<HTMLDivElement>(null)
  const transcriptTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const config = SUBJECT_META[subject]
  const starterPrompts: Record<Subject, string[]> = {
    math: ['Help me solve a fraction problem', 'I am stuck on algebra', 'Explain percentages'],
    reading: ['Help me find the main idea', 'What is a thesis statement?', 'Explain this passage'],
    science: ['How does photosynthesis work?', 'Explain Newton\'s laws', 'What is an ecosystem?'],
    writing: ['Help me write an introduction', 'Check my essay structure', 'Improve my paragraph'],
  }

  const prompts = starterPrompts[subject]

  const loadConversation = useCallback(async (conversationToLoad: string) => {
    const { data } = await supabase
      .from('messages')
      .select('id, role, content, created_at')
      .eq('conversation_id', conversationToLoad)
      .order('created_at', { ascending: true })

    setMessages(((data ?? []) as Array<{ id: string; role: 'user' | 'assistant'; content: string; created_at?: string }>).map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      created_at: message.created_at,
    })))
  }, [supabase])

  useEffect(() => {
    const nextConversation = searchParams.get('conversation')
    const nextMode = searchParams.get('mode')
    const nextPrefill = searchParams.get('prefill')

    if (nextConversation) setActiveConversationId(nextConversation)
    if (nextMode === 'homework' || nextMode === 'writing_coach' || nextMode === 'tutor') setMode(nextMode)
    if (nextPrefill) setInput(nextPrefill)
  }, [searchParams])

  useEffect(() => {
    void loadConversation(activeConversationId)
  }, [activeConversationId, loadConversation])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    const count = messages.filter((message) => message.role === 'user').length
    setRemaining(Math.max(0, 10 - count))
  }, [messages])

  useEffect(() => {
    void (async () => {
      const response = await fetch('/api/student/progress')
      const data = await response.json().catch(() => ({}))
      setProgressRows((data.progress ?? []) as ProgressRow[])
      const { data: path } = await supabase
        .from('learning_paths')
        .select('current_difficulty')
        .eq('user_id', userId)
        .eq('subject', subject)
        .maybeSingle()
      if (path?.current_difficulty === 'easy' || path?.current_difficulty === 'hard' || path?.current_difficulty === 'medium') {
        setCurrentDifficulty(path.current_difficulty)
      }
    })()
  }, [subject, supabase, userId])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({ role: message.role, content: message.content })),
          subject,
          mode,
          conversationId: activeConversationId,
          userId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          setError(
            data.type === 'quota'
              ? 'AI tutor is temporarily unavailable (usage limit reached). Please try again later or ask your admin to add API credits.'
              : (data.error ?? 'Too many requests. Please wait a moment and try again.')
          )
        } else if (response.status === 503) {
          setError('AI tutor is offline right now. Please check back in a few minutes.')
        } else if (response.status === 400 && data.upgrade) {
          setShowUpgrade(true)
        } else {
          setError(data.error ?? 'Something went wrong. Please try again.')
        }
        setIsLoading(false)
        return
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
      }
      const nextAssistantMessages: Message[] = [assistantMessage]

      if (subject === 'math' && /[=^\\dxy()+/*-]/i.test(trimmed)) {
        try {
          const mathResponse = await fetch('/api/student/math', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expression: trimmed, userId, conversationId: activeConversationId }),
          })
          const mathData = await mathResponse.json()
          if (mathResponse.ok && mathData?.latex) {
            nextAssistantMessages.push({
              id: (Date.now() + 2).toString(),
              role: 'assistant',
              content: `$$${mathData.latex}$$`,
              mathSteps: mathData.steps,
              solution: mathData.solution,
            })
          }
        } catch (mathError) {
          console.warn('Math helper failed:', mathError)
        }
      }

      setMessages((prev) => [...prev, ...nextAssistantMessages])
      setIsLoading(false)
    } catch (err) {
      console.error('Chat error:', err)
      setError('Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  const handleTranscript = (text: string) => {
    setInput(text)
    if (transcriptTimeoutRef.current) clearTimeout(transcriptTimeoutRef.current)
    transcriptTimeoutRef.current = setTimeout(() => {
      void sendMessage()
    }, 1500)
  }

  const handleImageAnalysis = (text: string) => {
    setInput(text)
  }

  const handleSelectConversation = async (id: string, selectedSubject: string) => {
    setActiveConversationId(id)
    setFeaturePanelOpen(false)
    if (selectedSubject !== subject) {
      router.push(`/chat/${selectedSubject}?conversation=${id}`)
    }
  }

  const progressMap = useMemo(() => {
    const map = new Map<string, number>()
    progressRows.forEach((row) => {
      if (row.subject) map.set(row.subject, row.session_count ?? 0)
    })
    return map
  }, [progressRows])

  return (
    <div className="flex h-full" style={{ background: 'var(--bg-base)' }}>
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          subject={subject}
          messagesToday={messages.filter((message) => message.role === 'user').length}
          onBack={() => router.push('/dashboard')}
          showCoachMode={subject === 'writing'}
          coachMode={mode === 'writing_coach'}
          onToggleCoachMode={() => setMode((current) => current === 'writing_coach' ? 'tutor' : 'writing_coach')}
        />

        <div className="flex items-center justify-end px-4 py-2 md:px-6" style={{ background: 'var(--bg-surface)', borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}>
          <button type="button" onClick={() => setFeaturePanelOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            {featurePanelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            Features
          </button>
        </div>

        {mode === 'writing_coach' && subject === 'writing' ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <WritingCoach userId={userId} conversationId={activeConversationId} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-4 pb-20 text-center">
                  <span className="mb-5 text-7xl" style={{ animation: 'float 3s ease-in-out infinite' }}>{config.icon}</span>
                  <h3 className="text-2xl font-bold" style={{ color: '#fff' }}>Hi! I am your {config.name} tutor 🎓</h3>
                  <p className="mt-2 max-w-sm text-sm" style={{ color: 'var(--text-muted)' }}>I will guide you step-by-step without giving away the answers. Ask me anything!</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {prompts.map((prompt) => (
                      <button key={prompt} type="button" onClick={() => setInput(prompt)} className="rounded-full border px-4 py-2 text-sm transition-all" style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      timestamp={message.created_at}
                      mathSteps={message.mathSteps}
                      solution={message.solution}
                    />
                  ))}
                  {isLoading ? <TypingIndicator /> : null}
                  {error ? (
                    <div className="flex justify-center">
                      <div className="max-w-sm rounded-2xl border px-4 py-3 text-center text-sm" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: 'rgba(252,165,165,1)' }}>
                        {error}
                        <button type="button" onClick={() => setError(null)} className="mt-1 block text-xs" style={{ color: 'rgba(252,165,165,0.8)' }}>Dismiss</button>
                      </div>
                    </div>
                  ) : null}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            <ChatInput
              input={input}
              onChange={(event) => setInput(event.target.value)}
              onSubmit={() => void sendMessage()}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              remaining={remaining}
              conversationId={activeConversationId}
              userId={userId}
              currentDifficulty={currentDifficulty}
              onTranscript={handleTranscript}
              onImageAnalysis={handleImageAnalysis}
              onToggleFeatures={() => setFeaturePanelOpen((value) => !value)}
            />
          </>
        )}
      </div>

      {featurePanelOpen ? (
        <aside className="hidden h-full w-[280px] shrink-0 border-l md:flex md:flex-col" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 border-b p-3" style={{ borderColor: 'var(--border)' }}>
            {[
              ['history', 'History'],
              ['progress', 'Progress'],
              ['adaptive', 'Adaptive'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFeatureTab(key as 'history' | 'progress' | 'adaptive')}
                className="rounded-full px-3 py-1.5 text-xs font-medium"
                style={featureTab === key ? { background: 'var(--grad)', color: '#fff' } : { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {featureTab === 'history' ? <ChatHistory userId={userId} onSelectConversation={handleSelectConversation} /> : null}
            {featureTab === 'progress' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#fff' }}>
                  <Sparkles className="h-4 w-4 text-violet-300" />
                  Subject Progress
                </div>
                {(Object.keys(SUBJECT_META) as Subject[]).map((entry) => (
                  <div key={entry}>
                    <div className="mb-1 flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>{SUBJECT_META[entry].name}</span>
                      <span>{progressMap.get(entry) ?? 0} sessions</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(((progressMap.get(entry) ?? 0) / 20) * 100, 100)}%`, background: entry === 'math' ? '#A78BFA' : entry === 'reading' ? '#34D399' : entry === 'science' ? '#FCD34D' : '#F9A8D4' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {featureTab === 'adaptive' ? <AdaptiveLearning userId={userId} subject={subject} onTopicSelect={(topic) => setInput(topic)} /> : null}
          </div>
        </aside>
      ) : null}

      {showUpgrade ? <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} /> : null}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
