import type { QueueStep } from './types'
import type { Queue } from './Queue'

export function stepsForCreate(_queue: Queue, values: number[]): QueueStep[] {
  const steps: QueueStep[] = [{ type: 'clear', message: 'Clear the queue' }]
  for (const value of values) {
    steps.push({ type: 'enqueue', value, message: `Enqueue ${value}` })
  }
  steps.push({ type: 'done', message: `Created queue [${values.join(', ')}]` })
  return steps
}

export function stepsForEnqueue(_queue: Queue, value: number): QueueStep[] {
  return [
    { type: 'enqueue', value, message: `Enqueue ${value} at rear` },
    { type: 'done', message: `${value} is now at the rear` },
  ]
}

export function stepsForDequeue(queue: Queue): QueueStep[] {
  if (queue.size() === 0) {
    return [{ type: 'underflow', message: 'Queue underflow: cannot dequeue from an empty queue' }]
  }
  const front = queue.peek()
  return [
    { type: 'highlightFront', message: `Front is ${front?.value ?? ''}` },
    { type: 'dequeue', message: `Dequeue ${front?.value ?? ''} from front` },
    { type: 'done', message: `Removed ${front?.value ?? ''}` },
  ]
}

export function stepsForPeek(queue: Queue): QueueStep[] {
  if (queue.size() === 0) {
    return [{ type: 'underflow', message: 'Queue is empty: nothing to peek' }]
  }
  const front = queue.peek()
  return [
    { type: 'highlightFront', message: `Peek front: ${front?.value ?? ''}` },
    { type: 'done', message: `Front value is ${front?.value ?? ''}` },
  ]
}

export function stepsForClear(queue: Queue): QueueStep[] {
  if (queue.size() === 0) {
    return [{ type: 'done', message: 'Queue is already empty' }]
  }
  return [
    { type: 'clear', message: 'Clear all elements' },
    { type: 'done', message: 'Queue cleared' },
  ]
}
