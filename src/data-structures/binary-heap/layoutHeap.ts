import type { BSTSnapshotNode } from '../binary-search-tree/types'
import type { HeapSnapshot } from './types'
import { layoutTree } from '../binary-search-tree/layoutTree'

/** Map array heap (index i → children 2i+1, 2i+2) to a binary tree for shared layout. */
export function heapSnapshotToTree(snapshot: HeapSnapshot | null): BSTSnapshotNode | null {
  if (!snapshot || snapshot.items.length === 0) return null
  const { items } = snapshot

  function build(i: number): BSTSnapshotNode | null {
    if (i >= items.length) return null
    const e = items[i]!
    return {
      id: e.id,
      value: e.value,
      left: build(2 * i + 1),
      right: build(2 * i + 2),
    }
  }

  return build(0)
}

export function layoutHeapSnapshot(snapshot: HeapSnapshot | null) {
  const layout = layoutTree(heapSnapshotToTree(snapshot))

  if (layout.nodes.length === 0) return layout

  const rootId = snapshot?.items[0]?.id
  const rootNode = rootId ? layout.nodes.find((node) => node.id === rootId) : null
  const rootX = rootNode?.x ?? layout.nodes[0]!.x
  const nodeRadius = 26
  const horizontalPad = 48
  const farthestFromRoot = Math.max(...layout.nodes.map((node) => Math.abs(node.x - rootX)))
  const minHalfWidth = farthestFromRoot + nodeRadius + horizontalPad
  const width = Math.max(layout.width, minHalfWidth * 2)
  const viewportCenterX = width / 2
  const shiftX = viewportCenterX - rootX

  return {
    ...layout,
    width,
    nodes: layout.nodes.map((node) => ({
      ...node,
      x: node.x + shiftX,
    })),
  }
}
