import { useState } from 'react'
import type { Stack } from './Stack'
import type { StackOperation } from './types'
import type { StackStep } from './types'
import { stepsForClear, stepsForCreate, stepsForPeek, stepsForPop, stepsForPush } from './stepGenerators'

interface StackControlPanelProps {
  stack: Stack
  setSteps: (steps: StackStep[], op: StackOperation | null) => void
  play: () => void
  maxNodes?: number
}

export default function StackControlPanel({
  stack,
  setSteps,
  play,
  maxNodes = 12,
}: StackControlPanelProps) {
  const [createValues, setCreateValues] = useState('10, 25, 32')
  const [pushValue, setPushValue] = useState('')
  const [warning, setWarning] = useState<string | null>(null)

  const handleCreate = () => {
    setWarning(null)
    let values = createValues
      .split(/[\s,]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n))
    if (values.length > maxNodes) {
      setWarning(`Limited to ${maxNodes} values so the stack fits cleanly.`)
      values = values.slice(0, maxNodes)
    }
    setSteps(stepsForCreate(stack, values), { type: 'create', values })
    play()
  }

  return (
    <div className="flex flex-col gap-4" role="form" aria-label="Stack operations">
      <div>
        <label htmlFor="stack-create-values" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
          Create values (bottom to top)
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id="stack-create-values"
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

      <div>
        <label htmlFor="stack-push-value" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
          Push value
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id="stack-push-value"
            type="number"
            value={pushValue}
            onChange={(e) => {
              setPushValue(e.target.value)
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
              if (stack.size() >= maxNodes) {
                setWarning(`Maximum of ${maxNodes} elements reached.`)
                return
              }
              const value = Number(pushValue)
              if (Number.isNaN(value)) return
              setSteps(stepsForPush(stack, value), { type: 'push', value })
              play()
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 focus:ring-offset-white
                       dark:focus:ring-offset-slate-900"
          >
            Push
          </button>
        </div>
      </div>

      {warning && (
        <p className="text-xs text-amber-700 dark:text-amber-300" role="status">
          {warning}
        </p>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            setWarning(null)
            setSteps(stepsForPop(stack), { type: 'pop' })
            play()
          }}
          className="px-4 py-2 rounded-lg bg-rose-100 text-rose-800 text-sm font-medium hover:bg-rose-200 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-white
                     dark:focus:ring-offset-slate-900 dark:bg-rose-900/40 dark:text-rose-100 dark:hover:bg-rose-900/60"
        >
          Pop
        </button>
        <button
          type="button"
          onClick={() => {
            setWarning(null)
            setSteps(stepsForPeek(stack), { type: 'peek' })
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
            setSteps(stepsForClear(stack), { type: 'clear' })
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
  )
}
