import { useEffect, useRef, useState } from 'react'
import { useTheme, type ThemeMode } from '../hooks/useTheme'

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden>
      <path
        d="M21 13.2A8.5 8.5 0 0 1 10.8 3a7.2 7.2 0 1 0 10.2 10.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ThemeMenu() {
  const { mode, setMode, label } = useTheme()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = rootRef.current
      if (!el) return
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const Item = ({ value }: { value: ThemeMode }) => (
    <button
      type="button"
      onClick={() => {
        setMode(value)
        setOpen(false)
      }}
      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium
        ${mode === value ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60'}`}
      role="menuitemradio"
      aria-checked={mode === value}
    >
      {value === 'light' ? 'Light' : value === 'dark' ? 'Dark' : 'System'}
    </button>
  )

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50
                   dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Theme"
      >
        <IconMoon />
        <span className="hidden sm:inline">{label}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg p-1
                     dark:border-slate-700 dark:bg-slate-900"
          role="menu"
        >
          <Item value="light" />
          <Item value="dark" />
          <Item value="system" />
        </div>
      )}
    </div>
  )
}

