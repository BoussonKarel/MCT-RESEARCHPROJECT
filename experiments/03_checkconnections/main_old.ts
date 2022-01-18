import "./style.css"
import * as THREE from 'three'

/*
 * General
 */
interface Component {
  id: string
  object: THREE.Object3D
  pins: AssignedPins
  connections?: Connection
}

/*
 * Electronics
 */
// Pins
interface Pin {
  name: string
  powered?: boolean
  position?: THREE.Vector3
}

interface AssignedPins {
  [key: string] : Pin
}

/*
 * Connections
 */
interface Connection {
  [other: string]: ConnectionPins
}

interface ConnectionPins {
  // from: to
  [from: string] : string
}

const conn1 : Connection = {
  "ARDUINO" : {
    "1": "5V"
  } // FROM this.pins[1] to Arduino.pins[5V]
}

const components = []

const ultrasoneSensor: Component = {
  id: "ULTRASONE01",
  object: null,
  pins: {
    1: {name: "Vcc"},
    2: {name: "Trig"},
    3: {name: "Echo"},
    4: {name: "GND"},
  }
}
components.push(ultrasoneSensor)

const arduino: Component = {
  id: "ARDUINO01",
  object: null,
  pins: {
    "5V": {name: "5V"},
    2: {name: "D2"},
    3: {name: "D3"},
    "GND": {name: "GND"},
  }
}
components.push(arduino)

const createConnection = (component1: Component, pin1: string, component2: Component, pin2: string) => {
  if (!component1.connections) component1.connections = {}
  if (!component2.connections) component2.connections = {}

  // If there is no connection between them yet, create one
  if (!component1.connections[component2.id]) {
    component1.connections[component2.id] = {}
    component2.connections[component1.id] = {}
  }

  component1.connections[component2.id][pin1] = pin2
  component2.connections[component1.id][pin2] = pin1
}

createConnection(arduino, "5V", ultrasoneSensor, "1")
createConnection(arduino, "GND", ultrasoneSensor, "4")
createConnection(arduino, "2", ultrasoneSensor, "2")
createConnection(arduino, "3", ultrasoneSensor, "3")

console.log(arduino)
console.log(ultrasoneSensor)

const checkUltrasoneConnections = (arduino: Component, ultrasone: Component) => {
  if (arduino.connections && arduino.connections[ultrasone.id]) {
    const connectionsBetween = arduino.connections[ultrasone.id]
    // if there are connections between the two
    if (connectionsBetween["5V"] === "1") {
      console.log("5V-Vcc succesfully connected")
    }
    if (connectionsBetween["2"] === "2") {
      console.log("D2-Echo succesfully connected")
    }
    if (connectionsBetween["3"] === "3") {
      console.log("D3-Trig succesfully connected")
    }
    if (connectionsBetween["GND"] === "4") {
      console.log("GND-GND succesfully connected")
    }
  }
}

checkUltrasoneConnections(arduino, ultrasoneSensor)

const init = () => {
  console.log("Loaded")
  const ultrasoneElement = document.querySelector("#ultrasone")
  const arduinoElement = document.querySelector("#arduino")

  for (const [pin, value] of Object.entries(arduino.pins)) {
    arduinoElement.innerHTML += `[${pin}] ${value.name}<br />`
  }

  for (const [pin, value] of Object.entries(ultrasoneSensor.pins)) {
    ultrasoneElement.innerHTML += `[${pin}] ${value.name}<br />`
  }
}

document.addEventListener('DOMContentLoaded', init)