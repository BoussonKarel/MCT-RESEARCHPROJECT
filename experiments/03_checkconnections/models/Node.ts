import * as THREE from 'three'
import { ElectronicComponent } from './ElectronicComponent'

export enum NodeType {
  STANDARD = 0,
  OUTPUT = 1,
  INPUT = 2,
  GROUND = 3
}

export class Node {
  constructor(position: THREE.Vector3, parent: ElectronicComponent, type = NodeType.STANDARD) {
    this.position = position
    this.type = type
    this.parent = parent
  }

  position: THREE.Vector3
  type: NodeType
  parent: ElectronicComponent
}

export interface NodeList {
  [key: string]: Node
}