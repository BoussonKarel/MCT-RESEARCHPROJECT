import "./style.css"
import * as THREE from "three"

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// AXES HELPER
const axesHelper = new THREE.AxesHelper(1) // AxesHelper(length)
scene.add(axesHelper)

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)
// Add to scene
// scene.add(mesh)

// GROUPS
const group = new THREE.Group()
// group.position.y = 1;
// group.scale.y = 2;
// group.rotation.y = 1;
scene.add(group)

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
group.add(cube1)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.x = -2
group.add(cube2)

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.x = 2
group.add(cube3)

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// POSITION
// mesh.position.x = 0.7
// mesh.position.y = - 0.6
// mesh.position.z = 1

// POSITION - METHODS
// mesh.position.set(0.7, -0.6, 1)

// console.log(
//     "Length between cube & center ",
//     mesh.position.length())
// console.log(
//     "Length between cube & center ",
//     mesh.position.distanceTo(camera.position))

// mesh.position.normalize() // Reduce length() until it's 1

// SCALE
// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;
// mesh.scale.set(2, 0.5, 0.5)

// ROTATION VS QUATERNION
// Updating one updates the other :)

// ROTATION
// rotation is not Vector3, but Euler

// First rotate around Y, then X, then Z
// Otherwise you will get gimball lock
// mesh.rotation.reorder('YXZ')
// mesh.rotation.x = Math.PI*0.25; // 1 full rotation = PI
// mesh.rotation.y = Math.PI*0.25; // 1 full rotation = PI

// QUATERNION
// Rotation, but in a more mathematical way

// LOOKAT
// Make camera look at the center of an object
// lookAt(Vector3)
// camera.lookAt(mesh.position)

// COMBINING TRANSFORMATIONS
// You can combine transformations in any order (scale, position, rotation)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
