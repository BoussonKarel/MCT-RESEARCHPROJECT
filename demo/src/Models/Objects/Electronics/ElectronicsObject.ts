import * as THREE from "three"
import { Pin, PinList } from "./Pin"
import { BaseObject } from "../BaseObject"
import { ElectronicsWorld } from "../../ElectronicsWorld"



const pinGeometry = new THREE.SphereGeometry(1.25)
const pinMaterial = new THREE.MeshBasicMaterial({
  color: 0xffc200,
})

export class ElectronicsObject extends BaseObject {
  electronicsWorld: ElectronicsWorld
  
  pins: PinList = {}
  
  errorState: string

  // Extra specs
  resistance = 0

  constructor() {
    super()
    
    this.electronicsWorld = new ElectronicsWorld()
    this.electronicsWorld.components.push(this)
  }

  getPinsByString(search: string) {
    return Object.keys(this.pins)
      .filter(e => e.toLowerCase().includes(search.toLowerCase()))
      .reduce((obj, key) => {
        obj[key] = this.pins[key]
        return obj
      }, {})
  }

  getPathByString(from: Pin, toObject: ElectronicsObject, search: string) {
    const pins: PinList = toObject.getPinsByString(search)
    let result = []

    for (const to of Object.values(pins)) {
      const path = this.electronicsWorld.checkConnection(
        from,
        to
      )
      if (path.length > 0) result = path
    }

    return result;
  }

  createPin(name: string, localCoords: THREE.Vector3, color: THREE.ColorRepresentation = null) {
    let material = pinMaterial
    if (color) material = new THREE.MeshBasicMaterial({color})
    
    const pinMesh = new THREE.Mesh(pinGeometry, material)
    pinMesh.position.copy(localCoords)
    this.mesh.add(pinMesh) // Adds it to mesh and places it at local (0,0,0)
    
    pinMesh.visible = false

    const newPin = new Pin(this, pinMesh)

    // Add to electronics object
    this.pins[name] = newPin
    // Add mesh to pins list
    this.world.pinMeshes.push(newPin.mesh)
  }
}
