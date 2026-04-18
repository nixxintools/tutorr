'use client'

import { Camera } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'

export function ImageSolver({
  conversationId,
  userId,
  onAnalysis,
}: {
  conversationId: string
  userId: string
  onAnalysis: (text: string) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [analysis, setAnalysis] = useState<{ extracted_text: string; detected_subject: string; description?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const nextFile = acceptedFiles[0]
    if (!nextFile) return
    setFile(nextFile)
    setPreview(URL.createObjectURL(nextFile))
    setAnalysis(null)
    setError(null)
  }, [])

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    noClick: true,
  })

  const subjectLabel = useMemo(() => {
    if (!analysis?.detected_subject) return null
    return `Looks like ${analysis.detected_subject[0]?.toUpperCase()}${analysis.detected_subject.slice(1)}`
  }, [analysis])

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setAnalysis(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      const path = `${userId}/${conversationId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from('homework-images').upload(path, file, { upsert: false })
      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage.from('homework-images').getPublicUrl(path)
      const response = await fetch('/api/student/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicUrl: publicData.publicUrl, userId, conversationId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Image analysis failed')
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image analysis failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)' }}>
      {!file ? (
        <div
          {...getRootProps()}
          className="cursor-pointer rounded-2xl border border-dashed p-6 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.15)' }}
        >
          <input {...getInputProps()} capture="environment" />
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: 'rgba(124,58,237,0.12)', color: '#C4B5FD' }}>
            <Camera className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold" style={{ color: '#fff' }}>Drop image here or tap to snap</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>Supports handwritten & printed problems</p>
          <button type="button" onClick={open} className="mt-4 rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text)' }}>
            Take Photo / Choose File
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {preview ? <img src={preview} alt="Homework preview" className="max-h-[200px] w-full rounded-xl object-contain" /> : null}
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleAnalyze} disabled={uploading} className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: 'var(--grad)' }}>
              {uploading ? 'Analyzing...' : 'Analyze this question →'}
            </button>
            <button type="button" onClick={removeFile} className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Remove
            </button>
          </div>
        </div>
      )}

      {analysis ? (
        <div className="space-y-3">
          <div className="rounded-xl border p-3 font-mono text-xs" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'var(--border)', color: 'var(--text)' }}>
            Detected: {analysis.extracted_text}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => onAnalysis(analysis.extracted_text)} className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: 'var(--grad)' }}>
              Send to tutor →
            </button>
            {subjectLabel ? <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>{subjectLabel}</span> : null}
          </div>
        </div>
      ) : null}

      {error ? <p className="text-xs" style={{ color: 'rgba(252,165,165,1)' }}>{error}</p> : null}
    </div>
  )
}
