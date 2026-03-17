import { useRef, useEffect } from 'react'
import { getPseudocodeState } from './pseudocode'
import type { LinkedListStep } from './types'
import type { LinkedListOperation } from '../../hooks/useVisualization'

interface PseudocodePanelProps {
  operation: LinkedListOperation | null
  currentStep: LinkedListStep | null
  stepIndex: number
  steps: LinkedListStep[]
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
  onRun?: () => void
  onReset: () => void
}

export default function PseudocodePanel({
  operation,
  currentStep,
  stepIndex,
  steps,
  onPrev,
  onNext,
  canPrev,
  canNext,
  onRun,
  onReset,
}: PseudocodePanelProps) {
  const { lines, activeLineIndices, executedLineIndices, description } = getPseudocodeState(
    operation,
    currentStep,
    stepIndex,
    steps
  )
  const activeLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [stepIndex, activeLineIndices])

  if (lines.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Pseudocode</h3>
        <p className="text-slate-500 text-sm">Select an operation and run to see the pseudocode step by step.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-slate-700">
        {operation?.type === 'create' ? 'Create(A)' : operation?.type === 'search' ? 'Search' : operation?.type === 'insert' ? 'Insert' : operation?.type === 'remove' ? 'Remove' : 'Pseudocode'}
      </h3>
      {description && (
        <p
          className="text-sm text-slate-700 bg-rose-50/80 border border-rose-200/80 rounded-lg px-3 py-2"
          role="status"
          aria-live="polite"
        >
          {description}
        </p>
      )}
      <pre className="text-xs font-mono text-slate-800 bg-white rounded-lg border border-slate-200 p-3 overflow-x-auto overflow-y-auto flex-1 max-h-64">
        {lines.map((line, i) => {
          const isExecuted = executedLineIndices.includes(i) && !activeLineIndices.includes(i)
          const isCurrent = activeLineIndices.includes(i)
          return (
            <div
              key={i}
              ref={isCurrent ? activeLineRef : undefined}
              className={`
                py-0.5 px-2 -mx-2 rounded
                ${isCurrent ? 'bg-indigo-600/90 text-white ring-1 ring-indigo-300' : ''}
                ${isExecuted ? 'bg-emerald-100 text-emerald-900' : ''}
                ${!isCurrent && !isExecuted ? 'text-slate-700' : ''}
              `}
            >
              {line}
            </div>
          )
        })}
      </pre>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="p-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous step"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="p-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next step"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
        <span className="text-xs text-slate-500">
          Step {stepIndex + 1} of {steps.length}
        </span>
        {onRun && (
          <button
            type="button"
            onClick={onRun}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Run
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
