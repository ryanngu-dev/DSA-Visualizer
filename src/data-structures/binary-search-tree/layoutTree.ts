import type { BSTSnapshotNode } from './types'

export interface LayoutNode {
  id: string
  value: number
  x: number
  y: number
}

export interface LayoutResult {
  nodes: LayoutNode[]
  edges: { from: string; to: string }[]
  width: number
  height: number
}

const DEFAULT_H = 64
const DEFAULT_V = 80

export function layoutTree(
  root: BSTSnapshotNode | null,
  hSpacing = DEFAULT_H,
  vSpacing = DEFAULT_V
): LayoutResult {
  if (!root) {
    return { nodes: [], edges: [], width: 320, height: 200 }
  }

  const nodes: LayoutNode[] = []
  const edges: { from: string; to: string }[] = []
  let inorderIndex = 0

  function walk(n: BSTSnapshotNode | null, depth: number) {
    if (!n) return
    walk(n.left, depth + 1)
    nodes.push({
      id: n.id,
      value: n.value,
      x: inorderIndex * hSpacing,
      y: depth * vSpacing,
    })
    inorderIndex++
    walk(n.right, depth + 1)
  }
  walk(root, 0)

  function collectEdges(n: BSTSnapshotNode | null, parent: BSTSnapshotNode | null) {
    if (!n) return
    if (parent) edges.push({ from: parent.id, to: n.id })
    collectEdges(n.left, n)
    collectEdges(n.right, n)
  }
  collectEdges(root, null)

  const xs = nodes.map((n) => n.x)
  const ys = nodes.map((n) => n.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const maxY = Math.max(...ys)
  const pad = 48
  const nodeR = 26
  const width = Math.max(320, maxX - minX + nodeR * 2 + pad * 2)
  const height = Math.max(200, maxY + nodeR * 2 + pad * 2)

  const offsetX = pad + nodeR - minX
  const offsetY = pad + nodeR

  const shifted = nodes.map((n) => ({
    ...n,
    x: n.x + offsetX,
    y: n.y + offsetY,
  }))

  return {
    nodes: shifted,
    edges,
    width,
    height,
  }
}

export function findNodeIdByValue(root: BSTSnapshotNode | null, value: number): string | null {
  let curr = root
  while (curr) {
    if (value === curr.value) return curr.id
    curr = value < curr.value ? curr.left : curr.right
  }
  return null
}
