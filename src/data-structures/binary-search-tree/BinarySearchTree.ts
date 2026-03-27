import type { BSTNode, BSTSnapshotNode } from './types'
import type { TraverseOrder } from './types'

let nodeIdCounter = 0

function nextId(): string {
  nodeIdCounter += 1
  return `bst-${nodeIdCounter}`
}

function syncIdCounterFromTree(n: BSTNode | null): void {
  const walk = (node: BSTNode | null) => {
    if (!node) return
    const m = /^bst-(\d+)$/.exec(node.id)
    if (m) nodeIdCounter = Math.max(nodeIdCounter, Number(m[1]))
    walk(node.left)
    walk(node.right)
  }
  walk(n)
}

export class BinarySearchTree {
  root: BSTNode | null = null

  clear(): void {
    this.root = null
  }

  /** Returns true if a new node was inserted. */
  insert(value: number): boolean {
    if (!this.root) {
      this.root = { id: nextId(), value, left: null, right: null }
      return true
    }
    let curr = this.root
    while (true) {
      if (value < curr.value) {
        if (!curr.left) {
          curr.left = { id: nextId(), value, left: null, right: null }
          return true
        }
        curr = curr.left
      } else if (value > curr.value) {
        if (!curr.right) {
          curr.right = { id: nextId(), value, left: null, right: null }
          return true
        }
        curr = curr.right
      } else {
        return false
      }
    }
  }

  private findMinNode(node: BSTNode): BSTNode {
    let n = node
    while (n.left) n = n.left
    return n
  }

  contains(value: number): boolean {
    let c = this.root
    while (c) {
      if (value === c.value) return true
      c = value < c.value ? c.left : c.right
    }
    return false
  }

  remove(value: number): boolean {
    if (!this.contains(value)) return false
    this.root = this.removeNode(this.root, value)
    return true
  }

  private removeNode(node: BSTNode | null, value: number): BSTNode | null {
    if (!node) return null
    if (value < node.value) {
      node.left = this.removeNode(node.left, value)
      return node
    }
    if (value > node.value) {
      node.right = this.removeNode(node.right, value)
      return node
    }
    if (!node.left && !node.right) return null
    if (!node.left) return node.right
    if (!node.right) return node.left
    const succ = this.findMinNode(node.right)
    const succVal = succ.value
    node.right = this.removeNode(node.right, succVal)
    node.value = succVal
    return node
  }

  /** Collect node ids for inorder / preorder / postorder traversal. */
  collectOrder(order: TraverseOrder): string[] {
    const out: string[] = []
    const inorder = (n: BSTNode | null) => {
      if (!n) return
      inorder(n.left)
      out.push(n.id)
      inorder(n.right)
    }
    const preorder = (n: BSTNode | null) => {
      if (!n) return
      out.push(n.id)
      preorder(n.left)
      preorder(n.right)
    }
    const postorder = (n: BSTNode | null) => {
      if (!n) return
      postorder(n.left)
      postorder(n.right)
      out.push(n.id)
    }
    if (order === 'inorder') inorder(this.root)
    else if (order === 'preorder') preorder(this.root)
    else postorder(this.root)
    return out
  }

  toSnapshot(): BSTSnapshotNode | null {
    const ser = (n: BSTNode | null): BSTSnapshotNode | null => {
      if (!n) return null
      return {
        id: n.id,
        value: n.value,
        left: ser(n.left),
        right: ser(n.right),
      }
    }
    return ser(this.root)
  }

  setFromSnapshot(s: BSTSnapshotNode | null): void {
    const des = (sn: BSTSnapshotNode | null): BSTNode | null => {
      if (!sn) return null
      return {
        id: sn.id,
        value: sn.value,
        left: des(sn.left),
        right: des(sn.right),
      }
    }
    this.root = des(s)
    syncIdCounterFromTree(this.root)
  }

  /** Search path: node ids from root to target (inclusive if found), or full descent if not found. */
  searchPath(value: number): { ids: string[]; found: boolean; lastId: string | null } {
    const ids: string[] = []
    let curr = this.root
    while (curr) {
      ids.push(curr.id)
      if (value === curr.value) return { ids, found: true, lastId: curr.id }
      curr = value < curr.value ? curr.left : curr.right
    }
    const lastId = ids.length > 0 ? ids[ids.length - 1]! : null
    return { ids, found: false, lastId }
  }

  findNodeById(id: string): BSTNode | null {
    const walk = (n: BSTNode | null): BSTNode | null => {
      if (!n) return null
      if (n.id === id) return n
      return walk(n.left) ?? walk(n.right)
    }
    return walk(this.root)
  }
}
