import * as THREE from "three"
import { Arduino } from "../Models/Objects/Electronics/Arduino";
import { UltrasoneSensor } from "../Models/Objects/Electronics/UltrasoneSensor";
import { World } from "../Models/World";
import { Scenario } from "./Scenario";

interface UltrasoneScenarioObjects {
  arduino?: Arduino
  ultrasone?: UltrasoneSensor
}

export class UltrasoneScenario extends Scenario {
  objects: UltrasoneScenarioObjects = {}

  constructor(world: World) {
    super(world)

    this.setInstruction("Verbind de ultrasone sensor zoals op volgend schema:", "https://hackster.imgix.net/uploads/attachments/991561/uploads2ftmp2ff6c8de93-288c-4663-9a29-31c8e61172812fultrasonic5_WCDWvutJmv.png")
  }

  addObjects() {
    // Add the components
    this.objects.arduino = new Arduino({position: new THREE.Vector3(-0.05,.75,0)})
    this.objects.ultrasone = new UltrasoneSensor({position: new THREE.Vector3(0.05,.75,0)})
  }
}