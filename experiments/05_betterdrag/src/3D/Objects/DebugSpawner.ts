import * as THREE from 'three'
import { Debug } from '../Debug';
import { World } from "../World";
import { LDR } from './LDR';
import { SimpleCube } from "./SimpleCube";
import { UltrasoneSensor } from './UltrasoneSensor';

export class DebugSpawner {
  world: World
  debug: Debug

  constructor() {
    this.world = new World()
    this.debug = new Debug()

    if (this.debug.active) {
      this.debug.ui.add(this, 'addCube')
      this.debug.ui.add(this, 'addUltrasone')
      this.debug.ui.add(this, 'addLDR')
    }
  }

  addCube() {
    const position = new THREE.Vector3(0, 0.8, 0)
    const cube = new SimpleCube({position})
  }

  addUltrasone() {
    const ultrasone = new UltrasoneSensor()
  }

  addLDR() {
    const ldr = new LDR()
  }
}