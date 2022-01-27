import * as THREE from "three"
import { ElectronicsObject } from './ElectronicsObject'

export enum PinType {
  STANDARD = 0,
  // OUTPUT = 1,
  // INPUT = 2,
  // GROUND = 3
}

export class Pin {
  mesh: THREE.Mesh
  type: PinType
  parent: ElectronicsObject

  constructor(parent: ElectronicsObject, mesh: THREE.Mesh, type = PinType.STANDARD) {
    this.mesh = mesh
    this.type = type
    this.parent = parent

    this.mesh.userData.pin = this
  }
}

export interface PinList {
  [key: string]: Pin
}