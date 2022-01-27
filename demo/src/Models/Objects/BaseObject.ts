import * as THREE from "three"
import * as CANNON from "cannon-es"

import { Physics } from "../Physics"
import { World } from "../World"

export class BaseObject {
  world: World

  mesh: THREE.Mesh
  geometry?: THREE.BufferGeometry
  material?: THREE.Material

  physics: Physics
  physicsBody?: CANNON.Body
  scale?: number = 1

  constructor() {
    this.world = new World()
    this.physics = new Physics()
  }

  static getComponentFromMesh(mesh: THREE.Object3D) {
    return mesh.userData.component ? mesh.userData.component : undefined
  }

  finishConstructor() {
    // needs to be done after the child class constructor()
    this.mesh.userData.component = this

    // Add mesh to scene
    this.world.scene.add(this.mesh)
    console.log("Add mesh to world")
    // Add physics body to physics world
    if (this.physicsBody) this.physics.addToPhysicsWorld(this.mesh, this.physicsBody)
  }

  setPR(position, rotation) {
    this.setPosition(position)
    this.setRotation(rotation)
  }

  setPosition(newPosition: THREE.Vector3) {
    this.mesh.position.copy(newPosition)
    if (this.physicsBody) {
      // @ts-ignore
      this.physicsBody.position.copy(this.mesh.position)
    }
  }

  setRotation(newRotation: THREE.Euler) {
    this.mesh.rotation.copy(newRotation)
    // @ts-ignore
    if (this.physicsBody) this.physicsBody.quaternion.copy(this.mesh.quaternion)
  }

  setQuaternion(newQuaternion: THREE.Quaternion) {
    this.setRotation(new THREE.Euler().setFromQuaternion(newQuaternion))
  }

  // Create a simple box, using the bounding box of the object
  createSimplePhysicsBox() {
    this.mesh.geometry.computeBoundingBox()
    const box3 = this.mesh.geometry.boundingBox

    const dimensions = new THREE.Vector3().subVectors(box3.max, box3.min)
    dimensions.multiplyScalar(this.scale)

    this.physicsBody = new CANNON.Body({
      mass: 0.01, // kg
      shape: new CANNON.Box(
        new CANNON.Vec3(dimensions.x/2, dimensions.y/2, dimensions.z/2)
        ),
    })
  }
}