import { Node } from './Node'

export interface Connection {
  from: Node
  to: Node
}

export const addConnection = (node1: Node, node2: Node) => {
  node1.parent.connections.push({
    from: node1,
    to: node2
  })

  node2.parent.connections.push({
    from: node2,
    to: node1
  })
}