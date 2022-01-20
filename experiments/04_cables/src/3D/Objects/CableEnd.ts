import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { Physics } from '../Physics';
import { World } from '../World'

interface SimpleCubeOptions {
  position?
  size?
  color?
}

export class CableEnd {
  world: World;
  
  geometry: THREE.BoxGeometry;
  material: THREE.MeshStandardMaterial;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
  
  physics: Physics;
  physicsBody: CANNON.Body;

  constructor() {
    // ThreeJS
    this.world = new World()

    this.geometry = new THREE.BoxGeometry(0.015, 0.015, 0.015);

    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x222222)
    })
    
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    // if (options.position) this.mesh.position.copy(options.position)

    this.world.scene.add(this.mesh)
    this.world.grabbables.push(this.mesh)

    // Physics
    this.physics = new Physics()
  }
}