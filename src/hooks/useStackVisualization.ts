import { useState, useCallback, useRef, useEffect } from 'react'
import type { StackStep, StackSnapshot, StackOperation } from '../data-structures/stack/types'
import type { Stack } from '../data-structures/stack/Stack'

function applyStep(step: StackStep, stack: Stack): void {
  switch (step.type) {
    case 'clear':
      stack.clear()
      break
    case 'push':
      stack.push(step.value)
      break
    case 'pop':
      stack.pop()
      break
    default:
      break
  }
}

const STEP_MS = 1600

export function useStackVisualization(stack: Stack) {
  const [steps, setStepsState] = useState<StackStep[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [stepStates, setStepStates] = useState<StackSnapshot[]>([])
  const [snapshot, setSnapshot] = useState<StackSnapshot>(() => stack.toSnapshot())
  const [operation, setOperationState] = useState<StackOperation | null>(null)
  const [items, setItems] = useState<StackSnapshot>(() => stack.toSnapshot())
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingPlayRef = useRef(false)

  const setSteps = useCallback(
    (newSteps: StackStep[], op: StackOperation | null = null) => {
      if (newSteps.length === 0) {
        setStepsState([])
        setStepIndex(0)
        setStepStates([])
        setOperationState(null)
        return
      }
      const snap = stack.toSnapshot()
      stack.setFromSnapshot(snap)
      const states: StackSnapshot[] = [stack.toSnapshot()]
      for (let i = 0; i < newSteps.length; i++) {
        applyStep(newSteps[i]!, stack)
        states.push(stack.toSnapshot())
      }
      setSnapshot(snap)
      setStepStates(states)
      setOperationState(op)
      setStepsState(newSteps)
      setStepIndex(0)
      setItems(states[1] ?? states[0]!)
    },
    [stack]
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
    setItems(stepStates[idx]!)
  }, [stepIndex, stepStates])

  const currentStepForDisplay = stepIndex < steps.length ? steps[stepIndex] : null
  const isPopStep = currentStepForDisplay?.type === 'pop'
  const displayedSnapshot =
    stepStates.length > 0
      ? stepStates[
          stepDirection === -1
            ? stepIndex
            : isPopStep
              ? stepIndex
              : Math.min(stepIndex + 1, stepStates.length - 1)
        ]!
      : items

  const reset = useCallback(() => {
    stack.setFromSnapshot(snapshot)
    setItems(stack.toSnapshot())
    setStepsState([])
    setStepIndex(0)
    setStepStates([])
    setOperationState(null)
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [stack, snapshot])

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
    stackSnapshot: displayedSnapshot,
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
  }
}
