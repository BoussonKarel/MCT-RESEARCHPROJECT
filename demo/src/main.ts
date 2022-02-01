import "./style.css"
import { UltrasoneScenario } from "./Scenarios/UltrasoneScenario"
import { DebugSpawner } from "./Models/Objects/DebugSpawner"
import { World } from "./Models/World"

let startOverlay, startButton
let scenario1

const world = new World()

function startScenario() {
  console.log("Start")
  scenario1 = new UltrasoneScenario()
  startOverlay.classList.add("u-hidden")
}

const init = () => {
  startOverlay = document.querySelector("#js-start")
  startButton = document.querySelector("#js-start-button")
  startButton.addEventListener("click", startScenario)

  const spawner = new DebugSpawner()
}

init()