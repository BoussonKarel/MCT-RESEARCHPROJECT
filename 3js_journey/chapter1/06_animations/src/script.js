import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Time
// let time = Date.now()

// Animations
// tick / loop / ...
const tick = () => {
    // Time
    const currentTime = Date.now()
    const deltaTime = currentTime - time;
    time = currentTime
    console.log(deltaTime)
    // Rotation at the same speed, regardless of framerate

    // Update objects
    mesh.rotation.y -= 0.001 * deltaTime;

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

// Start this once!
// tick();

// Clock
// const clock = new THREE.Clock();
// Time start at 0 when the clock is initialized

const tickWithClock = () => {
    // Clock
    const elapsedTime = clock.getElapsedTime();
    // console.log(elapsedTime);

    // Update objects
    // mesh.rotation.y = elapsedTime * Math.PI * 2; // 1 rotation (2 * PI) per second
    // mesh.position.y = Math.sin(elapsedTime)
    // mesh.position.x = Math.cos(elapsedTime)

    camera.position.y = Math.sin(elapsedTime)
    camera.position.x = Math.cos(elapsedTime)
    camera.lookAt(mesh.position)

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tickWithClock)
}

// tickWithClock()

const loop = () => {
    renderer.render(scene, camera)

    window.requestAnimationFrame(loop)
}

loop()

// LIBRARIES
// gsap has it's own tick() function, handles requestAnimationFrame itself
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })