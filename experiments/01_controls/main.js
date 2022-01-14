import "./style.css"
import * as THREE from "three"
import * as dat from "lil-gui"

const gui = new dat.GUI()

const pointerLockMode = false
const rightClickNeeded = true

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
axesHelper.visible = false
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
    opacity: 0.9,
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
lightBulb.position.y = tableHeight + lampStickSize + bulbRadius -0.01
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

camera.rotation.reorder("YXZ")
camera.lookAt(new THREE.Vector3(0, 1.5, 0))

// Crosshair?
const crosshair = new THREE.Mesh(
  new THREE.CircleGeometry(0.001),
  new THREE.MeshStandardMaterial({color: 0xffffff})
)
crosshair.position.y = 0
crosshair.position.z = - camera.near - 0.01
if (!pointerLockMode) crosshair.visible = false;
camera.add(crosshair)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffff00, 2, 10)
pointLight.position.copy(lightBulb.position)
scene.add(pointLight)

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
let rightMouseDown;

// Drag
window.addEventListener('mousedown', (e) => {
  if (e.button === 0) mainMouseDown = true
  if (e.button === 2) rightMouseDown = true
})

window.addEventListener('mouseup', (e) => {
  if (e.button === 0) mainMouseDown = false
  if (e.button === 2) rightMouseDown = false
})

document.addEventListener('contextmenu', e => {
  e.preventDefault()
}, false)

// Look around using movementX, movementY
const updateMovement = (event) => {
  if (rightClickNeeded) updateCursorPosition(event)

  if (rightClickNeeded && !rightMouseDown) return
  // LEFT - RIGHT
  camera.rotation.y += -event.movementX * 0.003

  // UP - DOWN
  const RotationX = camera.rotation.x - event.movementY * 0.003
  const halfPi = Math.PI / 2
  camera.rotation.x = Math.max(Math.min(RotationX, halfPi), -halfPi) // Between - halfPi and + halfPi
}

const cursorPosition = new THREE.Vector2()

const updateCursorPosition = (event) => {
  cursorPosition.x = event.clientX / sizes.width * 2 - 1
  cursorPosition.y = - (event.clientY / sizes.height) * 2 + 1
}

// Look around using clientX, clientY (180°)
const updatePosition = (event) => {
  updateCursorPosition(event)
  // LEFT - RIGHT
  const degreesY = 180
  camera.rotation.y = - cursorPosition.x * (degreesY / 360 * Math.PI)

  // UP - DOWN
  const degreesX = 180 
  camera.rotation.x = cursorPosition.y * (degreesX / 360 * Math.PI)
}

const usePointerLock = () => {
  canvas.addEventListener("click", canvas.requestPointerLock)
    
  document.addEventListener("pointerlockchange", lockChange)
  
  function lockChange() {
    if (document.pointerLockElement === canvas) {
        document.addEventListener("mousemove", updateMovement)
    } else {
      document.removeEventListener("mousemove", updateMovement)
    }
  }
}

let paused = false;

const useNoLock = () => {
  const updateFunction = rightClickNeeded ? updateMovement : updatePosition

  document.addEventListener("mousemove", updateFunction)

  const togglePause = () => {
    paused = !paused;

    if (paused) {
      // Remove moving event
      document.removeEventListener("mousemove", updateFunction)
      // Add a clicking event to undo the pause
      document.addEventListener("click", togglePause)
    } else {
      // Add moving event again
      document.addEventListener("mousemove", updateFunction)
      // Remove the clicking event, there is no pause to undo
      document.removeEventListener("click", togglePause)
    }
  }

  if (!rightClickNeeded) document.addEventListener("keydown", (event) => {
    if (event.code === "Escape") togglePause()
  })
}

if (pointerLockMode) usePointerLock()
else useNoLock()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update raycaster
  if (pointerLockMode) { // When using crosshair
    dragRayCaster.setFromCamera({x: 0, y: 0}, camera)
  } else {
    dragRayCaster.setFromCamera({x: cursorPosition.x, y: cursorPosition.y}, camera)
  }

  const intersects = dragRayCaster.intersectObjects(grabbables)

  for (const intersect of intersects) {
    if (mainMouseDown) { // Drag
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
