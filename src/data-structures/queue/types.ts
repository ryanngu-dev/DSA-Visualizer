export interface QueueEntry {
  id: string
  value: number
}

export interface QueueSnapshot {
  items: QueueEntry[]
}

export type QueueStep =
  | { type: 'clear'; message?: string }
  | { type: 'enqueue'; value: number; message?: string }
  | { type: 'highlightFront'; message?: string }
  | { type: 'dequeue'; message?: string }
  | { type: 'underflow'; message?: string }
  | { type: 'done'; message?: string }

export type QueueOperation =
  | { type: 'create'; values: number[] }
  | { type: 'enqueue'; value: number }
  | { type: 'dequeue' }
  | { type: 'peek' }
  | { type: 'clear' }
