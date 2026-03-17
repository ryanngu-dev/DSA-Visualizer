import type { LinkedListStep } from './types'
import type { LinkedListOperation } from '../../hooks/useVisualization'

export interface PseudocodeState {
  lines: string[]
  activeLineIndices: number[]
  executedLineIndices: number[]
  description: string
}

function getPseudocodeForOperation(op: LinkedListOperation | null): string[] {
  if (!op) return []
  if (op.type === 'create') {
    return [
      '1. empty the list',
      '2. for each v in A:',
      '3.     append v to tail',
    ]
  }
  if (op.type === 'insert') {
    if (op.position === 'head') {
      return [
        '1. new = Node(value)',
        '2. new.next = head',
        '3. head = new',
      ]
    }
    if (op.position === 'tail') {
      return [
        '1. new = Node(value)',
        '2. if head == null:',
        '3.     head = tail = new',
        '4.     return',
        '5. tail.next = new',
        '6. tail = new',
      ]
    }
    return [
      '1. new = Node(value)',
      '2. if index <= 0: new.next = head; head = new; return',
      '3. prev = head',
      '4. for k = 0 to index-2:',
      '5.     prev = prev.next',
      '6. new.next = prev.next; prev.next = new',
    ]
  }
  if (op.type === 'remove') {
    if (op.mode === 'index') {
      return [
        '1. if head == null: return',
        '2. if index == 0: head = head.next; return',
        '3. prev = head',
        '4. for k = 0 to index-2:',
        '5.     prev = prev.next',
        '6. del = prev.next',
        '7. prev.next = del.next  // bypass del',
        '8. delete del',
      ]
    }
    return [
      '1. if head == null: return',
      '2. if head.value == target: head = head.next; return',
      '3. prev = head',
      '4. curr = head.next',
      '5. while curr != null and curr.value != target:',
      '6.     prev = curr; curr = curr.next',
      '7. if curr == null: return  // not found',
      '8. prev.next = curr.next  // bypass curr',
    ]
  }
  if (op.type === 'search') {
    return [
      '1. curr = head',
      '2. index = 0',
      '3. while curr != null:',
      '4.   if curr.value == target:',
      '5.       return index',
      '6.   curr = curr.next',
      '7.   index++',
      '8. return -1',
    ]
  }
  return []
}

function getActiveLineIndicesForStep(op: LinkedListOperation | null, step: LinkedListStep): number[] {
  if (!op) return []
  if (op.type === 'create') {
    if (step.type === 'createClear') return [0]
    if (step.type === 'insertTail') return [1, 2]
    return []
  }
  if (op.type === 'insert') {
    if (op.position === 'head' && step.type === 'insertHead') return [0, 1, 2]
    if (op.position === 'tail' && step.type === 'highlight') return [1]
    if (op.position === 'tail' && step.type === 'insertTail') return [4, 5]
    if (op.position === 'index' && step.type === 'highlight') return [2, 3, 4]
    if (op.position === 'index' && step.type === 'insertAt') return step.index <= 0 ? [1] : [5]
    return []
  }
  if (op.type === 'remove') {
    if (op.mode === 'index' && step.type === 'highlight') {
      return [2, 3, 4]
    }
    if (op.mode === 'index' && step.type === 'reroute') return step.index === 0 ? [1] : [5, 6]
    if (op.mode === 'index' && step.type === 'removeAt') return step.index === 0 ? [1] : [7]
    if (op.mode === 'value' && step.type === 'highlight') return step.index === 0 ? [1] : [4, 5, 6]
    if (op.mode === 'value' && step.type === 'found') return step.index === 0 ? [1] : [4, 5, 6]
    if (op.mode === 'value' && step.type === 'reroute') return step.index === 0 ? [1] : [7]
    if (op.mode === 'value' && step.type === 'removeByValue') return step.value !== undefined ? [7] : []
    if (op.mode === 'value' && step.type === 'notFound') return [6]
    return []
  }
  if (op.type === 'search') {
    if (step.type === 'highlight') return [2, 3]
    if (step.type === 'found') return [3, 4]
    if (step.type === 'notFound') return [7]
    return []
  }
  return []
}

function computeExecutedLineIndices(
  op: LinkedListOperation | null,
  allSteps: LinkedListStep[],
  stepIndex: number
): number[] {
  const set = new Set<number>()
  for (let j = 0; j < stepIndex; j++) {
    getActiveLineIndicesForStep(op, allSteps[j]!).forEach((i) => set.add(i))
  }
  return Array.from(set)
}

export function getPseudocodeState(
  op: LinkedListOperation | null,
  step: LinkedListStep | null,
  stepIndex: number,
  allSteps?: LinkedListStep[]
): PseudocodeState {
  const lines = getPseudocodeForOperation(op)
  const empty = { lines, activeLineIndices: [], executedLineIndices: [], description: '' }
  if (!op || lines.length === 0) {
    return empty
  }
  if (!step) {
    return empty
  }

  const executedLineIndices = allSteps && stepIndex > 0 ? computeExecutedLineIndices(op, allSteps, stepIndex) : []

  if (op.type === 'create') {
    if (step.type === 'createClear')
      return { lines, activeLineIndices: [0], executedLineIndices, description: 'Clear the list.' }
    if (step.type === 'insertTail')
      return { lines, activeLineIndices: [1, 2], executedLineIndices, description: 'Append current value to tail.' }
    if (step.type === 'done') {
      const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
      return { lines, activeLineIndices: [], executedLineIndices: allExecuted, description: 'Create complete.' }
    }
  }

  if (op.type === 'insert') {
    if (op.position === 'head') {
      if (step.type === 'insertHead')
        return {
          lines,
          activeLineIndices: [0, 1, 2],
          executedLineIndices,
          description: 'Create a new node, set its next to the current head, then make it the new head.',
        }
      if (step.type === 'done') {
        const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
        return { lines, activeLineIndices: [], executedLineIndices: allExecuted, description: 'Insert at head complete.' }
      }
    }
    if (op.position === 'tail') {
      if (step.type === 'highlight')
        return {
          lines,
          activeLineIndices: [1],
          executedLineIndices,
          description: 'Check if list is empty; otherwise traverse to the tail node.',
        }
    if (step.type === 'insertTail')
      return {
        lines,
        activeLineIndices: [4, 5],
        executedLineIndices,
        description: 'tail.next = new; tail = new.',
      }
      if (step.type === 'done') {
        const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
        return { lines, activeLineIndices: [], executedLineIndices: allExecuted, description: 'Insert at tail complete.' }
      }
    }
    if (op.position === 'index') {
      if (step.type === 'highlight')
        return {
          lines,
          activeLineIndices: [2, 3, 4],
          executedLineIndices,
          description: 'prev = head; traverse until you reach index-1.',
        }
      if (step.type === 'insertAt')
        return {
          lines,
          activeLineIndices: step.index <= 0 ? [1] : [5],
          executedLineIndices,
          description: step.index <= 0 ? 'Insert at head: new.next = head; head = new.' : 'new.next = prev.next; prev.next = new.',
        }
      if (step.type === 'done') {
        const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
        return { lines, activeLineIndices: [], executedLineIndices: allExecuted, description: 'Insert at index complete.' }
      }
    }
  }

  if (op.type === 'remove') {
    if (op.mode === 'index') {
      if (step.type === 'highlight') {
        return {
          lines,
          activeLineIndices: [2, 3, 4],
          executedLineIndices,
          description: 'Traverse to the node just before the one you want to remove.',
        }
      }
      if (step.type === 'reroute') {
        return {
          lines,
          activeLineIndices: step.index === 0 ? [1] : [5, 6],
          executedLineIndices,
          description: step.index === 0 ? 'Removing head: head = head.next.' : 'del = prev.next; prev.next = del.next (bypass del).',
        }
      }
      if (step.type === 'removeAt') {
        return {
          lines,
          activeLineIndices: step.index === 0 ? [1] : [7],
          executedLineIndices,
          description: step.index === 0 ? 'Head removal complete.' : 'delete del (remove the node).',
        }
      }
      if (step.type === 'done') {
        const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
        return { lines, activeLineIndices: [], executedLineIndices: allExecuted, description: 'Remove at index complete.' }
      }
    }
    if (op.mode === 'value') {
      if (step.type === 'highlight')
        return {
          lines,
          activeLineIndices: step.index === 0 ? [1] : [4, 5, 6],
          executedLineIndices,
          description: step.index === 0 ? 'Check if head is the target.' : 'Scan forward until you find the target value.',
        }
      if (step.type === 'found')
        return {
          lines,
          activeLineIndices: step.index === 0 ? [1] : [4, 5, 6],
          executedLineIndices,
          description: 'Target found.',
        }
      if (step.type === 'reroute')
        return {
          lines,
          activeLineIndices: step.index === 0 ? [1] : [7],
          executedLineIndices,
          description: step.index === 0 ? 'Removing head: head = head.next.' : 'prev.next = curr.next (bypass curr).',
        }
      if (step.type === 'removeByValue')
        return {
          lines,
          activeLineIndices: [7],
          executedLineIndices,
          description: 'Unlink the node (removal happens here).',
        }
      if (step.type === 'done') {
        const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
        return { lines, activeLineIndices: [], executedLineIndices: allExecuted, description: 'Remove by value complete.' }
      }
      if (step.type === 'notFound')
        return { lines, activeLineIndices: [6], executedLineIndices, description: 'Reached end of list; value not found. No removal.' }
    }
  }

  if (op.type === 'search') {
    if (step.type === 'highlight')
      return {
        lines,
        activeLineIndices: [2, 3],
        executedLineIndices,
        description: 'while curr != null: compare curr.value with target.',
      }
    if (step.type === 'found')
      return {
        lines,
        activeLineIndices: [3, 4],
        executedLineIndices,
        description: 'Match found; return index.',
      }
    if (step.type === 'notFound')
      return {
        lines,
        activeLineIndices: [7],
        executedLineIndices,
        description: 'Reached end of list; return -1.',
      }
  }

  return {
    lines,
    activeLineIndices: [],
    executedLineIndices,
    description: step.message ?? '',
  }
}
