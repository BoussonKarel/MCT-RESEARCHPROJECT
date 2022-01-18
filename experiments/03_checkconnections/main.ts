import "./style.css"
import * as THREE from 'three'

/*
 * General
 */

/*
 * Electronics
 */

enum NodeType {
  STANDARD = 0,
}

class Node {
  constructor(position: THREE.Vector3, parent: ElectronicComponent, type = NodeType.STANDARD) {
    this.position = position
    this.type = type
    this.parent = parent
  }

  position: THREE.Vector3
  type: NodeType
  parent: ElectronicComponent
}



interface NodeList {
  [key: string]: Node
}

interface Connection {
  from: Node
  to: Node
}

const tempPosition = new THREE.Vector3(0,0,0)

let increment = 0;

class ElectronicComponent {
  constructor(object: THREE.Mesh) {
    this.name = increment
    increment++
    this.object = object
  }

  name: number
  nodes: NodeList
  object: THREE.Mesh
  connections: Connection[] = []

  addConnection(node1: Node, node2: Node) {
    node1.parent.connections.push({
      from: node1,
      to: node2
    })

    node2.parent.connections.push({
      from: node2,
      to: node1
    })
  }

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

class Arduino extends ElectronicComponent {
  constructor(object) {
    super(object)

    this.nodes = {
      "5V": new Node(tempPosition, this),
      d2: new Node(tempPosition, this),
      d3: new Node(tempPosition, this),
      GND: new Node(tempPosition, this),
    }
  }
}

class UltrasoneSensor extends ElectronicComponent {
  constructor(object) {
    super(object)

    this.nodes = {
      1: new Node(tempPosition, this),
      2: new Node(tempPosition, this),
      3: new Node(tempPosition, this),
      4: new Node(tempPosition, this),
    }
  }
}

class Cable extends ElectronicComponent {
  constructor(object) {
    super(object)

    this.nodes = {
      1: new Node(tempPosition, this),
      2: new Node(tempPosition, this),
    }

    // "Internal wiring"
    this.addConnection(this.nodes[1], this.nodes[2])
  }
}

class Resistor extends ElectronicComponent {
  constructor(object) {
    super(object)

    this.nodes = {
      1: new Node(tempPosition, this),
      2: new Node(tempPosition, this),
    }

    // "Internal wiring"
    this.addConnection(this.nodes[1], this.nodes[2])
  }
}

const arduino = new Arduino(undefined) // 0
const HCSR05 = new UltrasoneSensor(undefined) // 1
const cable1 = new Cable(undefined) // 2
const resistor = new Resistor(undefined) // 3
const cable2 = new Cable(undefined) // 4
const cable3 = new Cable(undefined) // 5
const cable4 = new Cable(undefined) // 6

arduino.addConnection(arduino.nodes["5V"], cable1.nodes[1])
arduino.addConnection(cable1.nodes[2], resistor.nodes[1])
arduino.addConnection(resistor.nodes[2], cable2.nodes[1])
arduino.addConnection(cable3.nodes[2], HCSR05.nodes[1]) // Cable that leads nowhere
arduino.addConnection(cable3.nodes[2], cable4.nodes[1]) // Cable that leads nowhere
arduino.addConnection(cable4.nodes[2], HCSR05.nodes[1]) // Cable that leads nowhere
// arduino.addConnection(cable2.nodes[2], HCSR05.nodes[1]) // Takes the first route made, not the shortest route
arduino.addConnection(arduino.nodes["5V"], HCSR05.nodes[1])

const pathULT1toARD5V = ElectronicComponent.checkConnection(
  arduino.nodes["5V"], HCSR05.nodes[1]
)
console.log(pathULT1toARD5V)

/*
 * Connections
 */
const init = () => {
  console.log("Loaded")
  const ultrasoneElement = document.querySelector("#ultrasone")
  const arduinoElement = document.querySelector("#arduino")

  // for (const [pin, value] of Object.entries(arduino.pins)) {
  //   arduinoElement.innerHTML += `[${pin}] ${value.name}<br />`
  // }

  // for (const [pin, value] of Object.entries(ultrasoneSensor.pins)) {
  //   ultrasoneElement.innerHTML += `[${pin}] ${value.name}<br />`
  // }
}

document.addEventListener('DOMContentLoaded', init)