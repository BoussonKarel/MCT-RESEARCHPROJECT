import * as THREE from "three"
import { BaseObject } from "./BaseObject"

let instance: LDR = null

interface LDROptions {
  position?: THREE.Vector3
}

const defaultOptions: LDROptions = {
  position: new THREE.Vector3(0, 0.77, 0),
}

const defaultDirection = new THREE.Vector3(0,0,1) // Along z-axis

export class LDR extends BaseObject {
  constructor(options?: LDROptions) {
    super()

    options = {
      ...defaultOptions,
      ...options,
    }

    // Only 1 ultrasone sensor can exist
    if (instance) {
      instance.setPR(options.position, new THREE.Euler(0,0,0))
      return instance
    } else instance = this

    // ThreeJS
    this.setup3D(options)

    // Physics
    this.createSimplePhysicsBox()

    // Events etc
    // this.world.time.on("tick", () => this.measureLightIntensity())

    // Wrap things up in parent class
    this.finishConstructor()
  }

  setup3D(options: LDROptions) {
    // Mesh, no geometry or material, we are using a resource
    this.mesh = this.world.resources.items["LDR"].scene.children[0].children[0]

    // Scale
    this.scale = 1 / 1000 // Designed at 1000x the size (45m to 45mm)

    // Transform
    this.mesh.rotation.x = -Math.PI/2
    this.mesh.scale.set(this.scale, this.scale, this.scale)
    if (options.position) this.mesh.position.copy(options.position)

    // Make grabbable
    this.world.grabbables.push(this.mesh)
  }

  measureLightIntensity() {
    console.log("There is no way to measure light in Three.JS")
  }
}
