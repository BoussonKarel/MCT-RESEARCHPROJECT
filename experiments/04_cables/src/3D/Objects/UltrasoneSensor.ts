import * as THREE from "three"
import * as CANNON from "cannon-es"
import { Physics } from "../Physics"
import { World } from "../World"

interface UltrasoneOptions {
  position?: THREE.Vector3
}

export class UltrasoneSensor {
  world: World

  mesh: THREE.Mesh

  raycaster: THREE.Raycaster

  physics: Physics
  physicsBody: CANNON.Body

  constructor(options?: UltrasoneOptions) {
    options = {
      position: new THREE.Vector3(.5,.75,-0.25),
      ...options
    }
    this.world = new World()

    // ThreeJS
    this.mesh = this.world.resources.items["Ultrasone"].scene

    this.mesh.scale.set(1 / 1000, 1 / 1000, 1 / 1000) // From 45m to 45mm wide
    this.mesh.rotation.x = Math.PI/2
    if (options.position) this.mesh.position.copy(options.position)

    console.log(this.mesh.quaternion)
    console.log(this.mesh.rotation)

    this.world.scene.add(this.mesh)

    const direction = new THREE.Vector3(0, 0, 1)
    const origin = new THREE.Vector3().copy(this.mesh.position)
    this.raycaster = new THREE.Raycaster(origin, direction)

    // const arrowHelper = new THREE.ArrowHelper(direction, origin)
    // this.world.scene.add(arrowHelper)

    // Physics
    this.physics = new Physics()

    // Events etc
    this.world.time.on('tick', () => this.measureDistances())
  }

  measureDistances() {
    // const physicsObjects = this.physics.objects
    // const physicsMeshes = []
    // for (const physicsObject of physicsObjects) {
    //   physicsMeshes.push(physicsObject.mesh)
    // }
    // const intersects = this.raycaster.intersectObjects(physicsMeshes)

    const otherObjects = this.world.scene.children.filter(c => c!= this.mesh)
    const intersects = this.raycaster.intersectObjects(otherObjects)

    if (intersects.length > 0) {
      const distance = Math.round(intersects[0].distance*100)
      console.log("De ultrasone meet: ", distance, "centimeter")
    }
  }
}
