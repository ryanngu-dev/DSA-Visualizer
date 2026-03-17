import { useState, useRef } from 'react'
import { LinkedList } from './LinkedList'
import { useVisualization } from '../../hooks/useVisualization'
import LinkedListView from './LinkedListView'
import PseudocodePanel from './PseudocodePanel'
import ControlPanel from '../../components/ControlPanel'
import VisualizationCanvas from '../../components/VisualizationCanvas'

const MAX_NODES = 6

export default function LinkedListVisualizer() {
  const [list] = useState(() => new LinkedList())
  const viz = useVisualization(list)
  const canvasRef = useRef<HTMLDivElement>(null)
  const maxNodes = MAX_NODES

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Top: visualization */}
      <section ref={canvasRef} className="w-full" aria-label="Visualization">
        <VisualizationCanvas>
          <LinkedListView
            nodes={viz.nodes}
            currentStep={viz.currentStep}
            message={viz.message}
            stepDirection={viz.stepDirection}
          />
        </VisualizationCanvas>
      </section>

      {/* Bottom: left = Create/Search/Insert/Remove, right = pseudocode + step controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-label="Operations">
          <ControlPanel
            list={list}
            setSteps={viz.setSteps}
            play={viz.play}
            maxNodes={maxNodes}
          />
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-label="Pseudocode">
          <PseudocodePanel
            operation={viz.operation}
            currentStep={viz.currentStep}
            stepIndex={viz.stepIndex}
            steps={viz.steps}
            onPrev={viz.prevStep}
            onNext={viz.nextStep}
            canPrev={viz.canPrev}
            canNext={viz.canStep}
            onReset={viz.reset}
          />
        </section>
      </div>
    </div>
  )
}
