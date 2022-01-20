import "./style.css"

import * as dat from 'lil-gui'
import * as THREE from 'three'
import { SimpleCube } from "./3D/Objects/SimpleCube"
import { World } from "./3D/World"

const ui = new dat.GUI()

/**
 * Base
 */
const world = new World(document.querySelector('canvas.webgl'))

ui.add(world.camera, 'fov').min(15).max(100).step(1).name('Camera FOV').onChange(() => {
  world.camera.updateProjectionMatrix()
})

ui.add(world.camera, 'zoom').min(1).max(5).step(.05).name('Camera Zoom').onChange(() => {
  world.camera.updateProjectionMatrix()
})


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
world.scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffd2, 0.5)
const lampPosition = new THREE.Vector3(0, 2, 0)
directionalLight.position.copy(lampPosition)
directionalLight.lookAt(new THREE.Vector3(0, 1, 0))
world.scene.add(directionalLight)