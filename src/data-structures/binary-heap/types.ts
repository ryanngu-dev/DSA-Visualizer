/**
 * Binary heap (array-based) types and visualization step API.
 */

export type HeapMode = 'min' | 'max'

export interface HeapEntry {
  id: string
  value: number
}

export interface HeapSnapshot {
  mode: HeapMode
  items: HeapEntry[]
}

export type HeapStep =
  | { type: 'clear'; message?: string }
  | { type: 'highlight'; index: number; message?: string }
  | { type: 'append'; value: number; message?: string }
  | { type: 'swap'; i: number; j: number; message?: string }
  | { type: 'removeLast'; message?: string }
  | { type: 'notFound'; message?: string }
  | { type: 'done'; message?: string }

export type HeapOperation =
  | { type: 'insert'; value: number }
  | { type: 'extract'; mode: HeapMode }
  | { type: 'delete'; value: number }
