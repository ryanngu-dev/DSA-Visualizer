/**
 * Linked list types and visualization step API.
 */

export interface ListNode {
  value: number
  next: ListNode | null
  id: string
}

/** Snapshot of a node for rendering (value + id for keys). */
export interface NodeSnapshot {
  id: string
  value: number
}

/** Step types for visualization. Runner applies mutations when it sees insert/remove steps. */
export type LinkedListStep =
  | { type: 'highlight'; index: number; message?: string }
  | { type: 'createClear'; message?: string }
  | { type: 'insertHead'; value: number; message?: string }
  | { type: 'insertTail'; value: number; message?: string }
  | { type: 'insertAt'; index: number; value: number; message?: string }
  | { type: 'reroute'; index: number; message?: string }
  | { type: 'removeAt'; index: number; message?: string }
  | { type: 'removeByValue'; value: number; message?: string }
  | { type: 'found'; index: number; message?: string }
  | { type: 'notFound'; message?: string }
  | { type: 'done'; message?: string }

export type InsertPosition = 'head' | 'tail' | 'index'
export type RemoveMode = 'index' | 'value'

/** Visual role for a node in the list (styling only). */
export type NodeRole = 'normal' | 'current' | 'found' | 'removing'

/** A single node to render. Each node is its own object. */
export interface VisualNode {
  type: 'node'
  id: string
  value: number
  role: NodeRole
}

/** Arrow kind: head (head→first), normal (node→node), bypass (prev→next over deleted), toNone (last→none). */
export type ArrowKind = 'head' | 'normal' | 'bypass' | 'toNone'

/** A single arrow to render. Each arrow is its own object. */
export interface VisualArrow {
  type: 'arrow'
  id: string
  kind: ArrowKind
  /** Highlight draw-in (e.g. during traverse) */
  animate?: boolean
  /** On create: animate in after the node (node appears first, then this arrow) */
  delayEnter?: boolean
}

/** Segment shown during reroute/remove: curved bypass + the node being removed. When morphToStraight, animate path to straight. */
export interface VisualBypassSegment {
  type: 'bypass'
  id: string
  removingNode: NodeSnapshot
  morphToStraight?: boolean
}

export type VisualElement = VisualNode | VisualArrow | VisualBypassSegment
