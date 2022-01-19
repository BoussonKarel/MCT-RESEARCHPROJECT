import * as THREE from 'three'
import { Sizes } from '../Sizes';

export class ClickAndDrag {
  camera: THREE.PerspectiveCamera;
  domElement: Element
  sizes: Sizes

  cursor: THREE.Vector2

  leftMouseDown: boolean = false
  rightMouseDown: boolean = false
  dragging: boolean = false

  movementAmplitude = 0.003

  constructor(camera: THREE.PerspectiveCamera, domElement: Element, sizes: Sizes) {
    this.camera = camera
    this.camera.rotation.reorder('YXZ')
    this.domElement = domElement
    this.sizes = sizes

    this.cursor = new THREE.Vector2()

    this.disableContextMenu() // No more right click context menu

    this.registerClicks()

    document.addEventListener("mousemove", (e) => this.moveEvent(e))
    document.addEventListener("wheel", (e) => this.scrollEvent(e))

    this.dragging = false
  }

  disableContextMenu() {
    this.domElement.addEventListener('contextmenu', e => {
      e.preventDefault()
    }, false)
  }

  registerClicks() {
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) this.leftMouseDown = true
      if (e.button === 2) this.rightMouseDown = true
    })
    
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.leftMouseDown = false
      if (e.button === 2) this.rightMouseDown = false
    })
  }

  // Move
  moveEvent(event: MouseEvent) {
    this.cursor.x = (event.clientX / this.sizes.width) *2 - 1 // -1 to 1 (left to right)
    this.cursor.y = - (event.clientY / this.sizes.height) * 2 + 1 // -1 to 1 (bottom to top)

    if (this.rightMouseDown) {
      // UP - DOWN
      this.camera.rotation.x += event.movementY * this.movementAmplitude

      // LEFT - RIGHT
      this.camera.rotation.y += event.movementX * this.movementAmplitude
    }

    if (this.dragging) { // Dragging
      // UP - DOWN
      this.camera.rotation.x -= event.movementY * this.movementAmplitude
    }
  }

  // Zoom
  scrollEvent(event: WheelEvent) {
    const zoomValue = this.camera.zoom - (event.deltaY / 100) / 10
    this.camera.zoom = Math.max(zoomValue, 1)
    this.camera.updateProjectionMatrix()
  }
}