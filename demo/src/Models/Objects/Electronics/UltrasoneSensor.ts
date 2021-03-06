import * as THREE from "three"
import { Arduino } from "./Arduino"
import { ElectronicsObject } from "./ElectronicsObject"
import { Pin, PinList } from "./Pin"

let instance: UltrasoneSensor = null

const arrowHelperVisible = false

interface Range {
  min: number
  max: number
}

interface UltrasoneOptions {
  position?: THREE.Vector3
  range?: Range
  rotation?: THREE.Euler
}

const defaultOptions: UltrasoneOptions = {
  position: new THREE.Vector3(0.1, 0.75, 0),
  range: { min: 0.02, max: 4 },
  rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
}

const defaultDirection = new THREE.Vector3(0, 0, 1) // Along z-axis

export class UltrasoneSensor extends ElectronicsObject {
  raycaster: THREE.Raycaster
  arrowHelper: THREE.ArrowHelper

  range: Range

  correctlyConnected = false

  lastMeasurement: number = null
  measurement: number = null

  constructor(options?: UltrasoneOptions) {
    super()

    options = {
      ...defaultOptions,
      ...options,
    }

    // Only 1 ultrasone sensor can exist
    if (instance) {
      instance.setPR(options.position, options.rotation)
      return instance
    } else instance = this

    this.range = options.range

    // ThreeJS
    this.setup3D(options)

    // Add pins
    this.addPins()

    // Physics
    this.createSimplePhysicsBox()

    // Events etc
    this.world.time.on("tick", () => {
      this.measureDistances()
    })

    this.electronicsWorld.on("connectionChange", () => {
      this.checkIfConnectedCorrectly()
    })

    // Wrap things up in parent class
    this.finishConstructor()
  }

  checkIfConnectedCorrectly() {
    this.correctlyConnected = false
    this.errorState = null

    // Check if all pins have connections
    for (const pin of Object.values(this.pins)) {
      const hasConnection = this.electronicsWorld.connections.some(
        (c) => c.a === pin || c.b === pin
      )

      if (!hasConnection) return
    }

    // Get Arduino
    const arduinos = this.electronicsWorld.components.filter(
      (c) => c instanceof Arduino
    )
    // There are no arduino's
    if (arduinos.length < 1) return false
    const arduino = arduinos[0]

    // Check if an Arduino 5V pin is connected to Ultrasone Vcc
    const pathVcc = this.getPathByString(this.pins["Vcc"], arduino, "5V")

    // Check if Arduino D3 is connected to Ultrasone Trig
    const pathTrig = this.getPathByString(this.pins["Trig"], arduino, "D3")

    // Check if Arduino D2 is connected to Ultrasone Echo
    const pathEcho = this.getPathByString(this.pins["Echo"], arduino, "D2")

    // Check if an Arduino GND is connected to Ultrasone GND
    const pathGND = this.getPathByString(this.pins["GND"], arduino, "GND")

    if (
      pathVcc.length > 0 &&
      pathTrig.length > 0 &&
      pathEcho.length > 0 &&
      pathGND.length > 0
    ) {
      this.correctlyConnected = true
    } else {
      this.errorState = "Niet alle pinnen zijn correct verbonden."
    }
  }

  setup3D(options: UltrasoneOptions) {
    // Mesh, no geometry or material, we are using a resource
    this.mesh =
      this.world.resources.items["Ultrasone"].scene.children[0].children[0]

    // Scale
    this.scale = 1 / 1000 // Designed at 1000x the size (45m to 45mm)

    // Transform
    this.mesh.rotation.copy(options.rotation)
    this.mesh.scale.set(this.scale, this.scale, this.scale)
    if (options.position) this.mesh.position.copy(options.position)

    // Make grabbable
    this.world.grabbables.push(this.mesh)

    this.setRaycaster()
  }

  addPins() {
    const names = ["Vcc", "Trig", "Echo", "GND"]

    // first pin location
    const localCoords = new THREE.Vector3(-4.5, -16, 1)
    for (const name of names) {
      const pos = new THREE.Vector3().copy(localCoords)

      this.createPin(name, pos)

      localCoords.x += 3 // move to next pin (3mm apart)
    }
  }

  setRaycaster() {
    // defaultDirection = world z-axis
    // Rotate this so it matches the object z-axis (apply the same quaternion)
    const direction = new THREE.Vector3()
      .copy(defaultDirection)
      .applyQuaternion(this.mesh.quaternion)

    // if the raycaster doesn't exist: create
    if (!this.raycaster) {
      this.raycaster = new THREE.Raycaster()
      this.raycaster.near = this.range.min
      this.raycaster.far = this.range.max

      this.arrowHelper = new THREE.ArrowHelper()
      this.arrowHelper.setLength(0.5)
      this.world.scene.add(this.arrowHelper)
    }

    this.arrowHelper.position.copy(this.mesh.position)
    this.arrowHelper.setDirection(direction)
    this.arrowHelper.visible = arrowHelperVisible

    this.raycaster.set(this.mesh.position, direction)
  }

  measureDistances() {
    if (!this.correctlyConnected) {
      this.measurement = null
      return
    }
    // Update raycaster and arrowhelper
    this.setRaycaster()

    // Cast ray
    const otherObjects = this.world.scene.children.filter(
      (obj) =>
        obj != this.mesh &&
        obj != this.arrowHelper &&
        // @ts-ignore
        !this.electronicsWorld.connections.some((conn) => conn.line === obj)
    )
    const intersects = this.raycaster.intersectObjects(otherObjects)

    this.lastMeasurement = this.measurement
    this.measurement = intersects.length > 0 ? Math.round(intersects[0].distance * 100) : this.range.max * 100
  }
}
