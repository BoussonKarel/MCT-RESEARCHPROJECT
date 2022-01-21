import * as THREE from "three"
import * as CANNON from "cannon-es"
import { Physics } from "../Physics"
import { World } from "../World"

interface CableEndOptions {
  position?: THREE.Vector3
}

export class CableEnd {
  world: World

  geometry: THREE.BoxGeometry
  material: THREE.MeshStandardMaterial
  mesh: THREE.Mesh

  physics: Physics
  physicsBody: CANNON.Body

  constructor(options?: CableEndOptions) {
    options = {
      ...options,
    }

    const size = 0.015

    // ThreeJS
    this.world = new World()

    this.geometry = new THREE.BoxGeometry(size, size, size)

    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x222222),
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    if (options.position) this.mesh.position.copy(options.position)

    this.world.scene.add(this.mesh)
    this.world.grabbables.push(this.mesh)

    // Physics
    this.physics = new Physics()

    this.physicsBody = new CANNON.Body({
      mass: 0.02, // kg
      shape: new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2)),
    })

    this.physics.addToPhysicsWorld(this.mesh, this.physicsBody)
  }
}
