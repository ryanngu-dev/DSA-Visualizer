import { useState } from 'react'
import type { BinaryHeap } from './BinaryHeap'
import { stepsForDeleteByValue, stepsForExtract, stepsForInsert } from './stepGenerators'
import type { HeapMode } from './types'
import type { HeapOperation } from './types'

type PanelOp = 'insert' | 'extract' | 'delete'

interface HeapControlPanelProps {
  heap: BinaryHeap
  setSteps: (steps: import('./types').HeapStep[], op: HeapOperation | null) => void
  play: () => void
  bumpSnapshot: () => void
  maxNodes?: number
}

export default function HeapControlPanel({
  heap,
  setSteps,
  play,
  bumpSnapshot,
  maxNodes = 15,
}: HeapControlPanelProps) {
  const [operation, setOperation] = useState<PanelOp>('insert')
  const [heapMode, setHeapMode] = useState<HeapMode>(() => heap.mode)
  const [insertWarning, setInsertWarning] = useState<string | null>(null)
  const [insertValue, setInsertValue] = useState('')
  const [deleteValue, setDeleteValue] = useState('')

  const applyHeapMode = (mode: HeapMode) => {
    setHeapMode(mode)
    heap.setMode(mode)
    bumpSnapshot()
  }

  const handleRun = () => {
    setInsertWarning(null)

    if (operation === 'insert') {
      const value = Number(insertValue)
      if (Number.isNaN(value)) return
      if (heap.size() >= maxNodes) {
        setInsertWarning(`Maximum of ${maxNodes} elements. Extract or delete before inserting.`)
        return
      }
      setSteps(stepsForInsert(heap, value, maxNodes), { type: 'insert', value })
      play()
      return
    }

    if (operation === 'extract') {
      setSteps(stepsForExtract(heap), { type: 'extract', mode: heap.mode })
      play()
      return
    }

    const value = Number(deleteValue)
    if (Number.isNaN(value)) return
    setSteps(stepsForDeleteByValue(heap, value), { type: 'delete', value })
    play()
  }

  const extractLabel = heap.mode === 'min' ? 'Extract min' : 'Extract max'

  return (
    <div className="flex flex-col gap-4" role="form" aria-label="Binary heap operations">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-200">Heap type</label>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Min or max heap">
          <button
            type="button"
            role="tab"
            aria-selected={heapMode === 'min'}
            onClick={() => applyHeapMode('min')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
              heapMode === 'min'
                ? 'bg-accent text-white shadow-md'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Min-heap
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={heapMode === 'max'}
            onClick={() => applyHeapMode('max')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
              heapMode === 'max'
                ? 'bg-accent text-white shadow-md'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Max-heap
          </button>
        </div>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Switching type rebuilds the array into a valid heap with the same elements.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-200">Operation</label>
        <div className="flex flex-wrap gap-2" role="tablist">
          {(['insert', 'extract', 'delete'] as const).map((op) => (
            <button
              key={op}
              type="button"
              role="tab"
              aria-selected={operation === op}
              onClick={() => setOperation(op)}
              className="capitalize px-3 py-2 rounded-lg text-sm font-medium transition-colors
                         aria-selected:bg-slate-800 aria-selected:text-white
                         bg-slate-200 text-slate-700 hover:bg-slate-300
                         dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700
                         dark:aria-selected:bg-slate-100 dark:aria-selected:text-slate-900"
            >
              {op === 'extract' ? extractLabel : op}
            </button>
          ))}
        </div>
      </div>

      {operation === 'insert' && (
        <div>
          <label htmlFor="heap-insert-value" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
            Value
          </label>
          <input
            id="heap-insert-value"
            type="number"
            value={insertValue}
            onChange={(e) => setInsertValue(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900
                       focus:outline-none focus:ring-2 focus:ring-accent/40
                       dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700"
            placeholder="e.g. 42"
          />
          {insertWarning && (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300" role="status">
              {insertWarning}
            </p>
          )}
        </div>
      )}

      {operation === 'delete' && (
        <div>
          <label htmlFor="heap-delete-value" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
            Value to delete
          </label>
          <input
            id="heap-delete-value"
            type="number"
            value={deleteValue}
            onChange={(e) => setDeleteValue(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900
                       focus:outline-none focus:ring-2 focus:ring-accent/40
                       dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700"
            placeholder="e.g. 30"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Removes the first occurrence (left-to-right in the array), then restores the heap.
          </p>
        </div>
      )}

      {operation === 'extract' && (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Removes the root ({heap.mode === 'min' ? 'smallest' : 'largest'} element), moves the last leaf to the root, then sifts down.
        </p>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={handleRun}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-white
                     dark:focus:ring-offset-slate-900"
        >
          Run
        </button>
      </div>
    </div>
  )
}
