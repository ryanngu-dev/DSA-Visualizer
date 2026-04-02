import type { GraphNodeData, GraphSnapshot } from './types'

function edgeKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

export class GraphModel {
  private nodes = new Map<string, GraphNodeData>()
  /** Undirected edges as normalized keys */
  private edgeKeys = new Set<string>()
  /** Adjacency lists */
  private adj = new Map<string, Set<string>>()

  constructor(snapshot?: GraphSnapshot | null) {
    if (snapshot) this.setFromSnapshot(snapshot)
  }

  get nodeIds(): string[] {
    return [...this.nodes.keys()].sort((a, b) => {
      const na = Number(a)
      const nb = Number(b)
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
      return a.localeCompare(b)
    })
  }

  get nodeCount(): number {
    return this.nodes.size
  }

  hasNode(id: string): boolean {
    return this.nodes.has(id)
  }

  getNode(id: string): GraphNodeData | undefined {
    return this.nodes.get(id)
  }

  getEdges(): { from: string; to: string }[] {
    const out: { from: string; to: string }[] = []
    for (const k of this.edgeKeys) {
      const [a, b] = k.split('|')
      if (a && b) out.push({ from: a, to: b })
    }
    return out
  }

  getSortedNeighbors(id: string): string[] {
    const s = this.adj.get(id)
    if (!s) return []
    return [...s].sort((a, b) => {
      const na = Number(a)
      const nb = Number(b)
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
      return a.localeCompare(b)
    })
  }

  addNode(id: string, label: string, x: number, y: number): void {
    if (this.nodes.has(id)) return
    this.nodes.set(id, { id, label, x, y })
    this.adj.set(id, new Set())
  }

  removeNode(id: string): void {
    if (!this.nodes.has(id)) return
    this.nodes.delete(id)
    this.adj.delete(id)
    for (const k of [...this.edgeKeys]) {
      const [a, b] = k.split('|')
      if (a === id || b === id) this.edgeKeys.delete(k)
    }
    for (const s of this.adj.values()) s.delete(id)
    this.rebuildAdjFromEdges()
  }

  private rebuildAdjFromEdges(): void {
    for (const id of this.nodes.keys()) this.adj.set(id, new Set())
    for (const k of this.edgeKeys) {
      const [a, b] = k.split('|')
      if (a && b && this.nodes.has(a) && this.nodes.has(b)) {
        this.adj.get(a)!.add(b)
        this.adj.get(b)!.add(a)
      }
    }
  }

  addEdge(a: string, b: string): void {
    if (a === b || !this.nodes.has(a) || !this.nodes.has(b)) return
    const k = edgeKey(a, b)
    if (this.edgeKeys.has(k)) return
    this.edgeKeys.add(k)
    this.adj.get(a)!.add(b)
    this.adj.get(b)!.add(a)
  }

  removeEdge(a: string, b: string): void {
    const k = edgeKey(a, b)
    this.edgeKeys.delete(k)
    this.adj.get(a)?.delete(b)
    this.adj.get(b)?.delete(a)
  }

  clear(): void {
    this.nodes.clear()
    this.edgeKeys.clear()
    this.adj.clear()
  }

  toSnapshot(): GraphSnapshot {
    const nodes = [...this.nodes.values()].sort((a, b) => {
      const na = Number(a.id)
      const nb = Number(b.id)
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
      return a.id.localeCompare(b.id)
    })
    return { nodes, edges: this.getEdges() }
  }

  setFromSnapshot(s: GraphSnapshot): void {
    this.clear()
    for (const n of s.nodes) {
      this.nodes.set(n.id, { ...n })
      this.adj.set(n.id, new Set())
    }
    for (const e of s.edges) {
      const k = edgeKey(e.from, e.to)
      this.edgeKeys.add(k)
      if (!this.adj.has(e.from)) this.adj.set(e.from, new Set())
      if (!this.adj.has(e.to)) this.adj.set(e.to, new Set())
      this.adj.get(e.from)!.add(e.to)
      this.adj.get(e.to)!.add(e.from)
    }
  }

  clone(): GraphModel {
    return new GraphModel(this.toSnapshot())
  }
}
/** Place `count` nodes on a circle centered in the given box. */
export function circleLayout(count: number, width: number, height: number): { x: number; y: number }[] {
  const cx = width / 2
  const cy = height / 2
  const r = Math.min(width, height) * 0.36
  const positions: { x: number; y: number }[] = []
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2
    positions.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    })
  }
  return positions
}

