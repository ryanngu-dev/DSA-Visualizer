import type { HeapStep } from './types'
import type { HeapOperation } from './types'

export interface HeapPseudocodeState {
  lines: string[]
  activeLineIndices: number[]
  executedLineIndices: number[]
  description: string
}

function linesForOperation(op: HeapOperation | null): string[] {
  if (!op) return []
  if (op.type === 'insert') {
    return [
      '1. append v at end of array',
      '2. i = last index',
      '3. while i has parent:',
      '4.     if heap property holds: break',
      '5.     swap(i, parent(i)); i = parent(i)',
    ]
  }
  if (op.type === 'extract') {
    return [
      '1. if heap empty: return',
      '2. result = A[0]',
      '3. swap A[0] and A[n-1]',
      '4. remove last element',
      '5. i = 0',
      '6. while i has a child that beats i:',
      '7.     j = best child index',
      '8.     swap(i, j); i = j',
      '9. return result',
    ]
  }
  if (op.type === 'delete') {
    return [
      '1. find index k where A[k] == v',
      '2. if not found: return',
      '3. swap A[k] and A[n-1]',
      '4. remove last element',
      '5. fix heap from k (bubble up and/or sift down)',
    ]
  }
  return []
}

function activeLines(op: HeapOperation | null, step: HeapStep): number[] {
  if (!op) return []
  if (op.type === 'insert') {
    if (step.type === 'append') return [0]
    if (step.type === 'highlight') return [1, 2, 3]
    if (step.type === 'swap') return [4, 5]
    return []
  }
  if (op.type === 'extract') {
    if (step.type === 'highlight') {
      if (step.message?.includes('Sift')) return [5, 6, 7]
      return [1, 2]
    }
    if (step.type === 'swap') {
      if (step.message?.includes('root')) return [2, 3]
      return [7, 8]
    }
    if (step.type === 'removeLast') return [3, 4]
    return []
  }
  if (op.type === 'delete') {
    if (step.type === 'notFound') return [1, 2]
    if (step.type === 'highlight' && step.message?.includes('Search')) return [0, 1]
    if (step.type === 'highlight' && step.message?.includes('Found')) return [0]
    if (step.type === 'highlight' && step.message?.includes('Restore')) return [4]
    if (step.type === 'swap') {
      if (step.message?.includes('last')) return [2]
      return [4]
    }
    if (step.type === 'removeLast') return [3]
    return []
  }
  return []
}

function computeExecuted(
  op: HeapOperation | null,
  allSteps: HeapStep[],
  stepIndex: number
): number[] {
  const set = new Set<number>()
  if (!op) return []
  for (let s = 0; s < stepIndex; s++) {
    const lines = activeLines(op, allSteps[s]!)
    for (const L of lines) set.add(L)
  }
  return Array.from(set).sort((a, b) => a - b)
}

export function getHeapPseudocodeState(
  operation: HeapOperation | null,
  currentStep: HeapStep | null,
  stepIndex: number,
  steps: HeapStep[]
): HeapPseudocodeState {
  const lines = linesForOperation(operation)
  if (lines.length === 0) {
    return { lines: [], activeLineIndices: [], executedLineIndices: [], description: '' }
  }
  const activeLineIndices =
    currentStep && operation ? activeLines(operation, currentStep) : []
  const executedLineIndices = computeExecuted(operation, steps, stepIndex)
  let description = ''
  if (currentStep?.type === 'notFound' && currentStep.message) description = currentStep.message
  return { lines, activeLineIndices, executedLineIndices, description }
}
