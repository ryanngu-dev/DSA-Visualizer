import type { GraphTraversalStep } from './types'
import type { GraphOperation } from './types'

export interface PseudocodeState {
  lines: string[]
  activeLineIndices: number[]
  executedLineIndices: number[]
  description: string
}

function linesForOp(op: GraphOperation | null): string[] {
  if (!op || op.type !== 'traverse') return []
  if (op.traversal === 'bfs') {
    return [
      '1. visited = ∅',
      '2. queue = [ start ]',
      '3. mark start as visited',
      '4. while queue is not empty:',
      '5.   u = dequeue front',
      '6.   process / visit u',
      '7.   for each neighbor v of u:',
      '8.     if v not visited:',
      '9.       mark v visited',
      '10.      enqueue v',
    ]
  }
  return [
    '1. visited = ∅',
    '2. stack = [ start ]',
    '3. while stack is not empty:',
    '4.   u = pop stack',
    '5.   if u already visited: continue',
    '6.   mark u visited; process / visit u',
    '7.   for each neighbor v of u (reverse order):',
    '8.     if v not visited:',
    '9.       push v onto stack',
  ]
}

function activeLines(
  op: GraphOperation | null,
  step: GraphTraversalStep
): number[] {
  if (!op || op.type !== 'traverse') return []
  if (step.type === 'done') return []
  if (step.type !== 'visit') return []
  if (op.traversal === 'bfs') {
    return [3, 4, 5, 6, 7, 8, 9, 10]
  }
  return [2, 3, 4, 5, 6, 7, 8, 9]
}

function computeExecuted(
  op: GraphOperation | null,
  allSteps: GraphTraversalStep[],
  stepIndex: number
): number[] {
  const set = new Set<number>()
  for (let j = 0; j < stepIndex; j++) {
    activeLines(op, allSteps[j]!).forEach((i) => set.add(i))
  }
  return Array.from(set)
}

export function getGraphPseudocodeState(
  op: GraphOperation | null,
  step: GraphTraversalStep | null,
  stepIndex: number,
  allSteps?: GraphTraversalStep[]
): PseudocodeState {
  const lines = linesForOp(op)
  const empty = { lines, activeLineIndices: [] as number[], executedLineIndices: [] as number[], description: '' }
  if (!op || lines.length === 0 || !step) {
    return empty
  }

  const executedLineIndices = allSteps && stepIndex > 0 ? computeExecuted(op, allSteps, stepIndex) : []

  if (step.type === 'visit') {
    return {
      lines,
      activeLineIndices: op.traversal === 'bfs' ? [4, 5, 6] : [3, 4, 5, 6],
      executedLineIndices,
      description: op.traversal === 'bfs' ? 'Dequeue the next vertex and expand its unvisited neighbors.' : 'Pop the next vertex; push unvisited neighbors.',
    }
  }
  if (step.type === 'done') {
    const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
    return {
      lines,
      activeLineIndices: [],
      executedLineIndices: allExecuted,
      description: 'Traversal finished.',
    }
  }

  return { lines, activeLineIndices: [], executedLineIndices, description: '' }
}
