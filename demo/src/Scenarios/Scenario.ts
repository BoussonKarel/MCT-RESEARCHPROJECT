import { World } from '../Models/World'
import { BaseObject } from '../Models/Objects/BaseObject'
import { Arduino } from '../Models/Objects/Electronics/Arduino'
import { ElectronicsObject } from '../Models/Objects/Electronics/ElectronicsObject'

let instance = null

interface ScenarioObjects {
  [key: string]: any
}

export class Scenario {
  world: World

  htmlInstruction: HTMLDivElement
  htmlInstructionText: HTMLSpanElement
  htmlInstructionImg: HTMLImageElement

  objects: ScenarioObjects = {}

  constructor(world: World) {
    // Only 1 of this scenario can exist
    if (instance) return instance
    instance = this

    // Create the world
    this.world = world

    this.htmlInstruction = document.querySelector('#js-instruction')
    this.htmlInstructionText = document.querySelector('#js-instruction-text')
    this.htmlInstructionImg = document.querySelector('#js-instruction-img')
    this.showInstruction()

    if (world.resources) this.addStartObjects()
    else this.world.resources.on("loaded", () => this.addStartObjects())
  }

  showInstruction() {
    this.htmlInstruction.classList.remove("u-hidden")
  }

  hideInstruction() {
    this.htmlInstruction.classList.add("u-hidden")
  }

  toggleInstruction() {
    this.htmlInstruction.classList.toggle("u-hidden")
  }

  setInstruction(text: string, imgSrc: string) {
    this.htmlInstructionText.innerHTML = text
    this.htmlInstructionImg.src = imgSrc
  }

  addStartObjects() {
    // No start objects in base scenario
  }
}