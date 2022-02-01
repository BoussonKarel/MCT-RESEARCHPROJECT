import * as THREE from "three"
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

import sources from "../sources"

import { Resources } from "./Resources"
import { Controls } from "./Controls/Controls"
import { Sizes } from "./Sizes"
import { Time } from "./Time"
import { Debug } from "./Debug"

import { Floor } from "./Objects/Environment/Floor"
import { Desk } from "./Objects/Environment/Desk"
import { VRControls } from "./Controls/VRControls";

let world: World = null

export class World {
  debug: Debug
  canvas: HTMLCanvasElement
  sizes: Sizes
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  time: Time
  scene: THREE.Scene
  controls: Controls | VRControls
  resources: Resources

  grabbables: THREE.Group = new THREE.Group()
  pinMeshes: THREE.Object3D[] = []

  constructor() {

    if (world) return world
    world = this

    // Debug
    this.debug = new Debug()

    // Canvas
    this.canvas = document.querySelector('canvas.webgl')

    // Sizes
    this.sizes = new Sizes()
    this.sizes.on("resize", () => {
      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(this.sizes.pixelRatio)
    })

    // Scene
    this.scene = new THREE.Scene()
    this.scene.add(this.grabbables)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    })

    this.renderer.shadowMap.enabled = true

    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(this.sizes.pixelRatio)

    // Time
    this.time = new Time(this.renderer)

    this.time.on('tick', () => {
      this.renderer.render(this.scene, this.camera)
    })

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    )

    this.scene.add(this.camera)

    // Controls
    // this.controls = new Controls(this.camera)

    // Resources
    this.resources = new Resources(sources)
    this.resources.on("loaded", () => this.addObjects())

    // Lights
    this.addLights()

    this.setDebugOptions()

    // VR
    this.controls = new VRControls(this.camera)

    document.body.appendChild( VRButton.createButton( this.renderer ) );

    this.renderer.xr.enabled = true;
  }

  setDebugOptions() {
    if (this.debug.active) {
      const cameraFolder = this.debug.ui.addFolder("Camera")

      cameraFolder.add(this.camera, 'fov').min(15).max(100).step(1).name('Camera FOV').onChange(() => {
        world.camera.updateProjectionMatrix()
      })
      
      cameraFolder.add(this.camera, 'zoom').min(1).max(5).step(.05).name('Camera Zoom').onChange(() => {
        world.camera.updateProjectionMatrix()
      })
    }
  }

  addObjects() {
    // Floor
    const floor = new Floor()

    // Desk
    const desk = new Desk()
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffd2, .5)
    const lampPosition = new THREE.Vector3(0, 2, 0)
    directionalLight.position.copy(lampPosition)
    this.scene.add(directionalLight)
  }
}
