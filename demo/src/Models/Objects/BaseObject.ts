import * as THREE from "three"
import * as CANNON from "cannon-es"

import { Physics } from "../Physics"
import { World } from "../World"
import { Resources } from "../Resources"

export class BaseObject {
  world: World
  resources: Resources

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

  lookAt(position: THREE.Vector3) {
    this.mesh.lookAt(position)
    // @ts-ignore
    if (this.physicsBody) this.physicsBody.quaternion.copy(this.mesh.quaternion)
  }

  // Create a simple box, using the bounding box of the object
  createSimplePhysicsBox(mass = 0.5) {
    this.mesh.geometry.computeBoundingBox()
    const box3 = this.mesh.geometry.boundingBox

    const dimensions = new THREE.Vector3().subVectors(box3.max, box3.min)
    dimensions.multiplyScalar(this.scale)

    const box = new CANNON.Box(
      new CANNON.Vec3(dimensions.x/2, dimensions.y/2, dimensions.z/2)
      )

    this.physicsBody = new CANNON.Body({
      mass: mass, // kg
    })

    this.physicsBody.addShape(box)
  }
}