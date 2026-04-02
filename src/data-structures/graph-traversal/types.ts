/**
 * Graph traversal visualization types.
 */

export type TraversalKind = 'bfs' | 'dfs'

export type GraphTraversalStep =
  | {
      type: 'visit'
      nodeId: string
      visitOrder: string[]
      frontier: string[]
      frontierLabel: 'queue' | 'stack'
      message?: string
      /** BFS only: queue contents right after dequeuing `nodeId`, before enqueueing neighbors. */
      queueAfterDequeue?: string[]
      /** BFS only: neighbors appended to the tail in this step (in order). */
      enqueuedIds?: string[]
      /** DFS only: stack contents right after popping `nodeId`, before pushing neighbors. */
      stackAfterPop?: string[]
      /** DFS only: neighbors pushed onto the stack in this step (order: first push … last push; last = top). */
      pushedIds?: string[]
    }
  | { type: 'done'; message?: string }

export interface GraphNodeData {
  id: string
  label: string
  x: number
  y: number
}

export interface GraphSnapshot {
  nodes: GraphNodeData[]
  edges: { from: string; to: string }[]
}

export type GraphOperation =
  | { type: 'traverse'; traversal: TraversalKind; startId: string }
