import { useCallback, useEffect, useRef, useState } from 'react'
import type { HashMapModel } from '../data-structures/hash-map/HashMapModel'
import type { HashMapOperation, HashMapSnapshot, HashMapStep } from '../data-structures/hash-map/types'

function applyStep(step: HashMapStep, map: HashMapModel): void {
  switch (step.type) {
    case 'clear':
      map.clear()
      break
    case 'upsert':
      map.set(step.key)
      break
    case 'remove':
      map.delete(step.key)
      break
    default:
      break
  }
}

const STEP_MS = 1600

export function useHashMapVisualization(map: HashMapModel) {
  const [steps, setStepsState] = useState<HashMapStep[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [stepStates, setStepStates] = useState<HashMapSnapshot[]>([])
  const [snapshot, setSnapshot] = useState<HashMapSnapshot>(() => map.toSnapshot())
  const [operation, setOperationState] = useState<HashMapOperation | null>(null)
  const [currentMap, setCurrentMap] = useState<HashMapSnapshot>(() => map.toSnapshot())
  const [isPlaying, setIsPlaying] = useState(false)
  const [stepDirection, setStepDirection] = useState<1 | -1>(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingPlayRef = useRef(false)

  const setSteps = useCallback(
    (newSteps: HashMapStep[], op: HashMapOperation | null = null) => {
      if (newSteps.length === 0) {
        setStepsState([])
        setStepIndex(0)
        setStepStates([])
        setOperationState(null)
        return
      }
      const snap = map.toSnapshot()
      map.setFromSnapshot(snap)
      const states: HashMapSnapshot[] = [map.toSnapshot()]
      for (let i = 0; i < newSteps.length; i++) {
        applyStep(newSteps[i]!, map)
        states.push(map.toSnapshot())
      }
      setSnapshot(snap)
      setStepStates(states)
      setOperationState(op)
      setStepsState(newSteps)
      setStepIndex(0)
      setCurrentMap(states[1] ?? states[0]!)
    },
    [map]
  )

  const nextStep = useCallback(() => {
    setStepDirection(1)
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }, [steps.length])

  const prevStep = useCallback(() => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setStepDirection(-1)
    setStepIndex((i) => (i <= 0 ? 0 : i - 1))
  }, [])

  useEffect(() => {
    if (stepStates.length === 0) return
    const idx = Math.min(stepIndex + 1, stepStates.length - 1)
    setCurrentMap(stepStates[idx]!)
  }, [stepIndex, stepStates])

  const currentStepForDisplay = stepIndex < steps.length ? steps[stepIndex] : null
  const isRemoveStep = currentStepForDisplay?.type === 'remove'
  const displayedSnapshot =
    stepStates.length > 0
      ? stepStates[
          stepDirection === -1
            ? stepIndex
            : isRemoveStep
              ? stepIndex
              : Math.min(stepIndex + 1, stepStates.length - 1)
        ]!
      : currentMap

  const reset = useCallback(() => {
    map.setFromSnapshot(snapshot)
    setCurrentMap(map.toSnapshot())
    setStepsState([])
    setStepIndex(0)
    setStepStates([])
    setOperationState(null)
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [map, snapshot])

  useEffect(() => {
    if (!isPlaying || stepIndex >= steps.length) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (isPlaying && steps.length > 0 && stepIndex >= steps.length) {
        setIsPlaying(false)
      }
      return
    }
    intervalRef.current = setInterval(() => {
      nextStep()
    }, STEP_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, stepIndex, steps.length, nextStep])

  const play = useCallback(() => {
    if (steps.length === 0) {
      pendingPlayRef.current = true
      return
    }
    pendingPlayRef.current = false
    setIsPlaying(true)
  }, [steps.length])

  useEffect(() => {
    if (!pendingPlayRef.current) return
    if (steps.length === 0) return
    pendingPlayRef.current = false
    setIsPlaying(true)
  }, [steps.length])

  const currentStep = stepIndex < steps.length ? steps[stepIndex]! : null
  const message = currentStep?.message ?? null
  const canStep = steps.length > 0 && stepIndex < steps.length - 1
  const canPrev = steps.length > 0 && stepIndex > 0

  return {
    hashMapSnapshot: displayedSnapshot,
    currentStep,
    message,
    operation,
    setSteps,
    nextStep,
    prevStep,
    reset,
    play,
    isPlaying,
    stepIndex,
    steps,
    canStep,
    canPrev,
  }
}
