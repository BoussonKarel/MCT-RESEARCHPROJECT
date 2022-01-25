import * as THREE from "three"
import { BaseObject } from "./BaseObject"

let instance: UltrasoneSensor = null

interface UltrasoneOptions {
  position?: THREE.Vector3
  range?: number,
  rotation?: THREE.Euler
}

const defaultOptions: UltrasoneOptions = {
  position: new THREE.Vector3(0, 0.77, 0),
  range: 4,
  rotation: new THREE.Euler(0,0,0)
}

export class UltrasoneSensor extends BaseObject {
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
      instance.setPR(options.position, new THREE.Euler(0,0,0))
      return instance
    } else instance = this

    // ThreeJS
    this.mesh = this.world.resources.items["Ultrasone"].scene.children[0].children[0]
    // this.mesh.geometry.center()

    this.scale = 1 / 1000 // Designed at 1000x the size (45m to 45mm)

    // Rotation, scale, position
    this.mesh.rotation.copy(options.rotation)
    this.mesh.scale.set(this.scale, this.scale, this.scale)
    if (options.position) this.mesh.position.copy(options.position)

    this.mesh.userData.parent = this
    this.world.scene.add(this.mesh)
    this.world.grabbables.push(this.mesh)

    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(
      this.mesh.quaternion
    )

    this.raycaster = new THREE.Raycaster(
      this.mesh.position,
      direction,
      0,
      options.range
    )

    this.arrowHelper = new THREE.ArrowHelper(direction, this.mesh.position, 0.5)
    this.world.scene.add(this.arrowHelper)

    // Physics test
    this.createSimplePhysicsBox()

    // Events etc
    this.world.time.on("tick", () => this.measureDistances())

    // Wrap things up in parent class
    this.finishConstructor()
  }

  measureDistances() {
    // Update raycaster and arrowhelper
    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(
      this.mesh.quaternion
    )
    this.raycaster.set(this.mesh.position, direction)
    this.arrowHelper.position.copy(this.mesh.position)
    this.arrowHelper.setDirection(
      new THREE.Vector3(0, 0, 1).applyQuaternion(this.mesh.quaternion)
    )

    // Cast ray
    const otherObjects = this.world.scene.children.filter(
      (c) => c != this.mesh && c != this.arrowHelper
    )
    const intersects = this.raycaster.intersectObjects(otherObjects)

    if (intersects.length > 0) {
      const distance = Math.max(Math.round(intersects[0].distance * 100), 2)
      console.log("De ultrasone meet: ", distance, "centimeter")
    }
  }
}
