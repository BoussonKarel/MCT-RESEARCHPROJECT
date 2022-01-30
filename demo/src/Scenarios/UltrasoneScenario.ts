import * as THREE from "three"
import { Arduino } from "../Models/Objects/Electronics/Arduino";
import { UltrasoneSensor } from "../Models/Objects/Electronics/UltrasoneSensor";
import { SimpleCube } from "../Models/Objects/SimpleCube";
import { World } from "../Models/World";
import { Scenario } from "./Scenario";

let instance = null

interface UltrasoneScenarioObjects {
  arduino?: Arduino
  ultrasone?: UltrasoneSensor
  cube?: SimpleCube
}

export class UltrasoneScenario extends Scenario {
  objects: UltrasoneScenarioObjects = {}

  constructor(world: World) {
    super(world)

    if (instance) return instance
    instance = this

    // Add start objects
    if (world.resources) this.addStartObjects()
    else this.world.resources.on("loaded", () => this.addStartObjects())

    // Set first instruction
    this.setInstruction("Verbind de ultrasone sensor zoals op volgend schema:", "https://hackster.imgix.net/uploads/attachments/991561/uploads2ftmp2ff6c8de93-288c-4663-9a29-31c8e61172812fultrasonic5_WCDWvutJmv.png")
  
    this.world.time.on('tick', () => this.scenarioTick())
  }

  scenarioTick() {
    switch(this.currentStep) {
      case 1:
        if (this.objects.ultrasone.errorState) this.setFeedbackError(this.objects.ultrasone.errorState)
        else this.removeFeedback()
        if (this.objects.ultrasone.correctlyConnected) this.startStep2()
        break;
      case 2:
        this.setFeedback(`De ultrasone meet: ${this.objects.ultrasone.measurement} cm`)
        break;
      default:
        break;
    }
  }

  addStartObjects() {
    // Add the components
    this.objects.arduino = new Arduino({position: new THREE.Vector3(-0.05,.75,0)})
    this.objects.ultrasone = new UltrasoneSensor({position: new THREE.Vector3(0.05,.75,0)})
  }

  startStep2() {
    this.currentStep = 2

    this.setInstruction("Goed gedaan! Nu kan je met de ultrasone sensor de afstand tot objecten meten.", "")

    const cubePosition = new THREE.Vector3().copy(this.objects.ultrasone.mesh.position)
    cubePosition.y += 0.01
    cubePosition.z += -0.1
    this.objects.cube = new SimpleCube({position: cubePosition})
    
    this.objects.ultrasone.lookAt(cubePosition)
    this.objects.ultrasone.mesh.position.y += 0.01
    this.objects.ultrasone.setPosition(this.objects.ultrasone.mesh.position)
  }
}