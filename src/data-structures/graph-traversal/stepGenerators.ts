import type { GraphTraversalStep } from './types'
import type { GraphModel } from './GraphModel'

export function generateBfsSteps(graph: GraphModel, startId: string): GraphTraversalStep[] {
  if (!graph.hasNode(startId)) {
    return [{ type: 'done', message: 'Start node is not in the graph.' }]
  }
  const steps: GraphTraversalStep[] = []
  const visited = new Set<string>()
  const queue: string[] = [startId]
  visited.add(startId)
  const visitOrder: string[] = []

  while (queue.length) {
    const u = queue.shift()!
    const queueAfterDequeue = [...queue]
    visitOrder.push(u)
    const neighbors = graph.getSortedNeighbors(u)
    const enqueuedIds: string[] = []
    for (const v of neighbors) {
      if (!visited.has(v)) {
        visited.add(v)
        queue.push(v)
        enqueuedIds.push(v)
      }
    }
    steps.push({
      type: 'visit',
      nodeId: u,
      visitOrder: [...visitOrder],
      frontier: [...queue],
      frontierLabel: 'queue',
      queueAfterDequeue,
      enqueuedIds,
      message: `Dequeue ${graph.getNode(u)?.label ?? u}. ${enqueuedIds.length ? `Enqueue at back: ${enqueuedIds.map((id) => graph.getNode(id)?.label ?? id).join(', ')}.` : 'No new neighbors to enqueue.'} Queue: [${queue.map((id) => graph.getNode(id)?.label ?? id).join(', ')}]`,
    })
  }
  steps.push({ type: 'done', message: 'Breadth-first search complete.' })
  return steps
}

export function generateDfsSteps(graph: GraphModel, startId: string): GraphTraversalStep[] {
  if (!graph.hasNode(startId)) {
    return [{ type: 'done', message: 'Start node is not in the graph.' }]
  }
  const steps: GraphTraversalStep[] = []
  /** Nodes already pushed onto the stack — avoids stacking the same node twice before it is popped (unlike a plain `visited`-on-pop check). */
  const discovered = new Set<string>([startId])
  const stack: string[] = [startId]
  const visitOrder: string[] = []

  while (stack.length) {
    const u = stack.pop()!
    const stackAfterPop = [...stack]
    visitOrder.push(u)
    const neighbors = graph.getSortedNeighbors(u)
    const pushedIds: string[] = []
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const v = neighbors[i]!
      if (!discovered.has(v)) {
        discovered.add(v)
        stack.push(v)
        pushedIds.push(v)
      }
    }
    steps.push({
      type: 'visit',
      nodeId: u,
      visitOrder: [...visitOrder],
      frontier: [...stack],
      frontierLabel: 'stack',
      stackAfterPop,
      pushedIds,
      message: `Pop ${graph.getNode(u)?.label ?? u} from top. ${pushedIds.length ? `Push: ${pushedIds.map((id) => graph.getNode(id)?.label ?? id).join(', ')}.` : 'No unvisited neighbors to push.'} Stack (bottom to top): [${stack.map((id) => graph.getNode(id)?.label ?? id).join(', ')}]`,
    })
  }
  steps.push({ type: 'done', message: 'Depth-first search complete.' })
  return steps
}
