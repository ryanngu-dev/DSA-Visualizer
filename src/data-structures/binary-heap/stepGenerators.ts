import { BinaryHeap, leftChild, parentIndex, rightChild } from './BinaryHeap'
import type { HeapStep } from './types'

const DEFAULT_MAX = 15

function cloneHeap(h: BinaryHeap): BinaryHeap {
  const c = new BinaryHeap()
  c.setFromSnapshot(h.toSnapshot())
  return c
}

export function stepsForInsert(tree: BinaryHeap, value: number, maxNodes = DEFAULT_MAX): HeapStep[] {
  const h = cloneHeap(tree)
  if (h.size() >= maxNodes) {
    return [{ type: 'done', message: `Heap is limited to ${maxNodes} elements for readability.` }]
  }

  const steps: HeapStep[] = []
  steps.push({ type: 'append', value, message: `Append ${value} at the next leaf position` })
  h.append(value)
  let i = h.size() - 1
  while (i > 0) {
    const p = parentIndex(i)
    steps.push({
      type: 'highlight',
      index: i,
      message: `Bubble up: index ${i} vs parent ${p}`,
    })
    if (!h.shouldBubbleUp(i)) break
    steps.push({ type: 'swap', i, j: p, message: 'Swap with parent' })
    h.swap(i, p)
    i = p
  }
  steps.push({ type: 'done', message: `Inserted ${value}` })
  return steps
}

export function stepsForExtract(tree: BinaryHeap): HeapStep[] {
  const h = cloneHeap(tree)
  const n = h.size()
  if (n === 0) {
    return [{ type: 'done', message: 'Heap is empty' }]
  }
  const label = h.mode === 'min' ? 'minimum' : 'maximum'
  if (n === 1) {
    const v = h.items[0]!.value
    return [
      { type: 'highlight', index: 0, message: `Extract ${label} (root)` },
      { type: 'removeLast', message: 'Remove root' },
      { type: 'done', message: `Extracted ${v}` },
    ]
  }

  const extracted = h.items[0]!.value
  const steps: HeapStep[] = [
    { type: 'highlight', index: 0, message: `Extract ${label} (root)` },
    { type: 'swap', i: 0, j: n - 1, message: 'Swap root with last element' },
    { type: 'removeLast', message: 'Shrink heap (remove former root)' },
  ]
  h.swap(0, n - 1)
  h.removeLast()

  let i = 0
  while (true) {
    let best = i
    const l = leftChild(i)
    const r = rightChild(i)
    const size = h.size()
    if (l < size && h.prefersValue(h.items[l]!.value, h.items[best]!.value)) best = l
    if (r < size && h.prefersValue(h.items[r]!.value, h.items[best]!.value)) best = r
    if (best === i) break
    const childLabel = h.mode === 'min' ? 'prefer smaller child' : 'prefer larger child'
    steps.push({
      type: 'highlight',
      index: best,
      message: `Sift down at ${i}: ${childLabel} (${best})`,
    })
    steps.push({ type: 'swap', i, j: best, message: 'Swap with preferred child' })
    h.swap(i, best)
    i = best
  }
  steps.push({ type: 'done', message: `Extracted ${extracted}` })
  return steps
}

export function stepsForDeleteByValue(tree: BinaryHeap, value: number): HeapStep[] {
  const h = cloneHeap(tree)
  const steps: HeapStep[] = []
  let idx = -1
  for (let j = 0; j < h.size(); j++) {
    steps.push({
      type: 'highlight',
      index: j,
      message: `Search for ${value} — check index ${j}`,
    })
    if (h.items[j]!.value === value) {
      idx = j
      break
    }
  }
  if (idx < 0) {
    steps.push({ type: 'notFound', message: `${value} not in heap` })
    return steps
  }

  const n = h.size()
  if (n === 1) {
    steps.push({ type: 'removeLast', message: `Remove ${value}` })
    steps.push({ type: 'done', message: `Deleted ${value}` })
    return steps
  }

  steps.push({ type: 'highlight', index: idx, message: `Found ${value} at index ${idx}` })
  steps.push({ type: 'swap', i: idx, j: n - 1, message: 'Swap with last element' })
  steps.push({ type: 'removeLast', message: 'Remove last position' })
  h.swap(idx, n - 1)
  h.removeLast()

  if (idx >= h.size()) {
    steps.push({ type: 'done', message: `Deleted ${value}` })
    return steps
  }

  let i = idx
  while (i > 0 && h.shouldBubbleUp(i)) {
    const p = parentIndex(i)
    steps.push({
      type: 'highlight',
      index: i,
      message: `Restore heap: bubble up from ${i}`,
    })
    steps.push({ type: 'swap', i, j: p, message: 'Swap with parent' })
    h.swap(i, p)
    i = p
  }

  while (true) {
    let best = i
    const l = leftChild(i)
    const r = rightChild(i)
    const size = h.size()
    if (l < size && h.prefersValue(h.items[l]!.value, h.items[best]!.value)) best = l
    if (r < size && h.prefersValue(h.items[r]!.value, h.items[best]!.value)) best = r
    if (best === i) break
    steps.push({
      type: 'highlight',
      index: best,
      message: `Restore heap: sift down from ${i}`,
    })
    steps.push({ type: 'swap', i, j: best, message: 'Swap with preferred child' })
    h.swap(i, best)
    i = best
  }

  steps.push({ type: 'done', message: `Deleted ${value}` })
  return steps
}
