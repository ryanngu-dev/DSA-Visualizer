export interface HashMapEntry {
  id: string
  key: number
}

export interface HashMapBucket {
  index: number
  entries: HashMapEntry[]
}

export interface HashMapSnapshot {
  bucketCount: number
  buckets: HashMapBucket[]
}

export type HashMapStep =
  | { type: 'clear'; message?: string }
  | { type: 'highlightBucket'; bucket: number; message?: string }
  | { type: 'probe'; key: number; candidate: number; bucket: number; message?: string }
  | { type: 'upsert'; key: number; bucket: number; message?: string }
  | { type: 'remove'; key: number; bucket: number; message?: string }
  | { type: 'found'; key: number; bucket: number; message?: string }
  | { type: 'notFound'; key: number; bucket: number; message?: string }
  | { type: 'done'; message?: string }

export type HashMapOperation =
  | { type: 'create'; values: number[] }
  | { type: 'insert'; key: number }
  | { type: 'search'; key: number }
  | { type: 'remove'; key: number }
