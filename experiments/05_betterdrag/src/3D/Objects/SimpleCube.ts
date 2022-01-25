import * as THREE from "three"
import * as CANNON from "cannon-es"
import { Physics } from "../Physics"
import { World } from "../World"
import { BaseObject } from "./BaseObject"

interface SimpleCubeOptions {
  position?: THREE.Vector3
  size?: number
  color?: THREE.Color
}

const defaultOptions: SimpleCubeOptions = {
  size: 0.1, // default
  color: new THREE.Color("red"), // default
}

export class SimpleCube extends BaseObject {
  geometry: THREE.BoxGeometry
  material: THREE.MeshStandardMaterial

  constructor(options?: SimpleCubeOptions) {
    options = {
      ...defaultOptions, // defaults
      ...options, // user parameters
    }

    super()
    // ThreeJS
    this.geometry = new THREE.BoxGeometry(
      options.size,
      options.size,
      options.size
    )

    this.material = new THREE.MeshStandardMaterial({
      color: options.color,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    

    if (options.position) this.mesh.position.copy(options.position)

    this.mesh.userData.parent = this
    this.world.scene.add(this.mesh)
    this.world.grabbables.push(this.mesh)

    // Physics
    this.createSimplePhysicsBox()

    // Wrap things up in parent class
    this.finishConstructor()
  }
}
