import * as THREE from "three"
import { ElectronicsObject } from "./Electronics/ElectronicsObject"

let instance: Arduino = null

interface ArduinoOptions {
  position?: THREE.Vector3
  rotation?: THREE.Euler
}

const defaultOptions: ArduinoOptions = {
  position: new THREE.Vector3(0, .75, 0),
  rotation: new THREE.Euler(-Math.PI/2, 0, 0),
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
    this.world.time.on("tick", () => {

    })

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
    // const names = ["1", "2", "3", "4"]

    // // first pin location
    // const shift = new THREE.Vector3(-4.5, -16, 1)
    // for (const name of names) {
    //   const pos = new THREE.Vector3().copy(this.mesh.position).add(shift)

    //   this.createPin(name, pos)

    //   shift.x += 3 // move to next pin (3mm apart)
    // }
  }
}
