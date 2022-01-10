import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    // console.log(event.clientX)
    // We prefer 0 - 1 instead of px
    // Divide by viewport size

    cursor.x = event.clientX / sizes.width - 0.5; // -0.5 to 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5);
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// PerspectiveCamera
const camera = new THREE.PerspectiveCamera(
    75, // fov: Field Of View (vertical) // Recommended by Bruno: 45 - 75
    sizes.width / sizes.height,
    0.1, // near
    100 // far
    // don't use extreme values like 0.0001 and 99999 --> z-fighting
    )

// OrtographicCamera(left, right, top, bottom, near, far)
// No perspective
// No cone, more like a square (parallel)

// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
// Cube looks stretched because canvas is rectangle and render is square

// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//     -1 * aspectRatio, // left
//     1 * aspectRatio, // right
//     1, // top
//     -1, // bottom
//     0.1, // near
//     100 //far
//     )

camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas);
// Add damping > more smooth
controls.enableDamping = true;

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    // Update camera
    // camera.position.x = cursor.x * 5;
    // camera.position.y = cursor.y * 5;

    // Look at the back, rotate in a circle around the cube
    // cosinus, sinus, Math.PI...
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * 5;

    // camera.lookAt(mesh.position)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()