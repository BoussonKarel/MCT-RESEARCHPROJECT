import * as THREE from "three"
import * as CANNON from "cannon-es"
import { Sizes } from "../Sizes"
import { World } from "../World"
import { Physics } from "../Physics"

export class ClickAndDrag2 {
  world: World
  physics: Physics
  camera: THREE.PerspectiveCamera
  sizes: Sizes
  cursor: THREE.Vector2 = new THREE.Vector2()
  
  rightMouseDown: boolean = false
  movementAmplitude = 0.002

  raycaster: THREE.Raycaster = new THREE.Raycaster()

  selectedObject: THREE.Object3D = null
  
  phNormal = new THREE.Vector3(0,1,0)
  movementPlaneH: THREE.Plane = new THREE.Plane()
  pvNormal = new THREE.Vector3(0,0,1)
  movementPlaneV: THREE.Plane = new THREE.Plane()

  marker: THREE.Mesh

  jointBody: CANNON.Body
  jointConstraint: CANNON.PointToPointConstraint

  constructor(camera: THREE.PerspectiveCamera) {
    this.world = new World()
    this.physics = new Physics()
    this.camera = camera
    this.camera.rotation.reorder("YXZ")
    this.sizes = new Sizes()

    // Marker for dragging
    const markerRadius = 0.02

    this.marker = new THREE.Mesh(
      new THREE.SphereGeometry(markerRadius, 8, 8),
      new  THREE.MeshLambertMaterial({color: 0xff0000})
    )
    this.marker.visible = false
    this.world.scene.add(this.marker)

    // Joint physics
    this.jointBody = new CANNON.Body({
      mass: 5,
      shape: new CANNON.Sphere(markerRadius/2),
      collisionFilterGroup: 0,
      collisionFilterMask: 0
    })
    this.physics.physicsWorld.addBody(this.jointBody)

    // Events
    this.clickEvents()
    document.addEventListener("mousemove", (e) => this.mouseMoveEvent(e))
    document.addEventListener("wheel", (e) => this.scrollEvent(e))
    // Disable context menu (on right click)
    this.world.renderer.domElement.addEventListener(
      "contextmenu",
      (e) => e.preventDefault()
    )
  }

  
  //#region EventListeners
  clickEvents() {
    window.addEventListener("mousedown", (e) => {
      if (e.button === 0 && !this.selectedObject) this.pickObject()
      if (e.button === 2 && !this.rightMouseDown) this.rightMouseDown = true
    })

    window.addEventListener("mouseup", (e) => {
      if (e.button === 0 && this.selectedObject) this.releaseObject()
      if (e.button === 2 && this.rightMouseDown) this.rightMouseDown = false
    })
  }
  //#endregion

  //#region Moving objects
  pickObject() {
    // Cast ray
    this.raycaster.setFromCamera(this.cursor, this.camera)

    const intersects = this.raycaster.intersectObjects(this.world.grabbables)

    if (intersects.length < 1) return;
    this.selectedObject = intersects[0].object

    // Show & move marker
    this.marker.visible = true
    this.marker.position.copy(intersects[0].point)

    // Move plane
    this.movementPlaneH.setFromNormalAndCoplanarPoint(this.phNormal, intersects[0].point)
    this.movementPlaneV.setFromNormalAndCoplanarPoint(this.pvNormal, intersects[0].point)

    // Add joint constraint
    // @ts-ignore
    const vector = new CANNON.Vec3().copy(intersects[0].point).vsub(this.selectedObject.position)

    const selectedBody : CANNON.Body = this.selectedObject.userData.parent.physicsBody

    const antiRotation = selectedBody.quaternion.inverse()
    const pivot = antiRotation.vmult(vector)

    // @ts-ignore
    this.jointBody.position.copy(intersects[0].point)

    this.jointConstraint = new CANNON.PointToPointConstraint(selectedBody, pivot, this.jointBody, new CANNON.Vec3(0, 0, 0))
  
    this.physics.physicsWorld.addConstraint(this.jointConstraint)

    console.log(this.physics.physicsWorld)
  }

  releaseObject() {
    
  }

  moveObject() {
    if (!this.selectedObject) return

    // Cast ray
    this.raycaster.setFromCamera(this.cursor, this.camera)

    const planeIntersect = new THREE.Vector3()
    this.raycaster.ray.intersectPlane(this.movementPlaneH, planeIntersect)

    // Move marker
    this.marker.position.copy(planeIntersect)

    // Move joint
    // @ts-ignore
    this.jointBody.position.copy(planeIntersect)
    this.jointConstraint.update()
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
