import { GraphModel, circleLayout } from './GraphModel'
import type { GraphSnapshot } from './types'

const W = 520
const H = 360

/** Random labeled tree on nodes 0..n-1 with edges (i, parent) for i >= 1. */
export function generateRandomTree(nodeCount: number): GraphSnapshot {
  const positions = circleLayout(nodeCount, W, H)
  const g = new GraphModel()
  for (let i = 0; i < nodeCount; i++) {
    const p = positions[i]!
    g.addNode(String(i), String(i), p.x, p.y)
  }
  for (let i = 1; i < nodeCount; i++) {
    const parent = Math.floor(Math.random() * i)
    g.addEdge(String(i), String(parent))
  }
  return g.toSnapshot()
}

/** Connected graph: random tree plus extra random edges. */
export function generateRandomConnectedGraph(nodeCount: number, extraEdges: number): GraphSnapshot {
  const positions = circleLayout(nodeCount, W, H)
  const g = new GraphModel()
  for (let i = 0; i < nodeCount; i++) {
    const p = positions[i]!
    g.addNode(String(i), String(i), p.x, p.y)
  }
  for (let i = 1; i < nodeCount; i++) {
    const parent = Math.floor(Math.random() * i)
    g.addEdge(String(i), String(parent))
  }
  const maxPairs = (nodeCount * (nodeCount - 1)) / 2
  const existing = g.getEdges().length
  const cap = Math.min(extraEdges, maxPairs - existing)
  let added = 0
  let guard = 0
  while (added < cap && guard < 20000) {
    guard++
    const a = String(Math.floor(Math.random() * nodeCount))
    const b = String(Math.floor(Math.random() * nodeCount))
    if (a === b) continue
    const before = g.getEdges().length
    g.addEdge(a, b)
    if (g.getEdges().length > before) added++
  }
  return g.toSnapshot()
}
