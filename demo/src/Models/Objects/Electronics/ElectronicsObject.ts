import * as THREE from "three"
import { Pin, PinList } from "./Pin"
import { BaseObject } from "../BaseObject"
import { Connection } from "./Connection"
import { ElectronicsWorld } from "../../ElectronicsWorld"



const pinGeometry = new THREE.SphereGeometry(1.25)
const pinMaterial = new THREE.MeshBasicMaterial({
  color: 0xffc200,
})

export class ElectronicsObject extends BaseObject {
  electronicsWorld: ElectronicsWorld
  
  // Pins & connections
  pins: PinList = {}
  // connections: Connection[] = []

  // Extra specs
  resistance = 0

  constructor() {
    super()
    
    this.electronicsWorld = new ElectronicsWorld()
    this.electronicsWorld.components.push(this)
  }

  createPin(name: string, position: THREE.Vector3, color: THREE.ColorRepresentation = null) {
    let material = pinMaterial
    if (color) material = new THREE.MeshBasicMaterial({color})
    
    const pinMesh = new THREE.Mesh(pinGeometry, material)

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