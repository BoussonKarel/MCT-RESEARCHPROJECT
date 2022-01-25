import "./style.css"

import * as dat from 'lil-gui'
import * as THREE from 'three'
import { World } from "./3D/World"
import { DebugSpawner } from "./3D/Objects/DebugSpawner"

const world = new World()

const ui = new dat.GUI()

ui.add(world.camera, 'fov').min(15).max(100).step(1).name('Camera FOV').onChange(() => {
  world.camera.updateProjectionMatrix()
})

ui.add(world.camera, 'zoom').min(1).max(5).step(.05).name('Camera Zoom').onChange(() => {
  world.camera.updateProjectionMatrix()
})

const debugSpawner = new DebugSpawner()

ui.add(debugSpawner, 'addCube')
ui.add(debugSpawner, 'addUltrasone')