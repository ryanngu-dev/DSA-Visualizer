import { useState } from 'react'
import type { HashMapModel } from './HashMapModel'
import type { HashMapOperation, HashMapStep } from './types'
import { stepsForCreate, stepsForInsert, stepsForRemove, stepsForSearch } from './stepGenerators'

interface HashMapControlPanelProps {
  map: HashMapModel
  setSteps: (steps: HashMapStep[], op: HashMapOperation | null) => void
  play: () => void
  maxValues?: number
}

function parseValues(input: string): number[] {
  return input
    .split(/[\s,]+/)
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n))
}

export default function HashMapControlPanel({ map, setSteps, play, maxValues = 18 }: HashMapControlPanelProps) {
  const [operation, setOperation] = useState<'create' | 'search' | 'insert' | 'remove'>('create')
  const [createValues, setCreateValues] = useState('10, 17, 24')
  const [insertValue, setInsertValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [removeValue, setRemoveValue] = useState('')
  const [warning, setWarning] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4" role="form" aria-label="Hash map operations">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-200">Operation</label>
        <div className="flex flex-wrap gap-2" role="tablist">
          {(['create', 'search', 'insert', 'remove'] as const).map((op) => (
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
              {op}
            </button>
          ))}
        </div>
      </div>

      {operation === 'create' && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/30">
          <label htmlFor="hm-create" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
            Create values
          </label>
          <input
            id="hm-create"
            type="text"
            value={createValues}
            onChange={(e) => {
              setCreateValues(e.target.value)
              setWarning(null)
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono bg-white text-slate-900
                       focus:outline-none focus:ring-2 focus:ring-accent/40 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700"
            placeholder="e.g. 1, 8, 15, 22"
          />
        </div>
      )}

      {operation === 'insert' && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/30">
          <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">Insert value</label>
            <input
              type="number"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white dark:bg-slate-950 dark:border-slate-700"
              placeholder="value"
            />
        </div>
      )}

      {operation === 'search' && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/30">
          <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">Search value</label>
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white dark:bg-slate-950 dark:border-slate-700"
            placeholder="value"
          />
        </div>
      )}

      {operation === 'remove' && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/30">
          <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">Remove value</label>
        <input
          type="number"
            value={removeValue}
            onChange={(e) => setRemoveValue(e.target.value)}
          className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white dark:bg-slate-950 dark:border-slate-700"
            placeholder="value"
        />
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            setWarning(null)
            if (operation === 'create') {
              let values = parseValues(createValues)
              if (values.length > maxValues) {
                setWarning(`Limited to ${maxValues} values.`)
                values = values.slice(0, maxValues)
              }
              setSteps(stepsForCreate(map, values), { type: 'create', values })
            } else if (operation === 'insert') {
              const value = Number(insertValue)
              if (Number.isNaN(value)) return
              setSteps(stepsForInsert(map, value), { type: 'insert', key: value })
            } else if (operation === 'search') {
              const value = Number(searchValue)
              if (Number.isNaN(value)) return
              setSteps(stepsForSearch(map, value), { type: 'search', key: value })
            } else {
              const value = Number(removeValue)
              if (Number.isNaN(value)) return
              setSteps(stepsForRemove(map, value), { type: 'remove', key: value })
            }
            play()
          }}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Run
        </button>
      </div>

      {warning && (
        <p className="text-xs text-amber-700 dark:text-amber-300" role="status">
          {warning}
        </p>
      )}
    </div>
  )
}
