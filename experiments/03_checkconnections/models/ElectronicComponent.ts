import * as THREE from 'three'
import { Connection } from './Connection';
import { Node } from './Node'
import { NodeList } from './Node'

let increment = 0;

export const tempPosition = new THREE.Vector3(0,0,0)

export class ElectronicComponent {
  constructor(object: THREE.Mesh) {
    this.name = increment
    increment++
    this.object = object
  }

  name: number
  nodes: NodeList
  object: THREE.Mesh
  connections: Connection[] = []
  resistance: number = 0

  static checkConnection(goal: Node, v: Node, discovered = [], path = []) {
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
      const newPath = this.checkConnection(goal, conn.to, discovered, path);

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
}