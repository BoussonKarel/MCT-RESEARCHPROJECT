import { BaseObject } from "../BaseObject"

export class Desk extends BaseObject {
  deskHeight: number

  constructor() {
    super()

    // ThreeJS
    this.setup3D()

    // Physics
    // this.createSimplePhysicsBox()

    // this.mesh.geometry.computeBoundingBox()
    // const cannonVec = new CANNON.Vec3(
    //   this.mesh.geometry.boundingBox.max.x - this.mesh.geometry.boundingBox.min.x,
    //   this.mesh.geometry.boundingBox.max.y - this.mesh.geometry.boundingBox.min.y,
    //   this.mesh.geometry.boundingBox.max.z - this.mesh.geometry.boundingBox.min.z
    // )
    // cannonVec.scale(1/200, cannonVec) // Scale 1/100 and 1/2 because we need halfExtents

    // Wrap things up in parent class
    // this.finishConstructor()
  }

  setup3D() {
    // this.deskHeight = 0.73 // 73cm
    // this.mesh = this.world.resources.items["Desk"].scene.children[0].children[0]

    // this.mesh.castShadow = true
    // this.mesh.receiveShadow = true
    // this.mesh.geometry.computeVertexNormals() // FIX

    // this.mesh.rotation.x = -Math.PI/2
    // this.mesh.geometry.center()

    // this.mesh.scale.set(1 / 100, 1 / 100, 1 / 100) // From 73m to 73cm
    // this.mesh.position.set(0, 0 + this.deskHeight/2, 0)
  }
}
