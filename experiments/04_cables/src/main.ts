import "./style.css"

import * as dat from 'lil-gui'
import * as THREE from 'three'
import { World } from "./3D/World"

const world = new World(document.querySelector('canvas.webgl'))

const ui = new dat.GUI()

ui.add(world.camera, 'fov').min(15).max(100).step(1).name('Camera FOV').onChange(() => {
  world.camera.updateProjectionMatrix()
})

ui.add(world.camera, 'zoom').min(1).max(5).step(.05).name('Camera Zoom').onChange(() => {
  world.camera.updateProjectionMatrix()
})