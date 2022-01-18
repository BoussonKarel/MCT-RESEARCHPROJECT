import "./style.css"
import * as THREE from 'three'
import { Arduino } from "./models/components/Arduino"
import { UltrasoneSensor } from "./models/components/UltrasoneSensor"
import { Cable } from "./models/components/Cable"
import { Resistor } from "./models/components/Resistor"
import { ElectronicComponent } from "./models/ElectronicComponent"
import { calculatePathResistance } from "./utils/pathHelper"

const arduino = new Arduino(undefined) // 0
const HCSR05 = new UltrasoneSensor(undefined) // 1
const cable1 = new Cable(undefined) // 2
const resistor = new Resistor(undefined, 470) // 3
const cable2 = new Cable(undefined) // 4
const cable3 = new Cable(undefined) // 5
const cable4 = new Cable(undefined) // 6

const addTestConnections = () => {
  arduino.addConnection(HCSR05.nodes[1], cable3.nodes[1])
  arduino.addConnection(cable3.nodes[2], cable4.nodes[1]) // Loop ultrasone > 3 > 4 > ultrasone
  arduino.addConnection(cable4.nodes[2], HCSR05.nodes[1])
  
  arduino.addConnection(arduino.nodes["5V"], cable1.nodes[1])
  arduino.addConnection(cable1.nodes[2], resistor.nodes[1])
  arduino.addConnection(resistor.nodes[2], cable2.nodes[1])
  arduino.addConnection(cable2.nodes[2], HCSR05.nodes[1])
}

addTestConnections()

const pathPowerUltrasoneArduino =
  ElectronicComponent.checkConnection(
    arduino.nodes["5V"], HCSR05.nodes[1]
  )

console.log(calculatePathResistance(pathPowerUltrasoneArduino))

/*
 * Connections
 */
const init = () => {
  console.log("Loaded")
  const ultrasoneElement = document.querySelector("#ultrasone")
  const arduinoElement = document.querySelector("#arduino")

  for (const key of Object.keys(arduino.nodes)) {
    arduinoElement.innerHTML += `[${key}]<br />`
  }

  for (const key of Object.keys(HCSR05.nodes)) {
    ultrasoneElement.innerHTML += `[${key}]<br />`
  }

  // let pathHTML = "";
  // for (const item of pathPowerUltrasoneArduino) {
  //   console.log(item)
  //   pathHTML += `${item.parent}`
  // }
  // ultrasoneElement.innerHTML += pathHTML;
}

document.addEventListener('DOMContentLoaded', init)