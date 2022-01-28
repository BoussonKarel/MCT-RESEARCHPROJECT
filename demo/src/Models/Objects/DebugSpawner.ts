import * as THREE from 'three'
import { Debug } from '../Debug';
import { World } from "../World";
import { Arduino } from './Electronics/Arduino';
import { LEDStrip } from './Electronics/LEDStrip';
import { UltrasoneSensor } from './Electronics/UltrasoneSensor';
import { SimpleCube } from "./SimpleCube";

export class DebugSpawner {
  world: World
  debug: Debug

  // Objects
  cube: SimpleCube;
  ultrasone: UltrasoneSensor;
  arduino: Arduino;
  ledstrip: LEDStrip;

  constructor() {
    this.world = new World()
    this.debug = new Debug()

    if (this.debug.active) {
      const objects = this.debug.ui.addFolder("Objects").close()
      objects.add(this, 'addCube')

      const electronics = this.debug.ui.addFolder("Electronics").close()
      electronics.add(this, 'addUltrasone')
      electronics.add(this, 'addArduino')
      electronics.add(this, 'logArduino')

      const experiments = this.debug.ui.addFolder("Experiments").close()
      // experiments.add(this, 'addLEDStrip')
    }
  }

  addCube() {
    const position = new THREE.Vector3(0, 0.8, 0)
    this.cube = new SimpleCube({position})
  }

  addUltrasone() {
    this.ultrasone = new UltrasoneSensor()
  }

  addArduino() {
    this.arduino = new Arduino()
  }

  logArduino() {
    console.log(this.arduino)
  }

  addLEDStrip() {
    this.ledstrip = new LEDStrip()
  }
}