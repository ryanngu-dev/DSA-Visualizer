import type { StackOperation } from './types'
import type { StackStep } from './types'

export interface StackPseudocodeState {
  lines: string[]
  activeLineIndices: number[]
  executedLineIndices: number[]
  description: string
}

function getPseudocode(op: StackOperation | null): string[] {
  if (!op) return []
  if (op.type === 'create') return ['1. clear stack', '2. for each v in A:', '3.     push(v)']
  if (op.type === 'push') return ['1. if stack is full: return overflow', '2. top = top + 1', '3. S[top] = value']
  if (op.type === 'pop')
    return ['1. if stack is empty: return underflow', '2. value = S[top]', '3. top = top - 1', '4. return value']
  if (op.type === 'peek') return ['1. if stack is empty: return underflow', '2. return S[top]']
  if (op.type === 'clear') return ['1. top = -1', '2. stack is now empty']
  return []
}

function linesForStep(op: StackOperation | null, step: StackStep): number[] {
  if (!op) return []
  if (step.type === 'underflow') return [0]
  if (op.type === 'create') {
    if (step.type === 'clear') return [0]
    if (step.type === 'push') return [1, 2]
    return []
  }
  if (op.type === 'push') {
    if (step.type === 'push') return [1, 2]
    return []
  }
  if (op.type === 'pop') {
    if (step.type === 'highlightTop') return [1]
    if (step.type === 'pop') return [2, 3]
    return []
  }
  if (op.type === 'peek') {
    if (step.type === 'highlightTop') return [1]
    return []
  }
  if (op.type === 'clear') {
    if (step.type === 'clear') return [0, 1]
    return []
  }
  return []
}

function computeExecuted(op: StackOperation | null, allSteps: StackStep[], stepIndex: number): number[] {
  const set = new Set<number>()
  for (let i = 0; i < stepIndex; i++) {
    for (const line of linesForStep(op, allSteps[i]!)) {
      set.add(line)
    }
  }
  return Array.from(set)
}

export function getStackPseudocodeState(
  op: StackOperation | null,
  step: StackStep | null,
  stepIndex: number,
  allSteps?: StackStep[]
): StackPseudocodeState {
  const lines = getPseudocode(op)
  if (!op || lines.length === 0 || !step) {
    return { lines, activeLineIndices: [], executedLineIndices: [], description: '' }
  }

  const executedLineIndices = allSteps && stepIndex > 0 ? computeExecuted(op, allSteps, stepIndex) : []

  if (step.type === 'done') {
    return {
      lines,
      activeLineIndices: [],
      executedLineIndices: Array.from({ length: lines.length }, (_, i) => i),
      description: step.message ?? '',
    }
  }

  return {
    lines,
    activeLineIndices: linesForStep(op, step),
    executedLineIndices,
    description: step.message ?? '',
  }
}
