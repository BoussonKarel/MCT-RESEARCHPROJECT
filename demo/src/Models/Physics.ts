import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { World } from './World'

let physics: Physics = null

export class Physics {
  world: World
  physicsWorld: CANNON.World
  physicsClock: THREE.Clock

  lastElapsedTime: number

  materials: {[key: string]: CANNON.Material} = {}
  contactMaterials: CANNON.ContactMaterial[] = []

  objects: {
    mesh: THREE.Mesh,
    body: CANNON.Body
  }[]

  constructor() {
    if (physics) return physics
    physics = this

    this.world = new World()

    this.physicsWorld = new CANNON.World({
      // gravity: new CANNON.Vec3(0, -9.82, 0)
      gravity: new CANNON.Vec3(0, -3, 0)
    })

    this.physicsClock = new THREE.Clock()

    this.materials.default = new CANNON.Material('default')
    this.contactMaterials.push(new CANNON.ContactMaterial(
      this.materials.default,
      this.materials.default,
      { friction: 1.0, restitution: 0.0 }
    ))

    this.physicsWorld.addContactMaterial(this.contactMaterials[0])
    this.physicsWorld.defaultMaterial = this.materials.default
    this.physicsWorld.defaultContactMaterial = this.contactMaterials[0]

    this.objects = []

    this.world.time.on('tick', () => this.updatePhysicsWorld())
  }

  updatePhysicsWorld() {
    // return;
    this.physicsWorld.step(this.physicsClock.getDelta())

    for (const object of this.objects) {
      // Being dragged
      // --> 3D world to Physics world
      if (object.mesh === this.world.controls.movingObject) {
        // @ts-ignore
        object.body.position.copy(object.mesh.position)
        // @ts-ignore
        object.body.quaternion.copy(object.mesh.quaternion)
      }
      // Not being dragged
      // --> Physics world to 3D world
      else {
        // @ts-ignore
        object.mesh.position.copy(object.body.position)
        // @ts-ignore
        object.mesh.quaternion.copy(object.body.quaternion)
      }
    }
  }

  addToPhysicsWorld(mesh, body) {
    this.physicsWorld.addBody(body)

    body.position.copy(mesh.position)
    body.quaternion.copy(mesh.quaternion)

    this.objects.push({
      mesh,
      body
    })
  }
}
