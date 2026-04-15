import type { StackSnapshot } from './types'
import type { StackEntry } from './types'

let nextId = 1
function newId() {
  return `stack-${nextId++}`
}

export class Stack {
  private items: StackEntry[] = []

  clear(): void {
    this.items = []
  }

  push(value: number): void {
    this.items.push({ id: newId(), value })
  }

  pop(): StackEntry | null {
    return this.items.pop() ?? null
  }

  peek(): StackEntry | null {
    return this.items[this.items.length - 1] ?? null
  }

  size(): number {
    return this.items.length
  }

  toSnapshot(): StackSnapshot {
    return { items: this.items.map((item) => ({ ...item })) }
  }

  setFromSnapshot(snapshot: StackSnapshot): void {
    this.items = snapshot.items.map((item) => ({ ...item }))
  }
}
