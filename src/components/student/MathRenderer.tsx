'use client'

import katex from 'katex'
import 'katex/dist/katex.min.css'

type MathStep = {
  step_num: number
  explanation: string
  expression: string
}

export function MathRenderer({
  expression,
  showSteps = false,
  steps,
  solution,
}: {
  expression: string
  showSteps?: boolean
  steps?: MathStep[]
  solution?: string
}) {
  const html = katex.renderToString(expression, { throwOnError: false, displayMode: expression.includes('\\\n') || expression.includes('=') })

  return (
    <div className="space-y-3">
      <div
        className="rounded-xl px-4 py-3 text-center"
        style={{ background: 'rgba(124,58,237,0.1)', border: '0.5px solid rgba(124,58,237,0.3)' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {showSteps && steps?.length ? (
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={`${step.step_num}-${step.expression}`} className="flex gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--border)' }}>
              <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold" style={{ background: 'rgba(124,58,237,0.2)', color: '#A78BFA' }}>
                {step.step_num}
              </div>
              <div className="min-w-0">
                <p className="text-sm" style={{ color: 'var(--text)' }}>{step.explanation}</p>
                <p className="mt-1 truncate text-xs font-mono" style={{ color: '#C4B5FD' }}>{step.expression}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {solution ? (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(52,211,153,0.1)', border: '0.5px solid rgba(52,211,153,0.25)', color: '#6EE7B7' }}>
          ✓ Solution: {solution}
        </div>
      ) : null}
    </div>
  )
}
