import type { BSTStep } from './types'
import type { BSTOperation } from './types'

export interface PseudocodeState {
  lines: string[]
  activeLineIndices: number[]
  executedLineIndices: number[]
  description: string
}

function getPseudocodeForOperation(op: BSTOperation | null): string[] {
  if (!op) return []
  if (op.type === 'create') {
    return [
      '1. root = null',
      '2. for each v in values:',
      '3.     walk from root comparing v',
      '4.     insert v at the first empty child',
    ]
  }
  if (op.type === 'insert') {
    return [
      '1. if root == null: root = new Node(v); return',
      '2. curr = root',
      '3. while true:',
      '4.     if v == curr.value: return  // duplicate',
      '5.     if v < curr.value:',
      '6.         if curr.left == null: curr.left = new Node(v); return',
      '7.         curr = curr.left',
      '8.     else:',
      '9.         if curr.right == null: curr.right = new Node(v); return',
      '10.        curr = curr.right',
    ]
  }
  if (op.type === 'search') {
    return [
      '1. curr = root',
      '2. while curr != null:',
      '3.     if target == curr.value: return found',
      '4.     if target < curr.value: curr = curr.left',
      '5.     else: curr = curr.right',
      '6. return not found',
    ]
  }
  if (op.type === 'remove') {
    return [
      '1. locate node with target value',
      '2. if missing: return',
      '3. if node is leaf: unlink',
      '4. else if one child: promote child',
      '5. else: replace with inorder successor, delete successor',
    ]
  }
  if (op.type === 'traverse') {
    if (op.order === 'inorder') {
      return [
        '1. inorder(node):',
        '2.     if node == null: return',
        '3.     inorder(node.left)',
        '4.     visit(node)',
        '5.     inorder(node.right)',
      ]
    }
    if (op.order === 'preorder') {
      return [
        '1. preorder(node):',
        '2.     if node == null: return',
        '3.     visit(node)',
        '4.     preorder(node.left)',
        '5.     preorder(node.right)',
      ]
    }
    return [
      '1. postorder(node):',
      '2.     if node == null: return',
      '3.     postorder(node.left)',
      '4.     postorder(node.right)',
      '5.     visit(node)',
    ]
  }
  return []
}

function getActiveLineIndicesForStep(op: BSTOperation | null, step: BSTStep): number[] {
  if (!op) return []
  if (op.type === 'create') {
    if (step.type === 'clear') return [0]
    if (step.type === 'highlight') return [1, 2]
    if (step.type === 'insert') return [2, 3]
    return []
  }
  if (op.type === 'insert') {
    if (step.type === 'highlight') return [1, 2, 3]
    if (step.type === 'insert') return [0, 5, 6, 8, 9]
    return []
  }
  if (op.type === 'search') {
    if (step.type === 'highlight') return [1, 2, 3, 4]
    if (step.type === 'found') return [2, 3]
    if (step.type === 'notFound') return [5]
    return []
  }
  if (op.type === 'remove') {
    if (step.type === 'highlight') return [0]
    if (step.type === 'remove') return [2, 3, 4, 5]
    return []
  }
  if (op.type === 'traverse') {
    if (step.type === 'visit') return op.order === 'inorder' ? [0, 2, 3, 4] : op.order === 'preorder' ? [0, 2, 3, 4] : [0, 2, 3, 4]
    return []
  }
  return []
}

function computeExecutedLineIndices(
  op: BSTOperation | null,
  allSteps: BSTStep[],
  stepIndex: number
): number[] {
  const set = new Set<number>()
  for (let j = 0; j < stepIndex; j++) {
    getActiveLineIndicesForStep(op, allSteps[j]!).forEach((i) => set.add(i))
  }
  return Array.from(set)
}

export function getBstPseudocodeState(
  op: BSTOperation | null,
  step: BSTStep | null,
  stepIndex: number,
  allSteps?: BSTStep[]
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
    if (step.type === 'clear')
      return { lines, activeLineIndices: [0], executedLineIndices, description: 'Start with an empty tree.' }
    if (step.type === 'highlight')
      return { lines, activeLineIndices: [1, 2], executedLineIndices, description: 'Walk down comparing the next value.' }
    if (step.type === 'insert')
      return { lines, activeLineIndices: [2, 3], executedLineIndices, description: 'Attach the new node at an empty child.' }
    if (step.type === 'done') {
      const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
      return { lines, activeLineIndices: [], executedLineIndices: allExecuted, description: 'Tree built.' }
    }
  }

  if (op.type === 'insert') {
    if (step.type === 'highlight')
      return {
        lines,
        activeLineIndices: [1, 2, 3],
        executedLineIndices,
        description: 'Compare with the current node and go left or right.',
      }
    if (step.type === 'insert')
      return {
        lines,
        activeLineIndices: [0, 5, 6, 8, 9],
        executedLineIndices,
        description: 'Insert at root or as a new leaf.',
      }
    if (step.type === 'done') {
      const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
      return { lines, activeLineIndices: [], executedLineIndices: allExecuted, description: 'Insert finished.' }
    }
  }

  if (op.type === 'search') {
    if (step.type === 'highlight')
      return {
        lines,
        activeLineIndices: [1, 2, 3, 4],
        executedLineIndices,
        description: 'Compare and descend until a match or a null link.',
      }
    if (step.type === 'found') {
      const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
      return { lines, activeLineIndices: [2, 3], executedLineIndices: allExecuted, description: 'Target found.' }
    }
    if (step.type === 'notFound') {
      const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
      return { lines, activeLineIndices: [5], executedLineIndices: allExecuted, description: 'Search ended without a match.' }
    }
  }

  if (op.type === 'remove') {
    if (step.type === 'highlight')
      return {
        lines,
        activeLineIndices: [0],
        executedLineIndices,
        description: 'Find the node to delete.',
      }
    if (step.type === 'remove') {
      const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
      return {
        lines,
        activeLineIndices: [2, 3, 4, 5],
        executedLineIndices: allExecuted,
        description: 'Unlink or replace using the standard BST cases.',
      }
    }
    if (step.type === 'notFound')
      return { lines, activeLineIndices: [1], executedLineIndices, description: 'Value not present.' }
    if (step.type === 'done') {
      const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
      return { lines, activeLineIndices: [], executedLineIndices: allExecuted, description: 'Remove finished.' }
    }
  }

  if (op.type === 'traverse') {
    if (step.type === 'visit')
      return {
        lines,
        activeLineIndices: [0, 2, 3, 4],
        executedLineIndices,
        description: `Visiting nodes in ${op.order} order.`,
      }
    if (step.type === 'done') {
      const allExecuted = Array.from({ length: lines.length }, (_, i) => i)
      return { lines, activeLineIndices: [], executedLineIndices: allExecuted, description: 'Traversal complete.' }
    }
  }

  return {
    lines,
    activeLineIndices: [],
    executedLineIndices,
    description: step.message ?? '',
  }
}
