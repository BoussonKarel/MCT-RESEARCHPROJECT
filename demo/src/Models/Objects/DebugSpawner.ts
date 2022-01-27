import * as THREE from 'three'
import { Debug } from '../Debug';
import { World } from "../World";
import { Arduino } from './Electronics/Arduino';
import { LEDStrip } from './Electronics/LEDStrip';
import { UltrasoneSensor } from './Electronics/UltrasoneSensor';
import { SimpleCube } from "./SimpleCube";

let arduino = null
export class DebugSpawner {
  world: World
  debug: Debug

  constructor() {
    this.world = new World()
    this.debug = new Debug()

    if (this.debug.active) {
      this.debug.ui.add(this, 'addCube')
      this.debug.ui.add(this, 'addUltrasone')
      this.debug.ui.add(this, 'addArduino')
      this.debug.ui.add(this, 'logArduino')
      this.debug.ui.add(this, 'addLEDStrip')
    }
  }

  addCube() {
    const position = new THREE.Vector3(0, 0.8, 0)
    const cube = new SimpleCube({position})
  }

  addUltrasone() {
    const ultrasone = new UltrasoneSensor()
  }

  addArduino() {
    arduino = new Arduino()
  }

  logArduino() {
    console.log(arduino)
  }

  addLEDStrip() {
    const ledstrip = new LEDStrip()
  }
}