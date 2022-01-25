import GUI from 'lil-gui'

let instance = null

export class Debug {
  active: boolean = false
  ui: GUI

  constructor() {
    this.active = window.location.hash === '#debug'

    if (this.active) {
      if (instance) return instance
      instance = this
  
      this.ui = new GUI()
    }
  }
}