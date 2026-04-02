import { AnimatePresence, motion } from 'framer-motion'
import type { GraphSnapshot } from './types'
import type { GraphTraversalStep } from './types'

interface GraphViewProps {
  snapshot: GraphSnapshot
  currentStep: GraphTraversalStep | null
  stepIndex: number
  allSteps: GraphTraversalStep[]
}

function BfsQueueVisual({
  dequeuedId,
  queueAfterDequeue,
  enqueuedIds,
  labelOf,
}: {
  dequeuedId: string
  queueAfterDequeue: string[]
  enqueuedIds: string[]
  labelOf: (id: string) => string
}) {
  const rowKey = `${queueAfterDequeue.join(',')}|${enqueuedIds.join(',')}`

  return (
    <div
      className="flex h-full min-h-[280px] w-full flex-col rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-3 shadow-sm dark:border-slate-700 dark:from-slate-900/80 dark:to-slate-950"
      aria-label={`Dequeued ${labelOf(dequeuedId)} from front of queue; queue state below`}
    >
      <div className="mb-3 shrink-0 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Dequeued from front</span>
        <span className="rounded-lg bg-indigo-500 px-2.5 py-1 font-mono text-sm font-bold text-white shadow-sm dark:bg-indigo-600">
          {labelOf(dequeuedId)}
        </span>
      </div>
      <div className="mb-2 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Queue
      </div>
      <div className="mb-1 shrink-0 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500">Front (dequeue here)</div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-lg border border-dashed border-slate-200 bg-white/80 px-2 py-3 dark:border-slate-700 dark:bg-slate-900/50">
        {queueAfterDequeue.length === 0 && enqueuedIds.length === 0 && (
          <span className="py-4 text-center text-sm text-slate-400 italic">empty</span>
        )}
        {queueAfterDequeue.map((id) => (
          <div
            key={`waiting-${id}`}
            className="w-full shrink-0 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2.5 text-center font-mono text-sm font-semibold text-slate-800 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            {labelOf(id)}
          </div>
        ))}
        <AnimatePresence mode="popLayout">
          {enqueuedIds.map((id, i) => (
            <motion.div
              key={`${rowKey}-enqueue-${id}-${i}`}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28, delay: i * 0.07 }}
              className="w-full shrink-0 rounded-lg border-2 border-amber-500 bg-amber-100 px-3 py-2.5 text-center font-mono text-sm font-bold text-amber-950 shadow-sm ring-1 ring-amber-400/30 dark:border-amber-400 dark:bg-amber-950/50 dark:text-amber-50"
            >
              {labelOf(id)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-1 shrink-0 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500">Back</div>
    </div>
  )
}

function DfsStackVisual({
  poppedId,
  stackAfterPop,
  pushedIds,
  labelOf,
}: {
  poppedId: string
  stackAfterPop: string[]
  pushedIds: string[]
  labelOf: (id: string) => string
}) {
  const rowKey = `${stackAfterPop.join(',')}|${pushedIds.join(',')}`

  return (
    <div
      className="flex h-full min-h-[280px] w-full flex-col rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-3 shadow-sm dark:border-slate-700 dark:from-slate-900/80 dark:to-slate-950"
      aria-label={`Popped ${labelOf(poppedId)} from top of stack; stack state below`}
    >
      <div className="mb-3 shrink-0 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Popped from top</span>
        <span className="rounded-lg bg-indigo-500 px-2.5 py-1 font-mono text-sm font-bold text-white shadow-sm dark:bg-indigo-600">
          {labelOf(poppedId)}
        </span>
      </div>
      <div className="mb-2 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Stack
      </div>
      <div className="mb-1 shrink-0 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500">Top (pop here)</div>
      <div className="flex min-h-0 flex-1 flex-col-reverse gap-2 overflow-y-auto rounded-lg border border-dashed border-slate-200 bg-white/80 px-2 py-3 dark:border-slate-700 dark:bg-slate-900/50">
        {stackAfterPop.length === 0 && pushedIds.length === 0 && (
          <span className="py-4 text-center text-sm text-slate-400 italic">empty</span>
        )}
        {stackAfterPop.map((id) => (
          <div
            key={`stack-waiting-${id}`}
            className="w-full shrink-0 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2.5 text-center font-mono text-sm font-semibold text-slate-800 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            {labelOf(id)}
          </div>
        ))}
        <AnimatePresence mode="popLayout">
          {pushedIds.map((id, i) => (
            <motion.div
              key={`${rowKey}-push-${id}-${i}`}
              layout
              initial={{ opacity: 0, scale: 0.92, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28, delay: i * 0.07 }}
              className="w-full shrink-0 rounded-lg border-2 border-amber-500 bg-amber-100 px-3 py-2.5 text-center font-mono text-sm font-bold text-amber-950 shadow-sm ring-1 ring-amber-400/30 dark:border-amber-400 dark:bg-amber-950/50 dark:text-amber-50"
            >
              {labelOf(id)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-1 shrink-0 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500">Bottom</div>
    </div>
  )
}

function resolveVisitStep(
  current: GraphTraversalStep | null,
  stepIndex: number,
  allSteps: GraphTraversalStep[]
): Extract<GraphTraversalStep, { type: 'visit' }> | null {
  if (!current) return null
  if (current.type === 'visit') return current
  if (current.type === 'done' && stepIndex > 0) {
    const prev = allSteps[stepIndex - 1]
    if (prev?.type === 'visit') return prev
  }
  return null
}

export default function GraphView({ snapshot, currentStep, stepIndex, allSteps }: GraphViewProps) {
  const visit = resolveVisitStep(currentStep, stepIndex, allSteps)
  const pos = new Map(snapshot.nodes.map((n) => [n.id, n]))

  const isDoneStep = currentStep?.type === 'done'
  const visits = allSteps.filter((s): s is Extract<GraphTraversalStep, { type: 'visit' }> => s.type === 'visit')
  const lastVisit = visits[visits.length - 1]

  const visitSet = new Set(
    isDoneStep && lastVisit ? lastVisit.visitOrder : (visit?.visitOrder ?? [])
  )
  const currentId = isDoneStep ? null : (visit?.nodeId ?? null)
  const frontierLabel = visit?.frontierLabel ?? 'queue'

  const labelOf = (id: string) => pos.get(id)?.label ?? id

  const discoveryEdgeIds =
    visit && !isDoneStep
      ? visit.frontierLabel === 'queue'
        ? visit.enqueuedIds ?? []
        : visit.frontierLabel === 'stack'
          ? visit.pushedIds ?? []
          : []
      : []

  const discoveryEdges =
    visit && !isDoneStep && discoveryEdgeIds.length > 0
      ? discoveryEdgeIds
          .map((toId) => {
            const from = pos.get(visit.nodeId)
            const to = pos.get(toId)
            if (!from || !to) return null
            return { from, to, toId }
          })
          .filter((e): e is { from: NonNullable<ReturnType<typeof pos.get>>; to: NonNullable<ReturnType<typeof pos.get>>; toId: string } => e !== null)
      : []

  const showFrontier =
    visit &&
    !isDoneStep &&
    ((frontierLabel === 'queue' &&
      visit.queueAfterDequeue !== undefined &&
      visit.enqueuedIds !== undefined) ||
      (frontierLabel === 'stack' && visit.stackAfterPop !== undefined && visit.pushedIds !== undefined))

  return (
    <div className="w-full">
      {snapshot.nodes.length === 0 ? (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">Generate a random graph to begin.</p>
      ) : (
        <div
          className={`flex w-full flex-col items-center gap-3 ${showFrontier ? 'lg:flex-row lg:items-start lg:justify-center lg:gap-2' : ''}`}
        >
          <div
            className={`flex w-full min-w-0 max-w-[560px] flex-col ${showFrontier ? 'shrink-0 items-center gap-3' : 'items-center gap-4'}`}
          >
            <motion.svg
              width={560}
              height={380}
              viewBox="0 0 560 380"
              className="max-w-full h-auto text-slate-400 dark:text-slate-500"
              aria-label="Graph"
            >
            {snapshot.edges.map((e) => {
              const a = pos.get(e.from)
              const b = pos.get(e.to)
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
            {discoveryEdges.map(({ from, to, toId }) => (
              <line
                key={`discovery-edge-${toId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className="text-amber-500 dark:text-amber-400"
                stroke="currentColor"
                strokeWidth={4}
                strokeLinecap="round"
                opacity={0.92}
              />
            ))}
            {snapshot.nodes.map((n) => {
              const visited = visitSet.has(n.id)
              const active = currentId === n.id
              const fill = active
                ? 'fill-indigo-500 stroke-indigo-600'
                : visited
                  ? 'fill-emerald-500/90 stroke-emerald-600'
                  : 'fill-white stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-600'
              return (
                <g key={n.id}>
                  <motion.circle
                    layout
                    cx={n.x}
                    cy={n.y}
                    r={22}
                    className={`transition-colors ${fill}`}
                    strokeWidth={2}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  />
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={`text-sm font-semibold pointer-events-none select-none ${
                      active || visited ? 'fill-white' : 'fill-slate-800 dark:fill-slate-100'
                    }`}
                  >
                    {n.label}
                  </text>
                </g>
              )
            })}
            </motion.svg>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500" aria-hidden /> Current
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" aria-hidden /> Visited
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full border border-slate-300 bg-white dark:bg-slate-900"
                  aria-hidden
                />
                Unvisited
              </span>
            </div>
          </div>

          {showFrontier && frontierLabel === 'queue' && visit.queueAfterDequeue !== undefined && visit.enqueuedIds !== undefined && (
            <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-[min(100%,260px)] lg:pt-1 xl:w-[280px]">
              <BfsQueueVisual
                dequeuedId={visit.nodeId}
                queueAfterDequeue={visit.queueAfterDequeue}
                enqueuedIds={visit.enqueuedIds}
                labelOf={labelOf}
              />
            </aside>
          )}

          {showFrontier && frontierLabel === 'stack' && visit.stackAfterPop !== undefined && visit.pushedIds !== undefined && (
            <aside className="w-full max-w-[260px] shrink-0 lg:sticky lg:top-4 lg:w-[min(100%,240px)] lg:pt-0.5 xl:w-[260px]">
              <DfsStackVisual
                poppedId={visit.nodeId}
                stackAfterPop={visit.stackAfterPop}
                pushedIds={visit.pushedIds}
                labelOf={labelOf}
              />
            </aside>
          )}
        </div>
      )}
    </div>
  )
}
