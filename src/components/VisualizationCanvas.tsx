import type { ReactNode } from 'react'

interface VisualizationCanvasProps {
  children: ReactNode
}

/**
 * Wrapper for the data-structure-specific visualization view.
 * Provides consistent container and optional legend area.
 */
export default function VisualizationCanvas({ children }: VisualizationCanvasProps) {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 min-h-[320px] flex flex-col items-center justify-center"
      aria-label="Visualization canvas"
    >
      {children}
    </div>
  )
}
