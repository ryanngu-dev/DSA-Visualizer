import { AnimatePresence, motion } from 'framer-motion'
import type { StackSnapshot } from './types'
import type { StackStep } from './types'

interface StackViewProps {
  stackSnapshot: StackSnapshot
  currentStep: StackStep | null
  message: string | null
}

function roleFor(step: StackStep | null, index: number, topIndex: number): 'normal' | 'top' {
  if (!step) return 'normal'
  if (index !== topIndex) return 'normal'
  if (step.type === 'highlightTop' || step.type === 'pop' || step.type === 'push') return 'top'
  return 'normal'
}

export default function StackView({ stackSnapshot, currentStep, message }: StackViewProps) {
  const items = stackSnapshot.items
  const topIndex = items.length - 1
  const rendered = [...items]

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
        The item at the top is removed first. New items are added to the top.
      </p>

      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-sm font-medium text-slate-700 bg-slate-100 px-4 py-2 rounded-lg dark:bg-slate-800 dark:text-slate-100"
            role="status"
            aria-live="polite"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="w-full flex justify-center">
        <div
          className="flex w-full max-w-[320px] min-h-[320px] flex-col rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-3 shadow-sm dark:border-slate-700 dark:from-slate-900/80 dark:to-slate-950"
          aria-label="Stack state"
        >
          <div className="mb-2 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Stack
          </div>
          <div className="mb-1 shrink-0 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500">
            Top (pop here)
          </div>
          <div className="flex min-h-0 flex-1 flex-col-reverse gap-2 overflow-y-auto rounded-lg border border-dashed border-slate-200 bg-white/80 px-2 py-3 dark:border-slate-700 dark:bg-slate-900/50">
            {rendered.length === 0 && <span className="py-4 text-center text-sm text-slate-400 italic">empty</span>}
            <AnimatePresence mode="popLayout">
              {rendered.map((entry) => {
                const idx = items.findIndex((e) => e.id === entry.id)
                const role = roleFor(currentStep, idx, topIndex)
                const cls =
                  role === 'top'
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className={`w-full shrink-0 rounded-lg border px-3 py-2.5 text-center font-mono text-sm font-semibold shadow-sm ${cls}`}
                  >
                    {entry.value}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
          <div className="mt-1 shrink-0 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500">Bottom</div>
        </div>
      </div>
    </div>
  )
}
