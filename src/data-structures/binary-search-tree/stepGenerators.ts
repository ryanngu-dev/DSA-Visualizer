import type { BSTStep, TraverseOrder } from './types'
import { BinarySearchTree } from './BinarySearchTree'

function buildInsertSteps(tree: BinarySearchTree, value: number): BSTStep[] {
  const steps: BSTStep[] = []
  if (!tree.root) {
    steps.push({ type: 'insert', value, message: `Insert ${value} as root` })
    return steps
  }
  let curr = tree.root
  while (curr) {
    steps.push({
      type: 'highlight',
      nodeId: curr.id,
      message: `Compare ${value} with ${curr.value}`,
    })
    if (value === curr.value) {
      steps.push({ type: 'done', message: `${value} already in the tree` })
      return steps
    }
    if (value < curr.value) {
      if (!curr.left) {
        steps.push({ type: 'insert', value, message: `Insert ${value} to the left` })
        return steps
      }
      curr = curr.left
    } else {
      if (!curr.right) {
        steps.push({ type: 'insert', value, message: `Insert ${value} to the right` })
        return steps
      }
      curr = curr.right
    }
  }
  return steps
}

export function stepsForCreate(_tree: BinarySearchTree, values: number[]): BSTStep[] {
  const steps: BSTStep[] = [{ type: 'clear', message: 'Empty the tree' }]
  const scratch = new BinarySearchTree()
  for (const v of values) {
    const part = buildInsertSteps(scratch, v)
    steps.push(...part)
    if (part.some((s) => s.type === 'insert')) scratch.insert(v)
  }
  steps.push({ type: 'done', message: 'Create complete' })
  return steps
}

export function stepsForInsert(tree: BinarySearchTree, value: number): BSTStep[] {
  const steps = buildInsertSteps(tree, value)
  if (steps.some((s) => s.type === 'insert')) {
    steps.push({ type: 'done', message: `Inserted ${value}` })
  }
  return steps
}

export function stepsForSearch(tree: BinarySearchTree, value: number): BSTStep[] {
  const steps: BSTStep[] = []
  if (!tree.root) {
    steps.push({ type: 'notFound', message: 'Tree is empty' })
    return steps
  }
  const { ids, found } = tree.searchPath(value)
  for (const id of ids) {
    const node = tree.findNodeById(id)
    steps.push({
      type: 'highlight',
      nodeId: id,
      message: node ? `Compare with ${node.value}` : undefined,
    })
  }
  if (found) {
    const last = ids[ids.length - 1]!
    steps.push({ type: 'found', nodeId: last, message: `Found ${value}` })
  } else {
    steps.push({ type: 'notFound', message: `${value} not in tree` })
  }
  return steps
}

export function stepsForRemove(tree: BinarySearchTree, value: number): BSTStep[] {
  const steps: BSTStep[] = []
  if (!tree.root) {
    steps.push({ type: 'done', message: 'Tree is empty' })
    return steps
  }
  const { ids, found } = tree.searchPath(value)
  if (!found) {
    for (const id of ids) {
      const node = tree.findNodeById(id)
      steps.push({
        type: 'highlight',
        nodeId: id,
        message: node ? `Compare with ${node.value}` : undefined,
      })
    }
    steps.push({ type: 'notFound', message: `${value} not in tree` })
    return steps
  }
  for (let i = 0; i < ids.length - 1; i++) {
    const id = ids[i]!
    const node = tree.findNodeById(id)
    steps.push({
      type: 'highlight',
      nodeId: id,
      message: node ? `Compare with ${node.value}` : undefined,
    })
  }
  const targetId = ids[ids.length - 1]!
  steps.push({
    type: 'highlight',
    nodeId: targetId,
    message: `Found ${value}`,
  })
  steps.push({ type: 'remove', value, message: `Unlink and remove ${value}` })
  steps.push({ type: 'done', message: `Removed ${value}` })
  return steps
}

export function stepsForTraverse(tree: BinarySearchTree, order: TraverseOrder): BSTStep[] {
  const ids = tree.collectOrder(order)
  const steps: BSTStep[] = []
  if (ids.length === 0) {
    steps.push({ type: 'done', message: 'Tree is empty' })
    return steps
  }
  const label =
    order === 'inorder' ? 'In-order (left → root → right)' : order === 'preorder' ? 'Pre-order (root → left → right)' : 'Post-order (left → right → root)'
  for (const id of ids) {
    const node = tree.findNodeById(id)
    steps.push({
      type: 'visit',
      nodeId: id,
      message: node ? `${label}: visit ${node.value}` : label,
    })
  }
  steps.push({ type: 'done', message: `${order} traversal complete` })
  return steps
}
