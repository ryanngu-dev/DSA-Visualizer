import type { ReactNode } from 'react'

interface VisualizationCanvasProps {
  children: ReactNode
  /** Extra classes (e.g. justify-start) for layouts with toolbars. */
  className?: string
}

/**
 * Wrapper for the data-structure-specific visualization view.
 * Provides consistent container and optional legend area.
 */
export default function VisualizationCanvas({ children, className = '' }: VisualizationCanvasProps) {
  return (
    <div
      className={`flex w-full min-h-[320px] flex-col items-center justify-center self-stretch rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
      aria-label="Visualization canvas"
    >
      {children}
    </div>
  )
}
