import { AnimatePresence, motion } from 'framer-motion'
import type { HashMapSnapshot, HashMapStep } from './types'

interface HashMapViewProps {
  hashMapSnapshot: HashMapSnapshot
  currentStep: HashMapStep | null
  message: string | null
}

function activeBucket(step: HashMapStep | null): number | null {
  if (!step) return null
  if ('bucket' in step) return step.bucket
  return null
}

export default function HashMapView({ hashMapSnapshot, currentStep, message }: HashMapViewProps) {
  const highlightedBucket = activeBucket(currentStep)
  const probingValue = currentStep?.type === 'probe' ? currentStep.candidate : null
  const foundValue = currentStep?.type === 'found' ? currentStep.key : null

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
        Bucket index = value mod {hashMapSnapshot.bucketCount}
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
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="w-full max-w-3xl space-y-2">
        {hashMapSnapshot.buckets.map((bucket) => {
          const isActive = highlightedBucket === bucket.index
          return (
            <div
              key={bucket.index}
              className={`rounded-lg border p-3 transition-colors ${
                isActive
                  ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/40'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-16 shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  [{bucket.index}]
                </span>
                {bucket.entries.length === 0 ? (
                  <span className="text-sm text-slate-500 dark:text-slate-400">empty</span>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    {bucket.entries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                        className={`rounded-md border px-2.5 py-1 text-sm font-mono transition-colors ${
                          foundValue === entry.key
                            ? 'border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400'
                            : probingValue === entry.key
                              ? 'border-indigo-500 bg-indigo-500 text-white dark:border-indigo-400'
                              : 'border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {entry.key}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
