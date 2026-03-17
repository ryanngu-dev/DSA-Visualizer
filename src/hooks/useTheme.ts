import { useEffect, useMemo, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

function getSystemPrefersDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

function applyTheme(mode: ThemeMode) {
  const isDark = mode === 'dark' || (mode === 'system' && getSystemPrefersDark())
  document.documentElement.classList.toggle('dark', isDark)
  // Helps native controls (scrollbars, form controls) match the theme.
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>('system')

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'system'
    const initial: ThemeMode = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system'
    setMode(initial)
    applyTheme(initial)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
    applyTheme(mode)

    if (mode !== 'system') return
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const handler = () => applyTheme('system')
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [mode])

  const label = useMemo(() => {
    if (mode === 'system') return 'System'
    if (mode === 'dark') return 'Dark'
    return 'Light'
  }, [mode])

  return { mode, setMode, label }
}

