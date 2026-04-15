import { AnimatePresence, motion } from 'framer-motion'
import type { QueueSnapshot, QueueStep } from './types'

interface QueueViewProps {
  queueSnapshot: QueueSnapshot
  currentStep: QueueStep | null
  message: string | null
}

function roleFor(step: QueueStep | null, index: number): 'normal' | 'front' {
  if (!step) return 'normal'
  if (index !== 0) return 'normal'
  if (step.type === 'highlightFront' || step.type === 'dequeue') return 'front'
  return 'normal'
}

export default function QueueView({ queueSnapshot, currentStep, message }: QueueViewProps) {
  const items = queueSnapshot.items
  const cardMinWidth = 78
  const cardGap = 8
  const laneHorizontalPadding = 32
  const contentWidth =
    items.length > 0 ? items.length * cardMinWidth + Math.max(0, items.length - 1) * cardGap : 90
  const laneWidth = Math.max(160, contentWidth + laneHorizontalPadding)

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
        The first item leaves from the left, and new items join on the right.
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

      <div className="max-w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="inline-flex flex-col gap-2 mx-auto" style={{ width: `${laneWidth}px` }}>
          <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span>Front (dequeue)</span>
            <span>Rear (enqueue)</span>
          </div>
          <div
            className="rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-3 shadow-sm dark:border-slate-700 dark:from-slate-900/80 dark:to-slate-950"
            aria-label="Queue state"
            style={{ width: `${laneWidth}px` }}
          >
            {items.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-6 px-5 dark:text-slate-400">empty</p>
            ) : (
              <div className="flex items-center gap-2">
                <AnimatePresence mode="popLayout">
                  {items.map((entry, idx) => {
                    const role = roleFor(currentStep, idx)
                    const cls =
                      role === 'front'
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
                    return (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, scale: 0.92, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -10 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        className={`min-w-[78px] rounded-lg border px-3 py-2.5 text-center font-mono text-sm font-semibold shadow-sm ${cls}`}
                      >
                        {entry.value}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
