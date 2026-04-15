import type { QueueSnapshot, QueueEntry } from './types'

let nextId = 1
function newId() {
  return `queue-${nextId++}`
}

export class Queue {
  private items: QueueEntry[] = []

  clear(): void {
    this.items = []
  }

  enqueue(value: number): void {
    this.items.push({ id: newId(), value })
  }

  dequeue(): QueueEntry | null {
    return this.items.shift() ?? null
  }

  peek(): QueueEntry | null {
    return this.items[0] ?? null
  }

  size(): number {
    return this.items.length
  }

  toSnapshot(): QueueSnapshot {
    return { items: this.items.map((item) => ({ ...item })) }
  }

  setFromSnapshot(snapshot: QueueSnapshot): void {
    this.items = snapshot.items.map((item) => ({ ...item }))
  }
}
