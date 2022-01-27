import * as THREE from "three"
import sources from "../sources"

import { Resources } from "./Resources"
import { Controls } from "./Controls/Controls"
import { Sizes } from "./Sizes"
import { Time } from "./Time"
import { Debug } from "./Debug"

import { Floor } from "./Objects/Environment/Floor"
import { Desk } from "./Objects/Environment/Desk"

let world: World = null

export class World {
  debug: Debug
  canvas: Element
  sizes: Sizes
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  time: Time
  scene: THREE.Scene
  controls: Controls
  resources: Resources

  grabbables: THREE.Object3D[] = []
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

    // Time
    this.time = new Time()

    // Scene
    this.scene = new THREE.Scene()

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    })

    this.renderer.shadowMap.enabled = true

    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(this.sizes.pixelRatio)

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
    this.camera.position.set(0, 1.5, 0.5)
    this.scene.add(this.camera)

    // Camera location
    this.camera.lookAt(new THREE.Vector3(0, .73, 0))

    // Controls
    this.controls = new Controls(this.camera)

    // Resources
    this.resources = new Resources(sources)
    this.resources.on("loaded", () => this.addObjects())

    // Lights
    this.addLights()

    this.setDebugOptions()
  }

  setDebugOptions() {
    if (this.debug.active) {
      this.debug.ui.add(this.camera, 'fov').min(15).max(100).step(1).name('Camera FOV').onChange(() => {
        world.camera.updateProjectionMatrix()
      })
      
      this.debug.ui.add(this.camera, 'zoom').min(1).max(5).step(.05).name('Camera Zoom').onChange(() => {
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
