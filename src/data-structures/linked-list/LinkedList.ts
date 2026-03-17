import type { ListNode, NodeSnapshot } from './types'

let nodeIdCounter = 0
function nextId(): string {
  nodeIdCounter += 1
  return `node-${nodeIdCounter}`
}

function createNode(value: number, next: ListNode | null, id: string): ListNode {
  return { value, next, id }
}

export class LinkedList {
  head: ListNode | null = null
  tail: ListNode | null = null

  /** Returns current nodes as array for rendering. */
  toArray(): NodeSnapshot[] {
    const out: NodeSnapshot[] = []
    let curr = this.head
    while (curr) {
      out.push({ id: curr.id, value: curr.value })
      curr = curr.next
    }
    return out
  }

  insertHead(value: number): void {
    const node: ListNode = { value, next: this.head, id: nextId() }
    this.head = node
    if (!this.tail) this.tail = node
  }

  insertTail(value: number): void {
    const node: ListNode = createNode(value, null, nextId())
    if (!this.head) {
      this.head = this.tail = node
      return
    }
    this.tail!.next = node
    this.tail = node
  }

  /** Append a node with a specific id (for restoring snapshot with stable ids). */
  insertTailWithId(value: number, id: string): void {
    const node: ListNode = createNode(value, null, id)
    if (!this.head) {
      this.head = this.tail = node
      return
    }
    this.tail!.next = node
    this.tail = node
  }

  insertAt(index: number, value: number): void {
    if (index <= 0) {
      this.insertHead(value)
      return
    }
    let i = 0
    let curr = this.head
    while (curr && i < index - 1) {
      curr = curr.next
      i += 1
    }
    if (!curr) {
      this.insertTail(value)
      return
    }
    const node: ListNode = { value, next: curr.next, id: nextId() }
    curr.next = node
    if (curr === this.tail) this.tail = node
  }

  removeAt(index: number): boolean {
    if (!this.head || index < 0) return false
    if (index === 0) {
      this.head = this.head.next
      if (!this.head) this.tail = null
      return true
    }
    let i = 0
    let curr = this.head
    while (curr.next && i < index - 1) {
      curr = curr.next
      i += 1
    }
    if (!curr.next) return false
    curr.next = curr.next.next
    if (!curr.next) this.tail = curr
    return true
  }

  removeByValue(value: number): boolean {
    if (!this.head) return false
    if (this.head.value === value) {
      this.head = this.head.next
      if (!this.head) this.tail = null
      return true
    }
    let curr = this.head
    while (curr.next && curr.next.value !== value) {
      curr = curr.next
    }
    if (!curr.next) return false
    curr.next = curr.next.next
    if (!curr.next) this.tail = curr
    return true
  }

  /** Returns index of first occurrence of value, or -1. */
  search(value: number): number {
    let curr = this.head
    let index = 0
    while (curr) {
      if (curr.value === value) return index
      curr = curr.next
      index += 1
    }
    return -1
  }

  get length(): number {
    return this.toArray().length
  }

  /** Clear the list. */
  clear(): void {
    this.head = this.tail = null
  }

  /** Replace list contents with values (e.g. for reset after a run). */
  setFromArray(values: number[]): void {
    this.clear()
    for (const v of values) this.insertTail(v)
  }

  /** Replace list from snapshot so node ids stay stable (prevents re-mount glitches). */
  setFromSnapshot(snapshots: NodeSnapshot[]): void {
    this.clear()
    for (const s of snapshots) this.insertTailWithId(s.value, s.id)
  }
}
