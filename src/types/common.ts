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

export interface StepBase {
  message?: string
}
