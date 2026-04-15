export interface StackEntry {
  id: string
  value: number
}

export interface StackSnapshot {
  items: StackEntry[]
}

export type StackStep =
  | { type: 'clear'; message?: string }
  | { type: 'push'; value: number; message?: string }
  | { type: 'highlightTop'; message?: string }
  | { type: 'pop'; message?: string }
  | { type: 'underflow'; message?: string }
  | { type: 'done'; message?: string }

export type StackOperation =
  | { type: 'create'; values: number[] }
  | { type: 'push'; value: number }
  | { type: 'pop' }
  | { type: 'peek' }
  | { type: 'clear' }
