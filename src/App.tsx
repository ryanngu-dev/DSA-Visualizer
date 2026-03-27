import { useState } from 'react'
import Layout from './components/Layout'
import type { DataStructureId } from './types/common'
import LinkedListVisualizer from './data-structures/linked-list'
import BinarySearchTreeVisualizer from './data-structures/binary-search-tree'

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
    </div>
  )

  return (
    <Layout nav={nav}>
      {dataStructure === 'linked-list' ? (
        <LinkedListVisualizer />
      ) : dataStructure === 'binary-search-tree' ? (
        <BinarySearchTreeVisualizer />
      ) : (
        <p className="text-slate-500">Select a data structure.</p>
      )}
    </Layout>
  )
}
