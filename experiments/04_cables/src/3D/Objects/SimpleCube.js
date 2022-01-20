import * as THREE from 'three'
import { World } from '../World'

export class SimpleCube {
  constructor(size = 0.1, color = new THREE.Color('red')) {
    this.world = new World()

    this.geometry = new THREE.BoxGeometry(size, size, size);

    this.material = new THREE.MeshStandardMaterial({
      color
    })
    
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.world.scene.add(this.mesh)
    this.world.grabbables.push(this.mesh)
  }
}