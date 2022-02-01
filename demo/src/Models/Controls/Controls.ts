import * as THREE from "three"
import { ElectronicsWorld } from "../ElectronicsWorld"
import { Connection } from "../Objects/Electronics/Connection"
import { Pin } from "../Objects/Electronics/Pin"
import { Sizes } from "../Sizes"
import { World } from "../World"

const phNormal = new THREE.Vector3(0, 1, 0) // Horizontal
const pvNormal = new THREE.Vector3(0, 0, 1) // Vertical

const cameraPositions = [
  new THREE.Vector3(0, 1.25, 0.5),
  new THREE.Vector3(0, .73, 0.5),
  new THREE.Vector3(0, 1.5, 0.15)
]

export class Controls {
  world: World
  camera: THREE.PerspectiveCamera
  sizes: Sizes

  htmlControls: HTMLDivElement
  htmlControlsClose: HTMLButtonElement

  htmlHelpButton: HTMLButtonElement

  htmlCameraButton: HTMLButtonElement

  cameraPositionIndex: number = 0
  cameraLookAt: THREE.Vector3

  electronicsWorld: ElectronicsWorld

  cursor: THREE.Vector2 = new THREE.Vector2()
  tooltip: any

  cursorNormalized: THREE.Vector2 = new THREE.Vector2()
  rightMouseDown: boolean = false
  shiftKeyDown: boolean = false
  movementAmplitude = 0.002
  raycaster: THREE.Raycaster = new THREE.Raycaster()

  // Moving stuff
  movingObject: THREE.Object3D
  movingMinY: number
  movementPlane = new THREE.Plane()
  diffY = 0.02
  shift = new THREE.Vector3() // Distance between intersect[x].object.position - intersect[x].point

  // Pin stuff
  hoveringPinMesh: THREE.Object3D
  selectedPinMeshes: THREE.Object3D[] = []

  // Check if it's connectable with something
  connectableWith: THREE.Object3D<THREE.Event>

  constructor(camera: THREE.PerspectiveCamera, cameraLookAt: THREE.Vector3) {
    this.world = new World()

    // Instructions
    this.htmlControls = document.querySelector("#js-controls")
    this.htmlControlsClose = document.querySelector("#js-controls-close")
    this.htmlHelpButton = document.querySelector("#js-help")
    this.htmlCameraButton = document.querySelector("#js-camera")

    this.htmlControlsClose.addEventListener("click", () => this.hideInstructions())
    this.showInstructions()

    this.htmlHelpButton.addEventListener("click", () => this.showInstructions())

    this.htmlCameraButton.addEventListener("click", () => {
      this.cameraPositionIndex++
      if (this.cameraPositionIndex >= cameraPositions.length) this.cameraPositionIndex = 0

      this.camera.position.copy(cameraPositions[this.cameraPositionIndex])
      this.camera.lookAt(this.cameraLookAt)
    })

    this.camera = camera
    this.camera.rotation.reorder("YXZ")
    this.camera.position.copy(cameraPositions[0])
    this.cameraLookAt = cameraLookAt
    this.camera.lookAt(this.cameraLookAt)


    this.sizes = new Sizes()

    this.tooltip = document.querySelector(".tooltip")

    this.setMouseEvents()
    this.setKeyboardEvents()

    this.electronicsWorld = new ElectronicsWorld()
  }

  showInstructions() {
    this.htmlControls.classList.remove("u-hidden")
  }

  hideInstructions() {
    this.htmlControls.classList.add("u-hidden")
  }

  toggleInstructions() {
    this.htmlControls.classList.toggle("u-hidden")
  }

  //#region Events
  // Mouse
  setMouseEvents() {
    this.world.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e))
    this.world.canvas.addEventListener("wheel", (e) => this.onWheel(e))
    this.world.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e))
    this.world.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e))
    this.world.canvas.addEventListener("contextmenu", (e) =>
      e.preventDefault() // Disable context menu (on right click)
    )
  }

  onMouseDown(e: MouseEvent) {
    if (e.button === 0 && !this.movingObject) this.pickObject()
    if (e.button === 0 && this.hoveringPinMesh) this.pickPin()
    if (e.button === 2 && !this.rightMouseDown) this.rightMouseDown = true
  }

  onMouseUp(e: MouseEvent) {
    if (e.button === 0 && this.movingObject) this.releaseObject()
    if (e.button === 2 && this.rightMouseDown) this.rightMouseDown = false
  }

  onMouseMove(event: MouseEvent) {
    // Update cursorNormalized position
    this.cursorNormalized.x = (event.clientX / this.sizes.width) * 2 - 1 // -1 to 1 (left to right)
    this.cursorNormalized.y = -(event.clientY / this.sizes.height) * 2 + 1 // -1 to 1 (bottom to top)

    this.cursor.x = event.clientX
    this.cursor.y = event.clientY

    // Set raycaster from camera
    this.raycaster.setFromCamera(this.cursorNormalized, this.camera)

    // Look around (on right click)
    this.updateCameraRotation(event.movementX, event.movementY)

    if (this.movingObject) this.moveObject()
    else this.hoverPins()
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
    if (event.key === "Escape") this.toggleInstructions()
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

    
    // Set cursor
    this.world.canvas.style.cursor = this.shiftKeyDown ? "ns-resize" : "grabbing"
  }

  releaseObject() {
    this.movingObject = null
    // Set cursor
    this.world.canvas.style.cursor = ""
  }

  rotateObject() {
    if (!this.movingObject) return

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

  //#region Connecting pins
  hoverPins() {
    const intersects = this.raycaster.intersectObjects(this.world.pinMeshes)

    this.world.pinMeshes.filter(p => !this.selectedPinMeshes.includes(p)).forEach(p => p.visible = false)
    
    this.hoveringPinMesh = intersects.length > 0 ? intersects[0].object : null
    if (this.hoveringPinMesh) this.hoveringPinMesh.visible = true

    this.checkTooltip()
  }

  checkTooltip() {
    if (this.hoveringPinMesh) {
      // Show tooltip
      this.tooltip.classList.add("tooltip--visible")

      // Set tooltip position
      this.tooltip.style.left = (this.cursor.x + 20).toString() + "px"
      this.tooltip.style.top = this.cursor.y.toString() + "px"

      // Set tooltip text
      const pin : Pin = this.hoveringPinMesh.userData.pin
      const pinKey = Object.keys(pin.parent.pins).filter(k => pin.parent.pins[k] === pin)
      
      this.tooltip.innerHTML = pinKey
    } else {
      // Hide tooltip
      this.tooltip.classList.remove("tooltip--visible")
      this.tooltip.innerHTML = ""
    }
  }

  pickPin() {
    if (!this.hoveringPinMesh) return

    // If this pin is in a connection > remove connection
    // const hasConnection = this.hoveringPinMesh
    const hoveringPin = this.hoveringPinMesh.userData.pin

    if (this.electronicsWorld.getConnectionsOnPin(hoveringPin).length > 0) {
      this.electronicsWorld.removeConnectionsOnPin(hoveringPin)
      // return
    }

    // If this pin is already selected > deselect
    const selected = this.selectedPinMeshes.findIndex(n => n === this.hoveringPinMesh)
    if (selected > -1) this.selectedPinMeshes.splice(selected, 1)
    // Else > select
    else {
      this.selectedPinMeshes.push(this.hoveringPinMesh)
      this.hoveringPinMesh.visible = true
    }

    // If there are 2 pins selected > create connection
    if (this.selectedPinMeshes.length > 1) {
      this.connectPins(this.selectedPinMeshes)
      this.selectedPinMeshes = []
    }
  }

  connectPins(pinMeshes: THREE.Object3D[]) {
    const pin1 = pinMeshes[0].userData.pin
    const pin2 = pinMeshes[1].userData.pin

    this.electronicsWorld.addConnection(pin1, pin2)
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
