import { useRef, useState } from 'react'
import VisualizationCanvas from '../../components/VisualizationCanvas'
import { Queue } from './Queue'
import { useQueueVisualization } from '../../hooks/useQueueVisualization'
import QueueView from './QueueView'
import QueueControlPanel from './QueueControlPanel'
import QueuePseudocodePanel from './QueuePseudocodePanel'

const MAX_NODES = 12

export default function QueueVisualizer() {
  const [queue] = useState(() => new Queue())
  const viz = useQueueVisualization(queue)
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
          <QueueView queueSnapshot={viz.queueSnapshot} currentStep={viz.currentStep} message={viz.message} />
        </VisualizationCanvas>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
          aria-label="Operations"
        >
          <QueueControlPanel queue={queue} setSteps={viz.setSteps} play={viz.play} maxNodes={MAX_NODES} />
        </section>
        <section
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
          aria-label="Pseudocode"
        >
          <QueuePseudocodePanel
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
