import * as THREE from "three"
import { Connection } from "./Objects/Electronics/Connection";
import { Pin } from "./Objects/Electronics/Pin";
import { World } from "./World";

const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );

let instance = null

export class ElectronicsWorld {
  world: World
  connections: Connection[] = []
  lines: THREE.Line[] = []

  constructor() {
    if (instance) return instance
    instance = this

    this.world = new World()

    this.world.time.on('tick', () => this.drawConnections())
  }

  addConnection(pin1: Pin, pin2: Pin) {
    if (pin1.parent === pin2.parent) {
      console.log("Cannot connect two pins from the same parent")
      return
    }
  
    const pin1connections = this.connections.filter(p => p.a === pin1 || p.b === pin2)
    if (pin1connections.some((p) => p.a === pin2 || p.b === pin2)) {
      console.log("This exact connection already exists")
      return
    }
    if (pin1connections.length > 0) {
      console.log("Pin 1 already connected somewhere")
    }
  
    const pin2hasConnection = this.connections.some(p => p.a === pin2 || p.b === pin2)
    if (pin2hasConnection) {
      console.log("Pin 2 already connected somewhere")
    }
  
    if (pin1connections.length > 0 || pin2hasConnection) return
  
    // Create connection
    this.connections.push({
      a: pin1,
      b: pin2,
    })
    // Also store the other way around
    this.connections.push({
      a: pin2,
      b: pin1,
    })
  }

  checkConnection(goal: Pin, v: Pin, discovered = [], path = []) {
    // discovered: list of ALL nodes we visited
    // path: list of nodes we visited, leading to our goal
    path.push(v) // Add v this to our path
    discovered.push(v) // List of ALL nodes we visited

    if (goal === v) return path // If we have reached our goal, return the used path

    // Check the other connections...
    const otherConnections = this.connections.filter((conn) => {
      // ...coming from the parent on this node 'v' and going to a node that hasn't been visited yet
      return conn.a === v && !discovered.includes(conn.b)
    })

    for (const conn of otherConnections) {
      const newPath = this.checkConnection(goal, conn.b, discovered, path)

      if (newPath.length > 0) {
        // If this new path is > 0
        return newPath
      } else {
        // Else remove this node from the path
        const index = path.findIndex((v) => v === conn.b)
        path.splice(index, 1)
      }
    }

    return [] // No path found
  }

  drawConnections() {
    // Remove all lines
    for (const line of this.lines) {
      this.world.scene.remove(line)
    }
    this.lines = []

    const drawnPins: Pin[] = []

    for (const conn of this.connections) {
      if (drawnPins.includes(conn.a) || drawnPins.includes(conn.b)) return
      drawnPins.push(conn.a, conn.b)

      // Draw line
      const posA = conn.a.mesh.parent.localToWorld(new THREE.Vector3().copy(conn.a.mesh.position))
      const posB = conn.b.mesh.parent.localToWorld(new THREE.Vector3().copy(conn.b.mesh.position))
      const geometry = new THREE.BufferGeometry().setFromPoints([posA, posB])

      const line = new THREE.Line(geometry, lineMaterial)
      this.lines.push(line)
      this.world.scene.add(line)
    }
  }
}