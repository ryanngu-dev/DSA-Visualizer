import type { ReactNode } from 'react'

interface VisualizationCanvasProps {
  children: ReactNode
  /** Extra classes (e.g. justify-start) for layouts with toolbars. */
  className?: string
  stepControls?: {
    onPrev: () => void
    onNext: () => void
    canPrev: boolean
    canNext: boolean
  }
}

/**
 * Wrapper for the data-structure-specific visualization view.
 * Provides consistent container and optional legend area.
 */
export default function VisualizationCanvas({
  children,
  className = '',
  stepControls,
}: VisualizationCanvasProps) {
  return (
    <div
      className={`relative flex w-full min-h-[320px] flex-col items-center justify-center self-stretch rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
      aria-label="Visualization canvas"
    >
      {children}
      {stepControls && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/85 px-2 py-1.5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/85">
          <button
            type="button"
            onClick={stepControls.onPrev}
            disabled={!stepControls.canPrev}
            className="p-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            aria-label="Previous step"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={stepControls.onNext}
            disabled={!stepControls.canNext}
            className="p-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            aria-label="Next step"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
