import { useCallback, useEffect, useMemo, useState } from 'react'
import { GraphModel } from './GraphModel'
import { generateRandomTree } from './graphGenerators'
import { generateBfsSteps, generateDfsSteps } from './stepGenerators'
import { useGraphTraversalVisualization } from '../../hooks/useGraphTraversalVisualization'
import GraphView from './GraphView'
import GraphPseudocodePanel from './GraphPseudocodePanel'
import GraphControlPanel from './GraphControlPanel'
import GraphTraversalToolbar from './GraphTraversalToolbar'
import VisualizationCanvas from '../../components/VisualizationCanvas'
import type { GraphSnapshot } from './types'
import type { GraphOperation } from './types'
import type { TraversalKind } from './types'

export default function GraphTraversalVisualizer() {
  const [snapshot, setSnapshotState] = useState<GraphSnapshot>(() => generateRandomTree(7))
  const [traversal, setTraversal] = useState<TraversalKind>('bfs')
  const [startId, setStartId] = useState<string>('0')

  const graph = useMemo(() => {
    const g = new GraphModel()
    g.setFromSnapshot(snapshot)
    return g
  }, [snapshot])

  const ids = graph.nodeIds
  const idKey = ids.join(',')
  useEffect(() => {
    if (ids.length === 0) return
    if (!ids.includes(startId)) setStartId(ids[0]!)
  }, [idKey, startId])

  const { reset: resetTraversal, setSteps, play, ...viz } = useGraphTraversalVisualization()

  const handleRunTraversal = useCallback(() => {
    const g = new GraphModel(snapshot)
    if (!g.hasNode(startId)) return
    const steps =
      traversal === 'bfs' ? generateBfsSteps(g, startId) : generateDfsSteps(g, startId)
    const op: GraphOperation = { type: 'traverse', traversal, startId }
    setSteps(steps, op)
    play()
  }, [snapshot, startId, traversal, setSteps, play])

  const setSnapshot = useCallback(
    (next: GraphSnapshot) => {
      setSnapshotState(next)
      resetTraversal()
    },
    [resetTraversal]
  )

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <section className="w-full" aria-label="Visualization">
        <VisualizationCanvas
          className="items-stretch justify-start py-3 sm:py-4"
          stepControls={{
            onPrev: viz.prevStep,
            onNext: viz.nextStep,
            canPrev: viz.canPrev,
            canNext: viz.canStep,
          }}
        >
          <div className="flex w-full flex-col items-stretch gap-2">
            <GraphTraversalToolbar
              graph={graph}
              traversal={traversal}
              onTraversalChange={setTraversal}
              startId={startId}
              onStartIdChange={setStartId}
              onRun={handleRunTraversal}
            />
            <GraphView
              snapshot={snapshot}
              currentStep={viz.currentStep}
              stepIndex={viz.stepIndex}
              allSteps={viz.steps}
            />
          </div>
        </VisualizationCanvas>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        <section
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
          aria-label="Graph controls"
        >
          <GraphControlPanel graph={graph} snapshot={snapshot} onGraphChange={setSnapshot} />
        </section>
        <section
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
          aria-label="Pseudocode"
        >
          <GraphPseudocodePanel
            operation={viz.operation}
            currentStep={viz.currentStep}
            stepIndex={viz.stepIndex}
            steps={viz.steps}
            onPrev={viz.prevStep}
            onNext={viz.nextStep}
            canPrev={viz.canPrev}
            canNext={viz.canStep}
            onReset={resetTraversal}
          />
        </section>
      </div>
    </div>
  )
}
