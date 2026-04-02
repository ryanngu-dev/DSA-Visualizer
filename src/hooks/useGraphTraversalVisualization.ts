import { useState, useCallback, useRef, useEffect } from 'react'
import type { GraphTraversalStep } from '../data-structures/graph-traversal/types'
import type { GraphOperation } from '../data-structures/graph-traversal/types'

/** Slower than list/BST so each visit is easy to follow. */
const STEP_MS = 4200

export function useGraphTraversalVisualization() {
  const [steps, setStepsState] = useState<GraphTraversalStep[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [operation, setOperationState] = useState<GraphOperation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingPlayRef = useRef(false)

  const setSteps = useCallback((newSteps: GraphTraversalStep[], op: GraphOperation | null = null) => {
    if (newSteps.length === 0) {
      setStepsState([])
      setStepIndex(0)
      setOperationState(null)
      return
    }
    setStepsState(newSteps)
    setOperationState(op)
    setStepIndex(0)
  }, [])

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
    if (!isPlaying || steps.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false)
      return
    }
    intervalRef.current = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1))
    }, STEP_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, stepIndex, steps.length])

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

  const reset = useCallback(() => {
    setStepsState([])
    setStepIndex(0)
    setOperationState(null)
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const currentStep = stepIndex < steps.length ? steps[stepIndex]! : null
  const message = currentStep?.message ?? null
  const canStep = steps.length > 0 && stepIndex < steps.length - 1
  const canPrev = steps.length > 0 && stepIndex > 0
  const canPlay = steps.length > 0 && stepIndex < steps.length
  const totalSteps = steps.length

  return {
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
  }
}
