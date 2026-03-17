import { useState } from 'react'
import Layout from './components/Layout'
import type { DataStructureId } from './types/common'
import LinkedListVisualizer from './data-structures/linked-list'

export default function App() {
  const [dataStructure, setDataStructure] = useState<DataStructureId>('linked-list')

  const nav = (
    <div className="flex gap-2" role="tablist" aria-label="Data structure">
      <button
        type="button"
        role="tab"
        aria-selected={dataStructure === 'linked-list'}
        onClick={() => setDataStructure('linked-list')}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors
                   aria-selected:bg-accent aria-selected:text-white
                   bg-slate-100 text-slate-700 hover:bg-slate-200
                   dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Linked List
      </button>
    </div>
  )

  return (
    <Layout nav={nav}>
      {dataStructure === 'linked-list' ? (
        <LinkedListVisualizer />
      ) : (
        <p className="text-slate-500">Select a data structure.</p>
      )}
    </Layout>
  )
}
