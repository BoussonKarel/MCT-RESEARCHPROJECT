import {EventEmitter} from 'events'
import * as THREE from 'three'
import { World } from './World'

let time: Time = null

export class Time extends EventEmitter {
  clock: THREE.Clock

  constructor(renderer) {
    super()

    if (time) return time // Only 1 instance of time
    time = this

    renderer.setAnimationLoop(() => this.tick())
  }

  tick() {
    // Update controls
    this.emit('tick')
  }
}