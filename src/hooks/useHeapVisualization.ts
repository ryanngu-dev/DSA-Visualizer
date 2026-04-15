import { useState, useCallback, useRef, useEffect } from 'react'
import type { HeapStep, HeapSnapshot } from '../data-structures/binary-heap/types'
import type { BinaryHeap } from '../data-structures/binary-heap/BinaryHeap'
import type { HeapOperation } from '../data-structures/binary-heap/types'

function applyStep(step: HeapStep, heap: BinaryHeap): void {
  switch (step.type) {
    case 'clear':
      heap.clear()
      break
    case 'append':
      heap.append(step.value)
      break
    case 'swap':
      heap.swap(step.i, step.j)
      break
    case 'removeLast':
      heap.removeLast()
      break
    default:
      break
  }
}

const STEP_MS = 1600

export function useHeapVisualization(heap: BinaryHeap) {
  const [steps, setStepsState] = useState<HeapStep[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [stepStates, setStepStates] = useState<HeapSnapshot[]>([])
  const [snapshot, setSnapshot] = useState<HeapSnapshot>(() => heap.toSnapshot())
  const [operation, setOperationState] = useState<HeapOperation | null>(null)
  const [nodes, setNodes] = useState<HeapSnapshot>(() => heap.toSnapshot())
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingPlayRef = useRef(false)

  const setSteps = useCallback(
    (newSteps: HeapStep[], op: HeapOperation | null = null) => {
      if (newSteps.length === 0) {
        setStepsState([])
        setStepIndex(0)
        setStepStates([])
        setOperationState(null)
        return
      }
      const snap = heap.toSnapshot()
      heap.setFromSnapshot(snap)
      const states: HeapSnapshot[] = [heap.toSnapshot()]
      for (let i = 0; i < newSteps.length; i++) {
        applyStep(newSteps[i]!, heap)
        states.push(heap.toSnapshot())
      }
      setSnapshot(snap)
      setStepStates(states)
      setOperationState(op)
      setStepsState(newSteps)
      setStepIndex(0)
      setNodes(states[1] ?? states[0]!)
    },
    [heap]
  )

  const [stepDirection, setStepDirection] = useState<1 | -1>(1)

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
    setNodes(stepStates[idx]!)
  }, [stepIndex, stepStates])

  const currentStepForDisplay = stepIndex < steps.length ? steps[stepIndex] : null
  const isSwapOrRemove =
    currentStepForDisplay?.type === 'swap' || currentStepForDisplay?.type === 'removeLast'
  const displayedSnapshot =
    stepStates.length > 0
      ? stepStates[
          stepDirection === -1
            ? stepIndex
            : isSwapOrRemove
              ? stepIndex
              : Math.min(stepIndex + 1, stepStates.length - 1)
        ]!
      : nodes

  const reset = useCallback(() => {
    heap.setFromSnapshot(snapshot)
    setNodes(heap.toSnapshot())
    setStepsState([])
    setStepIndex(0)
    setStepStates([])
    setOperationState(null)
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [heap, snapshot])

  /** Use after external mutations (e.g. min/max mode toggle) to refresh baseline and clear steps. */
  const bumpSnapshot = useCallback(() => {
    const s = heap.toSnapshot()
    setSnapshot(s)
    setNodes(s)
    setStepsState([])
    setStepIndex(0)
    setStepStates([])
    setOperationState(null)
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [heap])

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

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const currentStep = stepIndex < steps.length ? steps[stepIndex]! : null
  const message = currentStep?.message ?? null
  const canStep = steps.length > 0 && stepIndex < steps.length - 1
  const canPrev = steps.length > 0 && stepIndex > 0
  const canPlay = steps.length > 0 && stepIndex < steps.length
  const totalSteps = steps.length

  return {
    heapSnapshot: displayedSnapshot,
    currentStep,
    message,
    operation,
    setSteps,
    nextStep,
    prevStep,
    reset,
    play,
    pause,
    isPlaying,
    stepIndex,
    totalSteps,
    steps,
    stepDirection,
    canStep,
    canPrev,
    canPlay,
    hasSteps: steps.length > 0,
    snapshot,
    bumpSnapshot,
  }
}
