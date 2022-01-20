import { World } from "../World";
import { Cable } from "./Cable";
import { SimpleCube } from "./SimpleCube";

export class DebugSpawner {
  world: World

  constructor() {
    this.world = new World()
  }

  addCube() {
    const cube = new SimpleCube({position: {x:0, y:2, z:0}})
  }
  addCable() {
    const cable = new Cable()
  }
}