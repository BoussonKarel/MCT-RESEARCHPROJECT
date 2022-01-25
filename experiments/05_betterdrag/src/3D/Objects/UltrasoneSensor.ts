import * as THREE from "three"
import * as CANNON from "cannon-es"
import { Physics } from "../Physics"
import { World } from "../World"

interface UltrasoneOptions {
  position?: THREE.Vector3
  range?: number
}

export class UltrasoneSensor {
  world: World

  mesh: THREE.Mesh

  raycaster: THREE.Raycaster
  arrowHelper: THREE.ArrowHelper

  physics: Physics
  physicsBody: CANNON.Body

  constructor(options?: UltrasoneOptions) {
    options = {
      position: new THREE.Vector3(0,.77,0),
      range: 4,
      ...options
    }
    this.world = new World()

    // ThreeJS
    this.mesh = this.world.resources.items["Ultrasone"].scene.children[0].children[0]
    this.mesh.geometry.center()

    // Rotation, scale, position
    this.mesh.rotation.set(0,0,0)
    this.mesh.scale.set(1 / 1000, 1 / 1000, 1 / 1000) // From 45m to 45mm wide
    if (options.position) this.mesh.position.copy(options.position)

    this.mesh.userData.parent = this
    this.world.scene.add(this.mesh)
    this.world.grabbables.push(this.mesh)

    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.mesh.quaternion)

    this.raycaster = new THREE.Raycaster(this.mesh.position, direction, 0, options.range)

    this.arrowHelper = new THREE.ArrowHelper(direction, this.mesh.position, .5)
    this.world.scene.add(this.arrowHelper)

    // Physics test
    this.physics = new Physics()

    this.mesh.geometry.computeBoundingBox()
    const box3 = this.mesh.geometry.boundingBox

    const dimensions = new THREE.Vector3().subVectors(box3.max, box3.min)
    dimensions.multiplyScalar(0.001)

    this.physicsBody = new CANNON.Body({
      mass: 0.01, // kg
      shape: new CANNON.Box(
        new CANNON.Vec3(dimensions.x/2, dimensions.y/2, dimensions.z/2)
        ),
    })
    
    this.physics.addToPhysicsWorld(this.mesh, this.physicsBody)

    // Events etc
    this.world.time.on('tick', () => this.measureDistances())
  }

  measureDistances() {
    // Update raycaster and arrowhelper
    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.mesh.quaternion)
    this.raycaster.set(this.mesh.position, direction)
    this.arrowHelper.position.copy(this.mesh.position)
    this.arrowHelper.setDirection(new THREE.Vector3(0, 0, 1).applyQuaternion(this.mesh.quaternion))

    // Cast ray
    const otherObjects = this.world.scene.children.filter(c => c!= this.mesh && c != this.arrowHelper)
    const intersects = this.raycaster.intersectObjects(otherObjects)

    if (intersects.length > 0) {
      const distance = Math.max(Math.round(intersects[0].distance*100), 2)
      console.log("De ultrasone meet: ", distance, "centimeter")
    }
  }
}
