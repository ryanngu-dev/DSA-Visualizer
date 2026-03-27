import { useState, useRef } from 'react'
import { BinarySearchTree } from './BinarySearchTree'
import { useBstVisualization } from '../../hooks/useBstVisualization'
import BSTView from './BSTView'
import BstPseudocodePanel from './BstPseudocodePanel'
import BstControlPanel from './BstControlPanel'
import VisualizationCanvas from '../../components/VisualizationCanvas'

const MAX_NODES = 15

export default function BinarySearchTreeVisualizer() {
  const [tree] = useState(() => new BinarySearchTree())
  const viz = useBstVisualization(tree)
  const canvasRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <section ref={canvasRef} className="w-full" aria-label="Visualization">
        <VisualizationCanvas>
          <BSTView treeSnapshot={viz.treeSnapshot} currentStep={viz.currentStep} message={viz.message} />
        </VisualizationCanvas>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-label="Operations"
        >
          <BstControlPanel tree={tree} setSteps={viz.setSteps} play={viz.play} maxNodes={MAX_NODES} />
        </section>
        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-label="Pseudocode"
        >
          <BstPseudocodePanel
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
