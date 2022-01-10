# Notities ThreeJS Journey
## 05 - Transform objects
### Position
- x = right (RED)
- y = up (GREEN)
- z = towards you (BLUE)

```js
// AXES HELPER
const axesHelper = new THREE.AxesHelper(3); // AxesHelper(length)
scene.add(axesHelper);
```

### Put it anywhere
As long as you move it before the ```render(...)```

### DistanceTo (les 05)
Distance between two points > Ultrasone sensor!

### Groups
Move, scale, rotate... a group of objects etc.

## 06 - Animations
### requestAnimationFrame
**PURPOSE:** Call a function on the next frame

## 07 - Cameras
**StereoCamera:** two cameras that mimic the eyes to creata  parallax effect
(VR etc)

**OrthographicCamera:** render without perspective

### Controls
Use controls you need or make your own if not good enough.
e.g. OrbitControls