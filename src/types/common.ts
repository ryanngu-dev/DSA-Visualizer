/**
 * Shared types for any data structure visualizer.
 */

export type DataStructureId =
  | 'linked-list'
  | 'binary-search-tree'
  | 'binary-heap'
  | 'graph-traversal'
  | 'stack'
  | 'queue'
  | 'hash-map'

export interface StepBase {
  message?: string
}
