import { World } from '../Models/World'

let instance = null

interface ScenarioObjects {
  [key: string]: any
}

export class Scenario {
  world: World

  htmlInstruction: HTMLDivElement
  htmlInstructionText: HTMLSpanElement
  htmlInstructionImg: HTMLImageElement

  htmlFeedback: HTMLDivElement

  objects: ScenarioObjects = {}

  currentStep = 1

  constructor() {
    // Only 1 of this scenario can exist
    if (instance) return instance
    instance = this

    // Create the world
    this.world = new World()

    this.htmlInstruction = document.querySelector('#js-instruction')
    this.htmlInstructionText = document.querySelector('#js-instruction-text')
    this.htmlInstructionImg = document.querySelector('#js-instruction-img')
    this.showInstruction()

    this.htmlFeedback = document.querySelector('#js-feedback')
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

  setFeedback(text: string) {
    this.htmlFeedback.classList.remove('u-hidden')
    this.htmlFeedback.classList.remove('c-feedback--error')
    this.htmlFeedback.innerHTML = text
  }

  setFeedbackError(text: string) {
    this.htmlFeedback.classList.remove('u-hidden')
    this.htmlFeedback.classList.add('c-feedback--error')
    this.htmlFeedback.innerHTML = text

  }

  removeFeedback() {
    this.htmlFeedback.classList.add('u-hidden')
  }
}