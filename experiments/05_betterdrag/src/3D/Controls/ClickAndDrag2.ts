import * as THREE from "three"
import { Sizes } from "../Sizes"
import { Time } from "../Time"
import { World } from "../World"

export class ClickAndDrag2 {
  world: World
  camera: THREE.PerspectiveCamera
  sizes: Sizes
  time: Time
  cursor: THREE.Vector2
  leftMouseDown: boolean = false
  rightMouseDown: boolean = false
  movementAmplitude = 0.002

  selectedObject: THREE.Object3D = null

  // Check if it's connectable with something
  connectableWith: THREE.Object3D<THREE.Event>

  constructor(camera: THREE.PerspectiveCamera) {
    this.world = new World()

    this.camera = camera
    this.camera.rotation.reorder("YXZ")

    this.sizes = new Sizes()
    this.time = new Time()

    this.cursor = new THREE.Vector2()

    // Disable context menu (on right click)
    this.world.renderer.domElement.addEventListener(
      "contextmenu",
      (e) => e.preventDefault()
    )

    this.clickEvents()
    document.addEventListener("mousemove", (e) => this.mouseMoveEvent(e))
    document.addEventListener("wheel", (e) => this.scrollEvent(e))

    this.time.on("tick", () => {})
  }

  
  //#region EventListeners
  clickEvents() {
    window.addEventListener("mousedown", (e) => {
      if (e.button === 0 && !this.leftMouseDown) {
        this.leftMouseDown = true
        this.pickObject()
      }

      if (e.button === 2 && !this.rightMouseDown) {
        this.rightMouseDown = true
      }
    })

    window.addEventListener("mouseup", (e) => {
      if (e.button === 0 && this.leftMouseDown) {
        this.leftMouseDown = false
        this.releaseObject()
      }
      if (e.button === 2 && this.rightMouseDown) {
        this.rightMouseDown = false
      }
    })
  }
  //#endregion

  //#region Moving objects
  pickObject() {
    
  }

  releaseObject() {
    
  }

  moveObject() {

  }
  //#endregion

  // Mouse move: update for camera & moving objects
  mouseMoveEvent(event: MouseEvent) {
    // Update cursor position
    this.cursor.x = (event.clientX / this.sizes.width) * 2 - 1 // -1 to 1 (left to right)
    this.cursor.y = -(event.clientY / this.sizes.height) * 2 + 1 // -1 to 1 (bottom to top)

    // Look around (on right click)
    if (this.rightMouseDown) this.updateCameraRotation(event.movementX, event.movementY)
  
    if (this.selectedObject) this.moveObject()
  }

  // Updating camera rotation (looking around)
  updateCameraRotation(deltaX = 0, deltaY = 0) {
      // UP - DOWN
      this.camera.rotation.x += deltaY * this.movementAmplitude

      // Don't look further than all the way up/down
      this.camera.rotation.x = Math.min(Math.max(this.camera.rotation.x, -Math.PI/2), Math.PI/2)
      

      // LEFT - RIGHT
      this.camera.rotation.y += deltaX * this.movementAmplitude
  }

  // Zooming in-out
  scrollEvent(event: WheelEvent) {
    const zoomValue = this.camera.zoom - event.deltaY / 100 / 10
    this.camera.zoom = Math.min(Math.max(zoomValue, 1), 5)
    this.camera.updateProjectionMatrix()
  }
}
