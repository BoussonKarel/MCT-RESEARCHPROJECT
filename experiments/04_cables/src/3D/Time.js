import {EventEmitter} from 'events'
import * as THREE from 'three'

let time = null

export class Time extends EventEmitter {
  constructor() {
    super()

    if (time) return time // Only 1 instance of time
    time = this

    this.clock = new THREE.Clock()

    this.tick()
  }

  tick() {
    const elapsedTime = this.clock.getElapsedTime()
 
    // Update controls
    this.emit('tick')
  
    // Call tick again on the next frame
    window.requestAnimationFrame(() => this.tick())
  }
}