import { useState, useCallback, useRef, useEffect } from 'react'
import type { LinkedListStep } from '../data-structures/linked-list/types'
import type { NodeSnapshot } from '../data-structures/linked-list/types'
import type { LinkedList } from '../data-structures/linked-list/LinkedList'

function applyStep(step: LinkedListStep, list: LinkedList): void {
  switch (step.type) {
    case 'createClear':
      list.clear()
      break
    case 'insertHead':
      list.insertHead(step.value)
      break
    case 'insertTail':
      list.insertTail(step.value)
      break
    case 'insertAt':
      list.insertAt(step.index, step.value)
      break
    case 'removeAt':
      list.removeAt(step.index)
      break
    case 'removeByValue':
      list.removeByValue(step.value)
      break
    default:
      break
  }
}

const STEP_MS = 1600

export type LinkedListOperation =
  | { type: 'create'; values: number[] }
  | { type: 'insert'; position: 'head' | 'tail' | 'index'; value: number; index?: number }
  | { type: 'remove'; mode: 'index' | 'value'; index?: number; value?: number }
  | { type: 'search'; value: number }

export function useVisualization(list: LinkedList) {
  const [steps, setStepsState] = useState<LinkedListStep[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [stepStates, setStepStates] = useState<NodeSnapshot[][]>([])
  const [snapshot, setSnapshot] = useState<NodeSnapshot[]>([])
  const [operation, setOperationState] = useState<LinkedListOperation | null>(null)
  const [nodes, setNodes] = useState<NodeSnapshot[]>(() => list.toArray())
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingPlayRef = useRef(false)

  const setSteps = useCallback(
    (newSteps: LinkedListStep[], op: LinkedListOperation | null = null) => {
      if (newSteps.length === 0) {
        setStepsState([])
        setStepIndex(0)
        setStepStates([])
        setOperationState(null)
        return
      }
      const snap = list.toArray()
      list.setFromSnapshot(snap)
      const states: NodeSnapshot[][] = [list.toArray()]
      for (let i = 0; i < newSteps.length; i++) {
        applyStep(newSteps[i]!, list)
        states.push(list.toArray())
      }
      setSnapshot(snap)
      setStepStates(states)
      setOperationState(op)
      setStepsState(newSteps)
      setStepIndex(0)
      setNodes(states[1] ?? states[0]!)
    },
    [list]
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
  const keepPreRemoveSnapshot =
    currentStepForDisplay?.type === 'removeByValue' ||
    (currentStepForDisplay?.type === 'removeAt' && currentStepForDisplay.index > 0)
  const displayedNodes =
    stepStates.length > 0
      ? stepStates[
          stepDirection === -1
            ? stepIndex
            : keepPreRemoveSnapshot
              ? stepIndex
              : Math.min(stepIndex + 1, stepStates.length - 1)
        ]!
      : nodes

  const reset = useCallback(() => {
    list.setFromSnapshot(snapshot)
    setNodes(list.toArray())
    setStepsState([])
    setStepIndex(0)
    setStepStates([])
    setOperationState(null)
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [list, snapshot])

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
    // If play is invoked before steps state has updated (common right after setSteps),
    // queue it and start as soon as steps arrive.
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
    nodes: displayedNodes,
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
