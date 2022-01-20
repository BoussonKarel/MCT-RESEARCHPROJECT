import { World } from "../World";
import { SimpleCube } from "./SimpleCube";

export class DebugSpawner {
  world: World

  constructor() {
    this.world = new World()
  }

  addCube() {
    const cube = new SimpleCube({position: {x:0, y:2, z:0}})
  }
}