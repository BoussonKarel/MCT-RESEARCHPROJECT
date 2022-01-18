import "./style.css"
import * as THREE from 'three'
import { addConnection } from "./models/Connection"
import { Arduino } from "./models/components/Arduino"
import { UltrasoneSensor } from "./models/components/UltrasoneSensor"
import { Cable } from "./models/components/Cable"
import { Resistor } from "./models/components/Resistor"
import { ElectronicComponent } from "./models/ElectronicComponent"
import { calculatePathResistance, pathHasOutput } from "./utils/pathHelper"

const arduino = new Arduino(undefined) // 0
const HCSR05 = new UltrasoneSensor(undefined) // 1
const cable1 = new Cable(undefined) // 2
const resistor = new Resistor(undefined, 470) // 3
const cable2 = new Cable(undefined) // 4
const cable3 = new Cable(undefined) // 5
const cable4 = new Cable(undefined) // 6

const addTestConnections = () => {
  addConnection(HCSR05.nodes[1], cable3.nodes[1])
  addConnection(cable3.nodes[2], cable4.nodes[1]) // Loop ultrasone > 3 > 4 > ultrasone
  addConnection(cable4.nodes[2], HCSR05.nodes[1])
  
  addConnection(arduino.nodes["5V"], cable1.nodes[1])
  addConnection(cable1.nodes[2], resistor.nodes[1])
  addConnection(resistor.nodes[2], cable2.nodes[1])
  addConnection(cable2.nodes[2], HCSR05.nodes[1])
}

addTestConnections()

const pathPowerUltrasoneArduino =
  ElectronicComponent.checkConnection(arduino.nodes["5V"], HCSR05.nodes[1])
const pathResistance = calculatePathResistance(pathPowerUltrasoneArduino)
const hasOutput = pathHasOutput(pathPowerUltrasoneArduino)

/*
 * Connections
 */
const init = () => {
  console.log("Loaded")
  const ultrasoneElement = document.querySelector("#ultrasone")
  const arduinoElement = document.querySelector("#arduino")

  let arduinoPinsList = ""
  for (const key of Object.keys(arduino.nodes)) {
    arduinoPinsList += `<li>[${key}]</li>`
  }
  arduinoElement.innerHTML += `<h2>Pins</h2><ul>${arduinoPinsList}</ul>`

  let ultrasonePinsList = ""
  for (const key of Object.keys(HCSR05.nodes)) {
    ultrasonePinsList += `<li>${key}</li>`
  }
  ultrasoneElement.innerHTML += `<h2>Pins</h2><ul>${ultrasonePinsList}</ul>` 

  let ultrasonePath = "";
  for (const item of pathPowerUltrasoneArduino) {
    ultrasonePath += `${item.parent.constructor.name} (${item.parent.resistance} Ohm) - `
  }
  ultrasoneElement.innerHTML += `<h2>Path to Arduino 5V</h2>`
  ultrasonePath = ultrasonePath.substring(0, ultrasonePath.length -3)
  ultrasoneElement.innerHTML += ultrasonePath + "<br />"
  ultrasoneElement.innerHTML += `<strong>Path's resistance:</strong> ${pathResistance} Ohm<br />`
  ultrasoneElement.innerHTML += `<strong>Has an output:</strong> ${hasOutput ? "Yes" : "No"}<br />`
}

document.addEventListener('DOMContentLoaded', init)