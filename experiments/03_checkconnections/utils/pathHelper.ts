import { Node, NodeType } from '../models/Node'

export const calculatePathResistance = (path: Node[]) => {
  const parents = []
  let totalResistance = 0
  for (const step of path) {
    if (!parents.includes(step.parent)) {
      parents.push(step.parent)
      totalResistance += step.parent.resistance;
    }
  }

  return totalResistance;
}

export const pathHasOutput = (path: Node[]) => {
  const parents = []

  for (const step of path) {
    if (!parents.includes(step.parent)) {
      if (step.type === NodeType.OUTPUT) return true;
    }
  }

  return false; // No output found
}