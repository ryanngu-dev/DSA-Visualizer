import { useState, useCallback, useRef, useEffect } from 'react'
import type { BSTStep } from '../data-structures/binary-search-tree/types'
import type { BSTSnapshotNode } from '../data-structures/binary-search-tree/types'
import type { BinarySearchTree } from '../data-structures/binary-search-tree/BinarySearchTree'
import type { BSTOperation } from '../data-structures/binary-search-tree/types'

function applyStep(step: BSTStep, tree: BinarySearchTree): void {
  switch (step.type) {
    case 'clear':
      tree.clear()
      break
    case 'insert':
      tree.insert(step.value)
      break
    case 'remove':
      tree.remove(step.value)
      break
    default:
      break
  }
}

const STEP_MS = 1600

export function useBstVisualization(tree: BinarySearchTree) {
  const [steps, setStepsState] = useState<BSTStep[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [stepStates, setStepStates] = useState<(BSTSnapshotNode | null)[]>([])
  const [snapshot, setSnapshot] = useState<BSTSnapshotNode | null>(() => tree.toSnapshot())
  const [operation, setOperationState] = useState<BSTOperation | null>(null)
  const [nodes, setNodes] = useState<BSTSnapshotNode | null>(() => tree.toSnapshot())
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingPlayRef = useRef(false)

  const setSteps = useCallback(
    (newSteps: BSTStep[], op: BSTOperation | null = null) => {
      if (newSteps.length === 0) {
        setStepsState([])
        setStepIndex(0)
        setStepStates([])
        setOperationState(null)
        return
      }
      const snap = tree.toSnapshot()
      tree.setFromSnapshot(snap)
      const states: (BSTSnapshotNode | null)[] = [tree.toSnapshot()]
      for (let i = 0; i < newSteps.length; i++) {
        applyStep(newSteps[i]!, tree)
        states.push(tree.toSnapshot())
      }
      setSnapshot(snap)
      setStepStates(states)
      setOperationState(op)
      setStepsState(newSteps)
      setStepIndex(0)
      setNodes(states[1] ?? states[0]!)
    },
    [tree]
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
      : nodes

  const reset = useCallback(() => {
    tree.setFromSnapshot(snapshot)
    setNodes(tree.toSnapshot())
    setStepsState([])
    setStepIndex(0)
    setStepStates([])
    setOperationState(null)
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [tree, snapshot])

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
    treeSnapshot: displayedSnapshot,
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
