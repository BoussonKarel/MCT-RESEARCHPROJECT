import * as THREE from "three"
import { Pin, PinList } from "./Pin"
import { BaseObject } from "../BaseObject"
import { Connection } from "./Connection"

export class ElectronicsObject extends BaseObject {
  // Pins & connections
  pins: PinList = {}
  connections: Connection[] = []

  // Extra specs
  resistance = 0

  constructor() {
    super()
  }

  createPin(name: string, position: THREE.Vector3) {
    const pinGeometry = new THREE.SphereGeometry(1.25)
    const pinMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
    })

    const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial)

    this.mesh.add(pinMesh) // Adds it to mesh and places it at local (0,0,0)
    pinMesh.position.copy(position)
    pinMesh.visible = false

    const newPin = new Pin(this, pinMesh)

    // Add to electronics object
    this.pins[name] = newPin
    // Add mesh to pins list
    this.world.pinMeshes.push(newPin.mesh)
  }
}
