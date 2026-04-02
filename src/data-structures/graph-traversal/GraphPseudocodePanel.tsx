import { getGraphPseudocodeState } from './pseudocode'
import type { GraphTraversalStep } from './types'
import type { GraphOperation } from './types'

interface GraphPseudocodePanelProps {
  operation: GraphOperation | null
  currentStep: GraphTraversalStep | null
  stepIndex: number
  steps: GraphTraversalStep[]
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
  onReset: () => void
}

export default function GraphPseudocodePanel({
  operation,
  currentStep,
  stepIndex,
  steps,
  onPrev,
  onNext,
  canPrev,
  canNext,
  onReset,
}: GraphPseudocodePanelProps) {
  const { lines, activeLineIndices, executedLineIndices, description } = getGraphPseudocodeState(
    operation,
    currentStep,
    stepIndex,
    steps
  )
  const title =
    operation?.type === 'traverse'
      ? operation.traversal === 'bfs'
        ? 'Breadth-first search'
        : 'Depth-first search'
      : 'Pseudocode'

  if (lines.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4 dark:border-slate-800 dark:bg-slate-950/40">
        <h3 className="text-sm font-semibold text-slate-700 mb-2 dark:text-slate-100">Pseudocode</h3>
        <p className="text-slate-500 text-sm dark:text-slate-400">
          Choose BFS or DFS, pick a start node, and run a traversal to see pseudocode here.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4 flex flex-col gap-3 dark:border-slate-800 dark:bg-slate-950/40">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-100">{title}</h3>
      {description && (
        <p
          className="text-sm text-slate-700 bg-rose-50/80 border border-rose-200/80 rounded-lg px-3 py-2 dark:text-slate-100 dark:bg-rose-950/30 dark:border-rose-900/50"
          role="status"
          aria-live="polite"
        >
          {description}
        </p>
      )}
      <pre className="text-xs font-mono text-slate-800 bg-white rounded-lg border border-slate-200 p-3 overflow-x-auto overflow-y-auto flex-1 max-h-64 dark:text-slate-100 dark:bg-slate-950 dark:border-slate-800">
        {lines.map((line, i) => {
          const isExecuted = executedLineIndices.includes(i) && !activeLineIndices.includes(i)
          const isCurrent = activeLineIndices.includes(i)
          return (
            <div
              key={i}
              className={`
                py-0.5 px-2 -mx-2 rounded
                ${isCurrent ? 'bg-indigo-600/90 text-white ring-1 ring-indigo-300' : ''}
                ${isExecuted ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100' : ''}
                ${!isCurrent && !isExecuted ? 'text-slate-700 dark:text-slate-300' : ''}
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
          className="p-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          aria-label="Previous step"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="p-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          aria-label="Next step"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Step {stepIndex + 1} of {steps.length}
        </span>
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
