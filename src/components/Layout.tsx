import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  /** Data structure selector (e.g. tabs or dropdown) */
  nav?: ReactNode
}

export default function Layout({ children, nav }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Data Structure & Algorithm Visualizer
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Visualize how data structures and algorithms work step by step.
          </p>
          {nav ? <div className="mt-4">{nav}</div> : null}
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}
