import { useRef, useState } from 'react'
import VisualizationCanvas from '../../components/VisualizationCanvas'
import { Stack } from './Stack'
import { useStackVisualization } from '../../hooks/useStackVisualization'
import StackView from './StackView'
import StackControlPanel from './StackControlPanel'
import StackPseudocodePanel from './StackPseudocodePanel'

const MAX_NODES = 12

export default function StackVisualizer() {
  const [stack] = useState(() => new Stack())
  const viz = useStackVisualization(stack)
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
          <StackView stackSnapshot={viz.stackSnapshot} currentStep={viz.currentStep} message={viz.message} />
        </VisualizationCanvas>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-label="Operations"
        >
          <StackControlPanel stack={stack} setSteps={viz.setSteps} play={viz.play} maxNodes={MAX_NODES} />
        </section>
        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-label="Pseudocode"
        >
          <StackPseudocodePanel
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
