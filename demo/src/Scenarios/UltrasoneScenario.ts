import * as THREE from "three"
import { Arduino } from "../Models/Objects/Electronics/Arduino";
import { ElectronicsObject } from "../Models/Objects/Electronics/ElectronicsObject";
import { UltrasoneSensor } from "../Models/Objects/Electronics/UltrasoneSensor";
import { Scenario } from "./Scenario";

interface UltrasoneScenarioObjects {
  arduino?: Arduino
  ultrasone?: UltrasoneSensor
}

export class UltrasoneScenario extends Scenario {
  objects: UltrasoneScenarioObjects = {}

  constructor() {
    super()
  }

  addObjects() {
    // Add the components
    this.objects.arduino = new Arduino({position: new THREE.Vector3(-0.05,.75,0)})
    this.objects.ultrasone = new UltrasoneSensor({position: new THREE.Vector3(0.05,.75,0)})
  }
}