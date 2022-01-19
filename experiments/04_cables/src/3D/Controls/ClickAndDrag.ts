import * as THREE from 'three'
import { Sizes } from '../Sizes';
import { Time } from '../Time';

export class ClickAndDrag {
  camera: THREE.PerspectiveCamera;
  domElement: Element
  sizes: Sizes
  time: Time
  cursor: THREE.Vector2
  leftMouseDown: boolean = false
  rightMouseDown: boolean = false
  movementAmplitude = 0.003
  grabbables: THREE.Object3D[]
  raycaster: THREE.Raycaster

  constructor(camera: THREE.PerspectiveCamera, domElement: Element, grabbables = []) {
    this.camera = camera
    this.camera.rotation.reorder('YXZ')
    this.domElement = domElement

    this.sizes = new Sizes()
    this.time = new Time()

    this.cursor = new THREE.Vector2()

    this.disableContextMenu() // No more right click context menu

    this.registerClicks()

    document.addEventListener("mousemove", (e) => this.moveEvent(e))
    document.addEventListener("wheel", (e) => this.scrollEvent(e))

    this.grabbables = grabbables

    this.raycaster = new THREE.Raycaster()

    this.time.on('tick', () => {
      this.updateRaycaster()
    })
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

  // Move, set cursor coords
  moveEvent(event: MouseEvent) {
    // Update cursor position
    this.cursor.x = (event.clientX / this.sizes.width) *2 - 1 // -1 to 1 (left to right)
    this.cursor.y = - (event.clientY / this.sizes.height) * 2 + 1 // -1 to 1 (bottom to top)

    // Look around (on right click)
    if (this.rightMouseDown) {
      // UP - DOWN
      this.camera.rotation.x += event.movementY * this.movementAmplitude

      // LEFT - RIGHT
      this.camera.rotation.y += event.movementX * this.movementAmplitude
    }
  }

  // Zoom
  scrollEvent(event: WheelEvent) {
    const zoomValue = this.camera.zoom - (event.deltaY / 100) / 10
    this.camera.zoom = Math.max(zoomValue, 1)
    this.camera.updateProjectionMatrix()
  }

  updateRaycaster() {
    this.raycaster.setFromCamera({x: this.cursor.x, y: this.cursor.y}, this.camera)

    const intersects = this.raycaster.intersectObjects(this.grabbables)

    for (const intersect of intersects) {
      if (this.leftMouseDown) {
        intersect.object.position.x = intersect.point.x
        intersect.object.position.z = intersect.point.z
        // How do we move up and down??
      }
    }
  }
}