import type { HashMapEntry, HashMapSnapshot } from './types'

let nextId = 1
function newId() {
  return `hm-${nextId++}`
}

export class HashMapModel {
  private readonly bucketCount: number
  private buckets: HashMapEntry[][]

  constructor(bucketCount = 7) {
    this.bucketCount = bucketCount
    this.buckets = Array.from({ length: bucketCount }, () => [])
  }

  hash(key: number): number {
    return Math.abs(key) % this.bucketCount
  }

  getBucketCount(): number {
    return this.bucketCount
  }

  clear(): void {
    this.buckets = Array.from({ length: this.bucketCount }, () => [])
  }

  set(key: number): { bucket: number; isUpdate: boolean } {
    const bucket = this.hash(key)
    const chain = this.buckets[bucket]!
    const existing = chain.find((entry) => entry.key === key)
    if (existing) {
      return { bucket, isUpdate: true }
    }
    chain.push({ id: newId(), key })
    return { bucket, isUpdate: false }
  }

  get(key: number): { bucket: number; found: boolean } {
    const bucket = this.hash(key)
    const chain = this.buckets[bucket]!
    const entry = chain.find((item) => item.key === key)
    return { bucket, found: Boolean(entry) }
  }

  delete(key: number): { bucket: number; removed: boolean } {
    const bucket = this.hash(key)
    const chain = this.buckets[bucket]!
    const idx = chain.findIndex((entry) => entry.key === key)
    if (idx < 0) return { bucket, removed: false }
    chain.splice(idx, 1)
    return { bucket, removed: true }
  }

  toSnapshot(): HashMapSnapshot {
    return {
      bucketCount: this.bucketCount,
      buckets: this.buckets.map((entries, index) => ({
        index,
        entries: entries.map((entry) => ({ ...entry })),
      })),
    }
  }

  setFromSnapshot(snapshot: HashMapSnapshot): void {
    this.buckets = snapshot.buckets.map((bucket) => bucket.entries.map((entry) => ({ ...entry })))
  }
}
