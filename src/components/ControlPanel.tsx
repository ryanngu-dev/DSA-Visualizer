import { useState } from 'react'
import type { LinkedList } from '../data-structures/linked-list/LinkedList'
import {
  stepsForCreate,
  stepsForInsertHead,
  stepsForInsertTail,
  stepsForInsertAt,
  stepsForRemoveAt,
  stepsForRemoveByValue,
  stepsForSearch,
} from '../data-structures/linked-list/stepGenerators'
import type { InsertPosition, RemoveMode } from '../data-structures/linked-list/types'
import type { LinkedListOperation } from '../hooks/useVisualization'

type Operation = 'create' | 'search' | 'insert' | 'remove'

interface ControlPanelProps {
  list: LinkedList
  setSteps: (steps: import('../data-structures/linked-list/types').LinkedListStep[], op: LinkedListOperation | null) => void
  play: () => void
  maxNodes?: number
}

export default function ControlPanel({
  list,
  setSteps,
  play,
  maxNodes = 14,
}: ControlPanelProps) {
  const [operation, setOperation] = useState<Operation>('create')
  const [createValues, setCreateValues] = useState('22, 2, 77, 6, 43, 76')
  const [createWarning, setCreateWarning] = useState<string | null>(null)
  const [insertWarning, setInsertWarning] = useState<string | null>(null)
  const [insertValue, setInsertValue] = useState('')
  const [insertPosition, setInsertPosition] = useState<InsertPosition>('head')
  const [insertIndex, setInsertIndex] = useState('0')
  const [removeMode, setRemoveMode] = useState<RemoveMode>('index')
  const [removeIndex, setRemoveIndex] = useState('0')
  const [removeValue, setRemoveValue] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const getOperationContext = (): LinkedListOperation => {
    if (operation === 'create') {
      const values = createValues.split(/[\s,]+/).map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n))
      return { type: 'create', values }
    }
    if (operation === 'insert') {
      const value = Number(insertValue)
      return {
        type: 'insert',
        position: insertPosition,
        value: Number.isNaN(value) ? 0 : value,
        index: insertPosition === 'index' ? Number(insertIndex) || 0 : undefined,
      }
    }
    if (operation === 'remove') {
      return {
        type: 'remove',
        mode: removeMode,
        index: removeMode === 'index' ? Number(removeIndex) || 0 : undefined,
        value: removeMode === 'value' ? Number(removeValue) || 0 : undefined,
      }
    }
    return { type: 'search', value: Number(searchValue) || 0 }
  }

  const handleRun = () => {
    setCreateWarning(null)
    setInsertWarning(null)
    const op = getOperationContext()
    if (operation === 'create') {
      let values = (op.type === 'create' && op.values.length > 0) ? op.values : [22, 2, 77, 6, 43, 76]
      if (values.length > maxNodes) {
        setCreateWarning(`Limited to ${maxNodes} nodes so the list fits on one line.`)
        values = values.slice(0, maxNodes)
      }
      setSteps(stepsForCreate(list, values), op)
      play()
    } else if (operation === 'insert') {
      if (list.length >= maxNodes) {
        setInsertWarning(`Maximum of ${maxNodes} nodes reached. Remove a node before inserting another.`)
        return
      }
      const value = Number(insertValue)
      if (Number.isNaN(value)) return
      const steps =
        insertPosition === 'head'
          ? stepsForInsertHead(list, value)
          : insertPosition === 'tail'
            ? stepsForInsertTail(list, value)
            : stepsForInsertAt(list, Number(insertIndex) || 0, value)
      setSteps(steps, op)
      play()
    } else if (operation === 'remove') {
      const steps =
        removeMode === 'index'
          ? stepsForRemoveAt(list, Number(removeIndex) || 0)
          : stepsForRemoveByValue(list, Number(removeValue) || 0)
      setSteps(steps, op)
      play()
    } else {
      const value = Number(searchValue)
      if (Number.isNaN(value)) return
      setSteps(stepsForSearch(list, value), op)
      play()
    }
  }

  return (
    <div className="flex flex-col gap-4" role="form" aria-label="Operation controls">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Operation</label>
        <div className="flex flex-wrap gap-2" role="tablist">
          {(['create', 'search', 'insert', 'remove'] as const).map((op) => (
            <button
              key={op}
              type="button"
              role="tab"
              aria-selected={operation === op}
              onClick={() => setOperation(op)}
              className="capitalize px-3 py-2 rounded-lg text-sm font-medium transition-colors aria-selected:bg-slate-800 aria-selected:text-white bg-slate-200 text-slate-700 hover:bg-slate-300"
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      {operation === 'create' && (
        <div>
          <label htmlFor="create-values" className="block text-sm font-medium text-slate-700 mb-1">
            Values (comma or space separated, max {maxNodes} nodes)
          </label>
          <input
            id="create-values"
            type="text"
            value={createValues}
            onChange={(e) => { setCreateValues(e.target.value); setCreateWarning(null) }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
            placeholder="e.g. 22, 2, 77, 6, 43, 76, 89"
          />
          {createWarning && (
            <p className="mt-1 text-xs text-amber-700" role="status">{createWarning}</p>
          )}
        </div>
      )}

      {operation === 'insert' && (
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="insert-value" className="block text-sm font-medium text-slate-700 mb-1">
              Value
            </label>
            <input
              id="insert-value"
              type="number"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="e.g. 42"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
            <select
              value={insertPosition}
              onChange={(e) => setInsertPosition(e.target.value as InsertPosition)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="head">Head</option>
              <option value="tail">Tail</option>
              <option value="index">At index</option>
            </select>
          </div>
          {insertPosition === 'index' && (
            <div>
              <label htmlFor="insert-index" className="block text-sm font-medium text-slate-700 mb-1">
                Index
              </label>
              <input
                id="insert-index"
                type="number"
                min={0}
                value={insertIndex}
                onChange={(e) => setInsertIndex(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          )}
          {insertWarning && (
            <p className="mt-1 text-xs text-amber-700" role="status">{insertWarning}</p>
          )}
        </div>
      )}

      {operation === 'remove' && (
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Remove by</label>
            <select
              value={removeMode}
              onChange={(e) => setRemoveMode(e.target.value as RemoveMode)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="index">Index</option>
              <option value="value">Value</option>
            </select>
          </div>
          {removeMode === 'index' ? (
            <div>
              <label htmlFor="remove-index" className="block text-sm font-medium text-slate-700 mb-1">
                Index
              </label>
              <input
                id="remove-index"
                type="number"
                min={0}
                value={removeIndex}
                onChange={(e) => setRemoveIndex(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="remove-value" className="block text-sm font-medium text-slate-700 mb-1">
                Value
              </label>
              <input
                id="remove-value"
                type="number"
                value={removeValue}
                onChange={(e) => setRemoveValue(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. 42"
              />
            </div>
          )}
        </div>
      )}

      {operation === 'search' && (
        <div>
          <label htmlFor="search-value" className="block text-sm font-medium text-slate-700 mb-1">
            Value
          </label>
          <input
            id="search-value"
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="e.g. 42"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={handleRun}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Run
        </button>
      </div>
    </div>
  )
}
