/**
 * Builds an ordered list of visual elements (nodes and arrows as separate objects)
 * so the view can render each node and arrow explicitly.
 */

import type { NodeSnapshot, LinkedListStep, VisualElement, NodeRole } from './types'

function getHighlight(step: LinkedListStep | null): { index: number; kind: 'current' | 'found' } | null {
  if (!step) return null
  if (step.type === 'highlight') return { index: step.index, kind: 'current' }
  if (step.type === 'found') return { index: step.index, kind: 'found' }
  return null
}

function getRemovingIndex(step: LinkedListStep | null, nodes: NodeSnapshot[]): number {
  if (!step) return -1
  if (step.type === 'reroute' || step.type === 'removeAt') {
    return step.index >= 0 && step.index < nodes.length ? step.index : -1
  }
  if (step.type === 'removeByValue' && step.value !== undefined) {
    const i = nodes.findIndex((n) => n.value === step.value)
    return i >= 0 ? i : -1
  }
  return -1
}

export function buildVisualElements(
  nodes: NodeSnapshot[],
  currentStep: LinkedListStep | null
): VisualElement[] {
  const highlight = getHighlight(currentStep)
  const removingIndex = getRemovingIndex(currentStep, nodes)
  const isReroute = currentStep?.type === 'reroute'
  const isRemoveStep = currentStep?.type === 'removeAt' || currentStep?.type === 'removeByValue'
  const elements: VisualElement[] = []

  if (nodes.length === 0) return elements

  const nodeRole = (index: number): NodeRole => {
    if ((isReroute || isRemoveStep) && index === removingIndex) return 'removing'
    if (highlight?.index === index && highlight.kind === 'found') return 'found'
    if (highlight?.index === index && highlight.kind === 'current') return 'current'
    return 'normal'
  }

  // Head arrow (from "head" label to first node)
  elements.push({
    type: 'arrow',
    id: 'head-arrow',
    kind: 'head',
    delayEnter: false,
  })

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!
    const isLast = i === nodes.length - 1
    const isRemoving = removingIndex === i
    const isPrevOfRemoving = removingIndex >= 0 && i === removingIndex - 1
    const hasNextAfterRemoving = removingIndex >= 0 && removingIndex < nodes.length - 1

    // Reroute or removeAt: after the previous node, emit bypass segment
    if ((isReroute || isRemoveStep) && isPrevOfRemoving && hasNextAfterRemoving) {
      elements.push({
        type: 'node',
        id: node.id,
        value: node.value,
        role: nodeRole(i),
      })
      const removingNode = nodes[removingIndex]!
      elements.push({
        type: 'bypass',
        id: `bypass-${removingNode.id}`,
        removingNode,
        morphToStraight: isRemoveStep,
      })
      continue
    }

    if ((isReroute || isRemoveStep) && isRemoving) continue

    // Normal node
    elements.push({
      type: 'node',
      id: node.id,
      value: node.value,
      role: nodeRole(i),
    })

    // Arrow after this node
    if (isLast) {
      elements.push({
        type: 'arrow',
        id: `arrow-${node.id}-none`,
        kind: 'toNone',
        delayEnter: false,
      })
    } else {
      const nextNode = nodes[i + 1]!
      const animate = highlight?.index === i && highlight?.kind === 'current'
      elements.push({
        type: 'arrow',
        id: `arrow-${node.id}-${nextNode.id}`,
        kind: 'normal',
        animate,
        delayEnter: false,
      })
    }
  }

  return elements
}
