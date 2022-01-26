import * as THREE from "three"
import { Sizes } from "../Sizes"
import { World } from "../World"

const phNormal = new THREE.Vector3(0, 1, 0) // Horizontal
const pvNormal = new THREE.Vector3(0, 0, 1) // Vertical

export class Controls {
  world: World
  camera: THREE.PerspectiveCamera
  sizes: Sizes

  cursor: THREE.Vector2
  rightMouseDown: boolean = false
  shiftKeyDown: boolean = false
  movementAmplitude = 0.002
  raycaster: THREE.Raycaster = new THREE.Raycaster()

  movingObject: THREE.Object3D
  movingMinY: number
  movementPlane = new THREE.Plane()
  diffY = 0.05
  shift = new THREE.Vector3() // Distance between intersect[x].object.position - intersect[x].point

  // Check if it's connectable with something
  connectableWith: THREE.Object3D<THREE.Event>

  constructor(camera: THREE.PerspectiveCamera) {
    this.world = new World()

    this.camera = camera
    this.camera.rotation.reorder("YXZ")

    this.sizes = new Sizes()

    this.cursor = new THREE.Vector2()

    this.setMouseEvents()
    this.setKeyboardEvents()
  }

  //#region Events
  // Mouse
  setMouseEvents() {
    document.addEventListener("mousemove", (e) => this.onMouseMove(e))
    document.addEventListener("wheel", (e) => this.onWheel(e))
    document.addEventListener("mousedown", (e) => this.onMouseDown(e))
    document.addEventListener("mouseup", (e) => this.onMouseUp(e))
    document.addEventListener("contextmenu", (e) =>
      e.preventDefault() // Disable context menu (on right click)
    )
  }

  onMouseDown(e: MouseEvent) {
    if (e.button === 0 && !this.movingObject) this.pickObject()
    if (e.button === 2 && !this.rightMouseDown) this.rightMouseDown = true
  }

  onMouseUp(e: MouseEvent) {
    if (e.button === 0 && this.movingObject) this.releaseObject()
    if (e.button === 2 && this.rightMouseDown) this.rightMouseDown = false
  }

  onMouseMove(event: MouseEvent) {
    // Update cursor position
    this.cursor.x = (event.clientX / this.sizes.width) * 2 - 1 // -1 to 1 (left to right)
    this.cursor.y = -(event.clientY / this.sizes.height) * 2 + 1 // -1 to 1 (bottom to top)

    // Set raycaster from camera
    this.raycaster.setFromCamera(this.cursor, this.camera)

    // Look around (on right click)
    this.updateCameraRotation(event.movementX, event.movementY)

    if (this.movingObject) this.moveObject()
    else this.hoverNodes()
  }

  onWheel(event: WheelEvent) {
    this.camera.zoom -= (event.deltaY / 100) * 0.2

    this.camera.zoom = Math.min(Math.max(this.camera.zoom, 1), 5)
    this.camera.updateProjectionMatrix()
  }

  // Keyboard
  setKeyboardEvents() {
    document.addEventListener("keydown", (e) => this.onKeyDown(e))
    document.addEventListener("keyup", (e) => this.onKeyUp(e))
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Shift" && !this.shiftKeyDown) {
      this.shiftKeyDown = true
      if (this.movingObject) this.updatePlane()
    }

    if (event.code === "KeyR") this.rotateObject()
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Shift") {
      this.shiftKeyDown = false
      if (this.movingObject) this.updatePlane()
    }
  }
  //#endregion

  //#region Moving objects
  pickObject() {
    // Shoot ray and check for intersecting objects
    const intersects = this.raycaster.intersectObjects(this.world.grabbables)
    if (intersects.length < 1) return

    // Set minimum Y height
    intersects[0].object.position.y += this.diffY
    this.movingMinY = intersects[0].object.position.y

    // Set moving object
    this.movingObject = intersects[0].object
    this.shift.subVectors(intersects[0].object.position, intersects[0].point)

    // Add a horizontal plane slicing trough point of intersection
    this.updatePlane()
  }

  updatePlane() {
    const pIntersect = new THREE.Vector3().subVectors(this.movingObject.position, this.shift)

    this.movementPlane.setFromNormalAndCoplanarPoint(
      this.shiftKeyDown ? pvNormal : phNormal,
      pIntersect
    )
  }

  releaseObject() {
    this.movingObject = null
  }

  rotateObject() {
    this.movingObject.rotation.x += -Math.PI / 4
  }

  moveObject() {
    if (!this.movingObject) return

    const planeIntersect = new THREE.Vector3()
    this.raycaster.ray.intersectPlane(this.movementPlane, planeIntersect)

    // Move to intersection point w/ the plane
    // Adjust with the shift
    this.movingObject.position.addVectors(planeIntersect, this.shift)
    this.movingObject.position.y = Math.max(this.movingObject.position.y, this.movingMinY)
  }
  //#endregion

  //#region Connecting nodes
  hoverNodes() {
    const intersects = this.raycaster.intersectObjects(this.world.pins)

    for (const pin of this.world.pins) {
      pin.visible = intersects.some((i) => i.object == pin)
    }
  }
  //#endregion

  //#region Camera
  updateCameraRotation(deltaX = 0, deltaY = 0) {
    if (!this.rightMouseDown) return
    // UP - DOWN
    this.camera.rotation.x += deltaY * this.movementAmplitude
    // Don't look further than all the way up/down
    this.camera.rotation.x = Math.min(
      Math.max(this.camera.rotation.x, -Math.PI / 2),
      Math.PI / 2
    )

    // LEFT - RIGHT
    this.camera.rotation.y += deltaX * this.movementAmplitude
  }
  //#endregion
}
