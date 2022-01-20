import * as THREE from 'three'
import { Resources } from '../Resources'

export class SimpleCube {
  constructor(size = 0.1, color = new THREE.Color('red')) {
    // this.resources = new Resources()

    this.geometry = new THREE.BoxGeometry(size, size, size);

    this.material = new THREE.MeshStandardMaterial({
      color
    })
    
    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }
}