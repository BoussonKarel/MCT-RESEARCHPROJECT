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

export const checkConnection = (goal: Node, v: Node, discovered = [], path = []) => {
  // discovered: list of ALL nodes we visited
  // path: list of nodes we visited, leading to our goal
  path.push(v) // Add v this to our path
  discovered.push(v) // List of ALL nodes we visited

  if (goal === v) return path; // If we have reached our goal, return the used path

  // Check the other connections...
  const otherConnections = v.parent.connections.filter(conn => {
    // ...coming from the parent on this node 'v' and going to a node that hasn't been visited yet
    return conn.from === v && !discovered.includes(conn.to);
  })

  for (const conn of otherConnections) {
    const newPath = checkConnection(goal, conn.to, discovered, path);

    if (newPath.length > 0) {
      // If this new path is > 0
      return newPath;
    } else {
      // Else remove this node from the path
      const index = path.findIndex(v => v === conn.to)
      path.splice(index, 1)
    }
  }

  return []; // No path found
}