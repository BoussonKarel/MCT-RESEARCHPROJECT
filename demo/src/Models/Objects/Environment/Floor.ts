import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { Physics } from '../../Physics'
import { World } from "../../World"

export class Floor {
  world: World
  
  geometry: THREE.PlaneGeometry
  material: THREE.MeshStandardMaterial
  mesh: THREE.Mesh
  
  physics: Physics
  physicsBody: CANNON.Body

  constructor() {
    this.world = new World()
    
    // ThreeJS
    this.geometry = new THREE.PlaneGeometry(5, 5)
    this.material = new THREE.MeshStandardMaterial({
      map: this.world.resources.items["woodFloor"]
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.mesh.position.set(0, 0, 0)
    this.mesh.rotation.x = -Math.PI / 2

    this.mesh.receiveShadow = true; // SHADOW

    this.world.scene.add(this.mesh)

    // Physics
    this.physics = new Physics()
    
    this.physicsBody = new CANNON.Body({
      mass: 0, // 0 = don't fall down
      shape: new CANNON.Plane(),
    })
    this.physicsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    )
    
    this.physics.addToPhysicsWorld(this.mesh, this.physicsBody)
  }
}