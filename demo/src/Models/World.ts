import * as THREE from "three"
import sources from "../sources"

import { Resources } from "./Resources"
import { Controls } from "./Controls/Controls"
import { Sizes } from "./Sizes"
import { Time } from "./Time"
import { Debug } from "./Debug"

import { Floor } from "./Objects/Environment/Floor"
import { Desk } from "./Objects/Environment/Desk"

let instance: World = null

export class World {
  debug: Debug
  canvas: HTMLCanvasElement
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
    if (instance) return instance
    instance = this

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

    this.scene.add(this.camera)

    // Controls
    const lookAt = new THREE.Vector3(0, .75, 0)
    this.controls = new Controls(this.camera, lookAt)

    // Resources
    this.resources = new Resources(sources)
    this.resources.on("loaded", () => this.addObjects())

    // Lights
    this.addLights()

    this.setDebugOptions()
  }

  setDebugOptions() {
    if (this.debug.active) {
      const cameraFolder = this.debug.ui.addFolder("Camera")

      cameraFolder.add(this.camera, 'fov').min(15).max(100).step(1).name('Camera FOV').onChange(() => {
        this.camera.updateProjectionMatrix()
      })
      
      cameraFolder.add(this.camera, 'zoom').min(1).max(5).step(.05).name('Camera Zoom').onChange(() => {
        this.camera.updateProjectionMatrix()
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
    directionalLight.position.set(0,2,0)
    
    directionalLight.castShadow = true // SHADOWS
    directionalLight.shadow.mapSize.set(2048, 2048) // or width/x or height/y
    directionalLight.shadow.radius = .5

    // shadow camera optimization (floor is only 5x5)
    directionalLight.shadow.camera.top = 2.5
    directionalLight.shadow.camera.right = 2.5
    directionalLight.shadow.camera.bottom = -2.5
    directionalLight.shadow.camera.left = -2.5

    directionalLight.shadow.camera.near = .5 // Don't render shadows before .5m
    directionalLight.shadow.camera.far = 2.1 // light is only 2 meters above the ground

    this.scene.add(directionalLight)
  }
}
