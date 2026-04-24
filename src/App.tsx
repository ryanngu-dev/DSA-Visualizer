import { useState } from 'react'
import Layout from './components/Layout'
import type { DataStructureId } from './types/common'
import LinkedListVisualizer from './data-structures/linked-list'
import BinarySearchTreeVisualizer from './data-structures/binary-search-tree'
import GraphTraversalVisualizer from './data-structures/graph-traversal'
import BinaryHeapVisualizer from './data-structures/binary-heap'
import StackVisualizer from './data-structures/stack'
import QueueVisualizer from './data-structures/queue'
import HashMapVisualizer from './data-structures/hash-map'

export default function App() {
  const [dataStructure, setDataStructure] = useState<DataStructureId>('linked-list')

  const nav = (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Data structure">
      <button
        type="button"
        role="tab"
        aria-selected={dataStructure === 'linked-list'}
        onClick={() => setDataStructure('linked-list')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
          dataStructure === 'linked-list'
            ? 'bg-accent text-white shadow-md ring-2 ring-accent/60 ring-offset-2 ring-offset-white dark:ring-offset-slate-950'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        Linked List
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={dataStructure === 'binary-search-tree'}
        onClick={() => setDataStructure('binary-search-tree')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
          dataStructure === 'binary-search-tree'
            ? 'bg-accent text-white shadow-md ring-2 ring-accent/60 ring-offset-2 ring-offset-white dark:ring-offset-slate-950'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        Binary Search Tree
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={dataStructure === 'binary-heap'}
        onClick={() => setDataStructure('binary-heap')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
          dataStructure === 'binary-heap'
            ? 'bg-accent text-white shadow-md ring-2 ring-accent/60 ring-offset-2 ring-offset-white dark:ring-offset-slate-950'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        Binary Heap
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={dataStructure === 'stack'}
        onClick={() => setDataStructure('stack')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
          dataStructure === 'stack'
            ? 'bg-accent text-white shadow-md ring-2 ring-accent/60 ring-offset-2 ring-offset-white dark:ring-offset-slate-950'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        Stack
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={dataStructure === 'queue'}
        onClick={() => setDataStructure('queue')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
          dataStructure === 'queue'
            ? 'bg-accent text-white shadow-md ring-2 ring-accent/60 ring-offset-2 ring-offset-white dark:ring-offset-slate-950'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        Queue
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={dataStructure === 'hash-map'}
        onClick={() => setDataStructure('hash-map')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
          dataStructure === 'hash-map'
            ? 'bg-accent text-white shadow-md ring-2 ring-accent/60 ring-offset-2 ring-offset-white dark:ring-offset-slate-950'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        Hash Map
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={dataStructure === 'graph-traversal'}
        onClick={() => setDataStructure('graph-traversal')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
          dataStructure === 'graph-traversal'
            ? 'bg-accent text-white shadow-md ring-2 ring-accent/60 ring-offset-2 ring-offset-white dark:ring-offset-slate-950'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        Graph (BFS / DFS)
      </button>
    </div>
  )

  return (
    <Layout nav={nav}>
      {dataStructure === 'linked-list' ? (
        <LinkedListVisualizer />
      ) : dataStructure === 'binary-search-tree' ? (
        <BinarySearchTreeVisualizer />
      ) : dataStructure === 'binary-heap' ? (
        <BinaryHeapVisualizer />
      ) : dataStructure === 'stack' ? (
        <StackVisualizer />
      ) : dataStructure === 'queue' ? (
        <QueueVisualizer />
      ) : dataStructure === 'hash-map' ? (
        <HashMapVisualizer />
      ) : dataStructure === 'graph-traversal' ? (
        <GraphTraversalVisualizer />
      ) : (
        <p className="text-slate-500">Select a data structure.</p>
      )}
    </Layout>
  )
}
