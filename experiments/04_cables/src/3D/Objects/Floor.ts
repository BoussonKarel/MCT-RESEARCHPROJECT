import * as THREE from 'three'
import { World } from "../World"

export class Floor {
  world: World
  geometry: THREE.PlaneGeometry
  material: THREE.MeshBasicMaterial
  mesh: THREE.Mesh

  constructor() {
    this.world = new World()
    
    // Floor
    this.geometry = new THREE.PlaneGeometry(5, 5)
    this.material = new THREE.MeshBasicMaterial({
      map: this.world.resources.items["woodFloor"]
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.mesh.position.set(0, -0.001, 0)
    this.mesh.rotation.x = -Math.PI / 2

    this.world.scene.add(this.mesh)
  }
}