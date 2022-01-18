import { Node } from '../models/Node'

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