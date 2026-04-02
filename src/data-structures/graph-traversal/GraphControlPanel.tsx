import { useState } from 'react'
import { GraphModel } from './GraphModel'
import { generateRandomConnectedGraph } from './graphGenerators'
import type { GraphSnapshot } from './types'

interface GraphControlPanelProps {
  graph: GraphModel
  snapshot: GraphSnapshot
  onGraphChange: (next: GraphSnapshot) => void
  maxNodes?: number
}

/** Defaults for the single "Random graph" action (spanning tree + a few extra edges). */
const RANDOM_GRAPH_NODE_COUNT = 7
const RANDOM_GRAPH_EXTRA_EDGES = 1

export default function GraphControlPanel({
  graph,
  snapshot,
  onGraphChange,
  maxNodes = 14,
}: GraphControlPanelProps) {
  const [edgeFrom, setEdgeFrom] = useState<string>('')
  const [edgeTo, setEdgeTo] = useState<string>('')

  const ids = graph.nodeIds

  const handleRandomGraph = () => {
    const n = Math.max(3, Math.min(RANDOM_GRAPH_NODE_COUNT, maxNodes))
    onGraphChange(generateRandomConnectedGraph(n, RANDOM_GRAPH_EXTRA_EDGES))
  }

  const handleAddEdge = () => {
    if (!edgeFrom || !edgeTo || edgeFrom === edgeTo) return
    const g = new GraphModel(snapshot)
    g.addEdge(edgeFrom, edgeTo)
    onGraphChange(g.toSnapshot())
  }

  const handleRemoveEdge = () => {
    if (!edgeFrom || !edgeTo) return
    const g = new GraphModel(snapshot)
    g.removeEdge(edgeFrom, edgeTo)
    onGraphChange(g.toSnapshot())
  }

  const selectClass =
    'w-full min-w-0 rounded-lg border border-slate-300 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400'

  return (
    <div className="flex flex-col gap-6" role="form" aria-label="Graph editing controls">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">Graph</h3>

        <div className="rounded-xl border border-slate-200/90 bg-gradient-to-b from-slate-50/90 to-white p-4 shadow-sm dark:border-slate-700 dark:from-slate-900/60 dark:to-slate-950/90">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Random connected graph</p>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {Math.min(RANDOM_GRAPH_NODE_COUNT, maxNodes)} nodes, tree plus {RANDOM_GRAPH_EXTRA_EDGES} extra edge.
                Replaces the current graph.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRandomGraph}
              className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Generate
            </button>
          </div>

          <div className="my-5 h-px bg-slate-200/90 dark:bg-slate-700/80" aria-hidden />

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Edges</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Pick two nodes; edges are undirected.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <div className="space-y-1.5">
                <label htmlFor="edge-from" className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  From
                </label>
                <select
                  id="edge-from"
                  value={edgeFrom}
                  onChange={(e) => setEdgeFrom(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Choose node…</option>
                  {ids.map((id) => (
                    <option key={id} value={id}>
                      {graph.getNode(id)?.label ?? id}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="hidden shrink-0 pb-2.5 text-slate-300 dark:text-slate-600 sm:flex sm:items-center sm:justify-center sm:self-end"
                aria-hidden
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="edge-to" className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  To
                </label>
                <select
                  id="edge-to"
                  value={edgeTo}
                  onChange={(e) => setEdgeTo(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Choose node…</option>
                  {ids.map((id) => (
                    <option key={id} value={id}>
                      {graph.getNode(id)?.label ?? id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddEdge}
                className="rounded-lg border border-indigo-200 bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-900 transition-colors hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-100 dark:hover:bg-indigo-950/80"
              >
                Add edge
              </button>
              <button
                type="button"
                onClick={handleRemoveEdge}
                className="rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Remove edge
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200/80 pt-4 text-xs text-slate-500 dark:border-slate-700/80 dark:text-slate-400">
            <span>
              <span className="font-medium text-slate-600 dark:text-slate-300">{snapshot.nodes.length}</span> nodes
            </span>
            <span className="text-slate-300 dark:text-slate-600" aria-hidden>
              ·
            </span>
            <span>
              <span className="font-medium text-slate-600 dark:text-slate-300">{snapshot.edges.length}</span> edges
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
