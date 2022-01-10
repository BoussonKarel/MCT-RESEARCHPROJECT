import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color: 0xff0000}) // OR {color: '#ff0000'} OR {color: 'red'}
const mesh = new THREE.Mesh(geometry, material) // cube

scene.add(mesh) // Don't forget!

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height) // fov, aspect_ratio
camera.position.z = 3 // Move camera backwards so we can see the cube
// Y - UP
// X - RIGHT
// Z - TOWARDS US
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({canvas}) // {canvas: canvas}
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera)
// Doesn't work > camera is inside the cube!
// Cube is 1 meter
// We moved back our camera 3 meters