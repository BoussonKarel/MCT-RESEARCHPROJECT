import * as THREE from 'three'

export class Cube {
  constructor() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);

    this.textures = {}
    this.textures.color = new THREE.Color('red')

    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color
    })
    
    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }
}