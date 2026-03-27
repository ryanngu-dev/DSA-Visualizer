import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import type { BSTSnapshotNode } from './types'
import type { BSTStep } from './types'
import { findNodeIdByValue, layoutTree } from './layoutTree'

interface BSTViewProps {
  treeSnapshot: BSTSnapshotNode | null
  currentStep: BSTStep | null
  message: string | null
}

function roleFromStep(
  step: BSTStep | null,
  id: string,
  value: number,
  snapshot: BSTSnapshotNode | null
): 'normal' | 'current' | 'found' | 'removing' | 'visit' {
  if (!step) return 'normal'
  if (step.type === 'found' && step.nodeId === id) return 'found'
  if (step.type === 'visit' && step.nodeId === id) return 'visit'
  if (step.type === 'highlight' && step.nodeId === id) return 'current'
  if (step.type === 'remove') {
    const rid = findNodeIdByValue(snapshot, step.value)
    if (rid === id) return 'removing'
  }
  return 'normal'
}

const roleClasses: Record<
  'normal' | 'current' | 'found' | 'removing' | 'visit',
  string
> = {
  normal:
    'fill-white stroke-slate-300 text-slate-800 dark:fill-slate-900 dark:stroke-slate-600 dark:text-slate-100',
  current:
    'fill-indigo-500 stroke-indigo-600 text-white dark:fill-indigo-500 dark:stroke-indigo-400 dark:text-white',
  found:
    'fill-emerald-500 stroke-emerald-600 text-white dark:fill-emerald-500 dark:stroke-emerald-400 dark:text-white',
  removing:
    'fill-red-500 stroke-red-600 text-white dark:fill-red-500 dark:stroke-red-400 dark:text-white',
  visit:
    'fill-violet-500 stroke-violet-600 text-white dark:fill-violet-500 dark:stroke-violet-400 dark:text-white',
}

export default function BSTView({ treeSnapshot, currentStep, message }: BSTViewProps) {
  const { nodes, edges, width, height } = useMemo(() => layoutTree(treeSnapshot), [treeSnapshot])

  const posById = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>()
    for (const n of nodes) m.set(n.id, { x: n.x, y: n.y })
    return m
  }, [nodes])

  return (
    <div className="w-full flex flex-col items-center gap-6">
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

      {nodes.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Empty tree — create or insert nodes to begin.</p>
      ) : (
        <motion.svg
          key={treeSnapshot ? JSON.stringify(treeSnapshot) : 'empty'}
          layout
          width={width}
          height={height}
          className="max-w-full h-auto text-slate-400 dark:text-slate-500"
          aria-label="Binary search tree"
        >
          {edges.map((e) => {
            const a = posById.get(e.from)
            const b = posById.get(e.to)
            if (!a || !b) return null
            return (
              <line
                key={`${e.from}-${e.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            )
          })}
          {nodes.map((n) => {
            const role = roleFromStep(currentStep, n.id, n.value, treeSnapshot)
            const cls = roleClasses[role]
            return (
              <g key={n.id}>
                <motion.circle
                  layout
                  cx={n.x}
                  cy={n.y}
                  r={26}
                  className={`transition-colors ${cls}`}
                  strokeWidth={2}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-sm font-semibold pointer-events-none select-none ${
                    role === 'normal' ? 'fill-slate-800 dark:fill-slate-100' : 'fill-white'
                  }`}
                >
                  {String(n.value)}
                </text>
              </g>
            )
          })}
        </motion.svg>
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" aria-hidden /> Compare / path
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" aria-hidden /> Found
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0" aria-hidden /> Traversal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" aria-hidden /> Remove
        </span>
      </div>
    </div>
  )
}
