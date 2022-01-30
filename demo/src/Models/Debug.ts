import GUI from 'lil-gui'
import { DebugSpawner } from './Objects/DebugSpawner'

let instance = null

export class Debug {
  active: boolean = false
  ui: GUI
  spawner: DebugSpawner

  constructor() {
    this.active = window.location.hash === '#debug'

    if (this.active) {
      if (instance) return instance
      instance = this
  
      this.ui = new GUI({title: "Debug"}).close()
    }
  }
}