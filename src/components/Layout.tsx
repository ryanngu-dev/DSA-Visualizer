import type { ReactNode } from 'react'
import ThemeMenu from './ThemeMenu'
import GitHubLink from './GitHubLink'

interface LayoutProps {
  children: ReactNode
  /** Data structure selector (e.g. tabs or dropdown) */
  nav?: ReactNode
}

export default function Layout({ children, nav }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col dark:bg-slate-950 dark:text-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight dark:text-slate-50">
                Data Structure & Algorithm Visualizer
              </h1>
              <p className="text-sm text-slate-500 mt-0.5 dark:text-slate-400">
                Visualize how data structures and algorithms work step by step.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeMenu />
              <GitHubLink href="https://github.com/ryanngu-dev/DSA-Visualizer" />
            </div>
          </div>
          {nav ? <div className="mt-4">{nav}</div> : null}
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}
