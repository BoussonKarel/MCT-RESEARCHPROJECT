import { CableEnd } from "./CableEnd";

export class Cable {
  ends: CableEnd[]

  constructor() {
    this.ends = []

    this.ends.push(new CableEnd())
    this.ends.push(new CableEnd())

    this.ends[0].mesh.position.set(-0.1, 0.76, 0)
    this.ends[1].mesh.position.set(0.1, 0.76, 0)

    console.log(this.ends)
  }
}