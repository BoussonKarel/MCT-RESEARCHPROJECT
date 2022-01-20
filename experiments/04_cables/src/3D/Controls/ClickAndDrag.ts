import * as THREE from "three"
import { Sizes } from "../Sizes"
import { Time } from "../Time"

export class ClickAndDrag {
  camera: THREE.PerspectiveCamera
  domElement: Element
  sizes: Sizes
  time: Time
  cursor: THREE.Vector2
  rightMouseDown: boolean = false
  movementAmplitude = 0.003
  grabbables: THREE.Object3D[]
  raycaster: THREE.Raycaster = new THREE.Raycaster()

  selectedObject: THREE.Object3D
  objectRaycaster: THREE.Raycaster = new THREE.Raycaster()

  // Plane on which you can drag around
  plane = new THREE.Plane()
  pNormal = new THREE.Vector3(0,1,0) // Normal point of plane
  planeIntersect = new THREE.Vector3() // Point of intersection ray w/ plane
  shift = new THREE.Vector3() // Distance between intersect[x].object.position - intersect[x].point

  constructor(
    camera: THREE.PerspectiveCamera,
    domElement: Element,
    grabbables = []
  ) {
    this.camera = camera
    this.camera.rotation.reorder("YXZ")
    this.domElement = domElement

    this.sizes = new Sizes()
    this.time = new Time()

    this.cursor = new THREE.Vector2()

    this.disableContextMenu() // No more right click context menu

    this.clickEvents()

    document.addEventListener("mousemove", (e) => this.moveEvent(e))
    document.addEventListener("wheel", (e) => this.scrollEvent(e))

    this.grabbables = grabbables

    this.time.on('tick', () => {
      
    })
  }

  disableContextMenu() {
    this.domElement.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault()
      },
      false
    )
  }

  clickEvents() {
    window.addEventListener("mousedown", (e) => {
      if (e.button === 0) this.dragStart()
      if (e.button === 2) this.rightMouseDown = true
    })

    window.addEventListener("mouseup", (e) => {
      if (e.button === 0) this.dragEnd()
      if (e.button === 2) this.rightMouseDown = false
    })
  }

  dragStart() {
    // Shoot ray and check for intersecting objects
    this.raycaster.setFromCamera(
      { x: this.cursor.x, y: this.cursor.y },
      this.camera
    )

    const intersects = this.raycaster.intersectObjects(this.grabbables)

    // Use first object
    if (intersects.length > 0) {
      const pIntersect = intersects[0].point

      // Add a horizontal plane slicing trough the intersection point
      this.plane.setFromNormalAndCoplanarPoint(this.pNormal, pIntersect)
      this.shift.subVectors(intersects[0].object.position, intersects[0].point)

      this.selectedObject = intersects[0].object
    }
  }

  dragEnd() {
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

      // LEFT - RIGHT
      this.camera.rotation.y += event.movementX * this.movementAmplitude
    }

    if (this.selectedObject) {
      this.raycaster.setFromCamera(this.cursor, this.camera)

      if (this.selectedObject) {
        // Copy the point of intersection ray w/ plane to this.planeIntersect
        this.raycaster.ray.intersectPlane(this.plane, this.planeIntersect)
        // Move to the intersection point w/ the plane
        // Adjust with the shift (no sudden bumps when clicking elsewhere)
        this.selectedObject.position.addVectors(this.planeIntersect, this.shift)
      }
    }
  }

  // Zoom
  scrollEvent(event: WheelEvent) {
    const zoomValue = this.camera.zoom - event.deltaY / 100 / 10
    this.camera.zoom = Math.min(Math.max(zoomValue, 1), 5)
    this.camera.updateProjectionMatrix()
  }

  updateRaycaster() {
    
  }
}
