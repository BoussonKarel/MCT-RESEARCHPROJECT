import * as THREE from 'three'
import { World } from "../World";
import { Cable } from "./Cable";
import { SimpleCube } from "./SimpleCube";
import { UltrasoneSensor } from './UltrasoneSensor';

export class DebugSpawner {
  world: World

  constructor() {
    this.world = new World()
  }

  addCube() {
    const position = new THREE.Vector3(0, 0.8, 0)
    const cube = new SimpleCube({position})
  }

  addCable() {
    const cable = new Cable()
  }

  addUltrasone() {
    const ultrasone = new UltrasoneSensor()
  }
}