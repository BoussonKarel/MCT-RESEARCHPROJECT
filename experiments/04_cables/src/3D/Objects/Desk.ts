import * as THREE from "three"
import { World } from "../World"

export class Desk {
  world: World
  deskHeight: number

  constructor() {
    this.world = new World()

    this.deskHeight = 0.73 // 73cm
    const desk = this.world.resources.items["Desk"].scene.children[0].children[0]
    desk.rotation.x = -Math.PI/2
    desk.geometry.center()

    desk.scale.set(1 / 100, 1 / 100, 1 / 100) // From 73m to 73cm
    desk.position.set(0, 0 + this.deskHeight/2, 0)

    this.world.scene.add(desk)
  }
}
