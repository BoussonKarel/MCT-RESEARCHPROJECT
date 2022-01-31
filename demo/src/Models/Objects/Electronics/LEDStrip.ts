import * as THREE from "three"
import { ElectronicsObject } from "./ElectronicsObject"

let instance: LEDStrip = null

interface LEDStripOptions {
  position?: THREE.Vector3
  rotation?: THREE.Euler
}

const defaultOptions: LEDStripOptions = {
  position: new THREE.Vector3(0, 0.75, 0),
  rotation: new THREE.Euler(0, 0, 0),
}

export class LEDStrip extends ElectronicsObject {
  lights: THREE.Light[]

  constructor(options?: LEDStripOptions) {
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

    // Lights
    this.addLights()

    // Add pins
    this.addPins()

    // Physics
    this.createSimplePhysicsBox()

    // Events etc
    this.world.time.on("tick", () => {})

    // Wrap things up in parent class
    this.finishConstructor()
  }

  setup3D(options: LEDStripOptions) {
    // Mesh, no geometry or material, we are using a resource
    this.mesh =
      this.world.resources.items["LEDStrip"].scene.children[0].children[0]

    // Scale
    this.scale = 1 / 1000 // Designed at 1000x the size

    // Transform
    this.mesh.rotation.copy(options.rotation)
    this.mesh.scale.set(this.scale, this.scale, this.scale)
    if (options.position) this.mesh.position.copy(options.position)

    // Make grabbable
    this.world.grabbables.add(this.mesh)
  }

  addLights() {
    // first light at 0,-45,0
    const localPosition = new THREE.Vector3(0, -45, 3)
    const geometry = new THREE.SphereGeometry(3)
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
    material.transparent = true
    material.opacity = .5
    // 6 lights
    for (let i = 0; i < 6; i++) {
      const lightHelper = new THREE.Mesh(geometry, material)
      this.mesh.add(lightHelper)
      lightHelper.position.copy(localPosition)

      localPosition.y += 15
    }
  }

  addPins() {

  }
}
