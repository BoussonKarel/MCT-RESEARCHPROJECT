import EventEmitter from "events"

let sizes = null
export class Sizes extends EventEmitter {
  constructor() {
    super()

    if (sizes) return sizes
    sizes = this
    
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    window.addEventListener("resize", () => {
      this.resize()
    })
  }

  resize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    this.emit("resize")
  }
}
