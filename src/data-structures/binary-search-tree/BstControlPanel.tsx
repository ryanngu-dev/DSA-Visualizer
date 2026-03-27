import { useState } from 'react'
import type { BinarySearchTree } from './BinarySearchTree'
import {
  stepsForCreate,
  stepsForInsert,
  stepsForRemove,
  stepsForSearch,
  stepsForTraverse,
} from './stepGenerators'
import type { BSTOperation } from './types'
import type { TraverseOrder } from './types'

type Operation = 'create' | 'search' | 'insert' | 'remove' | 'traverse'

interface BstControlPanelProps {
  tree: BinarySearchTree
  setSteps: (steps: import('./types').BSTStep[], op: BSTOperation | null) => void
  play: () => void
  maxNodes?: number
}

export default function BstControlPanel({
  tree,
  setSteps,
  play,
  maxNodes = 15,
}: BstControlPanelProps) {
  const [operation, setOperation] = useState<Operation>('create')
  const [createValues, setCreateValues] = useState('50, 30, 70, 20, 40, 60, 80')
  const [createWarning, setCreateWarning] = useState<string | null>(null)
  const [insertWarning, setInsertWarning] = useState<string | null>(null)
  const [insertValue, setInsertValue] = useState('')
  const [removeValue, setRemoveValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [traverseOrder, setTraverseOrder] = useState<TraverseOrder>('inorder')

  function countNodes(): number {
    const snap = tree.toSnapshot()
    const walk = (n: typeof snap): number => {
      if (!n) return 0
      return 1 + walk(n.left) + walk(n.right)
    }
    return walk(snap)
  }

  function getOperationContext(): BSTOperation {
    if (operation === 'create') {
      const values = createValues
        .split(/[\s,]+/)
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n))
      return { type: 'create', values }
    }
    if (operation === 'insert') {
      const value = Number(insertValue)
      return { type: 'insert', value: Number.isNaN(value) ? 0 : value }
    }
    if (operation === 'remove') {
      return { type: 'remove', value: Number(removeValue) || 0 }
    }
    if (operation === 'traverse') {
      return { type: 'traverse', order: traverseOrder }
    }
    return { type: 'search', value: Number(searchValue) || 0 }
  }

  const handleRun = () => {
    setCreateWarning(null)
    setInsertWarning(null)
    const op = getOperationContext()

    if (operation === 'create') {
      let values = op.type === 'create' && op.values.length > 0 ? op.values : [50, 30, 70, 20, 40]
      if (values.length > maxNodes) {
        setCreateWarning(`Limited to ${maxNodes} nodes so the tree stays readable.`)
        values = values.slice(0, maxNodes)
      }
      setSteps(stepsForCreate(tree, values), op)
      play()
      return
    }

    if (operation === 'insert') {
      const value = Number(insertValue)
      if (Number.isNaN(value)) return
      if (countNodes() >= maxNodes) {
        setInsertWarning(`Maximum of ${maxNodes} nodes. Remove a node before inserting.`)
        return
      }
      setSteps(stepsForInsert(tree, value), op)
      play()
      return
    }

    if (operation === 'remove') {
      const value = Number(removeValue)
      if (Number.isNaN(value)) return
      setSteps(stepsForRemove(tree, value), op)
      play()
      return
    }

    if (operation === 'search') {
      const value = Number(searchValue)
      if (Number.isNaN(value)) return
      setSteps(stepsForSearch(tree, value), op)
      play()
      return
    }

    setSteps(stepsForTraverse(tree, traverseOrder), op)
    play()
  }

  return (
    <div className="flex flex-col gap-4" role="form" aria-label="Binary search tree operations">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-200">Operation</label>
        <div className="flex flex-wrap gap-2" role="tablist">
          {(['create', 'search', 'insert', 'remove', 'traverse'] as const).map((op) => (
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
        <div>
          <label htmlFor="bst-create-values" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
            Values (comma or space separated, max {maxNodes} nodes)
          </label>
          <input
            id="bst-create-values"
            type="text"
            value={createValues}
            onChange={(e) => {
              setCreateValues(e.target.value)
              setCreateWarning(null)
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono bg-white text-slate-900 placeholder:text-slate-400
                       focus:outline-none focus:ring-2 focus:ring-accent/40
                       dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
            placeholder="e.g. 50, 30, 70, 20, 40"
          />
          {createWarning && (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300" role="status">
              {createWarning}
            </p>
          )}
        </div>
      )}

      {operation === 'insert' && (
        <div>
          <label htmlFor="bst-insert-value" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
            Value
          </label>
          <input
            id="bst-insert-value"
            type="number"
            value={insertValue}
            onChange={(e) => setInsertValue(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900
                       focus:outline-none focus:ring-2 focus:ring-accent/40
                       dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700"
            placeholder="e.g. 25"
          />
          {insertWarning && (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300" role="status">
              {insertWarning}
            </p>
          )}
        </div>
      )}

      {operation === 'remove' && (
        <div>
          <label htmlFor="bst-remove-value" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
            Value to remove
          </label>
          <input
            id="bst-remove-value"
            type="number"
            value={removeValue}
            onChange={(e) => setRemoveValue(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900
                       focus:outline-none focus:ring-2 focus:ring-accent/40
                       dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700"
            placeholder="e.g. 30"
          />
        </div>
      )}

      {operation === 'search' && (
        <div>
          <label htmlFor="bst-search-value" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
            Value
          </label>
          <input
            id="bst-search-value"
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900
                       focus:outline-none focus:ring-2 focus:ring-accent/40
                       dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700"
            placeholder="e.g. 40"
          />
        </div>
      )}

      {operation === 'traverse' && (
        <div>
          <label htmlFor="bst-traverse-order" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
            Order
          </label>
          <select
            id="bst-traverse-order"
            value={traverseOrder}
            onChange={(e) => setTraverseOrder(e.target.value as TraverseOrder)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900
                       focus:outline-none focus:ring-2 focus:ring-accent/40
                       dark:bg-slate-950 dark:text-slate-100 dark:border-slate-700"
          >
            <option value="inorder">In-order</option>
            <option value="preorder">Pre-order</option>
            <option value="postorder">Post-order</option>
          </select>
        </div>
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
