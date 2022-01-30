import "./style.css"
import { UltrasoneScenario } from "./Scenarios/UltrasoneScenario"
import { DebugSpawner } from "./Models/Objects/DebugSpawner"
import { World } from "./Models/World"

let world
let startOverlay, startButton
let scenario1

const init = () => {
  world = new World()

  startOverlay = document.querySelector("#js-start")
  startButton = document.querySelector("#js-start-button")
  startButton.addEventListener("click", () => {
    scenario1 = new UltrasoneScenario(world)
    startOverlay.classList.add("u-hidden")
  })

  const spawner = new DebugSpawner()
}

document.addEventListener("DOMContentLoaded", init)