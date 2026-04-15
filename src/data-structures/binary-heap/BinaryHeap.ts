import type { HeapEntry, HeapMode, HeapSnapshot } from './types'

let idCounter = 0

function nextId(): string {
  idCounter += 1
  return `heap-${idCounter}`
}

function syncIdCounter(items: HeapEntry[]): void {
  for (const e of items) {
    const m = /^heap-(\d+)$/.exec(e.id)
    if (m) idCounter = Math.max(idCounter, Number(m[1]))
  }
}

export function parentIndex(i: number): number {
  return Math.floor((i - 1) / 2)
}

export function leftChild(i: number): number {
  return 2 * i + 1
}

export function rightChild(i: number): number {
  return 2 * i + 2
}

export class BinaryHeap {
  mode: HeapMode = 'min'
  items: HeapEntry[] = []

  clear(): void {
    this.items = []
  }

  size(): number {
    return this.items.length
  }

  /** True if a should be closer to the root than b (min: smaller wins; max: larger wins). */
  prefersValue(a: number, b: number): boolean {
    if (this.mode === 'min') return a < b
    return a > b
  }

  /** After swap at child c with parent, should we have swapped? (child beats parent for root position.) */
  shouldBubbleUp(c: number): boolean {
    if (c <= 0) return false
    const p = parentIndex(c)
    return this.prefersValue(this.items[c]!.value, this.items[p]!.value)
  }

  swap(i: number, j: number): void {
    const t = this.items[i]!
    this.items[i] = this.items[j]!
    this.items[j] = t
  }

  append(value: number): void {
    this.items.push({ id: nextId(), value })
  }

  removeLast(): void {
    this.items.pop()
  }

  /** Restore heap property top-down from i. */
  heapifyDown(i: number): void {
    const n = this.items.length
    while (true) {
      let best = i
      const l = leftChild(i)
      const r = rightChild(i)
      if (l < n && this.prefersValue(this.items[l]!.value, this.items[best]!.value)) best = l
      if (r < n && this.prefersValue(this.items[r]!.value, this.items[best]!.value)) best = r
      if (best === i) break
      this.swap(i, best)
      i = best
    }
  }

  rebuildInPlace(): void {
    const n = this.items.length
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapifyDown(i)
    }
  }

  setMode(mode: HeapMode): void {
    if (this.mode === mode) return
    this.mode = mode
    if (this.items.length > 1) this.rebuildInPlace()
  }

  toSnapshot(): HeapSnapshot {
    return {
      mode: this.mode,
      items: this.items.map((e) => ({ id: e.id, value: e.value })),
    }
  }

  setFromSnapshot(s: HeapSnapshot): void {
    this.mode = s.mode
    this.items = s.items.map((e) => ({ id: e.id, value: e.value }))
    syncIdCounter(this.items)
  }

}
