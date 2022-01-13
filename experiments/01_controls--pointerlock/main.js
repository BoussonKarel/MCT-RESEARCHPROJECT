import "./style.css"
import * as THREE from "three"
import * as dat from "lil-gui"
// import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js'

const gui = new dat.GUI()

/**
 * Base
 */
const canvas = document.querySelector("canvas.webgl")

const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const woodMap = textureLoader.load("textures/wood_floor.jpg")
woodMap.wrapS = THREE.RepeatWrapping
woodMap.wrapT = THREE.RepeatWrapping
woodMap.repeat.set(5, 5)

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
 * Objects
 */
const grabbables = []
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// FLOOR
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    map: woodMap,
  })
)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

// TABLE
const tableHeight = 1
const tableMaterial = new THREE.MeshStandardMaterial({ color: "brown" })
const table = new THREE.Mesh(
  new THREE.BoxGeometry(2, tableHeight, 1),
  tableMaterial
)
table.position.y = table.geometry.parameters.height / 2
scene.add(table)

// CUBE
const cubeSize = 0.25
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: "red",
})
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.y = tableHeight + cubeSize / 2
cube.position.x -= 0.5
scene.add(cube)
grabbables.push(cube)

// LAMP
const lampGroup = new THREE.Group()

const bulbRadius = 0.05
const lightBulb = new THREE.Mesh(
  new THREE.SphereGeometry(bulbRadius),
  new THREE.MeshBasicMaterial({
    color: "yellow",
    transparent: true,
    alpha: 0.5,
  })
)

const lampStickSize = 0.3
const lampStick = new THREE.Mesh(
  new THREE.CylinderGeometry(0.02, 0.02, lampStickSize),
  new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
)

lampStick.position.copy(table.position)
lampStick.position.y = tableHeight + lampStickSize/2
lampStick.position.x += 0.85

// lightBulb.position.copy(table.position)
lightBulb.position.y = tableHeight + lampStickSize
lightBulb.position.x += 0.85

lampGroup.add(lightBulb, lampStick)

scene.add(lampGroup)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  70,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.z = 1
camera.position.y = 1.75
scene.add(camera)

camera.lookAt(new THREE.Vector3(0, 1.5, 0))

// Crosshair?
const crosshair = new THREE.Mesh(
  new THREE.CircleGeometry(0.001),
  new THREE.MeshStandardMaterial({color: 0xffffff})
)
crosshair.position.y = 0
crosshair.position.z = - camera.near - 0.01
camera.add(crosshair)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.1)
  .name("AmbientLight intensity")

const pointLight = new THREE.PointLight(0xffff00, 2, 10)
pointLight.position.copy(lightBulb.position)
scene.add(pointLight)

gui
  .add(pointLight, "intensity")
  .min(0)
  .max(10)
  .step(0.1)
  .name("PointLight intensity")
gui
  .add(pointLight, "distance")
  .min(0)
  .max(200)
  .step(1)
  .name("PointLight distance")
gui
  .add(pointLight, "decay")
  .min(0)
  .max(50)
  .step(0.1)
  .name("PointLight decay")

const pointLightHelper = new THREE.PointLightHelper(pointLight)
pointLightHelper.visible = false
scene.add(pointLightHelper)

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
// Drag
const dragRayCaster = new THREE.Raycaster()

let mainMouseDown;

window.addEventListener('mousedown', (e) => {
  if (e.button === 0) mainMouseDown = true
})

window.addEventListener('mouseup', (e) => {
  if (e.button === 0) mainMouseDown = false
})

// Look around
const updateMovement = (event) => {
  camera.rotation.reorder("YXZ")
  camera.rotation.y += -event.movementX * 0.003
  const RotationX = camera.rotation.x - event.movementY * 0.003
  const halfPi = Math.PI / 2
  camera.rotation.x = Math.max(Math.min(RotationX, halfPi), -halfPi)
}

const usePointerLock = () => {
  canvas.addEventListener("click", () => {
    canvas.requestPointerLock()
  })
  
  /* events fired on the draggable target */
  document.addEventListener("drag", function(event) {
    console.log(event)
  }, false);
  
  document.addEventListener("pointerlockchange", lockChange)

  function lockChange() {
    try {
      if (document.pointerLockElement === canvas) {
        document.addEventListener("mousemove", updateMovement)
      } else {
        document.removeEventListener("mousemove", updateMovement)
      }
    } catch(e) {
      console.error({e})
    }
  }
}

usePointerLock()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update raycaster
  dragRayCaster.setFromCamera({x: 0, y: 0}, camera)

  const intersects = dragRayCaster.intersectObjects(grabbables)

  for (const intersect of intersects) {
    if (mainMouseDown) {
      intersect.object.position.x = intersect.point.x
      intersect.object.position.z = intersect.point.z
    }
  }

  // Update controls

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
