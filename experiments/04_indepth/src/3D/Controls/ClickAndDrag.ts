import * as THREE from "three"
import { Sizes } from "../Sizes"
import { Time } from "../Time"
import { World } from "../World"

export class ClickAndDrag {
  world: World
  camera: THREE.PerspectiveCamera
  domElement: Element
  sizes: Sizes
  time: Time
  cursor: THREE.Vector2
  leftMouseDown: boolean = false
  rightMouseDown: boolean = false
  shiftKeyDown: boolean = false
  movementAmplitude = 0.003
  raycaster: THREE.Raycaster = new THREE.Raycaster()

  selectedObject: THREE.Object3D
  objectRaycaster: THREE.Raycaster = new THREE.Raycaster()

  // Plane on which you can drag around
  horizontalPlane = new THREE.Plane() // Horizontal plane
  phNormal = new THREE.Vector3(0, 1, 0) // Normal point of plane (horizontal)

  verticalPlane = new THREE.Plane()
  pvNormal = new THREE.Vector3(0, 0, 1)

  planeIntersect = new THREE.Vector3() // Point of intersection ray w/ plane
  shift = new THREE.Vector3() // Distance between intersect[x].object.position - intersect[x].point

  constructor(camera: THREE.PerspectiveCamera, domElement: Element) {
    this.world = new World()

    this.camera = camera
    this.camera.rotation.reorder("YXZ")
    this.domElement = domElement

    this.sizes = new Sizes()
    this.time = new Time()

    this.cursor = new THREE.Vector2()

    // Disable context menu (on right click)
    this.domElement.addEventListener(
      "contextmenu",
      (e) => e.preventDefault()
    )

    this.clickEvents()
    this.keyEvents()
    document.addEventListener("mousemove", (e) => this.moveEvent(e))
    document.addEventListener("wheel", (e) => this.scrollEvent(e))

    this.time.on("tick", () => {})
  }

  
  //#region EventListeners
  clickEvents() {
    window.addEventListener("mousedown", (e) => {
      if (e.button === 0 && !this.leftMouseDown) {
        this.leftMouseDown = true
        this.dragStart()
      }

      if (e.button === 2 && !this.rightMouseDown) {
        this.rightMouseDown = true
      }
    })

    window.addEventListener("mouseup", (e) => {
      if (e.button === 0 && this.leftMouseDown) {
        this.leftMouseDown = false
        this.dragEnd()
      }
      if (e.button === 2 && this.rightMouseDown) {
        this.rightMouseDown = false
      }
    })
  }

  keyEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Shift" && !this.shiftKeyDown) {
        this.shiftKeyDown = true

        if (this.leftMouseDown) {
          this.dragStart()
        }
      }
    })
    document.addEventListener("keyup", (e) => {
      if (e.key === "Shift") {
        this.shiftKeyDown = false

        if (this.leftMouseDown) {
          this.dragStart()
        }
      }
    })
  }
  //#endregion

  //#region Dragging
  setPlanes(objectPosition: THREE.Vector3, pIntersect: THREE.Vector3) {
    // Add a horizontal plane slicing trough point of intersection
    this.horizontalPlane.setFromNormalAndCoplanarPoint(
      this.phNormal,
      pIntersect
    )
    // Add a vertical plane
    this.verticalPlane.setFromNormalAndCoplanarPoint(this.pvNormal, pIntersect)

    // Difference between intersection point and position
    this.shift.subVectors(objectPosition, pIntersect)
  }

  dragStart() {
    // Shoot ray and check for intersecting objects
    this.raycaster.setFromCamera(
      { x: this.cursor.x, y: this.cursor.y },
      this.camera
    )

    const intersects = this.raycaster.intersectObjects(this.world.grabbables)

    if (intersects.length > 0) {
      // Set planes to go trough the intersection point
      this.setPlanes(intersects[0].object.position, intersects[0].point)

      // Set this object as selectedObject
      this.selectedObject = intersects[0].object

      // Set cursor
      // @ts-ignore
      this.world.canvas.style.cursor = 'grabbing'
      // @ts-ignore
      if (this.shiftKeyDown) this.world.canvas.style.cursor = 'move'
    }
  }

  dragEnd() {
    // Set cursor
    // @ts-ignore
    this.world.canvas.style.cursor = 'auto'

    this.selectedObject = undefined
  }

  // Move, set cursor coords
  moveEvent(event: MouseEvent) {
    // Update cursor position
    this.cursor.x = (event.clientX / this.sizes.width) * 2 - 1 // -1 to 1 (left to right)
    this.cursor.y = -(event.clientY / this.sizes.height) * 2 + 1 // -1 to 1 (bottom to top)

    // Look around (on right click)
    if (this.rightMouseDown) {
      // UP - DOWN
      this.camera.rotation.x += event.movementY * this.movementAmplitude

      // Don't look further than all the way up/down
      this.camera.rotation.x = Math.min(Math.max(this.camera.rotation.x, -Math.PI/2), Math.PI/2)
      

      // LEFT - RIGHT
      this.camera.rotation.y += event.movementX * this.movementAmplitude
    }

    // if an object is selected
    if (this.selectedObject) {
      this.raycaster.setFromCamera(this.cursor, this.camera)

      if (this.shiftKeyDown) {
        this.raycaster.ray.intersectPlane(
          this.verticalPlane,
          this.planeIntersect
        )
      } else {
        this.raycaster.ray.intersectPlane(
          this.horizontalPlane,
          this.planeIntersect
        )
      }

      // Move to the intersection point w/ the plane
      // Adjust with the shift (no sudden bumps when clicking elsewhere)
      this.selectedObject.position.addVectors(this.planeIntersect, this.shift)
    }
  }
  //#endregion

  //#region Zoom
  scrollEvent(event: WheelEvent) {
    const zoomValue = this.camera.zoom - event.deltaY / 100 / 10
    this.camera.zoom = Math.min(Math.max(zoomValue, 1), 5)
    this.camera.updateProjectionMatrix()
  }
  //#endregion
}
