import * as THREE from "three";
import { CableEnd } from "./CableEnd";
import { CableRope } from "./CableRope";

export class Cable {
  ends: CableEnd[]
  rope: CableRope

  constructor() {
    this.ends = []

    const pos1 = new THREE.Vector3(-0.1, 0.76, 0)
    const pos2 = new THREE.Vector3(0.1, 0.76, 0)
    const posRope = new THREE.Vector3(0, 1, 0)

    this.ends.push(new CableEnd({position: pos1}))
    this.ends.push(new CableEnd({position: pos2}))

    this.rope = new CableRope({pos1, pos2})

    this.ends[1].material.color.set(0x552222)
  }
}