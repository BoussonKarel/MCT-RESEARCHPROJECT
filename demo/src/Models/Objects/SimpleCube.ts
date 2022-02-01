import * as THREE from "three"
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
    this.setup3D(options)

    // Physics
    this.createSimplePhysicsBox()

    // Wrap things up in parent class
    this.finishConstructor()
  }

  setup3D(options: SimpleCubeOptions) {
    // Geometry
    this.geometry = new THREE.BoxGeometry(
      options.size,
      options.size,
      options.size
    )

    // Material
    this.material = new THREE.MeshStandardMaterial({
      color: options.color,
    })

    // Mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    // SHADOW
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    
    // Transform
    if (options.position) this.mesh.position.copy(options.position)

    // Make grabbable
    this.world.grabbables.push(this.mesh)
  }
}
