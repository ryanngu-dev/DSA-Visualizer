import type { HashMapModel } from './HashMapModel'
import type { HashMapStep } from './types'

export function stepsForCreate(
  map: HashMapModel,
  values: number[]
): HashMapStep[] {
  const steps: HashMapStep[] = [{ type: 'clear', message: 'Clear the hash map' }]
  for (const key of values) {
    const bucket = map.hash(key)
    steps.push({ type: 'highlightBucket', bucket, message: `${key} mod 6 = ${bucket}` })
    steps.push({
      type: 'upsert',
      key,
      bucket,
      message: `Insert ${key}`,
    })
  }
  steps.push({ type: 'done', message: 'Created hash map from input values' })
  return steps
}

export function stepsForInsert(map: HashMapModel, key: number): HashMapStep[] {
  const bucket = map.hash(key)
  const before = map.get(key)
  return [
    { type: 'highlightBucket', bucket, message: `${key} mod 6 = ${bucket}` },
    {
      type: 'upsert',
      key,
      bucket,
      message: before.found ? `Value ${key} already exists` : `Insert ${key}`,
    },
    { type: 'done', message: `Insert complete for value ${key}` },
  ]
}

export function stepsForSearch(map: HashMapModel, key: number): HashMapStep[] {
  const bucket = map.hash(key)
  const chain = map.toSnapshot().buckets[bucket]?.entries ?? []
  const steps: HashMapStep[] = [{ type: 'highlightBucket', bucket, message: `${key} mod 6 = ${bucket}` }]

  for (const entry of chain) {
    steps.push({
      type: 'probe',
      key,
      candidate: entry.key,
      bucket,
      message: `Compare ${key} with ${entry.key}`,
    })
    if (entry.key === key) {
      steps.push({ type: 'found', key, bucket, message: `Found ${key}` })
      steps.push({ type: 'done', message: `Search complete for value ${key}` })
      return steps
    }
  }

  steps.push({ type: 'notFound', key, bucket, message: `Value ${key} not found` })
  return steps
}

export function stepsForRemove(map: HashMapModel, key: number): HashMapStep[] {
  const { bucket, found } = map.get(key)
  if (!found) {
    return [
      { type: 'highlightBucket', bucket, message: `${key} mod 6 = ${bucket}` },
      { type: 'notFound', key, bucket, message: `Value ${key} not found; nothing removed` },
    ]
  }
  return [
    { type: 'highlightBucket', bucket, message: `${key} mod 6 = ${bucket}` },
    { type: 'remove', key, bucket, message: `Remove value ${key}` },
    { type: 'done', message: `Removed value ${key}` },
  ]
}
