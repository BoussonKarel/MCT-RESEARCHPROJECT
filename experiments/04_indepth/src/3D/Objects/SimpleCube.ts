import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { Physics } from '../Physics';
import { World } from '../World'

interface SimpleCubeOptions {
  position?: THREE.Vector3
  size?: number
  color?: THREE.Color
}

export class SimpleCube {
  world: World;
  
  geometry: THREE.BoxGeometry;
  material: THREE.MeshStandardMaterial;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
  
  physics: Physics;
  physicsBody: CANNON.Body;

  constructor(options?: SimpleCubeOptions) {
    options = {
      size: 0.1, // default
      color: new THREE.Color('red'), // default
      ...options // user parameters
    }

    // ThreeJS
    this.world = new World()

    this.geometry = new THREE.BoxGeometry(options.size, options.size, options.size);

    this.material = new THREE.MeshStandardMaterial({
      color: options.color
    })
    
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    if (options.position) this.mesh.position.copy(options.position)

    this.world.scene.add(this.mesh)
    this.world.grabbables.push(this.mesh)

    // Physics
    this.physics = new Physics()
    
    this.physicsBody = new CANNON.Body({
      mass: 0.2, // kg
      shape: new CANNON.Box(new CANNON.Vec3(options.size/2, options.size/2, options.size/2)),
    })
    
    this.physics.addToPhysicsWorld(this.mesh, this.physicsBody)
  }
}