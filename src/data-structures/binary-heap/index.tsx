import { useState, useRef } from 'react'
import { BinaryHeap } from './BinaryHeap'
import { useHeapVisualization } from '../../hooks/useHeapVisualization'
import HeapView from './HeapView'
import HeapPseudocodePanel from './HeapPseudocodePanel'
import HeapControlPanel from './HeapControlPanel'
import VisualizationCanvas from '../../components/VisualizationCanvas'

const MAX_NODES = 15

export default function BinaryHeapVisualizer() {
  const [heap] = useState(() => new BinaryHeap())
  const viz = useHeapVisualization(heap)
  const canvasRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <section ref={canvasRef} className="w-full" aria-label="Visualization">
        <VisualizationCanvas
          stepControls={{
            onPrev: viz.prevStep,
            onNext: viz.nextStep,
            canPrev: viz.canPrev,
            canNext: viz.canStep,
          }}
        >
          <HeapView heapSnapshot={viz.heapSnapshot} currentStep={viz.currentStep} message={viz.message} />
        </VisualizationCanvas>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-label="Operations"
        >
          <HeapControlPanel
            heap={heap}
            setSteps={viz.setSteps}
            play={viz.play}
            bumpSnapshot={viz.bumpSnapshot}
            maxNodes={MAX_NODES}
          />
        </section>
        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-label="Pseudocode"
        >
          <HeapPseudocodePanel
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
