import { AnimatePresence, motion } from 'framer-motion'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { NodeSnapshot, LinkedListStep } from './types'

/**
 * Animation system copied from jaikpillai/linked-list-visualizer.
 * Structure: HeadPointer → [Node + Arrow] × N → NullPointer
 */

interface LinkedListViewProps {
  nodes: NodeSnapshot[]
  currentStep: LinkedListStep | null
  message: string | null
  stepDirection?: 1 | -1
}

// —— Head pointer: clean card ——
function HeadPointer({
  hideArrow,
  containerRef,
}: {
  hideArrow?: boolean
  containerRef?: (el: HTMLDivElement | null) => void
}) {
  return (
    <div
      className="flex items-center select-none"
      ref={containerRef}
    >
      <div
        className="px-3 py-2 rounded-lg shrink-0 bg-white border border-slate-200 shadow-sm flex items-center gap-2
                   dark:bg-slate-900 dark:border-slate-700 dark:shadow-none"
        aria-label="Head pointer"
      >
        <span className="text-sm font-semibold text-slate-600 tracking-wide dark:text-slate-200">head</span>
        <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" aria-hidden />
      </div>
      <span className="flex items-center w-6 justify-center">
        {!hideArrow && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 text-slate-400 dark:text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        )}
      </span>
    </div>
  )
}

// —— Null pointer: clean card ——
function NullPointer({
  containerRef,
}: {
  containerRef?: (el: HTMLDivElement | null) => void
}) {
  return (
    <div
      ref={containerRef}
      className="rounded-lg shrink-0 bg-white border border-slate-200 shadow-sm flex items-center gap-2 px-3 py-2 select-none
                 dark:bg-slate-900 dark:border-slate-700 dark:shadow-none"
      aria-label="Null pointer"
    >
      <span className="w-2 h-2 rounded-full border-2 border-slate-300 bg-transparent dark:border-slate-500" aria-hidden />
      <span className="text-sm font-semibold text-slate-500 dark:text-slate-300">null</span>
    </div>
  )
}

// —— Arrow between nodes ——
function Arrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 shrink-0 text-slate-400 dark:text-slate-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

// —— Node: same animation, clean card styling (data | next) ——
function Node({
  data,
  highlight,
  isFound,
  isRemoving,
}: {
  data: NodeSnapshot
  highlight: boolean
  isFound: boolean
  isRemoving: boolean
}) {
  const roleStyle =
    isRemoving
      ? 'border-red-400 bg-red-500 text-white'
      : isFound
        ? 'border-emerald-400 bg-emerald-500 text-white'
        : highlight
          ? 'border-indigo-400 bg-indigo-500 text-white'
          : 'border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'

  return (
    <motion.div
      data-ll-node
      key={data.id}
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        backgroundColor: 'rgb(239 68 68)',
        color: 'white',
        y: -5,
        opacity: 0.3,
        transition: {
          opacity: { ease: 'easeOut', duration: 0.6 },
          backgroundColor: { ease: 'easeOut', duration: 0.15 },
          y: { ease: 'easeOut', duration: 0.2 },
        },
      }}
      transition={{
        opacity: { ease: 'easeOut', duration: 0.6 },
        y: { ease: 'easeOut', duration: 0.2 },
        layout: { ease: 'easeOut', duration: 0.2 },
      }}
      className={`flex items-center rounded-lg border shrink-0 overflow-hidden shadow-sm w-[120px] h-[52px] min-w-[120px] min-h-[52px] ${roleStyle}`}
    >
      <div className="w-[60%] border-r border-slate-200 h-full flex items-center pl-3 dark:border-slate-700">
        <span className={`truncate text-sm font-medium ${isRemoving || isFound || highlight ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
          {String(data.value)}
        </span>
      </div>
      <div className="w-[40%] h-full flex items-center justify-center">
        <span className={`text-xs font-medium ${isRemoving || isFound || highlight ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
          next
        </span>
      </div>
    </motion.div>
  )
}

export default function LinkedListView({
  nodes,
  currentStep,
  message,
}: LinkedListViewProps) {
  const laneRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement | null>(null)
  const nullRef = useRef<HTMLDivElement | null>(null)
  const nodeElByIdRef = useRef<Map<string, HTMLElement>>(new Map())
  const [bypassPath, setBypassPath] = useState<{ d: string; head: string; visible: boolean }>({
    d: '',
    head: '',
    visible: false,
  })
  const highlightNodeId = (() => {
    if (!currentStep) return null
    if (currentStep.type === 'highlight') {
      const idx = currentStep.index
      return nodes[idx]?.id ?? null
    }
    return null
  })()

  const foundNodeId = (() => {
    if (!currentStep || currentStep.type !== 'found') return null
    const idx = currentStep.index
    return nodes[idx]?.id ?? null
  })()

  const removingNodeId = (() => {
    if (!currentStep) return null
    if (currentStep.type === 'reroute' || currentStep.type === 'removeAt') {
      const idx = currentStep.index
      return nodes[idx]?.id ?? null
    }
    if (currentStep.type === 'removeByValue' && currentStep.value !== undefined) {
      const n = nodes.find((node) => node.value === currentStep.value)
      return n?.id ?? null
    }
    return null
  })()

  const removingIndex = removingNodeId ? nodes.findIndex((n) => n.id === removingNodeId) : -1

  const bypassIds = useMemo(() => {
    if (!currentStep) return null
    if (currentStep.type !== 'reroute' && currentStep.type !== 'removeAt' && currentStep.type !== 'removeByValue') {
      return null
    }

    if (removingIndex < 0) return null

    // Deleting head: reroute head → next after deleted
    if (removingIndex === 0 && nodes.length > 1) {
      return {
        prevKind: 'head' as const,
        prevId: null,
        nextKind: 'node' as const,
        nextId: nodes[1]!.id,
      }
    }

    // Deleting last node: reroute previous node → null
    if (removingIndex === nodes.length - 1 && nodes.length > 1) {
      return {
        prevKind: 'node' as const,
        prevId: nodes[removingIndex - 1]!.id,
        nextKind: 'null' as const,
        nextId: null,
      }
    }

    // Middle delete: previous node → next node (existing behavior)
    if (removingIndex > 0 && removingIndex < nodes.length - 1) {
      return {
        prevKind: 'node' as const,
        prevId: nodes[removingIndex - 1]!.id,
        nextKind: 'node' as const,
        nextId: nodes[removingIndex + 1]!.id,
      }
    }

    return null
  }, [currentStep, nodes, removingIndex])

  // After the node has actually been removed from the array (no removingIndex),
  // hide straight arrows during the remove step so no arrow briefly points at
  // empty space while layout reflows.
  const hideAllStraightArrowsDuringRemove =
    removingIndex === -1 &&
    (currentStep?.type === 'removeAt' || currentStep?.type === 'removeByValue')

  useLayoutEffect(() => {
    const lane = laneRef.current
    if (!lane || !bypassIds) {
      setBypassPath((p) => (p.visible ? { d: '', head: '', visible: false } : p))
      return
    }

    let prevEl: HTMLElement | null = null
    if (bypassIds.prevKind === 'head') {
      prevEl = headRef.current
    } else if (bypassIds.prevKind === 'node' && bypassIds.prevId) {
      prevEl = nodeElByIdRef.current.get(bypassIds.prevId) ?? null
    }

    let nextEl: HTMLElement | null = null
    if (bypassIds.nextKind === 'node' && bypassIds.nextId) {
      nextEl = nodeElByIdRef.current.get(bypassIds.nextId) ?? null
    } else if (bypassIds.nextKind === 'null') {
      nextEl = nullRef.current
    }
    if (!prevEl || !nextEl) {
      setBypassPath((p) => (p.visible ? { d: '', head: '', visible: false } : p))
      return
    }

    const laneRect = lane.getBoundingClientRect()
    const prevRect = prevEl.getBoundingClientRect()
    const nextRect = nextEl.getBoundingClientRect()

    const startX = prevRect.left - laneRect.left + prevRect.width * 0.5
    const endX = nextRect.left - laneRect.left + nextRect.width * 0.5

    // Put the bypass arrow just below the node row.
    const rowBottom = Math.max(prevRect.bottom, nextRect.bottom) - laneRect.top
    const baseY = rowBottom + 24
    const tipY = rowBottom + 6

    // Simple shape: start near the previous node, go down, then horizontal
    // under the list, then up into the next node (arrow head already points up).
    const d = `M ${startX} ${tipY} L ${startX} ${baseY} L ${endX} ${baseY} L ${endX} ${tipY}`
    const head = `M ${endX - 4} ${tipY + 4} L ${endX} ${tipY} L ${endX + 4} ${tipY + 4}`

    setBypassPath({ d, head, visible: true })
  }, [bypassIds, removingNodeId, nodes.length])

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-sm font-medium text-slate-700 bg-slate-100 px-4 py-2 rounded-lg"
            role="status"
            aria-live="polite"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-2 min-h-[120px]">
        <motion.div
          layout
          className="flex flex-wrap items-center justify-center w-full"
          style={{ overflowY: 'visible', overflowX: 'visible' }}
          transition={{ layout: { duration: 0.2, ease: 'easeOut' } }}
          ref={laneRef}
        >
          {/* Extra bottom space so the bypass arrow is visible */}
          <div className="relative flex flex-nowrap items-center pb-10">
            <AnimatePresence>
              {bypassPath.visible && (
                <motion.svg
                  key="bypass-arrow"
                  className="absolute left-0 top-0 pointer-events-none text-slate-400 z-10"
                  width={laneRef.current?.getBoundingClientRect().width ?? 1}
                  height={140}
                  viewBox={`0 0 ${laneRef.current?.getBoundingClientRect().width ?? 1} 140`}
                  fill="none"
                  aria-hidden
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <path d={bypassPath.d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={bypassPath.head} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              )}
            </AnimatePresence>

            <HeadPointer
              hideArrow={bypassIds?.prevKind === 'head' && bypassPath.visible}
              containerRef={(el) => {
                headRef.current = el
              }}
            />
            <AnimatePresence initial={false}>
              {nodes.map((node) => {
                const isRemoving = removingNodeId === node.id
                const isPrevOfRemoving = bypassIds?.prevId === node.id
                // During the actual remove step (when the list is reflowing),
                // hide all straight arrows so we never see an arrow briefly
                // pointing at nothing. During the reroute step, hide ONLY the
                // straight arrow from prev -> removing; keep the removing
                // node's own arrow so it disappears together with the node.
                const hideArrowFromThisNode =
                  hideAllStraightArrowsDuringRemove ||
                  (bypassPath.visible && isPrevOfRemoving && bypassIds)

                return (
                  <div
                    key={node.id}
                    className="relative flex items-center"
                    ref={(el) => {
                      if (!el) {
                        nodeElByIdRef.current.delete(node.id)
                        return
                      }
                      const nodeEl = el.querySelector('[data-ll-node]') as HTMLElement | null
                      if (nodeEl) nodeElByIdRef.current.set(node.id, nodeEl)
                    }}
                  >
                    <Node
                      data={node}
                      highlight={highlightNodeId === node.id}
                      isFound={foundNodeId === node.id}
                      isRemoving={isRemoving}
                    />
                    <span className="flex items-center w-6 justify-center">
                      {!hideArrowFromThisNode &&
                        (isRemoving ? (
                          <motion.span
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{
                              opacity: 0.3,
                              y: -5,
                              transition: { duration: 0.4, ease: 'easeOut' },
                            }}
                          >
                            <Arrow />
                          </motion.span>
                        ) : (
                          <Arrow />
                        ))}
                    </span>
                  </div>
                )
              })}
            </AnimatePresence>
            <NullPointer
              containerRef={(el) => {
                nullRef.current = el
              }}
            />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2.5 rounded border border-slate-200 bg-white shadow-sm shrink-0" aria-hidden /> Node
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-indigo-500 shrink-0" aria-hidden /> Current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500 shrink-0" aria-hidden /> Found
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-red-500 shrink-0" aria-hidden /> Removing
        </span>
      </div>
    </div>
  )
}
