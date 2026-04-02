/**
 * Shared types for any data structure visualizer.
 */

export type DataStructureId = 'linked-list' | 'binary-search-tree' | 'graph-traversal'

export interface StepBase {
  message?: string
}
