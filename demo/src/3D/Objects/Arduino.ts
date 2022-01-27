import * as THREE from "three"
import { ElectronicsObject } from "./Electronics/ElectronicsObject"

let instance: Arduino = null

interface ArduinoOptions {
  position?: THREE.Vector3
  rotation?: THREE.Euler
}

const defaultOptions: ArduinoOptions = {
  position: new THREE.Vector3(0, 0.75, 0),
  rotation: new THREE.Euler(-Math.PI / 2, 0, -Math.PI/2),
}

export class Arduino extends ElectronicsObject {
  constructor(options?: ArduinoOptions) {
    super()

    options = {
      ...defaultOptions,
      ...options,
    }

    // Only 1 ultrasone sensor can exist
    if (instance) {
      instance.setPR(options.position, options.rotation)
      return instance
    } else instance = this

    // ThreeJS
    this.setup3D(options)

    // Add pins
    this.addPins()

    // Physics
    // this.createSimplePhysicsBox()

    // Events etc
    this.world.time.on("tick", () => {})

    // Wrap things up in parent class
    this.finishConstructor()
  }

  setup3D(options: ArduinoOptions) {
    // Mesh, no geometry or material, we are using a resource
    this.mesh =
      this.world.resources.items["Arduino"].scene.children[0].children[0]

    // Scale
    this.scale = 1 / 1000 // Designed at 1000x the size (45m to 45mm)

    // Transform
    this.mesh.rotation.copy(options.rotation)
    this.mesh.scale.set(this.scale, this.scale, this.scale)
    if (options.position) this.mesh.position.copy(options.position)

    // Make grabbable
    this.world.grabbables.push(this.mesh)
  }

  addPins() {
    // BOTTOM ROW
    const bottomRowShift = new THREE.Vector3(-5, -24.5, 7.5) // move along x, 3 apart
    // First
    // Second
    bottomRowShift.x += 3
    this.createPin(
      "5V1",
      new THREE.Vector3().copy(this.mesh.position).add(bottomRowShift),
      'red'
    )
    // Third, fourth
    bottomRowShift.x += 2 * 3
    // Fifth
    bottomRowShift.x += 3
    this.createPin(
      "5V2",
      new THREE.Vector3().copy(this.mesh.position).add(bottomRowShift),
      'red'
    )
    // Sixth
    bottomRowShift.x += 3
    this.createPin(
      "GND1",
      new THREE.Vector3().copy(this.mesh.position).add(bottomRowShift),
      'blue'
    )
    // Seventh
    bottomRowShift.x += 3
    this.createPin(
      "GND2",
      new THREE.Vector3().copy(this.mesh.position).add(bottomRowShift),
      'blue'
    )

    // TOP ROW
    const topRowShift = new THREE.Vector3(-16, 23.5, 7.5) // move along x, 3 apart
    // First, second, third
    topRowShift.x += 2*3
    // Fourth
    topRowShift.x += 3
    this.createPin(
      "GND3",
      new THREE.Vector3().copy(this.mesh.position).add(topRowShift),
      'blue'
    )

    topRowShift.x += 6*3 + 1 + 4*3 // 5-10 + GAP + 11-14
    // 15
    topRowShift.x += 3
    this.createPin(
      "D3",
      new THREE.Vector3().copy(this.mesh.position).add(topRowShift)
    )
    // 16
    topRowShift.x += 3
    this.createPin(
      "D2",
      new THREE.Vector3().copy(this.mesh.position).add(topRowShift)
    )
  }
}
