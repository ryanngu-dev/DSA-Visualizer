import { useState } from 'react'
import type { Queue } from './Queue'
import type { QueueOperation, QueueStep } from './types'
import { stepsForClear, stepsForCreate, stepsForDequeue, stepsForEnqueue, stepsForPeek } from './stepGenerators'

interface QueueControlPanelProps {
  queue: Queue
  setSteps: (steps: QueueStep[], op: QueueOperation | null) => void
  play: () => void
  maxNodes?: number
}

export default function QueueControlPanel({
  queue,
  setSteps,
  play,
  maxNodes = 12,
}: QueueControlPanelProps) {
  const [createValues, setCreateValues] = useState('10, 25, 32')
  const [enqueueValue, setEnqueueValue] = useState('')
  const [warning, setWarning] = useState<string | null>(null)

  const handleCreate = () => {
    setWarning(null)
    let values = createValues
      .split(/[\s,]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n))
    if (values.length > maxNodes) {
      setWarning(`Limited to ${maxNodes} values so the queue fits cleanly.`)
      values = values.slice(0, maxNodes)
    }
    setSteps(stepsForCreate(queue, values), { type: 'create', values })
    play()
  }

  return (
    <div className="flex flex-col gap-4" role="form" aria-label="Queue operations">
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/30">
        <label htmlFor="queue-create-values" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
          Create values (front to rear)
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id="queue-create-values"
            type="text"
            value={createValues}
            onChange={(e) => {
              setCreateValues(e.target.value)
              setWarning(null)
            }}
            className="flex-1 min-w-[180px] rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono bg-white text-slate-900
                       focus:outline-none focus:ring-2 focus:ring-accent/40
                       dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700"
            placeholder="e.g. 10, 25, 32"
          />
          <button
            type="button"
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-white
                     dark:focus:ring-offset-slate-900"
          >
            Create
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/30">
        <label htmlFor="queue-enqueue-value" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
          Enqueue value
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id="queue-enqueue-value"
            type="number"
            value={enqueueValue}
            onChange={(e) => {
              setEnqueueValue(e.target.value)
              setWarning(null)
            }}
            className="flex-1 min-w-[180px] rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900
                       focus:outline-none focus:ring-2 focus:ring-accent/40
                       dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700"
            placeholder="e.g. 42"
          />
          <button
            type="button"
            onClick={() => {
              setWarning(null)
              if (queue.size() >= maxNodes) {
                setWarning(`Maximum of ${maxNodes} elements reached.`)
                return
              }
              const value = Number(enqueueValue)
              if (Number.isNaN(value)) return
              setSteps(stepsForEnqueue(queue, value), { type: 'enqueue', value })
              play()
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 focus:ring-offset-white
                       dark:focus:ring-offset-slate-900"
          >
            Enqueue
          </button>
        </div>
      </div>

      {warning && (
        <p className="text-xs text-amber-700 dark:text-amber-300" role="status">
          {warning}
        </p>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/30">
        <p className="text-sm font-medium text-slate-700 mb-2 dark:text-slate-200">Quick actions</p>
        <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setWarning(null)
            setSteps(stepsForDequeue(queue), { type: 'dequeue' })
            play()
          }}
          className="px-4 py-2 rounded-lg bg-rose-100 text-rose-800 text-sm font-medium hover:bg-rose-200 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-white
                     dark:focus:ring-offset-slate-900 dark:bg-rose-900/40 dark:text-rose-100 dark:hover:bg-rose-900/60"
        >
          Dequeue
        </button>
        <button
          type="button"
          onClick={() => {
            setWarning(null)
            setSteps(stepsForPeek(queue), { type: 'peek' })
            play()
          }}
          className="px-4 py-2 rounded-lg bg-cyan-100 text-cyan-800 text-sm font-medium hover:bg-cyan-200 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-white
                     dark:focus:ring-offset-slate-900 dark:bg-cyan-900/40 dark:text-cyan-100 dark:hover:bg-cyan-900/60"
        >
          Peek
        </button>
        <button
          type="button"
          onClick={() => {
            setWarning(null)
            setSteps(stepsForClear(queue), { type: 'clear' })
            play()
          }}
          className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 text-sm font-medium hover:bg-slate-300 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-white
                     dark:focus:ring-offset-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          Clear
        </button>
      </div>
      </div>
    </div>
  )
}
