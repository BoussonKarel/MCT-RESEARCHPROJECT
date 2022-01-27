import * as THREE from "three"
import { ElectronicsObject } from "./Electronics/ElectronicsObject"

let instance: UltrasoneSensor = null

const arrowHelperVisible = false

interface Range {
  min: number
  max: number
}

interface UltrasoneOptions {
  position?: THREE.Vector3
  range?: Range
  rotation?: THREE.Euler
}

const defaultOptions: UltrasoneOptions = {
  position: new THREE.Vector3(0, .75, 0),
  range: { min: 0, max: 4 },
  rotation: new THREE.Euler(-Math.PI/2, 0, 0),
}

const defaultDirection = new THREE.Vector3(0, 0, 1) // Along z-axis

export class UltrasoneSensor extends ElectronicsObject {
  raycaster: THREE.Raycaster
  arrowHelper: THREE.ArrowHelper

  constructor(options?: UltrasoneOptions) {
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
      this.measureDistances()
    })

    // Wrap things up in parent class
    this.finishConstructor()
  }

  setup3D(options: UltrasoneOptions) {
    // Mesh, no geometry or material, we are using a resource
    this.mesh =
      this.world.resources.items["Ultrasone"].scene.children[0].children[0]

    // Scale
    this.scale = 1 / 1000 // Designed at 1000x the size (45m to 45mm)

    // Transform
    this.mesh.rotation.copy(options.rotation)
    this.mesh.scale.set(this.scale, this.scale, this.scale)
    if (options.position) this.mesh.position.copy(options.position)

    // Make grabbable
    this.world.grabbables.push(this.mesh)

    this.setRaycaster()
  }

  addPins() {
    const names = ["1", "2", "3", "4"]

    // first pin location
    const shift = new THREE.Vector3(-4.5, -16, 1)
    for (const name of names) {
      const pos = new THREE.Vector3().copy(this.mesh.position).add(shift)

      this.createPin(name, pos)

      shift.x += 3 // move to next pin (3mm apart)
    }
  }

  setRaycaster(range: Range = defaultOptions.range) {
    // defaultDirection = world z-axis
    // Rotate this so it matches the object z-axis (apply the same quaternion)
    const direction = new THREE.Vector3()
      .copy(defaultDirection)
      .applyQuaternion(this.mesh.quaternion)

    // if the raycaster doesn't exist: create
    if (!this.raycaster) {
      this.raycaster = new THREE.Raycaster()
      this.raycaster.near = range.min
      this.raycaster.far = range.max

      this.arrowHelper = new THREE.ArrowHelper()
      this.arrowHelper.setLength(0.5)
      this.world.scene.add(this.arrowHelper)
    }

    this.arrowHelper.position.copy(this.mesh.position)
    this.arrowHelper.setDirection(direction)
    this.arrowHelper.visible = arrowHelperVisible

    this.raycaster.set(this.mesh.position, direction)
  }

  measureDistances() {
    // Update raycaster and arrowhelper
    this.setRaycaster()

    // Cast ray
    const otherObjects = this.world.scene.children.filter(
      (obj) => obj != this.mesh && obj != this.arrowHelper
      // @ts-ignore
      && !this.electronicsWorld.connections.some(conn => conn.line === obj)
    )
    const intersects = this.raycaster.intersectObjects(otherObjects)

    if (intersects.length > 0) {
      const distance = Math.max(Math.round(intersects[0].distance * 100), 2)
      console.log("De ultrasone meet: ", distance, "centimeter")
    }
  }
}
