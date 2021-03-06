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
  scale: number

  constructor() {
    this.world = new World()
    this.physics = new Physics()

    this.scale = 1/100

    // ThreeJS
    this.setup3D()

    // ThreeJS to Physics
    this.createSimplePhysicsBox()
    // this.mesh.geometry.computeBoundingBox()
    // const cannonVec = new CANNON.Vec3(
    //   this.mesh.geometry.boundingBox.max.x - this.mesh.geometry.boundingBox.min.x,
    //   this.mesh.geometry.boundingBox.max.y - this.mesh.geometry.boundingBox.min.y,
    //   this.mesh.geometry.boundingBox.max.z - this.mesh.geometry.boundingBox.min.z
    // )
    // cannonVec.scale(1/200, cannonVec) // Scale 1/100 and 1/2 because we need halfExtents

    // // Physics
    // this.physics = new Physics()
    
    // this.physicsBody = new CANNON.Body({
    //   mass: 0, // 0 = don't fall down
    //   shape: new CANNON.Box(cannonVec),
    //   // @ts-ignore
    //   quaternion: new CANNON.Quaternion().copy(this.mesh.quaternion)
    // })

    this.physics.addToPhysicsWorld(this.mesh, this.physicsBody)
  }

  createSimplePhysicsBox(mass = 0) {
    this.mesh.geometry.computeBoundingBox()
    this.mesh.geometry.computeBoundingSphere()
    const box3 = this.mesh.geometry.boundingBox

    const dimensions = new THREE.Vector3().subVectors(box3.max, box3.min)
    dimensions.multiplyScalar(this.scale)

    const box = new CANNON.Box(
      new CANNON.Vec3(dimensions.x/2, dimensions.y/2, dimensions.z/2)
      )

    this.physicsBody = new CANNON.Body({
      mass: mass, // kg
    })

    const { center } = this.mesh.geometry.boundingSphere
    center.multiplyScalar(this.scale)

    // @ts-ignore
    this.physicsBody.addShape(box, new CANNON.Vec3().copy(center))
  }

  setup3D() {
    this.deskHeight = 0.73 // 73cm
    this.mesh = this.world.resources.items["Desk"].scene.children[0].children[0]

    this.mesh.rotation.x = -Math.PI/2

    this.mesh.scale.set(this.scale, this.scale, this.scale) // From 73m to 73cm
    this.mesh.position.set(0, 0, 0)

    this.mesh.castShadow = true
    this.mesh.receiveShadow = true

    this.world.scene.add(this.mesh)
  }
}