import * as THREE from "three"
import { ElectronicsObject } from "./ElectronicsObject"

let instance: Arduino = null

interface ArduinoOptions {
  position?: THREE.Vector3
  rotation?: THREE.Euler
}

const defaultOptions: ArduinoOptions = {
  position: new THREE.Vector3(-0.1, 0.75, 0),
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
    this.createSimplePhysicsBox()

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
    this.world.grabbables.add(this.mesh)
  }

  addPins() {
    // BOTTOM ROW
    const bottomRowLocalCoords = new THREE.Vector3(-5.5, -24, 7.5) // move along x, 3 apart
    // First
    // Second
    bottomRowLocalCoords.x += 3
    this.createPin(
      "5V1",
      new THREE.Vector3().copy(bottomRowLocalCoords),
      'red'
    )
    // Third, fourth
    bottomRowLocalCoords.x += 2 * 3
    // Fifth
    bottomRowLocalCoords.x += 3
    this.createPin(
      "5V2",
      new THREE.Vector3().copy(bottomRowLocalCoords),
      'red'
    )
    // Sixth
    bottomRowLocalCoords.x += 3
    this.createPin(
      "GND1",
      new THREE.Vector3().copy(bottomRowLocalCoords),
      'blue'
    )
    // Seventh
    bottomRowLocalCoords.x += 3
    this.createPin(
      "GND2",
      new THREE.Vector3().copy(bottomRowLocalCoords),
      'blue'
    )

    // TOP ROW
    const topRowLocalCoords = new THREE.Vector3(-16, 24, 7.5) // move along x, 3 apart
    // First, second, third
    topRowLocalCoords.x += 2*3
    // Fourth
    topRowLocalCoords.x += 3
    this.createPin(
      "GND3",
      new THREE.Vector3().copy(topRowLocalCoords),
      'blue'
    )

    topRowLocalCoords.x += 6*3 + 1 + 4*3 // 5-10 + GAP + 11-14
    // 15
    topRowLocalCoords.x += 3
    this.createPin(
      "D3",
      // new THREE.Vector3().copy(this.mesh.position).add(topRowShift)
      new THREE.Vector3().copy(topRowLocalCoords)
    )
    // 16
    topRowLocalCoords.x += 3
    this.createPin(
      "D2",
      // new THREE.Vector3().copy(topRowShift)
      new THREE.Vector3().copy(topRowLocalCoords)
    )
  }
}
