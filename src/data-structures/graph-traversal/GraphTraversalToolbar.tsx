import type { GraphModel } from './GraphModel'
import type { TraversalKind } from './types'

const segmentShell =
  'inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800/90'

const selectInSegment =
  'min-w-[4.5rem] max-w-[7rem] cursor-pointer rounded-md border-0 bg-white py-2 pl-2.5 pr-7 text-sm font-medium text-slate-800 shadow-sm ring-1 ring-slate-200/90 transition hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:bg-slate-950 dark:text-slate-100 dark:ring-slate-600 dark:hover:ring-slate-500'

interface GraphTraversalToolbarProps {
  graph: GraphModel
  traversal: TraversalKind
  onTraversalChange: (t: TraversalKind) => void
  startId: string
  onStartIdChange: (id: string) => void
  onRun: () => void
  disabled?: boolean
}

export default function GraphTraversalToolbar({
  graph,
  traversal,
  onTraversalChange,
  startId,
  onStartIdChange,
  onRun,
  disabled = false,
}: GraphTraversalToolbarProps) {
  const ids = graph.nodeIds

  const segmentBtn = (t: TraversalKind, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={traversal === t}
      onClick={() => onTraversalChange(t)}
      className={`rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
        traversal === t
          ? 'bg-slate-800 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
          : 'text-slate-600 hover:bg-white/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div
      className="flex w-full flex-wrap items-center justify-start gap-x-3 gap-y-2.5"
      role="toolbar"
      aria-label="Traversal controls"
    >
      <div className={`${segmentShell} gap-1.5 pl-2 pr-1`}>
        <span className="shrink-0 pl-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Start
        </span>
        <select
          id="toolbar-g-start"
          aria-label="Start node"
          value={startId}
          onChange={(e) => onStartIdChange(e.target.value)}
          disabled={ids.length === 0 || disabled}
          className={`${selectInSegment} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {ids.length === 0 ? (
            <option value="">—</option>
          ) : (
            ids.map((id) => (
              <option key={id} value={id}>
                {graph.getNode(id)?.label ?? id}
              </option>
            ))
          )}
        </select>
      </div>

      <div
        className="hidden h-8 w-px shrink-0 bg-slate-200/90 dark:bg-slate-600 sm:block"
        aria-hidden
      />

      <div className={`${segmentShell}`} role="tablist" aria-label="Traversal type">
        {segmentBtn('bfs', 'bfs')}
        {segmentBtn('dfs', 'dfs')}
      </div>

      <button
        type="button"
        onClick={onRun}
        disabled={ids.length === 0 || disabled}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-900"
      >
        Run
      </button>
    </div>
  )
}
