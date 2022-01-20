import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { World } from './World'

let physics: Physics = null

export class Physics {
  world: World
  physicsWorld: CANNON.World
  physicsClock: THREE.Clock

  lastElapsedTime: number

  objects: {
    mesh: THREE.Mesh,
    body: CANNON.Body
  }[]

  constructor() {
    if (physics) return physics
    physics = this

    this.world = new World()

    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    })

    this.physicsClock = new THREE.Clock()

    this.world.time.on('tick', () => this.updatePhysicsWorld())

    this.objects = []
  }

  updatePhysicsWorld() {
    this.physicsWorld.step(this.physicsClock.getDelta())

    for (const object of this.objects) {


      // Don't move if being dragged
      if (object.mesh === this.world.controls.selectedObject) {
        // Mesh to body (controls has the upperhand)
        // @ts-ignore
        object.body.position.copy(object.mesh.position)
          // @ts-ignore
        object.body.quaternion.copy(object.mesh.quaternion)
      } else {
        // Body position to mesh (physics has the upperhand)
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
