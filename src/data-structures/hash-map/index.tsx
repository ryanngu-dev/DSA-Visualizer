import { useState } from 'react'
import VisualizationCanvas from '../../components/VisualizationCanvas'
import { HashMapModel } from './HashMapModel'
import { useHashMapVisualization } from '../../hooks/useHashMapVisualization'
import HashMapView from './HashMapView'
import HashMapControlPanel from './HashMapControlPanel'
import HashMapPseudocodePanel from './HashMapPseudocodePanel'

export default function HashMapVisualizer() {
  const [map] = useState(() => new HashMapModel(6))
  const viz = useHashMapVisualization(map)

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <section className="w-full" aria-label="Visualization">
        <VisualizationCanvas
          stepControls={{
            onPrev: viz.prevStep,
            onNext: viz.nextStep,
            canPrev: viz.canPrev,
            canNext: viz.canStep,
          }}
        >
          <HashMapView hashMapSnapshot={viz.hashMapSnapshot} currentStep={viz.currentStep} message={viz.message} />
        </VisualizationCanvas>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
          aria-label="Operations"
        >
          <HashMapControlPanel map={map} setSteps={viz.setSteps} play={viz.play} />
        </section>
        <section
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
          aria-label="Pseudocode"
        >
          <HashMapPseudocodePanel
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
