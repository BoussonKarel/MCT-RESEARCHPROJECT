import * as THREE from "three"
import * as CANNON from "cannon-es"
import { Physics } from "../../Physics"
import { World } from "../../World"
import { AxesHelper } from "three"

export class Desk {
  world: World

  deskHeight: number
  mesh: THREE.Mesh

  physics: Physics
  physicsBody: CANNON.Body

  constructor() {
    this.world = new World()

    // ThreeJS

    this.deskHeight = 0.73 // 73cm
    this.mesh = this.world.resources.items["Desk"].scene.children[0].children[0]

    this.mesh.rotation.x = -Math.PI/2
    this.mesh.geometry.center()

    this.mesh.scale.set(1 / 100, 1 / 100, 1 / 100) // From 73m to 73cm
    this.mesh.position.set(0, 0 + this.deskHeight/2, 0)

    this.world.scene.add(this.mesh)

    const axesHelper = new AxesHelper(5)
    this.mesh.add(axesHelper)

    // ThreeJS to Physics
    this.mesh.geometry.computeBoundingBox()
    const cannonVec = new CANNON.Vec3(
      this.mesh.geometry.boundingBox.max.x - this.mesh.geometry.boundingBox.min.x,
      this.mesh.geometry.boundingBox.max.y - this.mesh.geometry.boundingBox.min.y,
      this.mesh.geometry.boundingBox.max.z - this.mesh.geometry.boundingBox.min.z
    )
    cannonVec.scale(1/200, cannonVec) // Scale 1/100 and 1/2 because we need halfExtents

    // Physics
    this.physics = new Physics()
    
    this.physicsBody = new CANNON.Body({
      mass: 0, // 0 = don't fall down
      shape: new CANNON.Box(cannonVec),
      // @ts-ignore
      quaternion: new CANNON.Quaternion().copy(this.mesh.quaternion)
    })
    
    this.physics.addToPhysicsWorld(this.mesh, this.physicsBody)
  }
}