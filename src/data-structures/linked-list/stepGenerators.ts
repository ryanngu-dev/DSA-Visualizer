import type { LinkedListStep } from './types'
import type { LinkedList } from './LinkedList'

/**
 * Step generators for visualization. They return a sequence of steps;
 * the runner applies list mutations when it sees insert/remove steps.
 */

export function stepsForCreate(_list: LinkedList, values: number[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [{ type: 'createClear', message: 'Clear the list' }]
  for (const v of values) {
    steps.push({ type: 'insertTail', value: v, message: `Append ${v}` })
  }
  steps.push({ type: 'done', message: `Created list [${values.join(', ')}]` })
  return steps
}

export function stepsForInsertHead(_list: LinkedList, value: number): LinkedListStep[] {
  return [
    { type: 'insertHead', value, message: `Inserting ${value} at head` },
    { type: 'done', message: `Inserted ${value} at head` },
  ]
}

export function stepsForInsertTail(_list: LinkedList, value: number): LinkedListStep[] {
  return [
    ...( _list.length > 0
      ? [{ type: 'highlight' as const, index: _list.length - 1, message: `Moving to tail` }]
      : []
    ),
    { type: 'insertTail', value, message: `Inserting ${value} at tail` },
    { type: 'done', message: `Inserted ${value} at tail` },
  ]
}

export function stepsForInsertAt(list: LinkedList, index: number, value: number): LinkedListStep[] {
  const steps: LinkedListStep[] = []
  const safeIndex = Math.max(0, Math.min(index, list.length))
  for (let i = 0; i < safeIndex; i++) {
    steps.push({ type: 'highlight', index: i, message: `Traversing to position ${safeIndex}` })
  }
  steps.push({ type: 'insertAt', index: safeIndex, value, message: `Inserting ${value} at index ${safeIndex}` })
  steps.push({ type: 'done', message: `Inserted ${value} at index ${safeIndex}` })
  return steps
}

export function stepsForRemoveAt(list: LinkedList, index: number): LinkedListStep[] {
  const steps: LinkedListStep[] = []
  if (list.length === 0 || index < 0 || index >= list.length) {
    steps.push({ type: 'done', message: 'Invalid index; no removal' })
    return steps
  }
  const arr = list.toArray()
  const removeNodeId = arr[index]?.id
  for (let i = 0; i < index; i++) {
    steps.push({ type: 'highlight', index: i, message: `Traversing to index ${index}` })
  }
  steps.push({ type: 'reroute', index, removeNodeId, message: `Linking previous node to next` })
  steps.push({ type: 'removeAt', index, removeNodeId, message: `Removing node at index ${index}` })
  steps.push({ type: 'done', message: `Removed node at index ${index}` })
  return steps
}

export function stepsForRemoveByValue(list: LinkedList, value: number): LinkedListStep[] {
  const steps: LinkedListStep[] = []
  const arr = list.toArray()
  const foundIndex = arr.findIndex((n) => n.value === value)
  const removeNodeId = foundIndex >= 0 ? arr[foundIndex]?.id : undefined
  if (foundIndex === -1) {
    for (let i = 0; i < arr.length; i++) {
      steps.push({ type: 'highlight', index: i, message: `Searching for ${value}` })
    }
    steps.push({ type: 'notFound', message: `Value ${value} not in list` })
    return steps
  }
  for (let i = 0; i < foundIndex; i++) {
    steps.push({ type: 'highlight', index: i, message: `Searching for ${value}` })
  }
  steps.push({ type: 'highlight', index: foundIndex, message: `Found ${value}` })
  steps.push({ type: 'reroute', index: foundIndex, removeNodeId, message: `Linking previous node to next` })
  steps.push({ type: 'removeByValue', value, removeNodeId, message: `Removing first occurrence of ${value}` })
  steps.push({ type: 'done', message: `Removed ${value}` })
  return steps
}

export function stepsForSearch(list: LinkedList, value: number): LinkedListStep[] {
  const steps: LinkedListStep[] = []
  const arr = list.toArray()
  const foundIndex = arr.findIndex((n) => n.value === value)
  if (foundIndex === -1) {
    for (let i = 0; i < arr.length; i++) {
      steps.push({ type: 'highlight', index: i, message: `Comparing with ${arr[i].value}` })
    }
    steps.push({ type: 'notFound', message: `Value ${value} not found` })
    return steps
  }
  for (let i = 0; i < foundIndex; i++) {
    steps.push({ type: 'highlight', index: i, message: `Comparing with ${arr[i].value}` })
  }
  steps.push({ type: 'found', index: foundIndex, message: `Found ${value} at index ${foundIndex}` })
  return steps
}
