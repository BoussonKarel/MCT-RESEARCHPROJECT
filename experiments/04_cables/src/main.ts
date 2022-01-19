import "./style.css"
import * as THREE from 'three'
import sources from './sources'
import { Resources } from "./3D/Resources"

/**
 * Base
 */
const canvas = document.querySelector("canvas.webgl")

const scene = new THREE.Scene()

const resources = new Resources(sources)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.z = 0.75
camera.position.y = 1.25
scene.add(camera)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffd2, 0.5)
const lampPosition = new THREE.Vector3(0, 2, 0)
directionalLight.position.copy(lampPosition)
directionalLight.lookAt(new THREE.Vector3(0, 1, 0))
scene.add(directionalLight)

/**
 * Objects
 */
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

resources.on('loaded', () => {
  // Floor
  const floorGeometry = new THREE.PlaneGeometry(5,5)
  const floorMaterial = new THREE.MeshBasicMaterial()

  floorMaterial.map = resources.items["woodFloor"]
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.set(0,-0.001,0)
  floor.rotation.x = -Math.PI/2
  scene.add(floor)

  // Desk
  const deskHeight = .73;
  const desk : THREE.Object3D = resources.items["Desk"].scene.children[0]
  // @ts-ignore
  desk.children[0].geometry.center()
  desk.scale.set(1/100, 1/100, 1/100) // From 73m to 73cm
  
  desk.position.set(0, deskHeight * 0.5, 0)

  scene.add(desk)
  console.log(desk)

  // Cube
  const cubeSize = 0.2;
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
    new THREE.MeshBasicMaterial({color: 0xff2222})
  )
  cube.position.set(0, deskHeight + cubeSize/2, 0)
  scene.add(cube)

  camera.lookAt(cube.position)
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Controls
 */

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()