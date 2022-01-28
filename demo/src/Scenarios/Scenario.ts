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

  objects: ScenarioObjects = {}

  constructor() {
    // Only 1 of this scenario can exist
    if (instance) return instance
    instance = this

    // Create the world
    this.world = new World()

    this.world.resources.on("loaded", () => this.addObjects())
  }

  addObjects() {}
}