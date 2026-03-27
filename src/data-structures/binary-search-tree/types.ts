/**
 * Binary search tree types and visualization step API.
 */

export interface BSTNode {
  id: string
  value: number
  left: BSTNode | null
  right: BSTNode | null
}

/** Serializable tree for snapshots (same shape as BSTNode). */
export interface BSTSnapshotNode {
  id: string
  value: number
  left: BSTSnapshotNode | null
  right: BSTSnapshotNode | null
}

export type TraverseOrder = 'inorder' | 'preorder' | 'postorder'

export type BSTStep =
  | { type: 'clear'; message?: string }
  | { type: 'highlight'; nodeId: string; message?: string }
  | { type: 'insert'; value: number; message?: string }
  | { type: 'remove'; value: number; message?: string }
  | { type: 'visit'; nodeId: string; message?: string }
  | { type: 'found'; nodeId: string; message?: string }
  | { type: 'notFound'; message?: string }
  | { type: 'done'; message?: string }

export type BSTOperation =
  | { type: 'create'; values: number[] }
  | { type: 'insert'; value: number }
  | { type: 'remove'; value: number }
  | { type: 'search'; value: number }
  | { type: 'traverse'; order: TraverseOrder }
