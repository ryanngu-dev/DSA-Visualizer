import type { HashMapOperation, HashMapStep } from './types'

export interface HashMapPseudocodeState {
  lines: string[]
  activeLineIndices: number[]
  executedLineIndices: number[]
  description: string
}

function getPseudocode(op: HashMapOperation | null): string[] {
  if (!op) return []
  if (op.type === 'create') return ['1. clear map', '2. for each x in values:', '3.     insert(x)']
  if (op.type === 'insert')
    return ['1. i = value mod 6', '2. if value exists in bucket i: stop', '3. else append value to bucket i']
  if (op.type === 'search') return ['1. i = value mod 6', '2. scan bucket i for value', '3. report found or not found']
  if (op.type === 'remove') return ['1. i = value mod 6', '2. scan bucket i', '3. if found remove value; else no-op']
  return []
}

function linesForStep(op: HashMapOperation | null, step: HashMapStep): number[] {
  if (!op) return []
  if (op.type === 'create') {
    if (step.type === 'clear') return [0]
    if (step.type === 'highlightBucket' || step.type === 'upsert') return [1, 2]
    return []
  }
  if (op.type === 'insert') {
    if (step.type === 'highlightBucket') return [0]
    if (step.type === 'upsert') return [1, 2]
    return []
  }
  if (op.type === 'search') {
    if (step.type === 'highlightBucket') return [0]
    if (step.type === 'probe') return [1]
    if (step.type === 'found' || step.type === 'notFound') return [1, 2]
    return []
  }
  if (op.type === 'remove') {
    if (step.type === 'highlightBucket') return [0]
    if (step.type === 'remove' || step.type === 'notFound') return [1, 2]
    return []
  }
  return []
}

function computeExecuted(op: HashMapOperation | null, steps: HashMapStep[], stepIndex: number): number[] {
  const set = new Set<number>()
  for (let i = 0; i < stepIndex; i++) {
    linesForStep(op, steps[i]!).forEach((line) => set.add(line))
  }
  return Array.from(set)
}

export function getHashMapPseudocodeState(
  operation: HashMapOperation | null,
  currentStep: HashMapStep | null,
  stepIndex: number,
  allSteps?: HashMapStep[]
): HashMapPseudocodeState {
  const lines = getPseudocode(operation)
  if (!operation || !currentStep || lines.length === 0) {
    return { lines, activeLineIndices: [], executedLineIndices: [], description: '' }
  }

  const executedLineIndices = allSteps && stepIndex > 0 ? computeExecuted(operation, allSteps, stepIndex) : []
  if (currentStep.type === 'done') {
    return {
      lines,
      activeLineIndices: [],
      executedLineIndices: Array.from({ length: lines.length }, (_, i) => i),
      description: currentStep.message ?? '',
    }
  }

  return {
    lines,
    activeLineIndices: linesForStep(operation, currentStep),
    executedLineIndices,
    description: currentStep.message ?? '',
  }
}
