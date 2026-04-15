import type { StackStep } from './types'
import type { Stack } from './Stack'

export function stepsForCreate(_stack: Stack, values: number[]): StackStep[] {
  const steps: StackStep[] = [{ type: 'clear', message: 'Clear the stack' }]
  for (const value of values) {
    steps.push({ type: 'push', value, message: `Push ${value}` })
  }
  steps.push({ type: 'done', message: `Created stack [${values.join(', ')}]` })
  return steps
}

export function stepsForPush(_stack: Stack, value: number): StackStep[] {
  return [
    { type: 'push', value, message: `Push ${value} onto top` },
    { type: 'done', message: `${value} is now the top element` },
  ]
}

export function stepsForPop(stack: Stack): StackStep[] {
  if (stack.size() === 0) {
    return [{ type: 'underflow', message: 'Stack underflow: cannot pop from an empty stack' }]
  }
  const top = stack.peek()
  return [
    { type: 'highlightTop', message: `Top is ${top?.value ?? ''}` },
    { type: 'pop', message: `Pop ${top?.value ?? ''} from top` },
    { type: 'done', message: `Removed ${top?.value ?? ''}` },
  ]
}

export function stepsForPeek(stack: Stack): StackStep[] {
  if (stack.size() === 0) {
    return [{ type: 'underflow', message: 'Stack is empty: nothing to peek' }]
  }
  const top = stack.peek()
  return [
    { type: 'highlightTop', message: `Peek top: ${top?.value ?? ''}` },
    { type: 'done', message: `Top value is ${top?.value ?? ''}` },
  ]
}

export function stepsForClear(stack: Stack): StackStep[] {
  if (stack.size() === 0) {
    return [{ type: 'done', message: 'Stack is already empty' }]
  }
  return [
    { type: 'clear', message: 'Clear all elements' },
    { type: 'done', message: 'Stack cleared' },
  ]
}
