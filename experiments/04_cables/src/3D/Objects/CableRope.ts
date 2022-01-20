import * as THREE from "three"
import * as CANNON from "cannon-es"
import { Physics } from "../Physics"
import { World } from "../World"

interface CableRopeOptions {
  pos1: THREE.Vector3,
  pos2: THREE.Vector3
}

export class CableRope {
  world: World

  pos1: THREE.Vector3
  pos2: THREE.Vector3
  diff: THREE.Vector3

  geometry: THREE.BufferGeometry
  material: THREE.MeshStandardMaterial
  mesh: THREE.Mesh

  physics: Physics
  physicsBody: CANNON.Body

  constructor(options: CableRopeOptions) {
    options = {
    //   pos1: new THREE.Vector3(-0.1, 1, 0),
    //   pos2: new THREE.Vector3(0.1, 1, 0),
      ...options,
    }

    /**
     * ThreeJS
     */
    this.world = new World()

    const ropeNumSegments = 10

    const ropePositions = [];
		const ropeIndices = [];

    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('yellow'),
    })

    this.geometry = new THREE.BufferGeometry()

    this.pos1 = options.pos1
    this.pos2 = options.pos2
    const diff = new THREE.Vector3().subVectors(this.pos2, this.pos1)

    const segmentPosition = (percentage: number) => {
      return new THREE.Vector3(
        this.pos1.x + diff.x * percentage,
        this.pos1.y + diff.y * percentage,
        this.pos1.z + diff.z * percentage,
      )
    }
    
    // 0 - 100% (0 - 1)
    for (let i = 0; i <= ropeNumSegments; i ++) {
      const percentage = i / ropeNumSegments
      ropePositions.push(segmentPosition(percentage).x, segmentPosition(percentage).y, segmentPosition(percentage).z)
    }

    for (let i = 0; i < ropeNumSegments; i ++) {
      ropeIndices.push(i, i+1)
    }

    this.geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(ropeIndices), 1))
    this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ropePositions), 3))

    const rope = new THREE.LineSegments(this.geometry, this.material)

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    // this.world.scene.add(this.mesh)
    this.world.scene.add(rope)

    /**
     * Physics
     */
    this.physics = new Physics()

    // rope movement in physics world
    // distance constraint
    // hinge?
    // ...?

    // this.physicsBody = ...

    // this.physics.addToPhysicsWorld(this.mesh, this.physicsBody)
  }
}
