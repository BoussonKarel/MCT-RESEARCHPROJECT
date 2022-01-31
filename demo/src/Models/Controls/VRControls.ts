import * as THREE from "three"
import { ElectronicsWorld } from "../ElectronicsWorld"
import { World } from "../World"
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

export class VRControls {
  world: World
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera

  electronicsWorld: ElectronicsWorld

  movingObject: THREE.Object3D

  hoveringPinMesh: THREE.Object3D

  controller1: THREE.Group
  controller2: THREE.Group
  controllerGrip1: THREE.Group
  controllerGrip2: THREE.Group

  tempMatrix: THREE.Matrix4 = new THREE.Matrix4()

  raycaster: THREE.Raycaster = new THREE.Raycaster()

  constructor(camera: THREE.PerspectiveCamera) {
    this.world = new World()
    this.renderer = this.world.renderer

    this.camera = camera
    this.camera.rotation.reorder("YXZ")
    this.camera.position.set(0, 1.5, 1.5)
    this.camera.lookAt(0, .75, 0)

    const XRcamera = this.renderer.xr.getCamera(this.camera)
    XRcamera.position.set(0, 1.5, 1.5)

    // Controllers
    this.controller1 = this.renderer.xr.getController( 0 );
		this.world.scene.add( this.controller1 );

    this.controller2 = this.renderer.xr.getController( 0 );
		this.world.scene.add( this.controller2 );
    this.setControllerEvents()

    const controllerModelFactory = new XRControllerModelFactory();

		this.controllerGrip1 = this.renderer.xr.getControllerGrip( 0 );
		this.controllerGrip1.add( controllerModelFactory.createControllerModel( this.controllerGrip1 ) );
		this.world.scene.add( this.controllerGrip1 );

		this.controllerGrip2 = this.renderer.xr.getControllerGrip( 1 );
		this.controllerGrip2.add( controllerModelFactory.createControllerModel( this.controllerGrip2 ) );
		this.world.scene.add( this.controllerGrip2 );

    const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

		const line = new THREE.Line( geometry );
		line.name = 'line';
		line.scale.z = 5;

		this.controller1.add( line.clone() );
		this.controller2.add( line.clone() );

    this.electronicsWorld = new ElectronicsWorld()
  }

  //#region Events
  // Controllers
  setControllerEvents() {

		this.controller1.addEventListener( 'selectstart', (e) => this.onSelectStart(e) );
		this.controller1.addEventListener( 'selectend', (e) => this.onSelectEnd(e) );
    
		this.controller2.addEventListener( 'selectstart', (e) => this.onSelectStart(e) );
		this.controller2.addEventListener( 'selectend', (e) => this.onSelectEnd(e) );

    // this.world.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e))
    // this.world.canvas.addEventListener("wheel", (e) => this.onWheel(e))
    // this.world.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e))
    // this.world.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e))
  }

  onSelectStart(e) {
    if (this.movingObject) return

    const controller = e.target

    const intersections = this.getIntersections(controller)

    if (intersections.length > 0) {
      const object = intersections[0].object

      // @ts-ignore
			object.material.emissive.b = 1

      controller.userData.selected = object
      controller.userData.previousParent = object.parent

      // Attach to controller
      controller.attach(object)

      // Set as selected object
      this.movingObject = object
    }
  }

  onSelectEnd(e) {
    const controller = e.target

    if (controller.userData.selected !== undefined) {
      const object = controller.userData.selected;
			object.material.emissive.b = 0;

      // Attach to world
			controller.userData.previousParent.attach(object)

      // Unset as selected object
			controller.userData.selected = undefined;
      this.movingObject = null
    }
  }

  getIntersections(controller) {
    this.tempMatrix.identity().extractRotation(controller.matrixWorld);

    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld)
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix)

    return this.raycaster.intersectObjects(this.world.grabbables, false)
  }

  onMouseMove(event: MouseEvent) {
    // Update cursorNormalized position
    // this.cursorNormalized.x = (event.clientX / this.sizes.width) * 2 - 1 // -1 to 1 (left to right)
    // this.cursorNormalized.y = -(event.clientY / this.sizes.height) * 2 + 1 // -1 to 1 (bottom to top)

    // this.cursor.x = event.clientX
    // this.cursor.y = event.clientY

    // // Set raycaster from camera
    // this.raycaster.setFromCamera(this.cursorNormalized, this.camera)

    // // Look around (on right click)
    // this.updateCameraRotation(event.movementX, event.movementY)

    // if (this.movingObject) this.moveObject()
    // else this.hoverPins()
  }
  //#endregion

  //#region Moving objects
  pickObject() {
    
  }

  updatePlane() {
    
  }

  releaseObject() {
    
  }

  rotateObject() {
    
  }

  moveObject() {
    
  }
  //#endregion

  //#region Connecting pins
  hoverPins() {
    
  }

  checkTooltip() {
    if (this.hoveringPinMesh) {
      
    } else {
      
    }
  }

  pickPin() {
  }

  connectPins(pinMeshes: THREE.Object3D[]) {

  }
  //#endregion
}
