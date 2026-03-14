'use client'

import { Mic, MicOff } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((event: { error?: string }) => void) | null
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
}

export function VoiceInput({ onTranscript, disabled = false }: { onTranscript: (text: string) => void; disabled?: boolean }) {
  const [supported, setSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    setSupported(Boolean(SpeechRecognitionCtor))
  }, [])

  const bars = useMemo(() => [0, 1, 2, 3, 4], [])

  const startListening = () => {
    if (disabled) return
    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!SpeechRecognitionCtor) {
      setError('Voice not available in this browser')
      return
    }

    finalTranscriptRef.current = ''
    setTranscript('')
    setError(null)
    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let interim = ''
      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index]
        const value = result[0]?.transcript ?? ''
        if (result.isFinal) {
          finalTranscriptRef.current += `${value} `
        } else {
          interim += value
        }
      }
      setTranscript((finalTranscriptRef.current + interim).trim())
    }

    recognition.onerror = (event) => {
      setError(event.error ?? 'Voice input failed')
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      const finalText = finalTranscriptRef.current.trim() || transcript.trim()
      if (finalText) onTranscript(finalText)
    }

    recognitionRef.current = recognition
    setIsListening(true)
    recognition.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
  }

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        aria-label="Voice not available in this browser"
        className="flex h-11 w-11 items-center justify-center rounded-2xl border"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)', color: 'var(--text-faint)' }}
      >
        <MicOff className="h-4 w-4" />
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-200"
        style={{
          background: error
            ? 'rgba(239,68,68,0.12)'
            : isListening
              ? 'rgba(124,58,237,0.2)'
              : 'rgba(255,255,255,0.06)',
          borderColor: error
            ? 'rgba(239,68,68,0.3)'
            : isListening
              ? 'rgba(124,58,237,0.5)'
              : 'var(--border)',
          color: error ? 'rgba(252,165,165,1)' : isListening ? '#C4B5FD' : 'var(--text-muted)',
        }}
      >
        {isListening ? <span className="flex items-end gap-0.5">{bars.map((bar) => <span key={bar} className="voice-bar" style={{ animationDelay: `${bar * 0.12}s` }} />)}</span> : <Mic className="h-4 w-4" />}
      </button>

      {isListening ? (
        <div className="absolute bottom-14 right-0 w-64 rounded-xl border px-3 py-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#fff' }}>
            <span className="flex items-end gap-0.5">{bars.map((bar) => <span key={`popup-${bar}`} className="voice-bar" style={{ animationDelay: `${bar * 0.12}s` }} />)}</span>
            Listening...
          </div>
          <p className="mt-2 min-h-6 text-xs" style={{ color: 'var(--text-muted)' }}>{transcript || 'Say something...'}</p>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--text-faint)' }}>Tap to stop</p>
        </div>
      ) : null}

      <style>{`
        .voice-bar {
          width: 3px;
          height: 10px;
          border-radius: 999px;
          background: #C4B5FD;
          animation: voicePulse 0.8s ease-in-out infinite;
        }
        @keyframes voicePulse {
          0%, 100% { transform: scaleY(0.45); opacity: 0.45; }
          50% { transform: scaleY(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
