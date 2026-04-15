import type { QueueOperation, QueueStep } from './types'

export interface QueuePseudocodeState {
  lines: string[]
  activeLineIndices: number[]
  executedLineIndices: number[]
  description: string
}

function getPseudocode(op: QueueOperation | null): string[] {
  if (!op) return []
  if (op.type === 'create') return ['1. clear queue', '2. for each v in A:', '3.     enqueue(v)']
  if (op.type === 'enqueue')
    return ['1. if queue is full: return overflow', '2. rear = rear + 1', '3. Q[rear] = value']
  if (op.type === 'dequeue')
    return ['1. if queue is empty: return underflow', '2. value = Q[front]', '3. front = front + 1', '4. return value']
  if (op.type === 'peek') return ['1. if queue is empty: return underflow', '2. return Q[front]']
  if (op.type === 'clear') return ['1. front = 0', '2. rear = -1', '3. queue is now empty']
  return []
}

function linesForStep(op: QueueOperation | null, step: QueueStep): number[] {
  if (!op) return []
  if (step.type === 'underflow') return [0]
  if (op.type === 'create') {
    if (step.type === 'clear') return [0]
    if (step.type === 'enqueue') return [1, 2]
    return []
  }
  if (op.type === 'enqueue') {
    if (step.type === 'enqueue') return [1, 2]
    return []
  }
  if (op.type === 'dequeue') {
    if (step.type === 'highlightFront') return [1]
    if (step.type === 'dequeue') return [2, 3]
    return []
  }
  if (op.type === 'peek') {
    if (step.type === 'highlightFront') return [1]
    return []
  }
  if (op.type === 'clear') {
    if (step.type === 'clear') return [0, 1, 2]
    return []
  }
  return []
}

function computeExecuted(op: QueueOperation | null, allSteps: QueueStep[], stepIndex: number): number[] {
  const set = new Set<number>()
  for (let i = 0; i < stepIndex; i++) {
    for (const line of linesForStep(op, allSteps[i]!)) {
      set.add(line)
    }
  }
  return Array.from(set)
}

export function getQueuePseudocodeState(
  op: QueueOperation | null,
  step: QueueStep | null,
  stepIndex: number,
  allSteps?: QueueStep[]
): QueuePseudocodeState {
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
