import * as THREE from "three"
import sources from "../sources"

import { Resources } from "./Resources"
import { ClickAndDrag } from "./Controls/ClickAndDrag"
import { Sizes } from "./Sizes"
import { Time } from "./Time"

import { SimpleCube } from './Objects/SimpleCube'

let world = null

export class World {
  constructor(canvas) {
    if (world) return world
    world = this

    // Canvas
    this.canvas = canvas

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
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(this.sizes.pixelRatio)

    this.time.on('tick', () => {
      this.renderer.render(this.scene, this.camera)
    })

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    )
    this.camera.position.set(0, 1.25, 0.75)
    this.scene.add(this.camera)

    // Controls
    this.controls = new ClickAndDrag(this.camera, this.canvas)

    // Resources
    this.resources = new Resources(sources)
    this.resources.on("loaded", () => this.addObjects())
  }

  addObjects() {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(5, 5)
    const floorMaterial = new THREE.MeshBasicMaterial()

    floorMaterial.map = this.resources.items["woodFloor"]
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.position.set(0, -0.001, 0)
    floor.rotation.x = -Math.PI / 2
    this.scene.add(floor)

    // Desk
    const deskHeight = 0.73
    const desk = this.resources.items["Desk"].scene.children[0]
    // @ts-ignore
    desk.children[0].geometry.center()
    desk.scale.set(1 / 100, 1 / 100, 1 / 100) // From 73m to 73cm

    desk.position.set(0, deskHeight * 0.5, 0)

    this.scene.add(desk)

    // Cube
    const cube = new SimpleCube()
    cube.mesh.position.set(
      0,
      deskHeight + cube.geometry.parameters.height / 2,
      0
    )
    this.scene.add(cube.mesh)
    this.controls.grabbables.push(cube.mesh)

    // Cube
    const solidCube = new SimpleCube(0.1, new THREE.Color(0x22ff22))
    solidCube.mesh.position.copy(cube.mesh.position)
    solidCube.mesh.position.x += 0.3
    this.scene.add(solidCube.mesh)

    console.log(cube.mesh.uuid)
    console.log(solidCube.mesh.uuid)

    this.camera.lookAt(cube.mesh.position)
  }
}
